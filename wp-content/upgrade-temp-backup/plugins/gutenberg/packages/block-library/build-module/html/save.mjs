// packages/block-library/src/html/save.js
import { RawHTML } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  return /* @__PURE__ */ jsx(RawHTML, { children: attributes.content });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
