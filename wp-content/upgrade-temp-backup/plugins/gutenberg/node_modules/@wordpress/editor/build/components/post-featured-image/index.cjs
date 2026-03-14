"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-featured-image/index.js
var post_featured_image_exports = {};
__export(post_featured_image_exports, {
  default: () => post_featured_image_default
});
module.exports = __toCommonJS(post_featured_image_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_hooks = require("@wordpress/hooks");
var import_components = require("@wordpress/components");
var import_blob = require("@wordpress/blob");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_core_data = require("@wordpress/core-data");
var import_check = __toESM(require("./check.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var ALLOWED_MEDIA_TYPES = ["image"];
var DEFAULT_FEATURE_IMAGE_LABEL = (0, import_i18n.__)("Featured image");
var DEFAULT_SET_FEATURE_IMAGE_LABEL = (0, import_i18n.__)("Add a featured image");
var instructions = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)(
  "To edit the featured image, you need permission to upload media."
) });
function getMediaDetails(media, postId) {
  if (!media) {
    return {};
  }
  const defaultSize = (0, import_hooks.applyFilters)(
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
  const fallbackSize = (0, import_hooks.applyFilters)(
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
  const returnsFocusRef = (0, import_element.useRef)(false);
  const [isLoading, setIsLoading] = (0, import_element.useState)(false);
  const { getSettings } = (0, import_data.useSelect)(import_block_editor.store);
  const { mediaSourceUrl } = getMediaDetails(media, currentPostId);
  function onDropFiles(filesList) {
    getSettings().mediaUpload({
      allowedTypes: ALLOWED_MEDIA_TYPES,
      filesList,
      onFileChange([image]) {
        if ((0, import_blob.isBlobURL)(image?.url)) {
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
      return (0, import_i18n.sprintf)(
        // Translators: %s: The selected image alt text.
        (0, import_i18n.__)("Current image: %s"),
        imageMedia.alt_text
      );
    }
    return (0, import_i18n.sprintf)(
      // Translators: %s: The selected image filename.
      (0, import_i18n.__)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_check.default, { children: [
    noticeUI,
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-post-featured-image", children: [
      media && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "div",
        {
          id: `editor-post-featured-image-${featuredImageId}-describedby`,
          className: "hidden",
          children: getImageDescription(media)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.MediaUploadCheck, { fallback: instructions, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.MediaUpload,
        {
          title: postType?.labels?.featured_image || DEFAULT_FEATURE_IMAGE_LABEL,
          onSelect: onUpdateImage,
          unstableFeaturedImageFlow: true,
          allowedTypes: ALLOWED_MEDIA_TYPES,
          modalClass: "editor-post-featured-image__media-modal",
          render: ({ open }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-post-featured-image__container", children: [
            isMissingMedia ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Notice,
              {
                status: "warning",
                isDismissible: false,
                children: (0, import_i18n.__)(
                  "Could not retrieve the featured image data."
                )
              }
            ) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              import_components.Button,
              {
                __next40pxDefaultSize: true,
                ref: returnFocus,
                className: !featuredImageId ? "editor-post-featured-image__toggle" : "editor-post-featured-image__preview",
                onClick: open,
                "aria-label": !featuredImageId ? null : (0, import_i18n.__)(
                  "Edit or replace the featured image"
                ),
                "aria-describedby": !featuredImageId ? null : `editor-post-featured-image-${featuredImageId}-describedby`,
                "aria-haspopup": "dialog",
                disabled: isLoading,
                accessibleWhenDisabled: true,
                children: [
                  !!featuredImageId && media && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "img",
                    {
                      className: "editor-post-featured-image__preview-image",
                      src: mediaSourceUrl,
                      alt: getImageDescription(
                        media
                      )
                    }
                  ),
                  (isLoading || isRequestingFeaturedImageMedia) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}),
                  !featuredImageId && !isLoading && (postType?.labels?.set_featured_image || DEFAULT_SET_FEATURE_IMAGE_LABEL)
                ]
              }
            ),
            !!featuredImageId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              import_components.__experimentalHStack,
              {
                className: (0, import_clsx.default)(
                  "editor-post-featured-image__actions",
                  {
                    "editor-post-featured-image__actions-missing-image": isMissingMedia,
                    "editor-post-featured-image__actions-is-requesting-image": isRequestingFeaturedImageMedia
                  }
                ),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_components.Button,
                    {
                      __next40pxDefaultSize: true,
                      className: "editor-post-featured-image__action",
                      onClick: open,
                      "aria-haspopup": "dialog",
                      variant: isMissingMedia ? "secondary" : void 0,
                      children: (0, import_i18n.__)("Replace")
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_components.Button,
                    {
                      __next40pxDefaultSize: true,
                      className: "editor-post-featured-image__action",
                      onClick: () => {
                        onRemoveImage();
                        returnsFocusRef.current = true;
                      },
                      variant: isMissingMedia ? "secondary" : void 0,
                      isDestructive: isMissingMedia,
                      children: (0, import_i18n.__)("Remove")
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.DropZone, { onFilesDrop: onDropFiles })
          ] }),
          value: featuredImageId
        }
      ) })
    ] })
  ] });
}
var applyWithSelect = (0, import_data.withSelect)((select) => {
  const { getEntityRecord, getPostType, hasFinishedResolution } = select(import_core_data.store);
  const { getCurrentPostId, getEditedPostAttribute } = select(import_store.store);
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
var applyWithDispatch = (0, import_data.withDispatch)(
  (dispatch, { noticeOperations }, { select }) => {
    const { editPost } = dispatch(import_store.store);
    return {
      onUpdateImage(image) {
        editPost({ featured_media: image.id });
      },
      onDropImage(filesList) {
        select(import_block_editor.store).getSettings().mediaUpload({
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
var post_featured_image_default = (0, import_compose.compose)(
  import_components.withNotices,
  applyWithSelect,
  applyWithDispatch,
  (0, import_components.withFilters)("editor.PostFeaturedImage")
)(PostFeaturedImage);
//# sourceMappingURL=index.cjs.map
