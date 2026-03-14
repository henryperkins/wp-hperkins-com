// packages/widgets/src/blocks/widget-group/deprecated.js
import { InnerBlocks, RichText } from "@wordpress/block-editor";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var v1 = {
  attributes: {
    title: {
      type: "string"
    }
  },
  supports: {
    html: false,
    inserter: true,
    customClassName: true,
    reusable: false
  },
  save({ attributes }) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        RichText.Content,
        {
          tagName: "h2",
          className: "widget-title",
          value: attributes.title
        }
      ),
      /* @__PURE__ */ jsx(InnerBlocks.Content, {})
    ] });
  }
};
var deprecated_default = [v1];
export {
  deprecated_default as default
};
//# sourceMappingURL=deprecated.mjs.map
