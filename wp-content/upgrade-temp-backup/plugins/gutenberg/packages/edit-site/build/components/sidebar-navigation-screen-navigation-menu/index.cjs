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

// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menu/index.js
var sidebar_navigation_screen_navigation_menu_exports = {};
__export(sidebar_navigation_screen_navigation_menu_exports, {
  default: () => SidebarNavigationScreenNavigationMenu,
  postType: () => postType
});
module.exports = __toCommonJS(sidebar_navigation_screen_navigation_menu_exports);
var import_core_data = require("@wordpress/core-data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_html_entities = require("@wordpress/html-entities");
var import_router = require("@wordpress/router");
var import_sidebar_navigation_screen_navigation_menus = require("../sidebar-navigation-screen-navigation-menus/index.cjs");
var import_more_menu = __toESM(require("./more-menu.cjs"));
var import_single_navigation_menu = __toESM(require("./single-navigation-menu.cjs"));
var import_use_navigation_menu_handlers = __toESM(require("./use-navigation-menu-handlers.cjs"));
var import_build_navigation_label = __toESM(require("../sidebar-navigation-screen-navigation-menus/build-navigation-label.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var postType = `wp_navigation`;
function SidebarNavigationScreenNavigationMenu({ backPath }) {
  const {
    params: { postId }
  } = useLocation();
  const { record: navigationMenu, isResolving } = (0, import_core_data.useEntityRecord)(
    "postType",
    postType,
    postId
  );
  const { isSaving, isDeleting } = (0, import_data.useSelect)(
    (select) => {
      const { isSavingEntityRecord, isDeletingEntityRecord } = select(import_core_data.store);
      return {
        isSaving: isSavingEntityRecord("postType", postType, postId),
        isDeleting: isDeletingEntityRecord(
          "postType",
          postType,
          postId
        )
      };
    },
    [postId]
  );
  const isLoading = isResolving || isSaving || isDeleting;
  const menuTitle = navigationMenu?.title?.rendered || navigationMenu?.slug;
  const { handleSave, handleDelete, handleDuplicate } = (0, import_use_navigation_menu_handlers.default)();
  const _handleDelete = () => handleDelete(navigationMenu);
  const _handleSave = (edits) => handleSave(navigationMenu, edits);
  const _handleDuplicate = () => handleDuplicate(navigationMenu);
  if (isLoading) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_sidebar_navigation_screen_navigation_menus.SidebarNavigationScreenWrapper,
      {
        description: (0, import_i18n.__)(
          "Navigation Menus are a curated collection of blocks that allow visitors to get around your site."
        ),
        backPath,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, { className: "edit-site-sidebar-navigation-screen-navigation-menus__loading" })
      }
    );
  }
  if (!isLoading && !navigationMenu) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_sidebar_navigation_screen_navigation_menus.SidebarNavigationScreenWrapper,
      {
        description: (0, import_i18n.__)("Navigation Menu missing."),
        backPath
      }
    );
  }
  if (!navigationMenu?.content?.raw) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_sidebar_navigation_screen_navigation_menus.SidebarNavigationScreenWrapper,
      {
        actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_more_menu.default,
          {
            menuId: navigationMenu?.id,
            menuTitle: (0, import_html_entities.decodeEntities)(menuTitle),
            onDelete: _handleDelete,
            onSave: _handleSave,
            onDuplicate: _handleDuplicate
          }
        ),
        backPath,
        title: (0, import_build_navigation_label.default)(
          navigationMenu?.title,
          navigationMenu?.id,
          navigationMenu?.status
        ),
        description: (0, import_i18n.__)("This Navigation Menu is empty.")
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_single_navigation_menu.default,
    {
      navigationMenu,
      backPath,
      handleDelete: _handleDelete,
      handleSave: _handleSave,
      handleDuplicate: _handleDuplicate
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  postType
});
//# sourceMappingURL=index.cjs.map
