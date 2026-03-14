// packages/block-library/src/accordion-item/save.js
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import clsx from "clsx";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  const { openByDefault } = attributes;
  const blockProps = useBlockProps.save({
    className: clsx({
      "is-open": openByDefault
    })
  });
  const innerBlocksProps = useInnerBlocksProps.save(blockProps);
  return /* @__PURE__ */ jsx("div", { ...innerBlocksProps });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
