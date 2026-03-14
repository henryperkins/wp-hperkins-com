// packages/block-library/src/form/save.js
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  const blockProps = useBlockProps.save();
  const { submissionMethod } = attributes;
  return /* @__PURE__ */ jsx(
    "form",
    {
      ...blockProps,
      encType: submissionMethod === "email" ? "text/plain" : null,
      children: /* @__PURE__ */ jsx(InnerBlocks.Content, {})
    }
  );
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
