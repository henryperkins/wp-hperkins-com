// packages/block-library/src/tab/save.js
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  const { anchor } = attributes;
  const tabPanelId = anchor;
  const blockProps = useBlockProps.save({
    role: "tabpanel"
  });
  const innerBlocksProps = useInnerBlocksProps.save(blockProps);
  return /* @__PURE__ */ jsx("section", { ...innerBlocksProps, id: tabPanelId });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
