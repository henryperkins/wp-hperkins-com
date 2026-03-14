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

// packages/block-editor/src/components/preset-input-control/utils.js
var utils_exports = {};
__export(utils_exports, {
  getCustomValueFromPreset: () => getCustomValueFromPreset,
  getPresetSlug: () => getPresetSlug,
  getPresetValueFromCustomValue: () => getPresetValueFromCustomValue,
  getSliderValueFromPreset: () => getSliderValueFromPreset,
  isValuePreset: () => isValuePreset
});
module.exports = __toCommonJS(utils_exports);
var isValuePreset = (value, slug) => {
  if (!value?.includes) {
    return false;
  }
  return value === "0" || value.includes(`var:preset|${slug}|`);
};
function getPresetSlug(value, presetType) {
  if (!value) {
    return;
  }
  if (value === "0" || value === "default") {
    return value;
  }
  const slug = value.match(
    new RegExp(`var:preset\\|${presetType}\\|(.+)`)
  );
  return slug ? slug[1] : void 0;
}
function getSliderValueFromPreset(presetValue, presets, presetType) {
  if (presetValue === void 0) {
    return 0;
  }
  const slug = parseFloat(presetValue, 10) === 0 ? "0" : getPresetSlug(presetValue, presetType);
  const sliderValue = presets.findIndex((size) => {
    return String(size.slug) === slug;
  });
  return sliderValue !== -1 ? sliderValue : NaN;
}
function getCustomValueFromPreset(value, presets, presetType) {
  if (!isValuePreset(value, presetType)) {
    return value;
  }
  const slug = parseFloat(value, 10) === 0 ? "0" : getPresetSlug(value, presetType);
  const preset = presets.find((size) => String(size.slug) === slug);
  return preset?.size;
}
function getPresetValueFromCustomValue(value, spacingSizes, presetType) {
  if (!value || isValuePreset(value, presetType) || value === "0") {
    return value;
  }
  const spacingMatch = spacingSizes.find(
    (size) => String(size.size) === String(value)
  );
  if (spacingMatch?.slug) {
    return `var:preset|${presetType}|${spacingMatch.slug}`;
  }
  return value;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCustomValueFromPreset,
  getPresetSlug,
  getPresetValueFromCustomValue,
  getSliderValueFromPreset,
  isValuePreset
});
//# sourceMappingURL=utils.cjs.map
