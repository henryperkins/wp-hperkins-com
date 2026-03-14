// packages/fields/src/components/create-template-part-modal/utils.js
import { paramCase as kebabCase } from "change-case";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
var useExistingTemplateParts = () => {
  return useSelect(
    (select) => select(coreStore).getEntityRecords(
      "postType",
      "wp_template_part",
      {
        per_page: -1
      }
    ),
    []
  ) ?? [];
};
var getUniqueTemplatePartTitle = (title, templateParts) => {
  const lowercaseTitle = title.toLowerCase();
  const existingTitles = templateParts.map(
    (templatePart) => templatePart.title.rendered.toLowerCase()
  );
  if (!existingTitles.includes(lowercaseTitle)) {
    return title;
  }
  let suffix = 2;
  while (existingTitles.includes(`${lowercaseTitle} ${suffix}`)) {
    suffix++;
  }
  return `${title} ${suffix}`;
};
var getCleanTemplatePartSlug = (title) => {
  return kebabCase(title).replace(/[^\w-]+/g, "") || "wp-custom-part";
};
export {
  getCleanTemplatePartSlug,
  getUniqueTemplatePartTitle,
  useExistingTemplateParts
};
//# sourceMappingURL=utils.mjs.map
