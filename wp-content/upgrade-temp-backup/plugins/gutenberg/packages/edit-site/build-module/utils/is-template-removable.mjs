// packages/edit-site/src/utils/is-template-removable.js
import { TEMPLATE_ORIGINS } from "./constants.mjs";
function isTemplateRemovable(template) {
  if (!template) {
    return false;
  }
  return template.source === TEMPLATE_ORIGINS.custom && !Boolean(template.plugin) && !template.has_theme_file;
}
export {
  isTemplateRemovable as default
};
//# sourceMappingURL=is-template-removable.mjs.map
