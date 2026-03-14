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

// packages/core-commands/src/utils/order-entity-records-by-search.js
var order_entity_records_by_search_exports = {};
__export(order_entity_records_by_search_exports, {
  orderEntityRecordsBySearch: () => orderEntityRecordsBySearch
});
module.exports = __toCommonJS(order_entity_records_by_search_exports);
function orderEntityRecordsBySearch(records = [], search = "") {
  if (!Array.isArray(records) || !records.length) {
    return [];
  }
  if (!search) {
    return records;
  }
  const priority = [];
  const nonPriority = [];
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (record?.title?.raw?.toLowerCase()?.includes(search?.toLowerCase())) {
      priority.push(record);
    } else {
      nonPriority.push(record);
    }
  }
  return priority.concat(nonPriority);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  orderEntityRecordsBySearch
});
//# sourceMappingURL=order-entity-records-by-search.cjs.map
