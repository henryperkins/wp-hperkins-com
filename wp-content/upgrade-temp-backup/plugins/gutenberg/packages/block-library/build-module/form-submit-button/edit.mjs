// packages/block-library/src/form-submit-button/edit.js
import { __ } from "@wordpress/i18n";
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
var TEMPLATE = [
  [
    "core/buttons",
    {},
    [
      [
        "core/button",
        {
          text: __("Submit"),
          tagName: "button",
          type: "submit"
        }
      ]
    ]
  ]
];
var Edit = () => {
  const blockProps = useBlockProps();
  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    template: TEMPLATE,
    templateLock: "all"
  });
  return /* @__PURE__ */ jsx("div", { className: "wp-block-form-submit-wrapper", ...innerBlocksProps });
};
var edit_default = Edit;
export {
  edit_default as default
};
//# sourceMappingURL=edit.mjs.map
