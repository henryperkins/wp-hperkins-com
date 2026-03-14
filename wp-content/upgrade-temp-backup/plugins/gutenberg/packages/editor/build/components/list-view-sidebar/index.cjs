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

// packages/editor/src/components/list-view-sidebar/index.js
var list_view_sidebar_exports = {};
__export(list_view_sidebar_exports, {
  default: () => ListViewSidebar
});
module.exports = __toCommonJS(list_view_sidebar_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_dom = require("@wordpress/dom");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_keycodes = require("@wordpress/keycodes");
var import_list_view_outline = __toESM(require("./list-view-outline.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { TabbedSidebar } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function ListViewSidebar() {
  const { setIsListViewOpened } = (0, import_data.useDispatch)(import_store.store);
  const { getListViewToggleRef } = (0, import_lock_unlock.unlock)((0, import_data.useSelect)(import_store.store));
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
  const [dropZoneElement, setDropZoneElement] = (0, import_element.useState)(null);
  const [tab, setTab] = (0, import_element.useState)("list-view");
  const sidebarRef = (0, import_element.useRef)();
  const tabsRef = (0, import_element.useRef)();
  const listViewRef = (0, import_element.useRef)();
  const listViewContainerRef = (0, import_compose.useMergeRefs)([
    focusOnMountRef,
    listViewRef,
    setDropZoneElement
  ]);
  function handleSidebarFocus(currentTab) {
    const tabPanelFocus = import_dom.focus.tabbable.find(tabsRef.current)[0];
    if (currentTab === "list-view") {
      const listViewApplicationFocus = import_dom.focus.tabbable.find(
        listViewRef.current
      )[0];
      const listViewFocusArea = sidebarRef.current.contains(
        listViewApplicationFocus
      ) ? listViewApplicationFocus : tabPanelFocus;
      listViewFocusArea.focus();
    } else {
      tabPanelFocus.focus();
    }
  }
  const handleToggleListViewShortcut = (0, import_element.useCallback)(() => {
    if (sidebarRef.current.contains(
      sidebarRef.current.ownerDocument.activeElement
    )) {
      closeListView();
    } else {
      handleSidebarFocus(tab);
    }
  }, [closeListView, tab]);
  (0, import_keyboard_shortcuts.useShortcut)("core/editor/toggle-list-view", handleToggleListViewShortcut);
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: "editor-list-view-sidebar",
        onKeyDown: closeOnEscape,
        ref: sidebarRef,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          TabbedSidebar,
          {
            tabs: [
              {
                name: "list-view",
                title: (0, import_i18n._x)("List View", "Post overview"),
                panel: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-list-view-sidebar__list-view-container", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-list-view-sidebar__list-view-panel-content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_block_editor.__experimentalListView,
                  {
                    dropZoneElement
                  }
                ) }) }),
                panelRef: listViewContainerRef
              },
              {
                name: "outline",
                title: (0, import_i18n._x)("Outline", "Post overview"),
                panel: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-list-view-sidebar__list-view-container", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_list_view_outline.default, {}) })
              }
            ],
            onClose: closeListView,
            onSelect: (tabName) => setTab(tabName),
            defaultTabId: "list-view",
            ref: tabsRef,
            closeButtonLabel: (0, import_i18n.__)("Close")
          }
        )
      }
    )
  );
}
//# sourceMappingURL=index.cjs.map
