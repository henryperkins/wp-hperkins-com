// packages/block-library/src/media-text/edit.js
import clsx from "clsx";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { useState, useRef } from "@wordpress/element";
import {
  BlockControls,
  BlockVerticalAlignmentControl,
  useInnerBlocksProps,
  InspectorControls,
  useBlockProps,
  __experimentalImageURLInputUI as ImageURLInputUI,
  store as blockEditorStore,
  useBlockEditingMode,
  privateApis as blockEditorPrivateApis
} from "@wordpress/block-editor";
import {
  RangeControl,
  TextareaControl,
  ToggleControl,
  ToolbarButton,
  ExternalLink,
  FocalPointPicker,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { isBlobURL, getBlobTypeByURL } from "@wordpress/blob";
import { pullLeft, pullRight } from "@wordpress/icons";
import { useEntityProp, store as coreStore } from "@wordpress/core-data";
import MediaContainer from "./media-container.mjs";
import {
  DEFAULT_MEDIA_SIZE_SLUG,
  WIDTH_CONSTRAINT_PERCENTAGE,
  LINK_DESTINATION_NONE,
  LINK_DESTINATION_MEDIA,
  LINK_DESTINATION_ATTACHMENT,
  TEMPLATE
} from "./constants.mjs";
import { unlock } from "../lock-unlock.mjs";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { ResolutionTool } = unlock(blockEditorPrivateApis);
var applyWidthConstraints = (width) => Math.max(
  WIDTH_CONSTRAINT_PERCENTAGE,
  Math.min(width, 100 - WIDTH_CONSTRAINT_PERCENTAGE)
);
function getImageSourceUrlBySizeSlug(image, slug) {
  return image?.media_details?.sizes?.[slug]?.source_url;
}
function attributesFromMedia({
  attributes: { linkDestination, href },
  setAttributes
}) {
  return (media) => {
    if (!media || !media.url) {
      setAttributes({
        mediaAlt: void 0,
        mediaId: void 0,
        mediaType: void 0,
        mediaUrl: void 0,
        mediaLink: void 0,
        href: void 0,
        focalPoint: void 0,
        useFeaturedImage: false
      });
      return;
    }
    if (isBlobURL(media.url)) {
      media.type = getBlobTypeByURL(media.url);
    }
    let mediaType;
    let src;
    if (media.media_type) {
      if (media.media_type === "image") {
        mediaType = "image";
      } else {
        mediaType = "video";
      }
    } else {
      mediaType = media.type;
    }
    if (mediaType === "image") {
      src = media.sizes?.large?.url || media.media_details?.sizes?.large?.source_url;
    }
    let newLinkDestination = linkDestination;
    let newHref = href;
    if (mediaType === "image") {
      if (!newLinkDestination) {
        switch (window?.wp?.media?.view?.settings?.defaultProps?.link || LINK_DESTINATION_NONE) {
          case "file":
          case LINK_DESTINATION_MEDIA:
            newLinkDestination = LINK_DESTINATION_MEDIA;
            break;
          case "post":
          case LINK_DESTINATION_ATTACHMENT:
            newLinkDestination = LINK_DESTINATION_ATTACHMENT;
            break;
          case LINK_DESTINATION_NONE:
          default:
            newLinkDestination = LINK_DESTINATION_NONE;
            break;
        }
      }
      switch (newLinkDestination) {
        case LINK_DESTINATION_MEDIA:
          newHref = media.url;
          break;
        case LINK_DESTINATION_ATTACHMENT:
          newHref = media.link;
          break;
      }
    }
    setAttributes({
      mediaAlt: media.alt,
      mediaId: media.id,
      mediaType,
      mediaUrl: src || media.url,
      mediaLink: media.link || void 0,
      href: newHref,
      linkDestination: newLinkDestination,
      focalPoint: void 0,
      useFeaturedImage: false
    });
  };
}
function MediaTextResolutionTool({ image, value, onChange }) {
  const { imageSizes } = useSelect((select) => {
    const { getSettings } = select(blockEditorStore);
    return {
      imageSizes: getSettings().imageSizes
    };
  }, []);
  if (!imageSizes?.length) {
    return null;
  }
  const imageSizeOptions = imageSizes.filter(({ slug }) => getImageSourceUrlBySizeSlug(image, slug)).map(({ name, slug }) => ({ value: slug, label: name }));
  return /* @__PURE__ */ jsx(
    ResolutionTool,
    {
      value,
      defaultValue: DEFAULT_MEDIA_SIZE_SLUG,
      options: imageSizeOptions,
      onChange
    }
  );
}
function MediaTextEdit({
  attributes,
  isSelected,
  setAttributes,
  context: { postId, postType }
}) {
  const {
    focalPoint,
    href,
    imageFill,
    isStackedOnMobile,
    linkClass,
    linkDestination,
    linkTarget,
    mediaAlt,
    mediaId,
    mediaPosition,
    mediaType,
    mediaUrl,
    mediaWidth,
    mediaSizeSlug,
    rel,
    verticalAlignment,
    allowedBlocks,
    useFeaturedImage
  } = attributes;
  const [featuredImage] = useEntityProp(
    "postType",
    postType,
    "featured_media",
    postId
  );
  const { featuredImageMedia } = useSelect(
    (select) => {
      return {
        featuredImageMedia: featuredImage && useFeaturedImage ? select(coreStore).getEntityRecord(
          "postType",
          "attachment",
          featuredImage,
          {
            context: "view"
          }
        ) : void 0
      };
    },
    [featuredImage, useFeaturedImage]
  );
  const { image } = useSelect(
    (select) => {
      return {
        image: mediaId && isSelected ? select(coreStore).getEntityRecord(
          "postType",
          "attachment",
          mediaId,
          {
            context: "view"
          }
        ) : null
      };
    },
    [isSelected, mediaId]
  );
  const featuredImageURL = useFeaturedImage ? featuredImageMedia?.source_url : "";
  const featuredImageAlt = useFeaturedImage ? featuredImageMedia?.alt_text : "";
  const toggleUseFeaturedImage = () => {
    setAttributes({
      imageFill: false,
      mediaType: "image",
      mediaId: void 0,
      mediaUrl: void 0,
      mediaAlt: void 0,
      mediaLink: void 0,
      linkDestination: void 0,
      linkTarget: void 0,
      linkClass: void 0,
      rel: void 0,
      href: void 0,
      useFeaturedImage: !useFeaturedImage
    });
  };
  const refMedia = useRef();
  const imperativeFocalPointPreview = (value) => {
    const { style: style2 } = refMedia.current;
    const { x, y } = value;
    style2.objectPosition = `${x * 100}% ${y * 100}%`;
  };
  const [temporaryMediaWidth, setTemporaryMediaWidth] = useState(null);
  const onSelectMedia = attributesFromMedia({ attributes, setAttributes });
  const onSetHref = (props) => {
    setAttributes(props);
  };
  const onWidthChange = (width) => {
    setTemporaryMediaWidth(applyWidthConstraints(width));
  };
  const commitWidthChange = (width) => {
    setAttributes({
      mediaWidth: applyWidthConstraints(width)
    });
    setTemporaryMediaWidth(null);
  };
  const classNames = clsx({
    "has-media-on-the-right": "right" === mediaPosition,
    "is-selected": isSelected,
    "is-stacked-on-mobile": isStackedOnMobile,
    [`is-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
    "is-image-fill-element": imageFill
  });
  const widthString = `${temporaryMediaWidth || mediaWidth}%`;
  const gridTemplateColumns = "right" === mediaPosition ? `1fr ${widthString}` : `${widthString} 1fr`;
  const style = {
    gridTemplateColumns,
    msGridColumns: gridTemplateColumns
  };
  const onMediaAltChange = (newMediaAlt) => {
    setAttributes({ mediaAlt: newMediaAlt });
  };
  const onVerticalAlignmentChange = (alignment) => {
    setAttributes({ verticalAlignment: alignment });
  };
  const updateImage = (newMediaSizeSlug) => {
    const newUrl = getImageSourceUrlBySizeSlug(image, newMediaSizeSlug);
    if (!newUrl) {
      return null;
    }
    setAttributes({
      mediaUrl: newUrl,
      mediaSizeSlug: newMediaSizeSlug
    });
  };
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const mediaTextGeneralSettings = /* @__PURE__ */ jsxs(
    ToolsPanel,
    {
      label: __("Settings"),
      resetAll: () => {
        setAttributes({
          isStackedOnMobile: true,
          imageFill: false,
          mediaAlt: "",
          focalPoint: void 0,
          mediaWidth: 50
        });
        updateImage(DEFAULT_MEDIA_SIZE_SLUG);
      },
      dropdownMenuProps,
      children: [
        /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Media width"),
            isShownByDefault: true,
            hasValue: () => mediaWidth !== 50,
            onDeselect: () => setAttributes({ mediaWidth: 50 }),
            children: /* @__PURE__ */ jsx(
              RangeControl,
              {
                __next40pxDefaultSize: true,
                label: __("Media width"),
                value: temporaryMediaWidth || mediaWidth,
                onChange: commitWidthChange,
                min: WIDTH_CONSTRAINT_PERCENTAGE,
                max: 100 - WIDTH_CONSTRAINT_PERCENTAGE
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Stack on mobile"),
            isShownByDefault: true,
            hasValue: () => !isStackedOnMobile,
            onDeselect: () => setAttributes({ isStackedOnMobile: true }),
            children: /* @__PURE__ */ jsx(
              ToggleControl,
              {
                label: __("Stack on mobile"),
                checked: isStackedOnMobile,
                onChange: () => setAttributes({
                  isStackedOnMobile: !isStackedOnMobile
                })
              }
            )
          }
        ),
        mediaType === "image" && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Crop image to fill"),
            isShownByDefault: true,
            hasValue: () => !!imageFill,
            onDeselect: () => setAttributes({ imageFill: false }),
            children: /* @__PURE__ */ jsx(
              ToggleControl,
              {
                label: __("Crop image to fill"),
                checked: !!imageFill,
                onChange: () => setAttributes({
                  imageFill: !imageFill
                })
              }
            )
          }
        ),
        imageFill && (mediaUrl || featuredImageURL) && mediaType === "image" && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Focal point"),
            isShownByDefault: true,
            hasValue: () => !!focalPoint,
            onDeselect: () => setAttributes({ focalPoint: void 0 }),
            children: /* @__PURE__ */ jsx(
              FocalPointPicker,
              {
                label: __("Focal point"),
                url: useFeaturedImage && featuredImageURL ? featuredImageURL : mediaUrl,
                value: focalPoint,
                onChange: (value) => setAttributes({ focalPoint: value }),
                onDragStart: imperativeFocalPointPreview,
                onDrag: imperativeFocalPointPreview
              }
            )
          }
        ),
        mediaType === "image" && mediaUrl && !useFeaturedImage && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Alternative text"),
            isShownByDefault: true,
            hasValue: () => !!mediaAlt,
            onDeselect: () => setAttributes({ mediaAlt: "" }),
            children: /* @__PURE__ */ jsx(
              TextareaControl,
              {
                label: __("Alternative text"),
                value: mediaAlt,
                onChange: onMediaAltChange,
                help: /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    ExternalLink,
                    {
                      href: (
                        // translators: Localized tutorial, if one exists. W3C Web Accessibility Initiative link has list of existing translations.
                        __(
                          "https://www.w3.org/WAI/tutorials/images/decision-tree/"
                        )
                      ),
                      children: __(
                        "Describe the purpose of the image."
                      )
                    }
                  ),
                  /* @__PURE__ */ jsx("br", {}),
                  __("Leave empty if decorative.")
                ] })
              }
            )
          }
        ),
        mediaType === "image" && !useFeaturedImage && /* @__PURE__ */ jsx(
          MediaTextResolutionTool,
          {
            image,
            value: mediaSizeSlug,
            onChange: updateImage
          }
        )
      ]
    }
  );
  const blockProps = useBlockProps({
    className: classNames,
    style
  });
  const innerBlocksProps = useInnerBlocksProps(
    { className: "wp-block-media-text__content" },
    { template: TEMPLATE, allowedBlocks }
  );
  const blockEditingMode = useBlockEditingMode();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(InspectorControls, { children: mediaTextGeneralSettings }),
    /* @__PURE__ */ jsxs(BlockControls, { group: "block", children: [
      blockEditingMode === "default" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          BlockVerticalAlignmentControl,
          {
            onChange: onVerticalAlignmentChange,
            value: verticalAlignment
          }
        ),
        /* @__PURE__ */ jsx(
          ToolbarButton,
          {
            icon: pullLeft,
            title: __("Show media on left"),
            isActive: mediaPosition === "left",
            onClick: () => setAttributes({ mediaPosition: "left" })
          }
        ),
        /* @__PURE__ */ jsx(
          ToolbarButton,
          {
            icon: pullRight,
            title: __("Show media on right"),
            isActive: mediaPosition === "right",
            onClick: () => setAttributes({ mediaPosition: "right" })
          }
        )
      ] }),
      mediaType === "image" && !useFeaturedImage && /* @__PURE__ */ jsx(
        ImageURLInputUI,
        {
          url: href || "",
          onChangeUrl: onSetHref,
          linkDestination,
          mediaType,
          mediaUrl: image && image.source_url,
          mediaLink: image && image.link,
          linkTarget,
          linkClass,
          rel
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { ...blockProps, children: [
      mediaPosition === "right" && /* @__PURE__ */ jsx("div", { ...innerBlocksProps }),
      /* @__PURE__ */ jsx(
        MediaContainer,
        {
          className: "wp-block-media-text__media",
          onSelectMedia,
          onWidthChange,
          commitWidthChange,
          refMedia,
          enableResize: blockEditingMode === "default",
          toggleUseFeaturedImage,
          ...{
            focalPoint,
            imageFill,
            isSelected,
            isStackedOnMobile,
            mediaAlt,
            mediaId,
            mediaPosition,
            mediaType,
            mediaUrl,
            mediaWidth,
            useFeaturedImage,
            featuredImageURL,
            featuredImageAlt
          }
        }
      ),
      mediaPosition !== "right" && /* @__PURE__ */ jsx("div", { ...innerBlocksProps })
    ] })
  ] });
}
var edit_default = MediaTextEdit;
export {
  edit_default as default
};
//# sourceMappingURL=edit.mjs.map
