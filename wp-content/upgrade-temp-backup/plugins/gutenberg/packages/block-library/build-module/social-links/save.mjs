// packages/block-library/src/social-links/save.js
import clsx from "clsx";
import { useInnerBlocksProps, useBlockProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function save(props) {
  const {
    attributes: {
      iconBackgroundColorValue,
      iconColorValue,
      showLabels,
      size
    }
  } = props;
  const className = clsx(size, {
    "has-visible-labels": showLabels,
    "has-icon-color": iconColorValue,
    "has-icon-background-color": iconBackgroundColorValue
  });
  const blockProps = useBlockProps.save({ className });
  const innerBlocksProps = useInnerBlocksProps.save(blockProps);
  return /* @__PURE__ */ jsx("ul", { ...innerBlocksProps });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
