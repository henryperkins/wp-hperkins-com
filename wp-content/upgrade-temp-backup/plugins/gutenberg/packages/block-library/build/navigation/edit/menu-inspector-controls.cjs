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

// packages/block-library/src/navigation/edit/menu-inspector-controls.js
var menu_inspector_controls_exports = {};
__export(menu_inspector_controls_exports, {
  default: () => menu_inspector_controls_default
});
module.exports = __toCommonJS(menu_inspector_controls_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_navigation_menu_selector = __toESM(require("./navigation-menu-selector.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_deleted_navigation_warning = __toESM(require("./deleted-navigation-warning.cjs"));
var import_use_navigation_menu = __toESM(require("../use-navigation-menu.cjs"));
var import_leaf_more_menu = __toESM(require("./leaf-more-menu.cjs"));
var import_navigation_link_ui = require("./navigation-link-ui.cjs");
var import_navigation_list_view_header = __toESM(require("./navigation-list-view-header.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var actionLabel = (
  /* translators: %s: The name of a menu. */
  (0, import_i18n.__)("Switch to '%s'")
);
var {
  PrivateListView,
  PrivateBlockContext,
  useListViewPanelState,
  useBlockDisplayTitle
} = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var MainContent = ({
  clientId,
  currentMenuId,
  isLoading,
  isNavigationMenuMissing,
  onCreateNew,
  expandRevision
}) => {
  const hasChildren = (0, import_data.useSelect)(
    (select) => {
      return !!select(import_block_editor.store).getBlockCount(clientId);
    },
    [clientId]
  );
  const { openListViewContentPanel } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_block_editor.store)
  );
  const { navigationMenu } = (0, import_use_navigation_menu.default)(currentMenuId);
  if (currentMenuId && isNavigationMenuMissing) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_deleted_navigation_warning.default, { onCreateNew, isNotice: true });
  }
  if (isLoading) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {});
  }
  const description = navigationMenu ? (0, import_i18n.sprintf)(
    /* translators: %s: The name of a menu. */
    (0, import_i18n.__)("Structure for Navigation Menu: %s"),
    navigationMenu?.title || (0, import_i18n.__)("Untitled menu")
  ) : (0, import_i18n.__)(
    "You have not yet created any menus. Displaying a list of your Pages"
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "wp-block-navigation__menu-inspector-controls", children: [
    !hasChildren && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "wp-block-navigation__menu-inspector-controls__empty-message", children: (0, import_i18n.__)("This Navigation Menu is empty.") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      PrivateListView,
      {
        rootClientId: clientId,
        isExpanded: true,
        description,
        showAppender: true,
        blockSettingsMenu: import_leaf_more_menu.default,
        additionalBlockContent: import_navigation_link_ui.NavigationLinkUI,
        onSelect: openListViewContentPanel
      },
      `${clientId}-${expandRevision}`
    )
  ] });
};
var MenuInspectorControls = (props) => {
  const {
    clientId,
    createNavigationMenuIsSuccess,
    createNavigationMenuIsError,
    currentMenuId = null,
    onCreateNew,
    onSelectClassicMenu,
    onSelectNavigationMenu,
    isManageMenusButtonDisabled,
    blockEditingMode
  } = props;
  const { isSelectionWithinCurrentSection } = (0, import_element.useContext)(PrivateBlockContext);
  const blockTitle = useBlockDisplayTitle({
    clientId,
    context: "list-view"
  });
  const showBlockTitle = isSelectionWithinCurrentSection;
  const { isOpened, expandRevision, handleToggle } = useListViewPanelState(clientId);
  if (!showBlockTitle) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InspectorControls, { group: "list", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.PanelBody, { title: null, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_navigation_list_view_header.default,
        {
          clientId,
          blockEditingMode,
          currentMenuId,
          onSelectClassicMenu,
          onSelectNavigationMenu,
          onCreateNew,
          createNavigationMenuIsSuccess,
          createNavigationMenuIsError,
          isManageMenusButtonDisabled
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        MainContent,
        {
          ...props,
          expandRevision
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InspectorControls, { group: "list", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.PanelBody,
    {
      title: blockTitle,
      opened: isOpened,
      onToggle: handleToggle,
      children: [
        blockEditingMode === "default" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_navigation_menu_selector.default,
          {
            currentMenuId,
            onSelectClassicMenu,
            onSelectNavigationMenu,
            onCreateNew,
            createNavigationMenuIsSuccess,
            createNavigationMenuIsError,
            actionLabel,
            isManageMenusButtonDisabled
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MainContent, { ...props, expandRevision })
      ]
    }
  ) });
};
var menu_inspector_controls_default = MenuInspectorControls;
//# sourceMappingURL=menu-inspector-controls.cjs.map
