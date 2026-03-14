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

// packages/global-styles-ui/src/preview-colors.tsx
var preview_colors_exports = {};
__export(preview_colors_exports, {
  default: () => preview_colors_default
});
module.exports = __toCommonJS(preview_colors_exports);
var import_components = require("@wordpress/components");
var import_preset_colors = __toESM(require("./preset-colors.cjs"));
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
var StylesPreviewColors = ({
  label,
  isFocused,
  withHoverView
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_preview_wrapper.default,
    {
      label,
      isFocused,
      withHoverView,
      children: ({ key }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.__unstableMotion.div,
        {
          variants: firstFrameVariants,
          style: {
            height: "100%",
            overflow: "hidden"
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalHStack,
            {
              spacing: 0,
              justify: "center",
              style: {
                height: "100%",
                overflow: "hidden"
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_preset_colors.default, {})
            }
          )
        },
        key
      )
    }
  );
};
var preview_colors_default = StylesPreviewColors;
//# sourceMappingURL=preview-colors.cjs.map
