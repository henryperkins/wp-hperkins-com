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

// packages/fields/src/actions/view-post-revisions.tsx
var view_post_revisions_exports = {};
__export(view_post_revisions_exports, {
  default: () => view_post_revisions_default
});
module.exports = __toCommonJS(view_post_revisions_exports);
var import_url = require("@wordpress/url");
var import_i18n = require("@wordpress/i18n");
var viewPostRevisions = {
  id: "view-post-revisions",
  context: "list",
  label(items) {
    const revisionsCount = items[0]._links?.["version-history"]?.[0]?.count ?? 0;
    return (0, import_i18n.sprintf)(
      /* translators: %d: number of revisions. */
      (0, import_i18n.__)("View revisions (%d)"),
      revisionsCount
    );
  },
  isEligible(post) {
    if (post.status === "trash") {
      return false;
    }
    const lastRevisionId = post?._links?.["predecessor-version"]?.[0]?.id ?? null;
    const revisionsCount = post?._links?.["version-history"]?.[0]?.count ?? 0;
    return !!lastRevisionId && revisionsCount > 1;
  },
  callback(posts, { onActionPerformed }) {
    const post = posts[0];
    const href = (0, import_url.addQueryArgs)("revision.php", {
      revision: post?._links?.["predecessor-version"]?.[0]?.id
    });
    document.location.href = href;
    if (onActionPerformed) {
      onActionPerformed(posts);
    }
  }
};
var view_post_revisions_default = viewPostRevisions;
//# sourceMappingURL=view-post-revisions.cjs.map
