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

// packages/editor/src/components/document-tools/index.js
var document_tools_exports = {};
__export(document_tools_exports, {
  default: () => document_tools_default
});
module.exports = __toCommonJS(document_tools_exports);
var import_clsx = __toESM(require("clsx"));
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_preferences = require("@wordpress/preferences");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_redo = __toESM(require("../editor-history/redo.cjs"));
var import_undo = __toESM(require("../editor-history/undo.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function DocumentTools({ className, disableBlockTools = false }) {
  const { setIsInserterOpened, setIsListViewOpened } = (0, import_data.useDispatch)(import_store.store);
  const {
    isDistractionFree,
    isInserterOpened,
    isListViewOpen,
    listViewShortcut,
    inserterSidebarToggleRef,
    listViewToggleRef,
    showIconLabels
  } = (0, import_data.useSelect)((select) => {
    const { get } = select(import_preferences.store);
    const {
      isListViewOpened,
      getEditorMode,
      getInserterSidebarToggleRef,
      getListViewToggleRef
    } = (0, import_lock_unlock.unlock)(select(import_store.store));
    const { getShortcutRepresentation } = select(import_keyboard_shortcuts.store);
    return {
      isInserterOpened: select(import_store.store).isInserterOpened(),
      isListViewOpen: isListViewOpened(),
      listViewShortcut: getShortcutRepresentation(
        "core/editor/toggle-list-view"
      ),
      inserterSidebarToggleRef: getInserterSidebarToggleRef(),
      listViewToggleRef: getListViewToggleRef(),
      showIconLabels: get("core", "showIconLabels"),
      isDistractionFree: get("core", "distractionFree"),
      isVisualMode: getEditorMode() === "visual"
    };
  }, []);
  const preventDefault = (event) => {
    if (isInserterOpened) {
      event.preventDefault();
    }
  };
  const isWideViewport = (0, import_compose.useViewportMatch)("wide");
  const toolbarAriaLabel = (0, import_i18n.__)("Document tools");
  const toggleListView = (0, import_element.useCallback)(
    () => setIsListViewOpened(!isListViewOpen),
    [setIsListViewOpened, isListViewOpen]
  );
  const toggleInserter = (0, import_element.useCallback)(
    () => setIsInserterOpened(!isInserterOpened),
    [isInserterOpened, setIsInserterOpened]
  );
  const longLabel = (0, import_i18n._x)(
    "Block Inserter",
    "Generic label for block inserter button"
  );
  const shortLabel = !isInserterOpened ? (0, import_i18n.__)("Add") : (0, import_i18n.__)("Close");
  return (
    // Some plugins expect and use the `edit-post-header-toolbar` CSS class to
    // find the toolbar and inject UI elements into it. This is not officially
    // supported, but we're keeping it in the list of class names for backwards
    // compatibility.
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.NavigableToolbar,
      {
        className: (0, import_clsx.default)(
          "editor-document-tools",
          "edit-post-header-toolbar",
          className
        ),
        "aria-label": toolbarAriaLabel,
        variant: "unstyled",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-document-tools__left", children: [
          !isDistractionFree && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.ToolbarButton,
            {
              ref: inserterSidebarToggleRef,
              className: "editor-document-tools__inserter-toggle",
              variant: "primary",
              isPressed: isInserterOpened,
              onMouseDown: preventDefault,
              onClick: toggleInserter,
              disabled: disableBlockTools,
              icon: import_icons.plus,
              label: showIconLabels ? shortLabel : longLabel,
              showTooltip: !showIconLabels,
              "aria-expanded": isInserterOpened
            }
          ),
          (isWideViewport || !showIconLabels) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.ToolbarItem,
              {
                as: import_undo.default,
                showTooltip: !showIconLabels,
                variant: showIconLabels ? "tertiary" : void 0,
                size: "compact"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.ToolbarItem,
              {
                as: import_redo.default,
                showTooltip: !showIconLabels,
                variant: showIconLabels ? "tertiary" : void 0,
                size: "compact"
              }
            ),
            !isDistractionFree && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.ToolbarButton,
              {
                className: "editor-document-tools__document-overview-toggle",
                icon: import_icons.listView,
                disabled: disableBlockTools,
                isPressed: isListViewOpen,
                label: (0, import_i18n.__)("Document Overview"),
                onClick: toggleListView,
                shortcut: listViewShortcut,
                showTooltip: !showIconLabels,
                variant: showIconLabels ? "tertiary" : void 0,
                "aria-expanded": isListViewOpen,
                ref: listViewToggleRef
              }
            )
          ] })
        ] })
      }
    )
  );
}
var document_tools_default = DocumentTools;
//# sourceMappingURL=index.cjs.map
