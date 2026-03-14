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

// packages/editor/src/components/post-format/index.js
var post_format_exports = {};
__export(post_format_exports, {
  POST_FORMATS: () => POST_FORMATS,
  default: () => PostFormat
});
module.exports = __toCommonJS(post_format_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_core_data = require("@wordpress/core-data");
var import_check = __toESM(require("./check.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var POST_FORMATS = [
  { id: "aside", caption: (0, import_i18n.__)("Aside") },
  { id: "audio", caption: (0, import_i18n.__)("Audio") },
  { id: "chat", caption: (0, import_i18n.__)("Chat") },
  { id: "gallery", caption: (0, import_i18n.__)("Gallery") },
  { id: "image", caption: (0, import_i18n.__)("Image") },
  { id: "link", caption: (0, import_i18n.__)("Link") },
  { id: "quote", caption: (0, import_i18n.__)("Quote") },
  { id: "standard", caption: (0, import_i18n.__)("Standard") },
  { id: "status", caption: (0, import_i18n.__)("Status") },
  { id: "video", caption: (0, import_i18n.__)("Video") }
].sort((a, b) => {
  const normalizedA = a.caption.toUpperCase();
  const normalizedB = b.caption.toUpperCase();
  if (normalizedA < normalizedB) {
    return -1;
  }
  if (normalizedA > normalizedB) {
    return 1;
  }
  return 0;
});
function PostFormat() {
  const instanceId = (0, import_compose.useInstanceId)(PostFormat);
  const postFormatSelectorId = `post-format-selector-${instanceId}`;
  const { postFormat, suggestedFormat, supportedFormats } = (0, import_data.useSelect)(
    (select) => {
      const { getEditedPostAttribute, getSuggestedPostFormat } = select(import_store.store);
      const _postFormat = getEditedPostAttribute("format");
      const themeSupports = select(import_core_data.store).getThemeSupports();
      return {
        postFormat: _postFormat ?? "standard",
        suggestedFormat: getSuggestedPostFormat(),
        supportedFormats: themeSupports.formats
      };
    },
    []
  );
  const formats = POST_FORMATS.filter((format) => {
    return supportedFormats?.includes(format.id) || postFormat === format.id;
  });
  const suggestion = formats.find(
    (format) => format.id === suggestedFormat
  );
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const onUpdatePostFormat = (format) => editPost({ format });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-post-format", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.RadioControl,
      {
        className: "editor-post-format__options",
        label: (0, import_i18n.__)("Post Format"),
        selected: postFormat,
        onChange: (format) => onUpdatePostFormat(format),
        id: postFormatSelectorId,
        options: formats.map((format) => ({
          label: format.caption,
          value: format.id
        })),
        hideLabelFromVision: true
      }
    ),
    suggestion && suggestion.id !== postFormat && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "editor-post-format__suggestion", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        variant: "link",
        onClick: () => onUpdatePostFormat(suggestion.id),
        children: (0, import_i18n.sprintf)(
          /* translators: %s: post format */
          (0, import_i18n.__)("Apply suggested format: %s"),
          suggestion.caption
        )
      }
    ) })
  ] }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  POST_FORMATS
});
//# sourceMappingURL=index.cjs.map
