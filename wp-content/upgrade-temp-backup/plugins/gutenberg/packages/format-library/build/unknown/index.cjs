var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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

// packages/format-library/src/unknown/index.js
var unknown_exports = {};
__export(unknown_exports, {
  unknown: () => unknown
});
module.exports = __toCommonJS(unknown_exports);
var import_i18n = require("@wordpress/i18n");
var import_rich_text = require("@wordpress/rich-text");
var import_block_editor = require("@wordpress/block-editor");
var import_icons = require("@wordpress/icons");
var import_jsx_runtime = require("react/jsx-runtime");
var name = "core/unknown";
var title = (0, import_i18n.__)("Clear Unknown Formatting");
function selectionContainsUnknownFormats(value) {
  if ((0, import_rich_text.isCollapsed)(value)) {
    return false;
  }
  const selectedValue = (0, import_rich_text.slice)(value);
  return selectedValue.formats.some((formats) => {
    return formats.some((format) => format.type === name);
  });
}
var unknown = {
  name,
  title,
  tagName: "*",
  className: null,
  edit({ isActive, value, onChange, onFocus }) {
    if (!isActive && !selectionContainsUnknownFormats(value)) {
      return null;
    }
    function onClick() {
      onChange((0, import_rich_text.removeFormat)(value, name));
      onFocus();
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.RichTextToolbarButton,
      {
        name: "unknown",
        icon: import_icons.help,
        title,
        onClick,
        isActive: true
      }
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  unknown
});
//# sourceMappingURL=index.cjs.map
