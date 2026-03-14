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

// packages/global-styles-ui/src/shadow-utils.ts
var shadow_utils_exports = {};
__export(shadow_utils_exports, {
  CUSTOM_VALUE_SETTINGS: () => CUSTOM_VALUE_SETTINGS,
  getShadowParts: () => getShadowParts,
  shadowObjectToString: () => shadowObjectToString,
  shadowStringToObject: () => shadowStringToObject
});
module.exports = __toCommonJS(shadow_utils_exports);
var CUSTOM_VALUE_SETTINGS = {
  px: { max: 20, step: 1 },
  "%": { max: 100, step: 1 },
  vw: { max: 100, step: 1 },
  vh: { max: 100, step: 1 },
  em: { max: 10, step: 0.1 },
  rm: { max: 10, step: 0.1 },
  svw: { max: 100, step: 1 },
  lvw: { max: 100, step: 1 },
  dvw: { max: 100, step: 1 },
  svh: { max: 100, step: 1 },
  lvh: { max: 100, step: 1 },
  dvh: { max: 100, step: 1 },
  vi: { max: 100, step: 1 },
  svi: { max: 100, step: 1 },
  lvi: { max: 100, step: 1 },
  dvi: { max: 100, step: 1 },
  vb: { max: 100, step: 1 },
  svb: { max: 100, step: 1 },
  lvb: { max: 100, step: 1 },
  dvb: { max: 100, step: 1 },
  vmin: { max: 100, step: 1 },
  svmin: { max: 100, step: 1 },
  lvmin: { max: 100, step: 1 },
  dvmin: { max: 100, step: 1 },
  vmax: { max: 100, step: 1 },
  svmax: { max: 100, step: 1 },
  lvmax: { max: 100, step: 1 },
  dvmax: { max: 100, step: 1 }
};
function getShadowParts(shadow) {
  const shadowValues = shadow.match(/(?:[^,(]|\([^)]*\))+/g) || [];
  return shadowValues.map((value) => value.trim());
}
function shadowStringToObject(shadowValue) {
  const defaultShadow = {
    x: "0",
    y: "0",
    blur: "0",
    spread: "0",
    color: "#000",
    inset: false
  };
  if (!shadowValue) {
    return defaultShadow;
  }
  if (shadowValue.includes("none")) {
    return defaultShadow;
  }
  const lengthsRegex = /((?:^|\s+)(-?\d*\.?\d+(?:px|%|in|cm|mm|em|rem|ex|pt|pc|vh|vw|vmin|vmax|ch|lh)?)(?=\s|$)(?![^(]*\))){1,4}/g;
  const matches = shadowValue.match(lengthsRegex) || [];
  if (matches.length !== 1) {
    return defaultShadow;
  }
  const lengths = matches[0].split(" ").map((value) => value.trim()).filter((value) => value);
  if (lengths.length < 2) {
    return defaultShadow;
  }
  const insets = shadowValue.match(/inset/gi) || [];
  if (insets.length > 1) {
    return defaultShadow;
  }
  const hasInset = insets.length === 1;
  let colorString = shadowValue.replace(lengthsRegex, "").trim();
  if (hasInset) {
    colorString = colorString.replace("inset", "").replace("INSET", "").trim();
  }
  const colorRegex = /^#([0-9a-f]{3}){1,2}$|^#([0-9a-f]{4}){1,2}$|^(?:rgb|hsl)a?\(?[\d*\.?\d+%?,?\/?\s]*\)$/gi;
  let colorMatches = (colorString.match(colorRegex) || []).map((value) => value?.trim()).filter((value) => value);
  if (colorMatches.length > 1) {
    return defaultShadow;
  } else if (colorMatches.length === 0) {
    colorMatches = colorString.trim().split(" ").filter((value) => value);
    if (colorMatches.length > 1) {
      return defaultShadow;
    }
  }
  const [x, y, blur, spread] = lengths;
  return {
    x,
    y,
    blur: blur || defaultShadow.blur,
    spread: spread || defaultShadow.spread,
    inset: hasInset,
    color: colorString || defaultShadow.color
  };
}
function shadowObjectToString(shadowObj) {
  const shadowString = `${shadowObj.x || "0px"} ${shadowObj.y || "0px"} ${shadowObj.blur || "0px"} ${shadowObj.spread || "0px"}`;
  return `${shadowObj.inset ? "inset" : ""} ${shadowString} ${shadowObj.color || ""}`.trim();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CUSTOM_VALUE_SETTINGS,
  getShadowParts,
  shadowObjectToString,
  shadowStringToObject
});
//# sourceMappingURL=shadow-utils.cjs.map
