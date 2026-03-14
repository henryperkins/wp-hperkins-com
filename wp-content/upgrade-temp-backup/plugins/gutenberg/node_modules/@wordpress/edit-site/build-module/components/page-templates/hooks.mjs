// packages/edit-site/src/components/page-templates/hooks.js
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import {
  commentAuthorAvatar as authorIcon,
  layout as themeIcon,
  plugins as pluginIcon,
  globe as globeIcon
} from "@wordpress/icons";
import { TEMPLATE_ORIGINS } from "../../utils/constants.mjs";
function useAddedBy(postType, postId) {
  return useSelect(
    (select) => {
      const { getEntityRecord, getUser, getEditedEntityRecord } = select(coreStore);
      const template = getEditedEntityRecord(
        "postType",
        postType,
        postId
      );
      const originalSource = template?.original_source;
      const authorText = template?.author_text;
      switch (originalSource) {
        case "theme": {
          return {
            type: originalSource,
            icon: themeIcon,
            text: authorText,
            isCustomized: template.source === TEMPLATE_ORIGINS.custom
          };
        }
        case "plugin": {
          return {
            type: originalSource,
            icon: pluginIcon,
            text: authorText,
            isCustomized: template.source === TEMPLATE_ORIGINS.custom
          };
        }
        case "site": {
          const siteData = getEntityRecord(
            "root",
            "__unstableBase"
          );
          return {
            type: originalSource,
            icon: globeIcon,
            imageUrl: siteData?.site_logo ? getEntityRecord(
              "postType",
              "attachment",
              siteData.site_logo
            )?.source_url : void 0,
            text: authorText,
            isCustomized: false
          };
        }
        default: {
          const user = getUser(template.author);
          return {
            type: "user",
            icon: authorIcon,
            imageUrl: user?.avatar_urls?.[48],
            text: authorText ?? user?.name,
            isCustomized: false
          };
        }
      }
    },
    [postType, postId]
  );
}
export {
  useAddedBy
};
//# sourceMappingURL=hooks.mjs.map
