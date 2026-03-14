// packages/edit-site/src/utils/is-template-revertable.js
import { TEMPLATE_ORIGINS } from "./constants.mjs";
function isTemplateRevertable(template) {
  if (!template) {
    return false;
  }
  return template?.source === TEMPLATE_ORIGINS.custom && (Boolean(template?.plugin) || template?.has_theme_file);
}
export {
  isTemplateRevertable as default
};
//# sourceMappingURL=is-template-revertable.mjs.map
