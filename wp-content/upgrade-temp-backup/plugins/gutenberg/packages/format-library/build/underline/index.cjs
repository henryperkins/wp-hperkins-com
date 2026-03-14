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

// packages/format-library/src/underline/index.js
var underline_exports = {};
__export(underline_exports, {
  underline: () => underline
});
module.exports = __toCommonJS(underline_exports);
var import_i18n = require("@wordpress/i18n");
var import_rich_text = require("@wordpress/rich-text");
var import_block_editor = require("@wordpress/block-editor");
var import_jsx_runtime = require("react/jsx-runtime");
var name = "core/underline";
var title = (0, import_i18n.__)("Underline");
var underline = {
  name,
  title,
  tagName: "span",
  className: null,
  attributes: {
    style: "style"
  },
  edit({ value, onChange }) {
    const onToggle = () => {
      onChange(
        (0, import_rich_text.toggleFormat)(value, {
          type: name,
          attributes: {
            style: "text-decoration: underline;"
          },
          title
        })
      );
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.RichTextShortcut,
        {
          type: "primary",
          character: "u",
          onUse: onToggle
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.__unstableRichTextInputEvent,
        {
          inputType: "formatUnderline",
          onInput: onToggle
        }
      )
    ] });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  underline
});
//# sourceMappingURL=index.cjs.map
