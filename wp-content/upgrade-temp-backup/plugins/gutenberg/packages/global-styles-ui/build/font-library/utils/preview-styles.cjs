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

// packages/global-styles-ui/src/font-library/utils/preview-styles.ts
var preview_styles_exports = {};
__export(preview_styles_exports, {
  formatFontFaceName: () => formatFontFaceName,
  formatFontFamily: () => formatFontFamily,
  getFacePreviewStyle: () => getFacePreviewStyle,
  getFamilyPreviewStyle: () => getFamilyPreviewStyle
});
module.exports = __toCommonJS(preview_styles_exports);
function findNearest(input, numbers) {
  if (numbers.length === 0) {
    return null;
  }
  numbers.sort((a, b) => Math.abs(input - a) - Math.abs(input - b));
  return numbers[0];
}
function extractFontWeights(fontFaces) {
  const result = [];
  fontFaces.forEach((face) => {
    const weights = String(face.fontWeight).split(" ");
    if (weights.length === 2) {
      const start = parseInt(weights[0]);
      const end = parseInt(weights[1]);
      for (let i = start; i <= end; i += 100) {
        result.push(i);
      }
    } else if (weights.length === 1) {
      result.push(parseInt(weights[0]));
    }
  });
  return result;
}
function formatFontFamily(input) {
  const regex = /^(?!generic\([ a-zA-Z\-]+\)$)(?!^[a-zA-Z\-]+$).+/;
  const output = input.trim();
  const formatItem = (item) => {
    item = item.trim();
    if (item.match(regex)) {
      item = item.replace(/^["']|["']$/g, "");
      return `"${item}"`;
    }
    return item;
  };
  if (output.includes(",")) {
    return output.split(",").map(formatItem).filter((item) => item !== "").join(", ");
  }
  return formatItem(output);
}
function formatFontFaceName(input) {
  if (!input) {
    return "";
  }
  let output = input.trim();
  if (output.includes(",")) {
    output = (output.split(",").find((item) => item.trim() !== "") ?? "").trim();
  }
  output = output.replace(/^["']|["']$/g, "");
  if (window.navigator.userAgent.toLowerCase().includes("firefox")) {
    output = `"${output}"`;
  }
  return output;
}
function getFamilyPreviewStyle(family) {
  const style = {
    fontFamily: formatFontFamily(family.fontFamily)
  };
  if (!("fontFace" in family) || !Array.isArray(family.fontFace)) {
    style.fontWeight = "400";
    style.fontStyle = "normal";
    return style;
  }
  if (family.fontFace) {
    const normalFaces = family.fontFace.filter(
      (face) => face?.fontStyle && face.fontStyle.toLowerCase() === "normal"
    );
    if (normalFaces.length > 0) {
      style.fontStyle = "normal";
      const normalWeights = extractFontWeights(normalFaces);
      const nearestWeight = findNearest(400, normalWeights);
      style.fontWeight = String(nearestWeight) || "400";
    } else {
      style.fontStyle = family.fontFace.length && family.fontFace[0].fontStyle || "normal";
      style.fontWeight = family.fontFace.length && String(family.fontFace[0].fontWeight) || "400";
    }
  }
  return style;
}
function getFacePreviewStyle(face) {
  return {
    fontFamily: formatFontFamily(face.fontFamily),
    fontStyle: face.fontStyle || "normal",
    fontWeight: face.fontWeight || "400"
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatFontFaceName,
  formatFontFamily,
  getFacePreviewStyle,
  getFamilyPreviewStyle
});
//# sourceMappingURL=preview-styles.cjs.map
