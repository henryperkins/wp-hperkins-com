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

// packages/customize-widgets/src/components/header/index.js
var header_exports = {};
__export(header_exports, {
  default: () => header_default
});
module.exports = __toCommonJS(header_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_keycodes = require("@wordpress/keycodes");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_inserter = __toESM(require("../inserter/index.cjs"));
var import_more_menu = __toESM(require("../more-menu/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function Header({
  sidebar,
  inserter,
  isInserterOpened,
  setIsInserterOpened,
  isFixedToolbarActive
}) {
  const [[hasUndo, hasRedo], setUndoRedo] = (0, import_element.useState)([
    sidebar.hasUndo(),
    sidebar.hasRedo()
  ]);
  const shortcut = (0, import_keycodes.isAppleOS)() ? import_keycodes.displayShortcut.primaryShift("z") : import_keycodes.displayShortcut.primary("y");
  (0, import_element.useEffect)(() => {
    return sidebar.subscribeHistory(() => {
      setUndoRedo([sidebar.hasUndo(), sidebar.hasRedo()]);
    });
  }, [sidebar]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: (0, import_clsx.default)("customize-widgets-header", {
          "is-fixed-toolbar-active": isFixedToolbarActive
        }),
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_block_editor.NavigableToolbar,
          {
            className: "customize-widgets-header-toolbar",
            "aria-label": (0, import_i18n.__)("Document tools"),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.ToolbarButton,
                {
                  icon: !(0, import_i18n.isRTL)() ? import_icons.undo : import_icons.redo,
                  label: (0, import_i18n.__)("Undo"),
                  shortcut: import_keycodes.displayShortcut.primary("z"),
                  disabled: !hasUndo,
                  onClick: sidebar.undo,
                  className: "customize-widgets-editor-history-button undo-button"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.ToolbarButton,
                {
                  icon: !(0, import_i18n.isRTL)() ? import_icons.redo : import_icons.undo,
                  label: (0, import_i18n.__)("Redo"),
                  shortcut,
                  disabled: !hasRedo,
                  onClick: sidebar.redo,
                  className: "customize-widgets-editor-history-button redo-button"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.ToolbarButton,
                {
                  className: "customize-widgets-header-toolbar__inserter-toggle",
                  isPressed: isInserterOpened,
                  variant: "primary",
                  icon: import_icons.plus,
                  label: (0, import_i18n._x)(
                    "Add block",
                    "Generic label for block inserter button"
                  ),
                  onClick: () => {
                    setIsInserterOpened((isOpen) => !isOpen);
                  }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_more_menu.default, {})
            ]
          }
        )
      }
    ),
    (0, import_element.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inserter.default, { setIsOpened: setIsInserterOpened }),
      inserter.contentContainer[0]
    )
  ] });
}
var header_default = Header;
//# sourceMappingURL=index.cjs.map
