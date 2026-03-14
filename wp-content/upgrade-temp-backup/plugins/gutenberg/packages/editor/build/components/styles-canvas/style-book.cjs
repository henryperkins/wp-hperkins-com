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

// packages/editor/src/components/styles-canvas/style-book.js
var style_book_exports = {};
__export(style_book_exports, {
  default: () => style_book_default
});
module.exports = __toCommonJS(style_book_exports);
var import_element = require("@wordpress/element");
var import_style_book = __toESM(require("../style-book/index.cjs"));
var import_constants = require("../style-book/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function StylesCanvasStyleBook({ path, onPathChange }, ref) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_style_book.default,
    {
      ref,
      isSelected: (blockName) => (
        // Match '/blocks/core%2Fbutton' and
        // '/blocks/core%2Fbutton/typography', but not
        // '/blocks/core%2Fbuttons'.
        path === `/blocks/${encodeURIComponent(blockName)}` || path?.startsWith(
          `/blocks/${encodeURIComponent(blockName)}/`
        )
      ),
      onSelect: (blockName) => {
        if (import_constants.STYLE_BOOK_COLOR_GROUPS.find(
          (group) => group.slug === blockName
        )) {
          onPathChange?.("/colors/palette");
          return;
        }
        if (blockName === "typography") {
          onPathChange?.("/typography");
          return;
        }
        onPathChange?.("/blocks/" + encodeURIComponent(blockName));
      }
    }
  );
}
var style_book_default = (0, import_element.forwardRef)(StylesCanvasStyleBook);
//# sourceMappingURL=style-book.cjs.map
