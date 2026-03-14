// packages/block-library/src/group/save.js
import { useInnerBlocksProps, useBlockProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes: { tagName: Tag } }) {
  return /* @__PURE__ */ jsx(Tag, { ...useInnerBlocksProps.save(useBlockProps.save()) });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
