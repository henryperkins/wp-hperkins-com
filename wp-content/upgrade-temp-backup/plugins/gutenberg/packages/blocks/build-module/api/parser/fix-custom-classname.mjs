// packages/blocks/src/api/parser/fix-custom-classname.js
import { hasBlockSupport } from "../registration.mjs";
import { getSaveContent } from "../serializer.mjs";
import { parseWithAttributeSchema } from "./get-block-attributes.mjs";
var CLASS_ATTR_SCHEMA = {
  type: "string",
  source: "attribute",
  selector: "[data-custom-class-name] > *",
  attribute: "class"
};
function getHTMLRootElementClasses(innerHTML) {
  const parsed = parseWithAttributeSchema(
    `<div data-custom-class-name>${innerHTML}</div>`,
    CLASS_ATTR_SCHEMA
  );
  return parsed ? parsed.trim().split(/\s+/) : [];
}
function fixCustomClassname(blockAttributes, blockType, innerHTML) {
  if (!hasBlockSupport(blockType, "customClassName", true)) {
    return blockAttributes;
  }
  const modifiedBlockAttributes = { ...blockAttributes };
  const { className: omittedClassName, ...attributesSansClassName } = modifiedBlockAttributes;
  const serialized = getSaveContent(blockType, attributesSansClassName);
  const defaultClasses = getHTMLRootElementClasses(serialized);
  const actualClasses = getHTMLRootElementClasses(innerHTML);
  const customClasses = actualClasses.filter(
    (className) => !defaultClasses.includes(className)
  );
  if (customClasses.length) {
    modifiedBlockAttributes.className = customClasses.join(" ");
  } else if (serialized) {
    delete modifiedBlockAttributes.className;
  }
  return modifiedBlockAttributes;
}
export {
  fixCustomClassname,
  getHTMLRootElementClasses
};
//# sourceMappingURL=fix-custom-classname.mjs.map
