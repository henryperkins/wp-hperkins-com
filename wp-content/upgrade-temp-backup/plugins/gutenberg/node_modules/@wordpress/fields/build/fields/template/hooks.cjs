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

// packages/fields/src/fields/template/hooks.ts
var hooks_exports = {};
__export(hooks_exports, {
  useDefaultTemplateLabel: () => useDefaultTemplateLabel
});
module.exports = __toCommonJS(hooks_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_utils = require("../../actions/utils.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
function getTemplateSlugToCheck(postType, slug) {
  if (slug) {
    return postType === "page" ? `${postType}-${slug}` : `single-${postType}-${slug}`;
  }
  return postType === "page" ? "page" : `single-${postType}`;
}
var NAME_NOT_FOUND = "";
function useDefaultTemplateLabel(postType, postId, slug) {
  return (0, import_data.useSelect)(
    (select) => {
      if (!postType || !postId) {
        return NAME_NOT_FOUND;
      }
      const postIdStr = String(postId);
      const homePage = (0, import_lock_unlock.unlock)(select(import_core_data.store)).getHomePage();
      if (postType === "page" && homePage?.postType === "page" && homePage?.postId === postIdStr) {
        const templates = select(
          import_core_data.store
        ).getEntityRecords("postType", "wp_template", {
          per_page: -1
        });
        const frontPage = templates?.find(
          (t) => t.slug === "front-page"
        );
        if (frontPage) {
          return (0, import_utils.getItemTitle)(frontPage);
        }
      }
      const postsPageId = (0, import_lock_unlock.unlock)(select(import_core_data.store)).getPostsPageId();
      if (postType === "page" && postsPageId === postIdStr) {
        const templateId2 = select(import_core_data.store).getDefaultTemplateId({
          slug: "home"
        });
        if (!templateId2) {
          return NAME_NOT_FOUND;
        }
        const template2 = select(
          import_core_data.store
        ).getEntityRecord(
          "postType",
          "wp_template",
          templateId2
        );
        return template2 ? (0, import_utils.getItemTitle)(template2) : NAME_NOT_FOUND;
      }
      const slugToCheck = getTemplateSlugToCheck(postType, slug);
      const templateId = select(import_core_data.store).getDefaultTemplateId({
        slug: slugToCheck
      });
      if (!templateId) {
        return NAME_NOT_FOUND;
      }
      const template = select(import_core_data.store).getEntityRecord(
        "postType",
        "wp_template",
        templateId
      );
      return template ? (0, import_utils.getItemTitle)(template) : NAME_NOT_FOUND;
    },
    [postType, postId, slug]
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useDefaultTemplateLabel
});
//# sourceMappingURL=hooks.cjs.map
