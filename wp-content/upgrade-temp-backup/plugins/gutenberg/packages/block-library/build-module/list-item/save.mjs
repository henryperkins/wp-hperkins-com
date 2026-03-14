// packages/block-library/src/list-item/save.js
import { InnerBlocks, RichText, useBlockProps } from "@wordpress/block-editor";
import { jsx, jsxs } from "react/jsx-runtime";
function save({ attributes }) {
  return /* @__PURE__ */ jsxs("li", { ...useBlockProps.save(), children: [
    /* @__PURE__ */ jsx(RichText.Content, { value: attributes.content }),
    /* @__PURE__ */ jsx(InnerBlocks.Content, {})
  ] });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
