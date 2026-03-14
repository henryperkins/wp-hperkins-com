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

// packages/format-library/src/bold/index.js
var bold_exports = {};
__export(bold_exports, {
  bold: () => bold
});
module.exports = __toCommonJS(bold_exports);
var import_i18n = require("@wordpress/i18n");
var import_rich_text = require("@wordpress/rich-text");
var import_block_editor = require("@wordpress/block-editor");
var import_icons = require("@wordpress/icons");
var import_jsx_runtime = require("react/jsx-runtime");
var name = "core/bold";
var title = (0, import_i18n.__)("Bold");
var bold = {
  name,
  title,
  tagName: "strong",
  className: null,
  edit({ isActive, value, onChange, onFocus, isVisible = true }) {
    function onToggle() {
      onChange((0, import_rich_text.toggleFormat)(value, { type: name, title }));
    }
    function onClick() {
      onChange((0, import_rich_text.toggleFormat)(value, { type: name }));
      onFocus();
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.RichTextShortcut,
        {
          type: "primary",
          character: "b",
          onUse: onToggle
        }
      ),
      isVisible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.RichTextToolbarButton,
        {
          name: "bold",
          icon: import_icons.formatBold,
          title,
          onClick,
          isActive,
          shortcutType: "primary",
          shortcutCharacter: "b"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.__unstableRichTextInputEvent,
        {
          inputType: "formatBold",
          onInput: onToggle
        }
      )
    ] });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bold
});
//# sourceMappingURL=index.cjs.map
