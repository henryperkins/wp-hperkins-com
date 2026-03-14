// packages/fields/src/fields/template/hooks.ts
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { getItemTitle } from "../../actions/utils.mjs";
import { unlock } from "../../lock-unlock.mjs";
function getTemplateSlugToCheck(postType, slug) {
  if (slug) {
    return postType === "page" ? `${postType}-${slug}` : `single-${postType}-${slug}`;
  }
  return postType === "page" ? "page" : `single-${postType}`;
}
var NAME_NOT_FOUND = "";
function useDefaultTemplateLabel(postType, postId, slug) {
  return useSelect(
    (select) => {
      if (!postType || !postId) {
        return NAME_NOT_FOUND;
      }
      const postIdStr = String(postId);
      const homePage = unlock(select(coreStore)).getHomePage();
      if (postType === "page" && homePage?.postType === "page" && homePage?.postId === postIdStr) {
        const templates = select(
          coreStore
        ).getEntityRecords("postType", "wp_template", {
          per_page: -1
        });
        const frontPage = templates?.find(
          (t) => t.slug === "front-page"
        );
        if (frontPage) {
          return getItemTitle(frontPage);
        }
      }
      const postsPageId = unlock(select(coreStore)).getPostsPageId();
      if (postType === "page" && postsPageId === postIdStr) {
        const templateId2 = select(coreStore).getDefaultTemplateId({
          slug: "home"
        });
        if (!templateId2) {
          return NAME_NOT_FOUND;
        }
        const template2 = select(
          coreStore
        ).getEntityRecord(
          "postType",
          "wp_template",
          templateId2
        );
        return template2 ? getItemTitle(template2) : NAME_NOT_FOUND;
      }
      const slugToCheck = getTemplateSlugToCheck(postType, slug);
      const templateId = select(coreStore).getDefaultTemplateId({
        slug: slugToCheck
      });
      if (!templateId) {
        return NAME_NOT_FOUND;
      }
      const template = select(coreStore).getEntityRecord(
        "postType",
        "wp_template",
        templateId
      );
      return template ? getItemTitle(template) : NAME_NOT_FOUND;
    },
    [postType, postId, slug]
  );
}
export {
  useDefaultTemplateLabel
};
//# sourceMappingURL=hooks.mjs.map
