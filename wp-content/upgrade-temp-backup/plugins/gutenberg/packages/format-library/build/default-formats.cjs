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

// packages/format-library/src/default-formats.js
var default_formats_exports = {};
__export(default_formats_exports, {
  default: () => default_formats_default
});
module.exports = __toCommonJS(default_formats_exports);
var import_bold = require("./bold/index.cjs");
var import_code = require("./code/index.cjs");
var import_image = require("./image/index.cjs");
var import_italic = require("./italic/index.cjs");
var import_link = require("./link/index.cjs");
var import_strikethrough = require("./strikethrough/index.cjs");
var import_underline = require("./underline/index.cjs");
var import_text_color = require("./text-color/index.cjs");
var import_subscript = require("./subscript/index.cjs");
var import_superscript = require("./superscript/index.cjs");
var import_keyboard = require("./keyboard/index.cjs");
var import_unknown = require("./unknown/index.cjs");
var import_language = require("./language/index.cjs");
var import_math = require("./math/index.cjs");
var import_non_breaking_space = require("./non-breaking-space/index.cjs");
var default_formats_default = [
  import_bold.bold,
  import_code.code,
  import_image.image,
  import_italic.italic,
  import_link.link,
  import_strikethrough.strikethrough,
  import_underline.underline,
  import_text_color.textColor,
  import_subscript.subscript,
  import_superscript.superscript,
  import_keyboard.keyboard,
  import_unknown.unknown,
  import_language.language,
  import_math.math,
  import_non_breaking_space.nonBreakingSpace
];
//# sourceMappingURL=default-formats.cjs.map
