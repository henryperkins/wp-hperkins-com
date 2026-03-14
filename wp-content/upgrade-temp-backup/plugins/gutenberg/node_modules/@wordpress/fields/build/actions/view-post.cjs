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

// packages/fields/src/actions/view-post.tsx
var view_post_exports = {};
__export(view_post_exports, {
  default: () => view_post_default
});
module.exports = __toCommonJS(view_post_exports);
var import_icons = require("@wordpress/icons");
var import_i18n = require("@wordpress/i18n");
var viewPost = {
  id: "view-post",
  label: (0, import_i18n._x)("View", "verb"),
  isPrimary: true,
  icon: import_icons.external,
  isEligible(post) {
    return post.status !== "trash";
  },
  callback(posts, { onActionPerformed }) {
    const post = posts[0];
    window.open(post?.link, "_blank");
    if (onActionPerformed) {
      onActionPerformed(posts);
    }
  }
};
var view_post_default = viewPost;
//# sourceMappingURL=view-post.cjs.map
