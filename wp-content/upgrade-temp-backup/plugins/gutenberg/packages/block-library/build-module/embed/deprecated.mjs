// packages/block-library/src/embed/deprecated.js
import clsx from "clsx";
import metadata from "./block.json";
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { jsx, jsxs } from "react/jsx-runtime";
var { attributes: blockAttributes } = metadata;
var v2 = {
  attributes: blockAttributes,
  save({ attributes }) {
    const { url, caption, type, providerNameSlug } = attributes;
    if (!url) {
      return null;
    }
    const className = clsx("wp-block-embed", {
      [`is-type-${type}`]: type,
      [`is-provider-${providerNameSlug}`]: providerNameSlug,
      [`wp-block-embed-${providerNameSlug}`]: providerNameSlug
    });
    return /* @__PURE__ */ jsxs("figure", { ...useBlockProps.save({ className }), children: [
      /* @__PURE__ */ jsx("div", { className: "wp-block-embed__wrapper", children: `
${url}
` }),
      !RichText.isEmpty(caption) && /* @__PURE__ */ jsx(RichText.Content, { tagName: "figcaption", value: caption })
    ] });
  }
};
var v1 = {
  attributes: blockAttributes,
  save({ attributes: { url, caption, type, providerNameSlug } }) {
    if (!url) {
      return null;
    }
    const embedClassName = clsx("wp-block-embed", {
      [`is-type-${type}`]: type,
      [`is-provider-${providerNameSlug}`]: providerNameSlug
    });
    return /* @__PURE__ */ jsxs("figure", { className: embedClassName, children: [
      `
${url}
`,
      !RichText.isEmpty(caption) && /* @__PURE__ */ jsx(RichText.Content, { tagName: "figcaption", value: caption })
    ] });
  }
};
var deprecated = [v2, v1];
var deprecated_default = deprecated;
export {
  deprecated_default as default
};
//# sourceMappingURL=deprecated.mjs.map
