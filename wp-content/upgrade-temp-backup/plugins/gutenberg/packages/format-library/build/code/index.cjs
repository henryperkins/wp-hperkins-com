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

// packages/format-library/src/code/index.js
var code_exports = {};
__export(code_exports, {
  code: () => code
});
module.exports = __toCommonJS(code_exports);
var import_i18n = require("@wordpress/i18n");
var import_rich_text = require("@wordpress/rich-text");
var import_block_editor = require("@wordpress/block-editor");
var import_icons = require("@wordpress/icons");
var import_jsx_runtime = require("react/jsx-runtime");
var name = "core/code";
var title = (0, import_i18n.__)("Inline code");
var code = {
  name,
  title,
  tagName: "code",
  className: null,
  __unstableInputRule(value) {
    const BACKTICK = "`";
    const { start, text } = value;
    const characterBefore = text[start - 1];
    if (characterBefore !== BACKTICK) {
      return value;
    }
    if (start - 2 < 0) {
      return value;
    }
    const indexBefore = text.lastIndexOf(BACKTICK, start - 2);
    if (indexBefore === -1) {
      return value;
    }
    const startIndex = indexBefore;
    const endIndex = start - 2;
    if (startIndex === endIndex) {
      return value;
    }
    value = (0, import_rich_text.remove)(value, startIndex, startIndex + 1);
    value = (0, import_rich_text.remove)(value, endIndex, endIndex + 1);
    value = (0, import_rich_text.applyFormat)(value, { type: name }, startIndex, endIndex);
    return value;
  },
  edit({ value, onChange, onFocus, isActive }) {
    function onClick() {
      onChange((0, import_rich_text.toggleFormat)(value, { type: name, title }));
      onFocus();
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.RichTextShortcut,
        {
          type: "access",
          character: "x",
          onUse: onClick
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.RichTextToolbarButton,
        {
          icon: import_icons.code,
          title,
          onClick,
          isActive,
          role: "menuitemcheckbox"
        }
      )
    ] });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  code
});
//# sourceMappingURL=index.cjs.map
