// packages/block-editor/src/components/preset-input-control/utils.js
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
export {
  getCustomValueFromPreset,
  getPresetSlug,
  getPresetValueFromCustomValue,
  getSliderValueFromPreset,
  isValuePreset
};
//# sourceMappingURL=utils.mjs.map
