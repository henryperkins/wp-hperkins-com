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

// packages/block-library/src/navigation-link/shared/select-label-text.js
var select_label_text_exports = {};
__export(select_label_text_exports, {
  selectLabelText: () => selectLabelText
});
module.exports = __toCommonJS(select_label_text_exports);
function selectLabelText(ref) {
  ref.current.focus();
  const { ownerDocument } = ref.current;
  const { defaultView } = ownerDocument;
  const selection = defaultView.getSelection();
  const range = ownerDocument.createRange();
  range.selectNodeContents(ref.current);
  selection.removeAllRanges();
  selection.addRange(range);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  selectLabelText
});
//# sourceMappingURL=select-label-text.cjs.map
