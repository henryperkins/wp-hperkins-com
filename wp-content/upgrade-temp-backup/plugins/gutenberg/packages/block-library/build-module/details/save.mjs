// packages/block-library/src/details/save.js
import { RichText, useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import { jsx, jsxs } from "react/jsx-runtime";
function save({ attributes }) {
  const { name, showContent } = attributes;
  const summary = attributes.summary ? attributes.summary : "Details";
  const blockProps = useBlockProps.save();
  return /* @__PURE__ */ jsxs(
    "details",
    {
      ...blockProps,
      name: name || void 0,
      open: showContent,
      children: [
        /* @__PURE__ */ jsx("summary", { children: /* @__PURE__ */ jsx(RichText.Content, { value: summary }) }),
        /* @__PURE__ */ jsx(InnerBlocks.Content, {})
      ]
    }
  );
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
