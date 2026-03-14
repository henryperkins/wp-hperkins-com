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

// packages/global-styles-ui/src/preview-typography.tsx
var preview_typography_exports = {};
__export(preview_typography_exports, {
  default: () => preview_typography_default
});
module.exports = __toCommonJS(preview_typography_exports);
var import_components = require("@wordpress/components");
var import_typography_example = __toESM(require("./typography-example.cjs"));
var import_preview_wrapper = __toESM(require("./preview-wrapper.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var StylesPreviewTypography = ({
  variation,
  isFocused,
  withHoverView
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_preview_wrapper.default,
    {
      label: variation.title,
      isFocused,
      withHoverView,
      children: ({ ratio, key }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.__experimentalHStack,
        {
          spacing: 10 * ratio,
          justify: "center",
          style: {
            height: "100%",
            overflow: "hidden"
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_typography_example.default,
            {
              variation,
              fontSize: 85 * ratio
            }
          )
        },
        key
      )
    }
  );
};
var preview_typography_default = StylesPreviewTypography;
//# sourceMappingURL=preview-typography.cjs.map
