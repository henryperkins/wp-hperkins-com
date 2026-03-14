// packages/editor/src/utils/get-template-info.js
import { layout } from "@wordpress/icons";
import { getTemplatePartIcon } from "./get-template-part-icon.mjs";
var EMPTY_OBJECT = {};
var getTemplateInfo = (params) => {
  if (!params) {
    return EMPTY_OBJECT;
  }
  const { templateTypes, templateAreas, template } = params;
  const { description, slug, title, area } = template;
  const { title: defaultTitle, description: defaultDescription } = Object.values(templateTypes).find((type) => type.slug === slug) ?? EMPTY_OBJECT;
  const templateTitle = typeof title === "string" ? title : title?.rendered;
  const templateDescription = typeof description === "string" ? description : description?.raw;
  const templateAreasWithIcon = templateAreas?.map((item) => ({
    ...item,
    icon: getTemplatePartIcon(item.icon)
  }));
  const templateIcon = templateAreasWithIcon?.find((item) => area === item.area)?.icon || layout;
  return {
    title: templateTitle && templateTitle !== slug ? templateTitle : defaultTitle || slug,
    description: templateDescription || defaultDescription,
    icon: templateIcon
  };
};
export {
  getTemplateInfo
};
//# sourceMappingURL=get-template-info.mjs.map
