// packages/block-library/src/comments/deprecated.js
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
var v1 = {
  attributes: {
    tagName: {
      type: "string",
      default: "div"
    }
  },
  apiVersion: 3,
  supports: {
    align: ["wide", "full"],
    html: false,
    color: {
      gradients: true,
      link: true,
      __experimentalDefaultControls: {
        background: true,
        text: true,
        link: true
      }
    }
  },
  save({ attributes: { tagName: Tag } }) {
    const blockProps = useBlockProps.save();
    const { className } = blockProps;
    const classes = className?.split(" ") || [];
    const newClasses = classes?.filter(
      (cls) => cls !== "wp-block-comments"
    );
    const newBlockProps = {
      ...blockProps,
      className: newClasses.join(" ")
    };
    return /* @__PURE__ */ jsx(Tag, { ...newBlockProps, children: /* @__PURE__ */ jsx(InnerBlocks.Content, {}) });
  }
};
var deprecated_default = [v1];
export {
  deprecated_default as default
};
//# sourceMappingURL=deprecated.mjs.map
