// packages/block-library/src/paragraph/save.js
import clsx from "clsx";
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { isRTL } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  const { content, dropCap, direction, style } = attributes;
  const textAlign = style?.typography?.textAlign;
  const className = clsx({
    "has-drop-cap": textAlign === (isRTL() ? "left" : "right") || textAlign === "center" ? false : dropCap
  });
  return /* @__PURE__ */ jsx("p", { ...useBlockProps.save({ className, dir: direction }), children: /* @__PURE__ */ jsx(RichText.Content, { value: content }) });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
