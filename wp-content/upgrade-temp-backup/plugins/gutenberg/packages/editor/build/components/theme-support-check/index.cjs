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

// packages/editor/src/components/theme-support-check/index.js
var theme_support_check_exports = {};
__export(theme_support_check_exports, {
  default: () => ThemeSupportCheck
});
module.exports = __toCommonJS(theme_support_check_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
function ThemeSupportCheck({ children, supportKeys }) {
  const { postType, themeSupports } = (0, import_data.useSelect)((select) => {
    return {
      postType: select(import_store.store).getEditedPostAttribute("type"),
      themeSupports: select(import_core_data.store).getThemeSupports()
    };
  }, []);
  const isSupported = (Array.isArray(supportKeys) ? supportKeys : [supportKeys]).some((key) => {
    const supported = themeSupports?.[key] ?? false;
    if ("post-thumbnails" === key && Array.isArray(supported)) {
      return supported.includes(postType);
    }
    return supported;
  });
  if (!isSupported) {
    return null;
  }
  return children;
}
//# sourceMappingURL=index.cjs.map
