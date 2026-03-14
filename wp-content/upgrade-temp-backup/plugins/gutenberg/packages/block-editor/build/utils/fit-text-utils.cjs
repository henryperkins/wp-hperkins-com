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

// packages/block-editor/src/utils/fit-text-utils.js
var fit_text_utils_exports = {};
__export(fit_text_utils_exports, {
  optimizeFitText: () => optimizeFitText
});
module.exports = __toCommonJS(fit_text_utils_exports);
function findOptimalFontSize(textElement, applyFontSize) {
  const alreadyHasScrollableHeight = textElement.scrollHeight > textElement.clientHeight;
  let minSize = 0;
  let maxSize = 2400;
  let bestSize = minSize;
  const computedStyle = window.getComputedStyle(textElement);
  let paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
  let paddingRight = parseFloat(computedStyle.paddingRight) || 0;
  const range = document.createRange();
  range.selectNodeContents(textElement);
  let referenceElement = textElement;
  const parentElement = textElement.parentElement;
  if (parentElement) {
    const parentElementComputedStyle = window.getComputedStyle(parentElement);
    if (parentElementComputedStyle?.display === "flex") {
      referenceElement = parentElement;
      paddingLeft += parseFloat(parentElementComputedStyle.paddingLeft) || 0;
      paddingRight += parseFloat(parentElementComputedStyle.paddingRight) || 0;
    }
  }
  let maxclientHeight = referenceElement.clientHeight;
  while (minSize <= maxSize) {
    const midSize = Math.floor((minSize + maxSize) / 2);
    applyFontSize(midSize);
    const rect = range.getBoundingClientRect();
    const textWidth = rect.width;
    const fitsWidth = textElement.scrollWidth <= referenceElement.clientWidth && textWidth <= referenceElement.clientWidth - paddingLeft - paddingRight;
    const fitsHeight = alreadyHasScrollableHeight || textElement.scrollHeight <= referenceElement.clientHeight || textElement.scrollHeight <= maxclientHeight;
    if (referenceElement.clientHeight > maxclientHeight) {
      maxclientHeight = referenceElement.clientHeight;
    }
    if (fitsWidth && fitsHeight) {
      bestSize = midSize;
      minSize = midSize + 1;
    } else {
      maxSize = midSize - 1;
    }
  }
  range.detach();
  return bestSize;
}
function optimizeFitText(textElement, applyFontSize) {
  if (!textElement) {
    return;
  }
  applyFontSize(0);
  const optimalSize = findOptimalFontSize(textElement, applyFontSize);
  applyFontSize(optimalSize);
  return optimalSize;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  optimizeFitText
});
//# sourceMappingURL=fit-text-utils.cjs.map
