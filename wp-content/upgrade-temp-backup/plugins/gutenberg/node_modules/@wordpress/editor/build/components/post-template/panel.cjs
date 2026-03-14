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

// packages/editor/src/components/post-template/panel.js
var panel_exports = {};
__export(panel_exports, {
  default: () => PostTemplatePanel
});
module.exports = __toCommonJS(panel_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
var import_classic_theme = __toESM(require("./classic-theme.cjs"));
var import_block_theme = __toESM(require("./block-theme.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function PostTemplatePanel() {
  const { templateId, isBlockTheme } = (0, import_data.useSelect)((select) => {
    const { getCurrentTemplateId, getEditorSettings } = select(import_store.store);
    return {
      templateId: getCurrentTemplateId(),
      isBlockTheme: getEditorSettings().__unstableIsBlockBasedTheme
    };
  }, []);
  const isVisible = (0, import_data.useSelect)((select) => {
    const postTypeSlug = select(import_store.store).getCurrentPostType();
    const postType = select(import_core_data.store).getPostType(postTypeSlug);
    if (!postType?.viewable) {
      return false;
    }
    const settings = select(import_store.store).getEditorSettings();
    const hasTemplates = !!settings.availableTemplates && Object.keys(settings.availableTemplates).length > 0;
    if (hasTemplates) {
      return true;
    }
    if (!settings.supportsTemplateMode) {
      return false;
    }
    const canCreateTemplates = select(import_core_data.store).canUser("create", {
      kind: "postType",
      name: "wp_template"
    }) ?? false;
    return canCreateTemplates;
  }, []);
  const canViewTemplates = (0, import_data.useSelect)(
    (select) => {
      return isVisible ? select(import_core_data.store).canUser("read", {
        kind: "postType",
        name: "wp_template"
      }) : false;
    },
    [isVisible]
  );
  if ((!isBlockTheme || !canViewTemplates) && isVisible) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_classic_theme.default, {});
  }
  if (isBlockTheme && !!templateId) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_theme.default, { id: templateId });
  }
  return null;
}
//# sourceMappingURL=panel.cjs.map
