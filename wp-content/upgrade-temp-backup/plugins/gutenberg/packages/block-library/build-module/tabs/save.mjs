// packages/block-library/src/tabs/save.js
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  const { anchor } = attributes;
  const tabsId = anchor;
  const blockProps = useBlockProps.save();
  const innerBlocksProps = useInnerBlocksProps.save(blockProps);
  return /* @__PURE__ */ jsx("div", { ...innerBlocksProps, id: tabsId });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
