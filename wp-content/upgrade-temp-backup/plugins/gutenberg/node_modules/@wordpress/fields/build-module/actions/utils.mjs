// packages/fields/src/actions/utils.ts
import { decodeEntities } from "@wordpress/html-entities";
import { __ } from "@wordpress/i18n";
function isTemplate(post) {
  return post.type === "wp_template";
}
function isTemplatePart(post) {
  return post.type === "wp_template_part";
}
function isTemplateOrTemplatePart(p) {
  return p.type === "wp_template" || p.type === "wp_template_part";
}
function getItemTitle(item, fallback = __("(no title)")) {
  let title = "";
  if (typeof item.title === "string") {
    title = decodeEntities(item.title);
  } else if (item.title && "rendered" in item.title) {
    title = decodeEntities(item.title.rendered);
  } else if (item.title && "raw" in item.title) {
    title = decodeEntities(item.title.raw);
  }
  return title || fallback;
}
function isTemplateRemovable(template) {
  if (!template) {
    return false;
  }
  return [template.source, template.source].includes("custom") && !Boolean(template.type === "wp_template" && template?.plugin) && !template.has_theme_file;
}
export {
  getItemTitle,
  isTemplate,
  isTemplateOrTemplatePart,
  isTemplatePart,
  isTemplateRemovable
};
//# sourceMappingURL=utils.mjs.map
