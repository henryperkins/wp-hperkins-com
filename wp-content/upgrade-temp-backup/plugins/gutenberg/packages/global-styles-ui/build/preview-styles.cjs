"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/global-styles-ui/src/preview-styles.tsx
var preview_styles_exports = {};
__export(preview_styles_exports, {
  default: () => preview_styles_default
});
module.exports = __toCommonJS(preview_styles_exports);
var import_components = require("@wordpress/components");
var import_hooks = require("./hooks.cjs");
var import_preview_hooks = require("./preview-hooks.cjs");
var import_typography_example = __toESM(require("./typography-example.cjs"));
var import_highlighted_colors = __toESM(require("./highlighted-colors.cjs"));
var import_preview_wrapper = __toESM(require("./preview-wrapper.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var firstFrameVariants = {
  start: {
    scale: 1,
    opacity: 1
  },
  hover: {
    scale: 0,
    opacity: 0
  }
};
var midFrameVariants = {
  hover: {
    opacity: 1
  },
  start: {
    opacity: 0.5
  }
};
var secondFrameVariants = {
  hover: {
    scale: 1,
    opacity: 1
  },
  start: {
    scale: 0,
    opacity: 0
  }
};
function PreviewStyles({
  label,
  isFocused,
  withHoverView,
  variation
}) {
  const [fontWeight] = (0, import_hooks.useStyle)("typography.fontWeight");
  const [fontFamily = "serif"] = (0, import_hooks.useStyle)(
    "typography.fontFamily"
  );
  const [headingFontFamily = fontFamily] = (0, import_hooks.useStyle)(
    "elements.h1.typography.fontFamily"
  );
  const [headingFontWeight = fontWeight] = (0, import_hooks.useStyle)(
    "elements.h1.typography.fontWeight"
  );
  const [textColor = "black"] = (0, import_hooks.useStyle)("color.text");
  const [headingColor = textColor] = (0, import_hooks.useStyle)(
    "elements.h1.color.text"
  );
  const { paletteColors } = (0, import_preview_hooks.useStylesPreviewColors)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_preview_wrapper.default,
    {
      label,
      isFocused,
      withHoverView,
      children: [
        ({ ratio, key }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__unstableMotion.div,
          {
            variants: firstFrameVariants,
            style: {
              height: "100%",
              overflow: "hidden"
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              import_components.__experimentalHStack,
              {
                spacing: 10 * ratio,
                justify: "center",
                style: {
                  height: "100%",
                  overflow: "hidden"
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_typography_example.default,
                    {
                      fontSize: 65 * ratio,
                      variation
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalVStack, { spacing: 4 * ratio, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_highlighted_colors.default,
                    {
                      normalizedColorSwatchSize: 32,
                      ratio
                    }
                  ) })
                ]
              }
            )
          },
          key
        ),
        ({ key }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__unstableMotion.div,
          {
            variants: withHoverView ? midFrameVariants : void 0,
            style: {
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              overflow: "hidden",
              filter: "blur(60px)",
              opacity: 0.1
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.__experimentalHStack,
              {
                spacing: 0,
                justify: "flex-start",
                style: {
                  height: "100%",
                  overflow: "hidden"
                },
                children: paletteColors.slice(0, 4).map(({ color }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "div",
                  {
                    style: {
                      height: "100%",
                      background: color,
                      flexGrow: 1
                    }
                  },
                  index
                ))
              }
            )
          },
          key
        ),
        ({ ratio, key }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__unstableMotion.div,
          {
            variants: secondFrameVariants,
            style: {
              height: "100%",
              width: "100%",
              overflow: "hidden",
              position: "absolute",
              top: 0
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.__experimentalVStack,
              {
                spacing: 3 * ratio,
                justify: "center",
                style: {
                  height: "100%",
                  overflow: "hidden",
                  padding: 10 * ratio,
                  boxSizing: "border-box"
                },
                children: label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "div",
                  {
                    style: {
                      fontSize: 40 * ratio,
                      fontFamily: headingFontFamily,
                      color: headingColor,
                      fontWeight: headingFontWeight,
                      lineHeight: "1em",
                      textAlign: "center"
                    },
                    children: label
                  }
                )
              }
            )
          },
          key
        )
      ]
    }
  );
}
var preview_styles_default = PreviewStyles;
//# sourceMappingURL=preview-styles.cjs.map
