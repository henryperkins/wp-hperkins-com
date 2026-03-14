// packages/block-editor/src/hooks/block-fields/media/index.js
import {
  Button,
  Icon,
  __experimentalGrid as Grid
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import {
  audio as audioIcon,
  image as imageIcon,
  media as mediaIcon,
  video as videoIcon
} from "@wordpress/icons";
import MediaReplaceFlow from "../../../components/media-replace-flow/index.mjs";
import MediaUploadCheck from "../../../components/media-upload/check.mjs";
import { useInspectorPopoverPlacement } from "../use-inspector-popover-placement.mjs";
import { getMediaSelectKey } from "../../../store/private-keys.mjs";
import { store as blockEditorStore } from "../../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function MediaThumbnail({ data, field, attachment, config }) {
  const { allowedTypes = [], multiple = false } = config || {};
  if (multiple) {
    return "todo multiple";
  }
  if (attachment?.media_type === "image" || attachment?.poster) {
    return /* @__PURE__ */ jsx("div", { className: "block-editor-content-only-controls__media-thumbnail", children: /* @__PURE__ */ jsx(
      "img",
      {
        alt: "",
        width: 24,
        height: 24,
        src: attachment.media_type === "image" ? attachment.source_url : attachment.poster
      }
    ) });
  }
  if (allowedTypes.length === 1) {
    const value = field.getValue({ item: data });
    const url = value?.url;
    if (allowedTypes[0] === "image" && url) {
      return /* @__PURE__ */ jsx("div", { className: "block-editor-content-only-controls__media-thumbnail", children: /* @__PURE__ */ jsx("img", { alt: "", width: 24, height: 24, src: url }) });
    }
    let icon;
    if (allowedTypes[0] === "image") {
      icon = imageIcon;
    } else if (allowedTypes[0] === "video") {
      icon = videoIcon;
    } else if (allowedTypes[0] === "audio") {
      icon = audioIcon;
    } else {
      icon = mediaIcon;
    }
    if (icon) {
      return /* @__PURE__ */ jsx(Icon, { icon, size: 24 });
    }
  }
  return /* @__PURE__ */ jsx(Icon, { icon: mediaIcon, size: 24 });
}
function Media({ data, field, onChange, config = {} }) {
  const { popoverProps } = useInspectorPopoverPlacement({
    isControl: true
  });
  const value = field.getValue({ item: data });
  const {
    allowedTypes = [],
    multiple = false,
    useFeaturedImage = false
  } = config;
  const id = value?.id;
  const url = value?.url;
  const attachment = useSelect(
    (select) => {
      if (!id) {
        return;
      }
      const settings = select(blockEditorStore).getSettings();
      const getMedia = settings[getMediaSelectKey];
      if (!getMedia) {
        return;
      }
      return getMedia(select, id);
    },
    [id]
  );
  let chooseItemLabel;
  if (allowedTypes.length === 1) {
    const allowedType = allowedTypes[0];
    if (allowedType === "image") {
      chooseItemLabel = __("Choose an image\u2026");
    } else if (allowedType === "video") {
      chooseItemLabel = __("Choose a video\u2026");
    } else if (allowedType === "application") {
      chooseItemLabel = __("Choose a file\u2026");
    } else {
      chooseItemLabel = __("Choose a media item\u2026");
    }
  } else {
    chooseItemLabel = __("Choose a media item\u2026");
  }
  return /* @__PURE__ */ jsx(MediaUploadCheck, { children: /* @__PURE__ */ jsx(
    MediaReplaceFlow,
    {
      className: "block-editor-content-only-controls__media-replace-flow",
      allowedTypes,
      mediaId: id,
      mediaURL: url,
      multiple,
      popoverProps,
      onReset: () => {
        onChange(
          field.setValue({
            item: data,
            value: {}
          })
        );
      },
      ...useFeaturedImage && {
        useFeaturedImage: !!value?.featuredImage,
        onToggleFeaturedImage: () => {
          onChange(
            field.setValue({
              item: data,
              value: {
                featuredImage: !value?.featuredImage
              }
            })
          );
        }
      },
      onSelect: (selectedMedia) => {
        if (selectedMedia.id && selectedMedia.url) {
          const newValue = {
            ...selectedMedia,
            mediaType: selectedMedia.media_type
          };
          if (useFeaturedImage) {
            newValue.featuredImage = false;
          }
          onChange(
            field.setValue({
              item: data,
              value: newValue
            })
          );
        }
      },
      renderToggle: (buttonProps) => /* @__PURE__ */ jsx(
        Button,
        {
          __next40pxDefaultSize: true,
          className: "block-editor-content-only-controls__media",
          ...buttonProps,
          children: /* @__PURE__ */ jsxs(
            Grid,
            {
              rowGap: 0,
              columnGap: 8,
              templateColumns: "24px 1fr",
              className: "block-editor-content-only-controls__media-row",
              children: [
                url && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    MediaThumbnail,
                    {
                      attachment,
                      field,
                      data,
                      config
                    }
                  ),
                  /* @__PURE__ */ jsx("span", {
                    className: "block-editor-content-only-controls__media-title",
                    // TODO - truncate long titles or url smartly (e.g. show filename).
                    children: attachment?.title?.raw && attachment?.title?.raw !== "" ? attachment?.title?.raw : url
                  })
                ] }),
                !url && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "block-editor-content-only-controls__media-placeholder",
                      style: {
                        width: "24px",
                        height: "24px"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "block-editor-content-only-controls__media-title", children: chooseItemLabel })
                ] })
              ]
            }
          )
        }
      )
    }
  ) });
}
export {
  Media as default
};
//# sourceMappingURL=index.mjs.map
