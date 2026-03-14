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

// packages/editor/src/components/entities-saved-states/entity-type-list.js
var entity_type_list_exports = {};
__export(entity_type_list_exports, {
  default: () => EntityTypeList
});
module.exports = __toCommonJS(entity_type_list_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_core_data = require("@wordpress/core-data");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_entity_record_item = __toESM(require("./entity-record-item.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function getEntityDescription(entity, count) {
  switch (entity) {
    case "site":
      return 1 === count ? (0, import_i18n.__)("This change will affect your whole site.") : (0, import_i18n.__)("These changes will affect your whole site.");
    case "wp_template":
      return (0, import_i18n.__)(
        "This change will affect other parts of your site that use this template."
      );
    case "page":
    case "post":
      return (0, import_i18n.__)("The following has been modified.");
  }
}
function GlobalStylesDescription({ record }) {
  const { editedRecord, savedRecord } = (0, import_data.useSelect)(
    (select) => {
      const { getEditedEntityRecord, getEntityRecord } = select(import_core_data.store);
      return {
        editedRecord: getEditedEntityRecord(
          record.kind,
          record.name,
          record.key
        ),
        savedRecord: getEntityRecord(
          record.kind,
          record.name,
          record.key
        )
      };
    },
    [record.kind, record.name, record.key]
  );
  const globalStylesChanges = (0, import_global_styles_engine.getGlobalStylesChanges)(
    editedRecord,
    savedRecord,
    {
      maxResults: 10
    }
  );
  return globalStylesChanges.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "entities-saved-states__changes", children: globalStylesChanges.map((change) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: change }, change)) }) : null;
}
function EntityDescription({ record, count }) {
  if ("globalStyles" === record?.name) {
    return null;
  }
  const description = getEntityDescription(record?.name, count);
  return description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.PanelRow, { children: description }) : null;
}
function EntityTypeList({
  list,
  unselectedEntities,
  setUnselectedEntities
}) {
  const count = list.length;
  const firstRecord = list[0];
  const entityConfig = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getEntityConfig(
      firstRecord.kind,
      firstRecord.name
    ),
    [firstRecord.kind, firstRecord.name]
  );
  let entityLabel = entityConfig.label;
  if (firstRecord?.name === "wp_template_part") {
    entityLabel = 1 === count ? (0, import_i18n.__)("Template Part") : (0, import_i18n.__)("Template Parts");
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.PanelBody,
    {
      title: entityLabel,
      initialOpen: true,
      className: "entities-saved-states__panel-body",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntityDescription, { record: firstRecord, count }),
        list.map((record) => {
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_entity_record_item.default,
            {
              record,
              checked: !unselectedEntities.some(
                (elt) => elt.kind === record.kind && elt.name === record.name && elt.key === record.key && elt.property === record.property
              ),
              onChange: (value) => setUnselectedEntities(record, value)
            },
            record.key || record.property
          );
        }),
        "globalStyles" === firstRecord?.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalStylesDescription, { record: firstRecord })
      ]
    }
  );
}
//# sourceMappingURL=entity-type-list.cjs.map
