// packages/block-library/src/math/save.js
import { useBlockProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  const { latex, mathML } = attributes;
  if (!latex) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { ...useBlockProps.save(), children: /* @__PURE__ */ jsx(
    "math",
    {
      display: "block",
      dangerouslySetInnerHTML: { __html: mathML }
    }
  ) });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
