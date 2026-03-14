"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/style-book/duotone-examples.tsx
var duotone_examples_exports = {};
__export(duotone_examples_exports, {
  default: () => duotone_examples_default
});
module.exports = __toCommonJS(duotone_examples_exports);
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
var DuotoneExamples = ({ duotones }) => {
  if (!duotones) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalGrid, { columns: 2, rowGap: 16, columnGap: 16, children: duotones.map((duotone) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_components.__experimentalGrid,
      {
        className: "editor-style-book__duotone-example",
        columns: 2,
        rowGap: 8,
        columnGap: 8,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "img",
            {
              alt: `Duotone example: ${duotone.slug}`,
              src: "https://s.w.org/images/core/5.3/MtBlanc1.jpg",
              style: {
                filter: `url(#wp-duotone-${duotone.slug})`
              }
            }
          ) }),
          duotone.colors.map((color) => {
            return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "div",
              {
                className: "editor-style-book__color-example",
                style: { backgroundColor: color }
              },
              color
            );
          })
        ]
      },
      duotone.slug
    );
  }) });
};
var duotone_examples_default = DuotoneExamples;
//# sourceMappingURL=duotone-examples.cjs.map
