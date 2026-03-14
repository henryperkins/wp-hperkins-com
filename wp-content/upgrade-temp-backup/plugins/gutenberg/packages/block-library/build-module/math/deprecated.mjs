// packages/block-library/src/math/deprecated.js
import { useBlockProps } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
var v1 = {
  attributes: {
    latex: {
      type: "string",
      role: "content"
    },
    mathML: {
      type: "string",
      source: "html",
      selector: "math"
    }
  },
  save({ attributes }) {
    const { latex, mathML } = attributes;
    if (!latex) {
      return null;
    }
    return /* @__PURE__ */ jsx(
      "math",
      {
        ...useBlockProps.save(),
        display: "block",
        dangerouslySetInnerHTML: { __html: mathML }
      }
    );
  }
};
var deprecated_default = [v1];
export {
  deprecated_default as default
};
//# sourceMappingURL=deprecated.mjs.map
