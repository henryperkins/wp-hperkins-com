// packages/widgets/src/blocks/widget-group/save.js
import { InnerBlocks, RichText } from "@wordpress/block-editor";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function save({ attributes }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      RichText.Content,
      {
        tagName: "h2",
        className: "widget-title",
        value: attributes.title
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "wp-widget-group__inner-blocks", children: /* @__PURE__ */ jsx(InnerBlocks.Content, {}) })
  ] });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
