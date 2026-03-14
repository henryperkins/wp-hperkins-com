// packages/block-library/src/query-pagination-next/edit.js
import { __ } from "@wordpress/i18n";
import { useBlockProps, PlainText } from "@wordpress/block-editor";
import { jsx, jsxs } from "react/jsx-runtime";
var arrowMap = {
  none: "",
  arrow: "\u2192",
  chevron: "\xBB"
};
function QueryPaginationNextEdit({
  attributes: { label },
  setAttributes,
  context: { paginationArrow, showLabel }
}) {
  const displayArrow = arrowMap[paginationArrow];
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: "#pagination-next-pseudo-link",
      onClick: (event) => event.preventDefault(),
      ...useBlockProps(),
      children: [
        showLabel && /* @__PURE__ */ jsx(
          PlainText,
          {
            __experimentalVersion: 2,
            tagName: "span",
            "aria-label": __("Next page link"),
            placeholder: __("Next Page"),
            value: label,
            onChange: (newLabel) => setAttributes({ label: newLabel })
          }
        ),
        displayArrow && /* @__PURE__ */ jsx(
          "span",
          {
            className: `wp-block-query-pagination-next-arrow is-arrow-${paginationArrow}`,
            "aria-hidden": true,
            children: displayArrow
          }
        )
      ]
    }
  );
}
export {
  QueryPaginationNextEdit as default
};
//# sourceMappingURL=edit.mjs.map
