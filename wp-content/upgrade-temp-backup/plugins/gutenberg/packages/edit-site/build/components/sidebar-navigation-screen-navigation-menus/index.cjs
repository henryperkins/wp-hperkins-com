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

// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menus/index.js
var sidebar_navigation_screen_navigation_menus_exports = {};
__export(sidebar_navigation_screen_navigation_menus_exports, {
  SidebarNavigationScreenWrapper: () => SidebarNavigationScreenWrapper,
  default: () => SidebarNavigationScreenNavigationMenus
});
module.exports = __toCommonJS(sidebar_navigation_screen_navigation_menus_exports);
var import_i18n = require("@wordpress/i18n");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_html_entities = require("@wordpress/html-entities");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_sidebar_navigation_screen = __toESM(require("../sidebar-navigation-screen/index.cjs"));
var import_sidebar_navigation_item = __toESM(require("../sidebar-navigation-item/index.cjs"));
var import_constants = require("./constants.cjs");
var import_single_navigation_menu = __toESM(require("../sidebar-navigation-screen-navigation-menu/single-navigation-menu.cjs"));
var import_use_navigation_menu_handlers = __toESM(require("../sidebar-navigation-screen-navigation-menu/use-navigation-menu-handlers.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_constants2 = require("../../utils/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function buildMenuLabel(title, id, status) {
  if (!title) {
    return (0, import_i18n.sprintf)((0, import_i18n.__)("(no title %s)"), id);
  }
  if (status === "publish") {
    return (0, import_html_entities.decodeEntities)(title);
  }
  return (0, import_i18n.sprintf)(
    // translators: 1: title of the menu. 2: status of the menu (draft, pending, etc.).
    (0, import_i18n._x)("%1$s (%2$s)", "menu label"),
    (0, import_html_entities.decodeEntities)(title),
    status
  );
}
function SidebarNavigationScreenNavigationMenus({ backPath }) {
  const {
    records: navigationMenus,
    isResolving: isResolvingNavigationMenus,
    hasResolved: hasResolvedNavigationMenus
  } = (0, import_core_data.useEntityRecords)(
    "postType",
    import_constants2.NAVIGATION_POST_TYPE,
    import_constants.PRELOADED_NAVIGATION_MENUS_QUERY
  );
  const isLoading = isResolvingNavigationMenus && !hasResolvedNavigationMenus;
  const { getNavigationFallbackId } = (0, import_lock_unlock.unlock)((0, import_data.useSelect)(import_core_data.store));
  const isCreatingNavigationFallback = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).isResolving("getNavigationFallbackId"),
    []
  );
  const firstNavigationMenu = navigationMenus?.[0];
  if (!firstNavigationMenu && !isResolvingNavigationMenus && hasResolvedNavigationMenus && // Ensure a fallback navigation is created only once
  !isCreatingNavigationFallback) {
    getNavigationFallbackId();
  }
  const { handleSave, handleDelete, handleDuplicate } = (0, import_use_navigation_menu_handlers.default)();
  const hasNavigationMenus = !!navigationMenus?.length;
  if (isLoading) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarNavigationScreenWrapper, { backPath, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, { className: "edit-site-sidebar-navigation-screen-navigation-menus__loading" }) });
  }
  if (!isLoading && !hasNavigationMenus) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SidebarNavigationScreenWrapper,
      {
        description: (0, import_i18n.__)("No Navigation Menus found."),
        backPath
      }
    );
  }
  if (navigationMenus?.length === 1) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_single_navigation_menu.default,
      {
        navigationMenu: firstNavigationMenu,
        backPath,
        handleDelete: () => handleDelete(firstNavigationMenu),
        handleDuplicate: () => handleDuplicate(firstNavigationMenu),
        handleSave: (edits) => handleSave(firstNavigationMenu, edits)
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarNavigationScreenWrapper, { backPath, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItemGroup, { className: "edit-site-sidebar-navigation-screen-navigation-menus", children: navigationMenus?.map(({ id, title, status }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    NavMenuItem,
    {
      postId: id,
      withChevron: true,
      icon: import_icons.navigation,
      children: buildMenuLabel(title?.rendered, index + 1, status)
    },
    id
  )) }) });
}
function SidebarNavigationScreenWrapper({
  children,
  actions,
  title,
  description,
  backPath
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_sidebar_navigation_screen.default,
    {
      title: title || (0, import_i18n.__)("Navigation"),
      actions,
      description: description || (0, import_i18n.__)("Manage your Navigation Menus."),
      backPath,
      content: children
    }
  );
}
var NavMenuItem = ({ postId, ...props }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_sidebar_navigation_item.default,
    {
      to: `/wp_navigation/${postId}`,
      ...props
    }
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SidebarNavigationScreenWrapper
});
//# sourceMappingURL=index.cjs.map
