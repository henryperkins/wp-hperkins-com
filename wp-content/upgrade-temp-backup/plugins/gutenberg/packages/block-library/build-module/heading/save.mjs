// packages/block-library/src/heading/save.js
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  const { content, level } = attributes;
  const TagName = "h" + level;
  return /* @__PURE__ */ jsx(TagName, { ...useBlockProps.save(), children: /* @__PURE__ */ jsx(RichText.Content, { value: content }) });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
