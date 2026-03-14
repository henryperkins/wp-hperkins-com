// packages/block-library/src/more/save.js
import { RawHTML } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
function save({ attributes: { customText, noTeaser } }) {
  const moreTag = customText ? `<!--more ${customText}-->` : "<!--more-->";
  const noTeaserTag = noTeaser ? "<!--noteaser-->" : "";
  return /* @__PURE__ */ jsx(RawHTML, { children: [moreTag, noTeaserTag].filter(Boolean).join("\n") });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
