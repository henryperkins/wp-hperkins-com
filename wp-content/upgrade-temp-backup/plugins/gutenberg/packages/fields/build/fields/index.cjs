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

// packages/fields/src/fields/index.ts
var fields_exports = {};
__export(fields_exports, {
  authorField: () => import_author.default,
  commentStatusField: () => import_comment_status.default,
  dateField: () => import_date.default,
  discussionField: () => import_discussion.default,
  featuredImageField: () => import_featured_image.default,
  notesField: () => import_notes.default,
  orderField: () => import_order.default,
  pageTitleField: () => import_page_title.default,
  parentField: () => import_parent.default,
  passwordField: () => import_password.default,
  patternTitleField: () => import_pattern_title.default,
  pingStatusField: () => import_ping_status.default,
  scheduledDateField: () => import_scheduled.default,
  slugField: () => import_slug.default,
  statusField: () => import_status.default,
  templateField: () => import_template.default,
  templateTitleField: () => import_template_title.default,
  titleField: () => import_title.default
});
module.exports = __toCommonJS(fields_exports);
var import_slug = __toESM(require("./slug/index.cjs"));
var import_title = __toESM(require("./title/index.cjs"));
var import_page_title = __toESM(require("./page-title/index.cjs"));
var import_template_title = __toESM(require("./template-title/index.cjs"));
var import_pattern_title = __toESM(require("./pattern-title/index.cjs"));
var import_order = __toESM(require("./order/index.cjs"));
var import_featured_image = __toESM(require("./featured-image/index.cjs"));
var import_template = __toESM(require("./template/index.cjs"));
var import_parent = __toESM(require("./parent/index.cjs"));
var import_password = __toESM(require("./password/index.cjs"));
var import_status = __toESM(require("./status/index.cjs"));
var import_comment_status = __toESM(require("./comment-status/index.cjs"));
var import_ping_status = __toESM(require("./ping-status/index.cjs"));
var import_discussion = __toESM(require("./discussion/index.cjs"));
var import_date = __toESM(require("./date/index.cjs"));
var import_scheduled = __toESM(require("./date/scheduled/index.cjs"));
var import_author = __toESM(require("./author/index.cjs"));
var import_notes = __toESM(require("./notes/index.cjs"));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authorField,
  commentStatusField,
  dateField,
  discussionField,
  featuredImageField,
  notesField,
  orderField,
  pageTitleField,
  parentField,
  passwordField,
  patternTitleField,
  pingStatusField,
  scheduledDateField,
  slugField,
  statusField,
  templateField,
  templateTitleField,
  titleField
});
//# sourceMappingURL=index.cjs.map
