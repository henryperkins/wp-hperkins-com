// packages/editor/src/components/post-featured-image/index.js
import clsx from "clsx";
import { __, sprintf } from "@wordpress/i18n";
import { applyFilters } from "@wordpress/hooks";
import {
  DropZone,
  Button,
  Spinner,
  withNotices,
  withFilters,
  __experimentalHStack as HStack,
  Notice
} from "@wordpress/components";
import { isBlobURL } from "@wordpress/blob";
import { useState, useRef } from "@wordpress/element";
import { compose } from "@wordpress/compose";
import { useSelect, withDispatch, withSelect } from "@wordpress/data";
import {
  MediaUpload,
  MediaUploadCheck,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { store as coreStore } from "@wordpress/core-data";
import PostFeaturedImageCheck from "./check.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var ALLOWED_MEDIA_TYPES = ["image"];
var DEFAULT_FEATURE_IMAGE_LABEL = __("Featured image");
var DEFAULT_SET_FEATURE_IMAGE_LABEL = __("Add a featured image");
var instructions = /* @__PURE__ */ jsx("p", { children: __(
  "To edit the featured image, you need permission to upload media."
) });
function getMediaDetails(media, postId) {
  if (!media) {
    return {};
  }
  const defaultSize = applyFilters(
    "editor.PostFeaturedImage.imageSize",
    "large",
    media.id,
    postId
  );
  if (defaultSize in (media?.media_details?.sizes ?? {})) {
    return {
      mediaWidth: media.media_details.sizes[defaultSize].width,
      mediaHeight: media.media_details.sizes[defaultSize].height,
      mediaSourceUrl: media.media_details.sizes[defaultSize].source_url
    };
  }
  const fallbackSize = applyFilters(
    "editor.PostFeaturedImage.imageSize",
    "thumbnail",
    media.id,
    postId
  );
  if (fallbackSize in (media?.media_details?.sizes ?? {})) {
    return {
      mediaWidth: media.media_details.sizes[fallbackSize].width,
      mediaHeight: media.media_details.sizes[fallbackSize].height,
      mediaSourceUrl: media.media_details.sizes[fallbackSize].source_url
    };
  }
  return {
    mediaWidth: media.media_details.width,
    mediaHeight: media.media_details.height,
    mediaSourceUrl: media.source_url
  };
}
function PostFeaturedImage({
  currentPostId,
  featuredImageId,
  onUpdateImage,
  onRemoveImage,
  media,
  postType,
  noticeUI,
  noticeOperations,
  isRequestingFeaturedImageMedia
}) {
  const returnsFocusRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getSettings } = useSelect(blockEditorStore);
  const { mediaSourceUrl } = getMediaDetails(media, currentPostId);
  function onDropFiles(filesList) {
    getSettings().mediaUpload({
      allowedTypes: ALLOWED_MEDIA_TYPES,
      filesList,
      onFileChange([image]) {
        if (isBlobURL(image?.url)) {
          setIsLoading(true);
          return;
        }
        if (image) {
          onUpdateImage(image);
        }
        setIsLoading(false);
      },
      onError(message) {
        noticeOperations.removeAllNotices();
        noticeOperations.createErrorNotice(message);
      },
      multiple: false
    });
  }
  function getImageDescription(imageMedia) {
    if (imageMedia.alt_text) {
      return sprintf(
        // Translators: %s: The selected image alt text.
        __("Current image: %s"),
        imageMedia.alt_text
      );
    }
    return sprintf(
      // Translators: %s: The selected image filename.
      __(
        "The current image has no alternative text. The file name is: %s"
      ),
      imageMedia.media_details.sizes?.full?.file || imageMedia.slug
    );
  }
  function returnFocus(node) {
    if (returnsFocusRef.current && node) {
      node.focus();
      returnsFocusRef.current = false;
    }
  }
  const isMissingMedia = !isRequestingFeaturedImageMedia && !!featuredImageId && !media;
  return /* @__PURE__ */ jsxs(PostFeaturedImageCheck, { children: [
    noticeUI,
    /* @__PURE__ */ jsxs("div", { className: "editor-post-featured-image", children: [
      media && /* @__PURE__ */ jsx(
        "div",
        {
          id: `editor-post-featured-image-${featuredImageId}-describedby`,
          className: "hidden",
          children: getImageDescription(media)
        }
      ),
      /* @__PURE__ */ jsx(MediaUploadCheck, { fallback: instructions, children: /* @__PURE__ */ jsx(
        MediaUpload,
        {
          title: postType?.labels?.featured_image || DEFAULT_FEATURE_IMAGE_LABEL,
          onSelect: onUpdateImage,
          unstableFeaturedImageFlow: true,
          allowedTypes: ALLOWED_MEDIA_TYPES,
          modalClass: "editor-post-featured-image__media-modal",
          render: ({ open }) => /* @__PURE__ */ jsxs("div", { className: "editor-post-featured-image__container", children: [
            isMissingMedia ? /* @__PURE__ */ jsx(
              Notice,
              {
                status: "warning",
                isDismissible: false,
                children: __(
                  "Could not retrieve the featured image data."
                )
              }
            ) : /* @__PURE__ */ jsxs(
              Button,
              {
                __next40pxDefaultSize: true,
                ref: returnFocus,
                className: !featuredImageId ? "editor-post-featured-image__toggle" : "editor-post-featured-image__preview",
                onClick: open,
                "aria-label": !featuredImageId ? null : __(
                  "Edit or replace the featured image"
                ),
                "aria-describedby": !featuredImageId ? null : `editor-post-featured-image-${featuredImageId}-describedby`,
                "aria-haspopup": "dialog",
                disabled: isLoading,
                accessibleWhenDisabled: true,
                children: [
                  !!featuredImageId && media && /* @__PURE__ */ jsx(
                    "img",
                    {
                      className: "editor-post-featured-image__preview-image",
                      src: mediaSourceUrl,
                      alt: getImageDescription(
                        media
                      )
                    }
                  ),
                  (isLoading || isRequestingFeaturedImageMedia) && /* @__PURE__ */ jsx(Spinner, {}),
                  !featuredImageId && !isLoading && (postType?.labels?.set_featured_image || DEFAULT_SET_FEATURE_IMAGE_LABEL)
                ]
              }
            ),
            !!featuredImageId && /* @__PURE__ */ jsxs(
              HStack,
              {
                className: clsx(
                  "editor-post-featured-image__actions",
                  {
                    "editor-post-featured-image__actions-missing-image": isMissingMedia,
                    "editor-post-featured-image__actions-is-requesting-image": isRequestingFeaturedImageMedia
                  }
                ),
                children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      __next40pxDefaultSize: true,
                      className: "editor-post-featured-image__action",
                      onClick: open,
                      "aria-haspopup": "dialog",
                      variant: isMissingMedia ? "secondary" : void 0,
                      children: __("Replace")
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      __next40pxDefaultSize: true,
                      className: "editor-post-featured-image__action",
                      onClick: () => {
                        onRemoveImage();
                        returnsFocusRef.current = true;
                      },
                      variant: isMissingMedia ? "secondary" : void 0,
                      isDestructive: isMissingMedia,
                      children: __("Remove")
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx(DropZone, { onFilesDrop: onDropFiles })
          ] }),
          value: featuredImageId
        }
      ) })
    ] })
  ] });
}
var applyWithSelect = withSelect((select) => {
  const { getEntityRecord, getPostType, hasFinishedResolution } = select(coreStore);
  const { getCurrentPostId, getEditedPostAttribute } = select(editorStore);
  const featuredImageId = getEditedPostAttribute("featured_media");
  return {
    media: featuredImageId ? getEntityRecord("postType", "attachment", featuredImageId, {
      context: "view"
    }) : null,
    currentPostId: getCurrentPostId(),
    postType: getPostType(getEditedPostAttribute("type")),
    featuredImageId,
    isRequestingFeaturedImageMedia: !!featuredImageId && !hasFinishedResolution("getEntityRecord", [
      "postType",
      "attachment",
      featuredImageId,
      { context: "view" }
    ])
  };
});
var applyWithDispatch = withDispatch(
  (dispatch, { noticeOperations }, { select }) => {
    const { editPost } = dispatch(editorStore);
    return {
      onUpdateImage(image) {
        editPost({ featured_media: image.id });
      },
      onDropImage(filesList) {
        select(blockEditorStore).getSettings().mediaUpload({
          allowedTypes: ["image"],
          filesList,
          onFileChange([image]) {
            editPost({ featured_media: image.id });
          },
          onError(message) {
            noticeOperations.removeAllNotices();
            noticeOperations.createErrorNotice(message);
          },
          multiple: false
        });
      },
      onRemoveImage() {
        editPost({ featured_media: 0 });
      }
    };
  }
);
var post_featured_image_default = compose(
  withNotices,
  applyWithSelect,
  applyWithDispatch,
  withFilters("editor.PostFeaturedImage")
)(PostFeaturedImage);
export {
  post_featured_image_default as default
};
//# sourceMappingURL=index.mjs.map
