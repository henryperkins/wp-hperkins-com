"use strict";
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

// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menus/build-navigation-label.js
var build_navigation_label_exports = {};
__export(build_navigation_label_exports, {
  default: () => buildNavigationLabel
});
module.exports = __toCommonJS(build_navigation_label_exports);
var import_i18n = require("@wordpress/i18n");
var import_html_entities = require("@wordpress/html-entities");
function buildNavigationLabel(title, id, status) {
  if (!title?.rendered) {
    return (0, import_i18n.sprintf)((0, import_i18n.__)("(no title %s)"), id);
  }
  if (status === "publish") {
    return (0, import_html_entities.decodeEntities)(title?.rendered);
  }
  return (0, import_i18n.sprintf)(
    // translators: 1: title of the menu. 2: status of the menu (draft, pending, etc.).
    (0, import_i18n._x)("%1$s (%2$s)", "menu label"),
    (0, import_html_entities.decodeEntities)(title?.rendered),
    status
  );
}
//# sourceMappingURL=build-navigation-label.cjs.map
