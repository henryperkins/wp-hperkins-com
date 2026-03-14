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

// packages/edit-site/src/components/editor/use-editor-title.js
var use_editor_title_exports = {};
__export(use_editor_title_exports, {
  default: () => use_editor_title_default
});
module.exports = __toCommonJS(use_editor_title_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_html_entities = require("@wordpress/html-entities");
var import_editor = require("@wordpress/editor");
var import_use_title = __toESM(require("../routes/use-title.cjs"));
var import_constants = require("../../utils/constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var { getTemplateInfo } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
function useEditorTitle(postType, postId) {
  const { title, isLoaded } = (0, import_data.useSelect)(
    (select) => {
      const {
        getEditedEntityRecord,
        getCurrentTheme,
        hasFinishedResolution
      } = select(import_core_data.store);
      if (!postId) {
        return { isLoaded: false };
      }
      const _record = getEditedEntityRecord(
        "postType",
        postType,
        postId
      );
      const { default_template_types: templateTypes = [] } = getCurrentTheme() ?? {};
      const templateInfo = getTemplateInfo({
        template: _record,
        templateTypes
      });
      const _isLoaded = hasFinishedResolution("getEditedEntityRecord", [
        "postType",
        postType,
        postId
      ]);
      return {
        title: templateInfo.title,
        isLoaded: _isLoaded
      };
    },
    [postType, postId]
  );
  let editorTitle;
  if (isLoaded) {
    editorTitle = (0, import_i18n.sprintf)(
      // translators: A breadcrumb trail for the Admin document title. 1: title of template being edited, 2: type of template (Template or Template Part).
      (0, import_i18n._x)("%1$s \u2039 %2$s", "breadcrumb trail"),
      (0, import_html_entities.decodeEntities)(title),
      import_constants.POST_TYPE_LABELS[postType] ?? import_constants.POST_TYPE_LABELS[import_constants.TEMPLATE_POST_TYPE]
    );
  }
  (0, import_use_title.default)(isLoaded && editorTitle);
}
var use_editor_title_default = useEditorTitle;
//# sourceMappingURL=use-editor-title.cjs.map
