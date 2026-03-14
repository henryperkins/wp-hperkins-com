// packages/block-library/src/form-submission-notification/save.js
import { useInnerBlocksProps, useBlockProps } from "@wordpress/block-editor";
import clsx from "clsx";
import { jsx } from "react/jsx-runtime";
function save({ attributes }) {
  const { type } = attributes;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...useInnerBlocksProps.save(
        useBlockProps.save({
          className: clsx("wp-block-form-submission-notification", {
            [`form-notification-type-${type}`]: type
          })
        })
      )
    }
  );
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
