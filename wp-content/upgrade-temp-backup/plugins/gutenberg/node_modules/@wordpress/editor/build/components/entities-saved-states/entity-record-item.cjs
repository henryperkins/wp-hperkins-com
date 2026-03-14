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

// packages/editor/src/components/entities-saved-states/entity-record-item.js
var entity_record_item_exports = {};
__export(entity_record_item_exports, {
  default: () => EntityRecordItem
});
module.exports = __toCommonJS(entity_record_item_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_html_entities = require("@wordpress/html-entities");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_get_template_info = require("../../utils/get-template-info.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function EntityRecordItem({ record, checked, onChange }) {
  const { name, kind, title, key } = record;
  const { entityRecordTitle, hasPostMetaChanges } = (0, import_data.useSelect)(
    (select) => {
      if ("postType" !== kind || "wp_template" !== name) {
        return {
          entityRecordTitle: title,
          hasPostMetaChanges: (0, import_lock_unlock.unlock)(
            select(import_store.store)
          ).hasPostMetaChanges(name, key)
        };
      }
      const template = select(import_core_data.store).getEditedEntityRecord(
        kind,
        name,
        key
      );
      const { default_template_types: templateTypes = [] } = select(import_core_data.store).getCurrentTheme() ?? {};
      return {
        entityRecordTitle: (0, import_get_template_info.getTemplateInfo)({
          template,
          templateTypes
        }).title,
        hasPostMetaChanges: (0, import_lock_unlock.unlock)(
          select(import_store.store)
        ).hasPostMetaChanges(name, key)
      };
    },
    [name, kind, title, key]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.PanelRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.CheckboxControl,
      {
        label: (0, import_html_entities.decodeEntities)(entityRecordTitle) || (0, import_i18n.__)("Untitled"),
        checked,
        onChange,
        className: "entities-saved-states__change-control"
      }
    ) }),
    hasPostMetaChanges && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "entities-saved-states__changes", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: (0, import_i18n.__)("Post Meta.") }) })
  ] });
}
//# sourceMappingURL=entity-record-item.cjs.map
