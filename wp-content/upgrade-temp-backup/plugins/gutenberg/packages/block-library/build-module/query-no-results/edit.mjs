// packages/block-library/src/query-no-results/edit.js
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
var TEMPLATE = [
  [
    "core/paragraph",
    {
      placeholder: __(
        "Add text or blocks that will display when a query returns no results."
      )
    }
  ]
];
function QueryNoResultsEdit() {
  const blockProps = useBlockProps();
  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    template: TEMPLATE
  });
  return /* @__PURE__ */ jsx("div", { ...innerBlocksProps });
}
export {
  QueryNoResultsEdit as default
};
//# sourceMappingURL=edit.mjs.map
