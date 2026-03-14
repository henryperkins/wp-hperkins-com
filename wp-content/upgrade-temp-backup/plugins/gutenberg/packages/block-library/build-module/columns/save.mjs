// packages/block-library/src/columns/save.js
import clsx from "clsx";
import { useInnerBlocksProps, useBlockProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  const { isStackedOnMobile, verticalAlignment } = attributes;
  const className = clsx({
    [`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
    [`is-not-stacked-on-mobile`]: !isStackedOnMobile
  });
  const blockProps = useBlockProps.save({ className });
  const innerBlocksProps = useInnerBlocksProps.save(blockProps);
  return /* @__PURE__ */ jsx("div", { ...innerBlocksProps });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
