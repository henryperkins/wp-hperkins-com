// packages/block-library/src/accordion/save.js
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save() {
  const blockProps = useBlockProps.save({
    role: "group"
  });
  return /* @__PURE__ */ jsx("div", { ...useInnerBlocksProps.save(blockProps) });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
