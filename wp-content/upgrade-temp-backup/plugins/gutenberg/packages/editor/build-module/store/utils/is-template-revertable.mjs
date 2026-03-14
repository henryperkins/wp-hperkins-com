// packages/editor/src/store/utils/is-template-revertable.js
import { TEMPLATE_ORIGINS } from "../constants.mjs";
function isTemplateRevertable(templateOrTemplatePart) {
  if (!templateOrTemplatePart) {
    return false;
  }
  return templateOrTemplatePart.source === TEMPLATE_ORIGINS.custom && (Boolean(templateOrTemplatePart?.plugin) || templateOrTemplatePart?.has_theme_file);
}
export {
  isTemplateRevertable as default
};
//# sourceMappingURL=is-template-revertable.mjs.map
