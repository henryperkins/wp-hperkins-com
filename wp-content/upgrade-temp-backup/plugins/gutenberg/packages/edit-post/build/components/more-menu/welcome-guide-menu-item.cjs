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

// packages/edit-post/src/components/more-menu/welcome-guide-menu-item.js
var welcome_guide_menu_item_exports = {};
__export(welcome_guide_menu_item_exports, {
  default: () => WelcomeGuideMenuItem
});
module.exports = __toCommonJS(welcome_guide_menu_item_exports);
var import_data = require("@wordpress/data");
var import_preferences = require("@wordpress/preferences");
var import_i18n = require("@wordpress/i18n");
var import_editor = require("@wordpress/editor");
var import_jsx_runtime = require("react/jsx-runtime");
function WelcomeGuideMenuItem() {
  const isEditingTemplate = (0, import_data.useSelect)(
    (select) => select(import_editor.store).getCurrentPostType() === "wp_template",
    []
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_preferences.PreferenceToggleMenuItem,
    {
      scope: "core/edit-post",
      name: isEditingTemplate ? "welcomeGuideTemplate" : "welcomeGuide",
      label: (0, import_i18n.__)("Welcome Guide")
    }
  );
}
//# sourceMappingURL=welcome-guide-menu-item.cjs.map
