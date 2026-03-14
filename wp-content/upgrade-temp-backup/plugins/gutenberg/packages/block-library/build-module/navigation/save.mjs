// packages/block-library/src/navigation/save.js
import { InnerBlocks } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  if (attributes.ref) {
    return;
  }
  return /* @__PURE__ */ jsx(InnerBlocks.Content, {});
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
