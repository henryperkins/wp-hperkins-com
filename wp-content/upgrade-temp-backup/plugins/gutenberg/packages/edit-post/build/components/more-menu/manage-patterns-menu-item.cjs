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

// packages/edit-post/src/components/more-menu/manage-patterns-menu-item.js
var manage_patterns_menu_item_exports = {};
__export(manage_patterns_menu_item_exports, {
  default: () => manage_patterns_menu_item_default
});
module.exports = __toCommonJS(manage_patterns_menu_item_exports);
var import_components = require("@wordpress/components");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_url = require("@wordpress/url");
var import_jsx_runtime = require("react/jsx-runtime");
function ManagePatternsMenuItem() {
  const url = (0, import_data.useSelect)((select) => {
    const { canUser } = select(import_core_data.store);
    const defaultUrl = (0, import_url.addQueryArgs)("edit.php", {
      post_type: "wp_block"
    });
    const patternsUrl = (0, import_url.addQueryArgs)("site-editor.php", {
      p: "/pattern"
    });
    return canUser("create", {
      kind: "postType",
      name: "wp_template"
    }) ? patternsUrl : defaultUrl;
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuItem, { role: "menuitem", href: url, children: (0, import_i18n.__)("Manage patterns") });
}
var manage_patterns_menu_item_default = ManagePatternsMenuItem;
//# sourceMappingURL=manage-patterns-menu-item.cjs.map
