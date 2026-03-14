var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-widgets/src/components/secondary-sidebar/list-view-sidebar.js
var list_view_sidebar_exports = {};
__export(list_view_sidebar_exports, {
  default: () => ListViewSidebar
});
module.exports = __toCommonJS(list_view_sidebar_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_keycodes = require("@wordpress/keycodes");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function ListViewSidebar() {
  const { setIsListViewOpened } = (0, import_data.useDispatch)(import_store.store);
  const { getListViewToggleRef } = (0, import_lock_unlock.unlock)((0, import_data.useSelect)(import_store.store));
  const [dropZoneElement, setDropZoneElement] = (0, import_element.useState)(null);
  const focusOnMountRef = (0, import_compose.useFocusOnMount)("firstElement");
  const closeListView = (0, import_element.useCallback)(() => {
    setIsListViewOpened(false);
    getListViewToggleRef().current?.focus();
  }, [getListViewToggleRef, setIsListViewOpened]);
  const closeOnEscape = (0, import_element.useCallback)(
    (event) => {
      if (event.keyCode === import_keycodes.ESCAPE && !event.defaultPrevented) {
        event.preventDefault();
        closeListView();
      }
    },
    [closeListView]
  );
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        className: "edit-widgets-editor__list-view-panel",
        onKeyDown: closeOnEscape,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "edit-widgets-editor__list-view-panel-header", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: (0, import_i18n.__)("List View") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Button,
              {
                icon: import_icons.closeSmall,
                label: (0, import_i18n.__)("Close"),
                onClick: closeListView,
                size: "compact"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: "edit-widgets-editor__list-view-panel-content",
              ref: (0, import_compose.useMergeRefs)([focusOnMountRef, setDropZoneElement]),
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.__experimentalListView, { dropZoneElement })
            }
          )
        ]
      }
    )
  );
}
//# sourceMappingURL=list-view-sidebar.cjs.map
