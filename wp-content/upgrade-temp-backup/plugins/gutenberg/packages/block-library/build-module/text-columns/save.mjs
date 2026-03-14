// packages/block-library/src/text-columns/save.js
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  const { width, content, columns } = attributes;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...useBlockProps.save({
        className: `align${width} columns-${columns}`
      }),
      children: Array.from({ length: columns }).map((_, index) => /* @__PURE__ */ jsx("div", { className: "wp-block-column", children: /* @__PURE__ */ jsx(
        RichText.Content,
        {
          tagName: "p",
          value: content?.[index]?.children
        }
      ) }, `column-${index}`))
    }
  );
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
