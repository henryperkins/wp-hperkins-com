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

// packages/edit-widgets/src/components/header/document-tools/index.js
var document_tools_exports = {};
__export(document_tools_exports, {
  default: () => document_tools_default
});
module.exports = __toCommonJS(document_tools_exports);
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_block_editor = require("@wordpress/block-editor");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_undo = __toESM(require("../undo-redo/undo.cjs"));
var import_redo = __toESM(require("../undo-redo/redo.cjs"));
var import_store = require("../../../store/index.cjs");
var import_lock_unlock = require("../../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function DocumentTools() {
  const isMediumViewport = (0, import_compose.useViewportMatch)("medium");
  const {
    isInserterOpen,
    isListViewOpen,
    inserterSidebarToggleRef,
    listViewToggleRef
  } = (0, import_data.useSelect)((select) => {
    const {
      isInserterOpened,
      getInserterSidebarToggleRef,
      isListViewOpened,
      getListViewToggleRef
    } = (0, import_lock_unlock.unlock)(select(import_store.store));
    return {
      isInserterOpen: isInserterOpened(),
      isListViewOpen: isListViewOpened(),
      inserterSidebarToggleRef: getInserterSidebarToggleRef(),
      listViewToggleRef: getListViewToggleRef()
    };
  }, []);
  const { setIsInserterOpened, setIsListViewOpened } = (0, import_data.useDispatch)(import_store.store);
  const toggleListView = (0, import_element.useCallback)(
    () => setIsListViewOpened(!isListViewOpen),
    [setIsListViewOpened, isListViewOpen]
  );
  const toggleInserterSidebar = (0, import_element.useCallback)(
    () => setIsInserterOpened(!isInserterOpen),
    [setIsInserterOpened, isInserterOpen]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_block_editor.NavigableToolbar,
    {
      className: "edit-widgets-header-toolbar",
      "aria-label": (0, import_i18n.__)("Document tools"),
      variant: "unstyled",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.ToolbarItem,
          {
            ref: inserterSidebarToggleRef,
            as: import_components.Button,
            className: "edit-widgets-header-toolbar__inserter-toggle",
            variant: "primary",
            isPressed: isInserterOpen,
            onMouseDown: (event) => {
              event.preventDefault();
            },
            onClick: toggleInserterSidebar,
            icon: import_icons.plus,
            label: (0, import_i18n._x)(
              "Block Inserter",
              "Generic label for block inserter button"
            ),
            size: "compact"
          }
        ),
        isMediumViewport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarItem, { as: import_undo.default }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarItem, { as: import_redo.default }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.ToolbarItem,
            {
              as: import_components.Button,
              className: "edit-widgets-header-toolbar__list-view-toggle",
              icon: import_icons.listView,
              isPressed: isListViewOpen,
              label: (0, import_i18n.__)("List View"),
              onClick: toggleListView,
              ref: listViewToggleRef,
              size: "compact"
            }
          )
        ] })
      ]
    }
  );
}
var document_tools_default = DocumentTools;
//# sourceMappingURL=index.cjs.map
