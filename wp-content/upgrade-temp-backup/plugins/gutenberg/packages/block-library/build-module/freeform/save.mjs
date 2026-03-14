// packages/block-library/src/freeform/save.js
import { RawHTML } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  const { content } = attributes;
  return /* @__PURE__ */ jsx(RawHTML, { children: content });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
