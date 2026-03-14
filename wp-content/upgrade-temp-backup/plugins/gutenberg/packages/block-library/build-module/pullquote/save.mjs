// packages/block-library/src/pullquote/save.js
import clsx from "clsx";
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { jsx, jsxs } from "react/jsx-runtime";
function save({ attributes }) {
  const { textAlign, citation, value } = attributes;
  const shouldShowCitation = !RichText.isEmpty(citation);
  return /* @__PURE__ */ jsx(
    "figure",
    {
      ...useBlockProps.save({
        className: clsx({
          [`has-text-align-${textAlign}`]: textAlign
        })
      }),
      children: /* @__PURE__ */ jsxs("blockquote", { children: [
        /* @__PURE__ */ jsx(RichText.Content, { tagName: "p", value }),
        shouldShowCitation && /* @__PURE__ */ jsx(RichText.Content, { tagName: "cite", value: citation })
      ] })
    }
  );
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
