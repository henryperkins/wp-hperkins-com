// packages/core-commands/src/utils/order-entity-records-by-search.js
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
export {
  orderEntityRecordsBySearch
};
//# sourceMappingURL=order-entity-records-by-search.mjs.map
