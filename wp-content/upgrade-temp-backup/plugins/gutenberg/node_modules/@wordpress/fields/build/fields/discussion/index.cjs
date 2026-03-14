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

// packages/fields/src/fields/discussion/index.tsx
var discussion_exports = {};
__export(discussion_exports, {
  default: () => discussion_default
});
module.exports = __toCommonJS(discussion_exports);
var import_i18n = require("@wordpress/i18n");
var discussionField = {
  id: "discussion",
  label: (0, import_i18n.__)("Discussion"),
  type: "text",
  render: ({ item }) => {
    const commentsOpen = item.comment_status === "open";
    const pingsOpen = item.ping_status === "open";
    if (commentsOpen && pingsOpen) {
      return (0, import_i18n.__)("Open");
    }
    if (commentsOpen && !pingsOpen) {
      return (0, import_i18n.__)("Comments only");
    }
    if (!commentsOpen && pingsOpen) {
      return (0, import_i18n.__)("Pings only");
    }
    return (0, import_i18n.__)("Closed");
  },
  filterBy: false
};
var discussion_default = discussionField;
//# sourceMappingURL=index.cjs.map
