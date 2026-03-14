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

// packages/edit-widgets/src/components/widget-areas-block-editor-content/index.js
var widget_areas_block_editor_content_exports = {};
__export(widget_areas_block_editor_content_exports, {
  default: () => WidgetAreasBlockEditorContent
});
module.exports = __toCommonJS(widget_areas_block_editor_content_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_preferences = require("@wordpress/preferences");
var import_notices = __toESM(require("../notices/index.cjs"));
var import_keyboard_shortcuts = __toESM(require("../keyboard-shortcuts/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function WidgetAreasBlockEditorContent({
  blockEditorSettings
}) {
  const hasThemeStyles = (0, import_data.useSelect)(
    (select) => !!select(import_preferences.store).get(
      "core/edit-widgets",
      "themeStyles"
    ),
    []
  );
  const isLargeViewport = (0, import_compose.useViewportMatch)("medium");
  const styles = (0, import_element.useMemo)(() => {
    return hasThemeStyles ? blockEditorSettings.styles : [];
  }, [blockEditorSettings, hasThemeStyles]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "edit-widgets-block-editor", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_notices.default, {}),
    !isLargeViewport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockToolbar, { hideDragHandle: true }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_block_editor.BlockTools, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_keyboard_shortcuts.default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.__unstableEditorStyles,
        {
          styles,
          scope: ":where(.editor-styles-wrapper)"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockSelectionClearer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.WritingFlow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockList, { className: "edit-widgets-main-block-list" }) }) })
    ] })
  ] });
}
//# sourceMappingURL=index.cjs.map
