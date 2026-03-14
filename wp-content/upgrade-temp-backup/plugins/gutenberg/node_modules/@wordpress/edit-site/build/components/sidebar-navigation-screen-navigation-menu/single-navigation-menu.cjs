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

// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menu/single-navigation-menu.js
var single_navigation_menu_exports = {};
__export(single_navigation_menu_exports, {
  default: () => SingleNavigationMenu
});
module.exports = __toCommonJS(single_navigation_menu_exports);
var import_i18n = require("@wordpress/i18n");
var import_html_entities = require("@wordpress/html-entities");
var import_sidebar_navigation_screen_navigation_menus = require("../sidebar-navigation-screen-navigation-menus/index.cjs");
var import_more_menu = __toESM(require("./more-menu.cjs"));
var import_navigation_menu_editor = __toESM(require("./navigation-menu-editor.cjs"));
var import_build_navigation_label = __toESM(require("../sidebar-navigation-screen-navigation-menus/build-navigation-label.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function SingleNavigationMenu({
  navigationMenu,
  backPath,
  handleDelete,
  handleDuplicate,
  handleSave
}) {
  const menuTitle = navigationMenu?.title?.rendered;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_sidebar_navigation_screen_navigation_menus.SidebarNavigationScreenWrapper,
    {
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_more_menu.default,
        {
          menuId: navigationMenu?.id,
          menuTitle: (0, import_html_entities.decodeEntities)(menuTitle),
          onDelete: handleDelete,
          onSave: handleSave,
          onDuplicate: handleDuplicate
        }
      ) }),
      backPath,
      title: (0, import_build_navigation_label.default)(
        navigationMenu?.title,
        navigationMenu?.id,
        navigationMenu?.status
      ),
      description: (0, import_i18n.__)(
        "Navigation Menus are a curated collection of blocks that allow visitors to get around your site."
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_navigation_menu_editor.default, { navigationMenuId: navigationMenu?.id })
    }
  );
}
//# sourceMappingURL=single-navigation-menu.cjs.map
