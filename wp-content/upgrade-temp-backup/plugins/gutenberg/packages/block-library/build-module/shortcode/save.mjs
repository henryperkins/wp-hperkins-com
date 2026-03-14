// packages/block-library/src/shortcode/save.js
import { RawHTML } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  return /* @__PURE__ */ jsx(RawHTML, { children: attributes.text });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
