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

// packages/block-library/src/utils/deprecated-text-align-attributes.js
var deprecated_text_align_attributes_exports = {};
__export(deprecated_text_align_attributes_exports, {
  default: () => useDeprecatedTextAlign
});
module.exports = __toCommonJS(deprecated_text_align_attributes_exports);
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
function useDeprecatedTextAlign(props) {
  const { name, attributes, setAttributes } = props;
  const { textAlign } = attributes;
  const { __unstableMarkNextChangeAsNotPersistent } = (0, import_data.useDispatch)(import_block_editor.store);
  const updateStyleWithAlign = (0, import_compose.useEvent)(() => {
    (0, import_deprecated.default)(`textAlign attribute in ${name}`, {
      alternative: "style.typography.textAlign",
      since: "7.0"
    });
    __unstableMarkNextChangeAsNotPersistent();
    setAttributes((currentAttr) => ({
      style: {
        ...currentAttr.style,
        typography: {
          ...currentAttr.style?.typography,
          textAlign
        }
      }
    }));
  });
  const lastUpdatedAlignRef = (0, import_element.useRef)();
  (0, import_element.useEffect)(() => {
    if (textAlign === lastUpdatedAlignRef.current) {
      return;
    }
    lastUpdatedAlignRef.current = textAlign;
    updateStyleWithAlign();
  }, [textAlign, updateStyleWithAlign]);
}
//# sourceMappingURL=deprecated-text-align-attributes.cjs.map
