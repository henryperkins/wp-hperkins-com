// packages/block-library/src/terms-query/save.js
import { useInnerBlocksProps, useBlockProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes: { tagName: Tag = "div" } }) {
  const blockProps = useBlockProps.save();
  const innerBlocksProps = useInnerBlocksProps.save(blockProps);
  return /* @__PURE__ */ jsx(Tag, { ...innerBlocksProps });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
