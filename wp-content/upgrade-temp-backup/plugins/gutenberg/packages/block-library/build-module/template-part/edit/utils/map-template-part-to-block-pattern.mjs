// packages/block-library/src/template-part/edit/utils/map-template-part-to-block-pattern.js
import { parse } from "@wordpress/blocks";
import { createTemplatePartId } from "./create-template-part-id.mjs";
function mapTemplatePartToBlockPattern(templatePart) {
  return {
    name: createTemplatePartId(templatePart.theme, templatePart.slug),
    title: templatePart.title.rendered,
    blocks: parse(templatePart.content.raw),
    templatePart
  };
}
export {
  mapTemplatePartToBlockPattern
};
//# sourceMappingURL=map-template-part-to-block-pattern.mjs.map
