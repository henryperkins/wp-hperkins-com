// packages/block-library/src/buttons/save.js
import clsx from "clsx";
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save({ attributes, className }) {
  const { fontSize, style } = attributes;
  const blockProps = useBlockProps.save({
    className: clsx(className, {
      "has-custom-font-size": fontSize || style?.typography?.fontSize
    })
  });
  const innerBlocksProps = useInnerBlocksProps.save(blockProps);
  return /* @__PURE__ */ jsx("div", { ...innerBlocksProps });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
