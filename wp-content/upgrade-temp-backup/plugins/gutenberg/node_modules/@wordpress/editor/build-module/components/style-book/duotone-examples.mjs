// packages/editor/src/components/style-book/duotone-examples.tsx
import { __experimentalGrid as Grid } from "@wordpress/components";
import { jsx, jsxs } from "react/jsx-runtime";
var DuotoneExamples = ({ duotones }) => {
  if (!duotones) {
    return null;
  }
  return /* @__PURE__ */ jsx(Grid, { columns: 2, rowGap: 16, columnGap: 16, children: duotones.map((duotone) => {
    return /* @__PURE__ */ jsxs(
      Grid,
      {
        className: "editor-style-book__duotone-example",
        columns: 2,
        rowGap: 8,
        columnGap: 8,
        children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
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
            return /* @__PURE__ */ jsx(
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
export {
  duotone_examples_default as default
};
//# sourceMappingURL=duotone-examples.mjs.map
