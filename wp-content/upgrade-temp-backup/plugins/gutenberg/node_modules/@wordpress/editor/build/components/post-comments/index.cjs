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

// packages/editor/src/components/post-comments/index.js
var post_comments_exports = {};
__export(post_comments_exports, {
  default: () => post_comments_default
});
module.exports = __toCommonJS(post_comments_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var COMMENT_OPTIONS = [
  {
    label: (0, import_i18n._x)("Open", 'Adjective: e.g. "Comments are open"'),
    value: "open",
    description: (0, import_i18n.__)("Visitors can add new comments and replies.")
  },
  {
    label: (0, import_i18n.__)("Closed"),
    value: "closed",
    description: [
      (0, import_i18n.__)("Visitors cannot add new comments or replies."),
      (0, import_i18n.__)("Existing comments remain visible.")
    ].join(" ")
  }
];
function PostComments() {
  const commentStatus = (0, import_data.useSelect)(
    (select) => select(import_store.store).getEditedPostAttribute("comment_status") ?? "open",
    []
  );
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const handleStatus = (newCommentStatus) => editPost({
    comment_status: newCommentStatus
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalVStack, { spacing: 4, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.RadioControl,
    {
      className: "editor-change-status__options",
      hideLabelFromVision: true,
      label: (0, import_i18n.__)("Comment status"),
      options: COMMENT_OPTIONS,
      onChange: handleStatus,
      selected: commentStatus
    }
  ) }) });
}
var post_comments_default = PostComments;
//# sourceMappingURL=index.cjs.map
