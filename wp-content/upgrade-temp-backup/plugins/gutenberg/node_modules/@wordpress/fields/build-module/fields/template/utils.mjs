// packages/fields/src/fields/template/utils.ts
import { store as coreStore } from "@wordpress/core-data";
import { __ } from "@wordpress/i18n";
import { getItemTitle } from "../../actions/utils.mjs";
import { unlock } from "../../lock-unlock.mjs";
function getTemplateSlugToCheck(postType, slug) {
  if (slug) {
    return postType === "page" ? `${postType}-${slug}` : `single-${postType}-${slug}`;
  }
  return postType === "page" ? "page" : `single-${postType}`;
}
function getDefaultTemplateLabel(select, postType, postId, slug) {
  if (!postType || !postId) {
    return __("Default template");
  }
  const homePage = unlock(select(coreStore)).getHomePage();
  if (postType === "page" && homePage?.postType === "page" && homePage?.postId === String(postId)) {
    const templates = select(coreStore).getEntityRecords(
      "postType",
      "wp_template",
      { per_page: -1 }
    );
    const frontPage = templates?.find(
      (t) => t.slug === "front-page"
    );
    if (frontPage) {
      return getItemTitle(frontPage);
    }
  }
  const postsPageId = unlock(select(coreStore)).getPostsPageId();
  if (postType === "page" && postsPageId === String(postId)) {
    const templateId2 = select(coreStore).getDefaultTemplateId({
      slug: "home"
    });
    if (templateId2) {
      const template2 = select(coreStore).getEntityRecord(
        "postType",
        "wp_template",
        templateId2
      );
      if (template2) {
        return getItemTitle(template2);
      }
    }
    return __("Default template");
  }
  const slugToCheck = getTemplateSlugToCheck(postType, slug);
  const templateId = select(coreStore).getDefaultTemplateId({
    slug: slugToCheck
  });
  if (!templateId) {
    return __("Default template");
  }
  const template = select(coreStore).getEntityRecord(
    "postType",
    "wp_template",
    templateId
  );
  return template ? getItemTitle(template) : __("Default template");
}
export {
  getDefaultTemplateLabel,
  getTemplateSlugToCheck
};
//# sourceMappingURL=utils.mjs.map
