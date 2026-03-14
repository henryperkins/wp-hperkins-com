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

// packages/fields/src/fields/template/utils.ts
var utils_exports = {};
__export(utils_exports, {
  getDefaultTemplateLabel: () => getDefaultTemplateLabel,
  getTemplateSlugToCheck: () => getTemplateSlugToCheck
});
module.exports = __toCommonJS(utils_exports);
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_utils = require("../../actions/utils.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
function getTemplateSlugToCheck(postType, slug) {
  if (slug) {
    return postType === "page" ? `${postType}-${slug}` : `single-${postType}-${slug}`;
  }
  return postType === "page" ? "page" : `single-${postType}`;
}
function getDefaultTemplateLabel(select, postType, postId, slug) {
  if (!postType || !postId) {
    return (0, import_i18n.__)("Default template");
  }
  const homePage = (0, import_lock_unlock.unlock)(select(import_core_data.store)).getHomePage();
  if (postType === "page" && homePage?.postType === "page" && homePage?.postId === String(postId)) {
    const templates = select(import_core_data.store).getEntityRecords(
      "postType",
      "wp_template",
      { per_page: -1 }
    );
    const frontPage = templates?.find(
      (t) => t.slug === "front-page"
    );
    if (frontPage) {
      return (0, import_utils.getItemTitle)(frontPage);
    }
  }
  const postsPageId = (0, import_lock_unlock.unlock)(select(import_core_data.store)).getPostsPageId();
  if (postType === "page" && postsPageId === String(postId)) {
    const templateId2 = select(import_core_data.store).getDefaultTemplateId({
      slug: "home"
    });
    if (templateId2) {
      const template2 = select(import_core_data.store).getEntityRecord(
        "postType",
        "wp_template",
        templateId2
      );
      if (template2) {
        return (0, import_utils.getItemTitle)(template2);
      }
    }
    return (0, import_i18n.__)("Default template");
  }
  const slugToCheck = getTemplateSlugToCheck(postType, slug);
  const templateId = select(import_core_data.store).getDefaultTemplateId({
    slug: slugToCheck
  });
  if (!templateId) {
    return (0, import_i18n.__)("Default template");
  }
  const template = select(import_core_data.store).getEntityRecord(
    "postType",
    "wp_template",
    templateId
  );
  return template ? (0, import_utils.getItemTitle)(template) : (0, import_i18n.__)("Default template");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getDefaultTemplateLabel,
  getTemplateSlugToCheck
});
//# sourceMappingURL=utils.cjs.map
