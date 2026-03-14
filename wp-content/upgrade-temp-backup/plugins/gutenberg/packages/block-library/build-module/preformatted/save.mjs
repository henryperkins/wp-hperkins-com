// packages/block-library/src/preformatted/save.js
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  const { content } = attributes;
  return /* @__PURE__ */ jsx("pre", { ...useBlockProps.save(), children: /* @__PURE__ */ jsx(RichText.Content, { value: content }) });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
