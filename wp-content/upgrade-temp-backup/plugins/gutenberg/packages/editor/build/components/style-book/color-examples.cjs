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

// packages/editor/src/components/style-book/color-examples.tsx
var color_examples_exports = {};
__export(color_examples_exports, {
  default: () => color_examples_default
});
module.exports = __toCommonJS(color_examples_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_block_editor = require("@wordpress/block-editor");
var import_jsx_runtime = require("react/jsx-runtime");
var ColorExamples = ({
  colors,
  type,
  templateColumns = "1fr 1fr",
  itemHeight = "52px"
}) => {
  if (!colors) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalGrid, { templateColumns, rowGap: 8, columnGap: 16, children: colors.map((color) => {
    const className = type === "gradients" ? (0, import_block_editor.__experimentalGetGradientClass)(color.slug) : (0, import_block_editor.getColorClassName)("background-color", color.slug);
    const classes = (0, import_clsx.default)(
      "editor-style-book__color-example",
      className
    );
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: classes,
        style: { height: itemHeight }
      },
      color.slug
    );
  }) });
};
var color_examples_default = ColorExamples;
//# sourceMappingURL=color-examples.cjs.map
