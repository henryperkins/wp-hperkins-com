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

// packages/edit-site/src/components/post-list/use-notes-count.js
var use_notes_count_exports = {};
__export(use_notes_count_exports, {
  default: () => useNotesCount
});
module.exports = __toCommonJS(use_notes_count_exports);
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
function useNotesCount(postIds) {
  const { records: notes, isResolving } = (0, import_core_data.useEntityRecords)(
    "root",
    "comment",
    {
      post: postIds,
      type: "note",
      status: "all",
      per_page: -1,
      _fields: "id,post"
    },
    {
      enabled: postIds?.length > 0
    }
  );
  const notesCount = (0, import_element.useMemo)(() => {
    if (!notes || notes.length === 0) {
      return {};
    }
    const counts = {};
    notes.forEach((note) => {
      const postId = note.post;
      counts[postId] = (counts[postId] || 0) + 1;
    });
    return counts;
  }, [notes]);
  return { notesCount, isResolving };
}
//# sourceMappingURL=use-notes-count.cjs.map
