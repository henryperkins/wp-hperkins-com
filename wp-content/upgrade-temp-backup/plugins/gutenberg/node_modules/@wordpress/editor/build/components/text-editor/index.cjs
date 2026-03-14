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

// packages/editor/src/components/text-editor/index.js
var text_editor_exports = {};
__export(text_editor_exports, {
  default: () => TextEditor
});
module.exports = __toCommonJS(text_editor_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_element = require("@wordpress/element");
var import_store = require("../../store/index.cjs");
var import_post_text_editor = __toESM(require("../post-text-editor/index.cjs"));
var import_post_title_raw = __toESM(require("../post-title/post-title-raw.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function TextEditor({ autoFocus = false }) {
  const { switchEditorMode } = (0, import_data.useDispatch)(import_store.store);
  const { shortcut, isRichEditingEnabled } = (0, import_data.useSelect)((select) => {
    const { getEditorSettings } = select(import_store.store);
    const { getShortcutRepresentation } = select(import_keyboard_shortcuts.store);
    return {
      shortcut: getShortcutRepresentation("core/editor/toggle-mode"),
      isRichEditingEnabled: getEditorSettings().richEditingEnabled
    };
  }, []);
  const titleRef = (0, import_element.useRef)();
  (0, import_element.useEffect)(() => {
    if (autoFocus) {
      return;
    }
    titleRef?.current?.focus();
  }, [autoFocus]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-text-editor", children: [
    isRichEditingEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-text-editor__toolbar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: (0, import_i18n.__)("Editing code") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          variant: "tertiary",
          onClick: () => switchEditorMode("visual"),
          shortcut,
          children: (0, import_i18n.__)("Exit code editor")
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-text-editor__body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_title_raw.default, { ref: titleRef }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_text_editor.default, {})
    ] })
  ] });
}
//# sourceMappingURL=index.cjs.map
