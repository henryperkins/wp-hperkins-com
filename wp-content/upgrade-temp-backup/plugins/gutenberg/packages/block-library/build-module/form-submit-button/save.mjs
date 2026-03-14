// packages/block-library/src/form-submit-button/save.js
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save() {
  const blockProps = useBlockProps.save();
  return /* @__PURE__ */ jsx("div", { className: "wp-block-form-submit-wrapper", ...blockProps, children: /* @__PURE__ */ jsx(InnerBlocks.Content, {}) });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
