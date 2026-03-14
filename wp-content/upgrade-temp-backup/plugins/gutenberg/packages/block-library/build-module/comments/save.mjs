// packages/block-library/src/comments/save.js
import { useInnerBlocksProps, useBlockProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes: { tagName: Tag, legacy } }) {
  const blockProps = useBlockProps.save();
  const innerBlocksProps = useInnerBlocksProps.save(blockProps);
  return legacy ? null : /* @__PURE__ */ jsx(Tag, { ...innerBlocksProps });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
