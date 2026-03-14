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

// packages/core-data/src/hooks/use-entity-prop.js
var use_entity_prop_exports = {};
__export(use_entity_prop_exports, {
  default: () => useEntityProp
});
module.exports = __toCommonJS(use_entity_prop_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_name = require("../name.cjs");
var import_entities = require("../entities.cjs");
var import_entity_context = require("../entity-context.cjs");
var import_use_entity_id = __toESM(require("./use-entity-id.cjs"));
function useEntityProp(kind, name, prop, _id) {
  const providerId = (0, import_use_entity_id.default)(kind, name);
  const id = _id ?? providerId;
  const context = (0, import_element.useContext)(import_entity_context.EntityContext);
  const revisionId = context?.revisionId;
  const { value, fullValue } = (0, import_data.useSelect)(
    (select) => {
      if (revisionId) {
        const revisions = select(import_name.STORE_NAME).getRevisions(
          kind,
          name,
          id,
          {
            per_page: -1,
            context: "edit"
          }
        );
        const entityConfig = select(import_name.STORE_NAME).getEntityConfig(
          kind,
          name
        );
        const revKey = entityConfig?.revisionKey || import_entities.DEFAULT_ENTITY_KEY;
        const revision = revisions?.find(
          (r) => r[revKey] === revisionId
        );
        return revision ? {
          value: revision[prop],
          fullValue: revision[prop]
        } : {};
      }
      const { getEntityRecord, getEditedEntityRecord } = select(import_name.STORE_NAME);
      const record = getEntityRecord(kind, name, id);
      const editedRecord = getEditedEntityRecord(kind, name, id);
      return record && editedRecord ? {
        value: editedRecord[prop],
        fullValue: record[prop]
      } : {};
    },
    [kind, name, id, prop, revisionId]
  );
  const { editEntityRecord } = (0, import_data.useDispatch)(import_name.STORE_NAME);
  const setValue = (0, import_element.useCallback)(
    (newValue) => {
      if (revisionId) {
        return;
      }
      editEntityRecord(kind, name, id, {
        [prop]: newValue
      });
    },
    [editEntityRecord, kind, name, id, prop, revisionId]
  );
  return [value, setValue, fullValue];
}
//# sourceMappingURL=use-entity-prop.cjs.map
