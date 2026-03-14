"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-library/src/utils/media-control.js
var media_control_exports = {};
__export(media_control_exports, {
  MediaControl: () => MediaControl,
  MediaControlPreview: () => MediaControlPreview
});
module.exports = __toCommonJS(media_control_exports);
var import_components = require("@wordpress/components");
var import_block_editor = require("@wordpress/block-editor");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_jsx_runtime = require("react/jsx-runtime");
function MediaControlPreview({
  url,
  alt,
  filename,
  itemGroupProps,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItemGroup, { ...itemGroupProps, as: "span", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "flex-start", as: "span", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: url, alt }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { as: "span", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalTruncate, { numberOfLines: 1, className, children: filename }) })
  ] }) });
}
function MediaControl({
  mediaId,
  mediaUrl,
  alt = "",
  filename,
  allowedTypes,
  onSelect,
  onSelectURL,
  onError,
  onReset,
  isUploading = false,
  emptyLabel = (0, import_i18n.__)("Add media")
}) {
  const { getSettings } = (0, import_data.useSelect)(import_block_editor.store);
  const onFilesDrop = (filesList) => {
    const { mediaUpload } = getSettings();
    if (!mediaUpload) {
      return;
    }
    mediaUpload({
      allowedTypes,
      filesList,
      onFileChange([media]) {
        onSelect(media);
      },
      onError,
      multiple: false
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "block-library-utils__media-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.MediaReplaceFlow,
      {
        mediaId,
        mediaURL: mediaUrl,
        allowedTypes,
        onSelect,
        onSelectURL,
        onError,
        name: mediaUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          MediaControlPreview,
          {
            url: mediaUrl,
            alt,
            filename
          }
        ) : emptyLabel,
        renderToggle: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Button, { ...props, __next40pxDefaultSize: true, children: isUploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}) : props.children }),
        onReset
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.DropZone, { onFilesDrop })
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MediaControl,
  MediaControlPreview
});
//# sourceMappingURL=media-control.cjs.map
