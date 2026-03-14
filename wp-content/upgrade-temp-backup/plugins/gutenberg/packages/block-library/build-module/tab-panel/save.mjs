// packages/block-library/src/tab-panel/save.js
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save() {
  const blockProps = useBlockProps.save();
  const innerBlocksProps = useInnerBlocksProps.save(blockProps);
  return /* @__PURE__ */ jsx("div", { ...innerBlocksProps });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
