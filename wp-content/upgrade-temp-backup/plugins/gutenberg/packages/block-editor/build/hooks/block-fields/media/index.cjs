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

// packages/block-editor/src/hooks/block-fields/media/index.js
var media_exports = {};
__export(media_exports, {
  default: () => Media
});
module.exports = __toCommonJS(media_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_media_replace_flow = __toESM(require("../../../components/media-replace-flow/index.cjs"));
var import_check = __toESM(require("../../../components/media-upload/check.cjs"));
var import_use_inspector_popover_placement = require("../use-inspector-popover-placement.cjs");
var import_private_keys = require("../../../store/private-keys.cjs");
var import_store = require("../../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function MediaThumbnail({ data, field, attachment, config }) {
  const { allowedTypes = [], multiple = false } = config || {};
  if (multiple) {
    return "todo multiple";
  }
  if (attachment?.media_type === "image" || attachment?.poster) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-editor-content-only-controls__media-thumbnail", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-editor-content-only-controls__media-thumbnail", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { alt: "", width: 24, height: 24, src: url }) });
    }
    let icon;
    if (allowedTypes[0] === "image") {
      icon = import_icons.image;
    } else if (allowedTypes[0] === "video") {
      icon = import_icons.video;
    } else if (allowedTypes[0] === "audio") {
      icon = import_icons.audio;
    } else {
      icon = import_icons.media;
    }
    if (icon) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon, size: 24 });
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon: import_icons.media, size: 24 });
}
function Media({ data, field, onChange, config = {} }) {
  const { popoverProps } = (0, import_use_inspector_popover_placement.useInspectorPopoverPlacement)({
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
  const attachment = (0, import_data.useSelect)(
    (select) => {
      if (!id) {
        return;
      }
      const settings = select(import_store.store).getSettings();
      const getMedia = settings[import_private_keys.getMediaSelectKey];
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
      chooseItemLabel = (0, import_i18n.__)("Choose an image\u2026");
    } else if (allowedType === "video") {
      chooseItemLabel = (0, import_i18n.__)("Choose a video\u2026");
    } else if (allowedType === "application") {
      chooseItemLabel = (0, import_i18n.__)("Choose a file\u2026");
    } else {
      chooseItemLabel = (0, import_i18n.__)("Choose a media item\u2026");
    }
  } else {
    chooseItemLabel = (0, import_i18n.__)("Choose a media item\u2026");
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_media_replace_flow.default,
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
      renderToggle: (buttonProps) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          className: "block-editor-content-only-controls__media",
          ...buttonProps,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            import_components.__experimentalGrid,
            {
              rowGap: 0,
              columnGap: 8,
              templateColumns: "24px 1fr",
              className: "block-editor-content-only-controls__media-row",
              children: [
                url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    MediaThumbnail,
                    {
                      attachment,
                      field,
                      data,
                      config
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                    className: "block-editor-content-only-controls__media-title",
                    // TODO - truncate long titles or url smartly (e.g. show filename).
                    children: attachment?.title?.raw && attachment?.title?.raw !== "" ? attachment?.title?.raw : url
                  })
                ] }),
                !url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "span",
                    {
                      className: "block-editor-content-only-controls__media-placeholder",
                      style: {
                        width: "24px",
                        height: "24px"
                      }
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-editor-content-only-controls__media-title", children: chooseItemLabel })
                ] })
              ]
            }
          )
        }
      )
    }
  ) });
}
//# sourceMappingURL=index.cjs.map
