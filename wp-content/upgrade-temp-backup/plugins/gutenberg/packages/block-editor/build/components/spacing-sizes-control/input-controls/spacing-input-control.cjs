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

// packages/block-editor/src/components/spacing-sizes-control/input-controls/spacing-input-control.js
var spacing_input_control_exports = {};
__export(spacing_input_control_exports, {
  default: () => SpacingInputControl
});
module.exports = __toCommonJS(spacing_input_control_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_preset_input_control = __toESM(require("../../preset-input-control/index.cjs"));
var import_use_settings = require("../../use-settings/index.cjs");
var import_store = require("../../../store/index.cjs");
var import_utils = require("../utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var CUSTOM_VALUE_SETTINGS = {
  px: { max: 300, steps: 1 },
  "%": { max: 100, steps: 1 },
  vw: { max: 100, steps: 1 },
  vh: { max: 100, steps: 1 },
  em: { max: 10, steps: 0.1 },
  rm: { max: 10, steps: 0.1 },
  svw: { max: 100, steps: 1 },
  lvw: { max: 100, steps: 1 },
  dvw: { max: 100, steps: 1 },
  svh: { max: 100, steps: 1 },
  lvh: { max: 100, steps: 1 },
  dvh: { max: 100, steps: 1 },
  vi: { max: 100, steps: 1 },
  svi: { max: 100, steps: 1 },
  lvi: { max: 100, steps: 1 },
  dvi: { max: 100, steps: 1 },
  vb: { max: 100, steps: 1 },
  svb: { max: 100, steps: 1 },
  lvb: { max: 100, steps: 1 },
  dvb: { max: 100, steps: 1 },
  vmin: { max: 100, steps: 1 },
  svmin: { max: 100, steps: 1 },
  lvmin: { max: 100, steps: 1 },
  dvmin: { max: 100, steps: 1 },
  vmax: { max: 100, steps: 1 },
  svmax: { max: 100, steps: 1 },
  lvmax: { max: 100, steps: 1 },
  dvmax: { max: 100, steps: 1 }
};
function SpacingInputControl({
  icon,
  isMixed = false,
  minimumCustomValue,
  onChange,
  onMouseOut,
  onMouseOver,
  showSideInLabel = true,
  side,
  spacingSizes,
  type,
  value,
  ...restProps
}) {
  const disableCustomSpacingSizes = (0, import_data.useSelect)((select) => {
    const editorSettings = select(import_store.store).getSettings();
    return editorSettings?.disableCustomSpacingSizes;
  });
  const [availableUnits] = (0, import_use_settings.useSettings)("spacing.units");
  const units = (0, import_components.__experimentalUseCustomUnits)({
    availableUnits: availableUnits || ["px", "em", "rem"]
  });
  const presets = (0, import_element.useMemo)(() => {
    return spacingSizes?.map((preset) => ({
      name: preset.name,
      slug: preset.slug,
      size: preset.size
    })) || [];
  }, [spacingSizes]);
  const sideLabel = (import_utils.ALL_SIDES.includes(side) || ["vertical", "horizontal"].includes(side)) && showSideInLabel ? import_utils.LABELS[side] : "";
  const typeLabel = showSideInLabel ? type?.toLowerCase() : type;
  const ariaLabel = (0, import_i18n.sprintf)(
    // translators: 1: The side of the block being modified (top, bottom, left etc.). 2. Type of spacing being modified (padding, margin, etc).
    (0, import_i18n._x)("%1$s %2$s", "spacing"),
    sideLabel,
    typeLabel
  ).trim();
  const selectedUnit = units[0]?.value || "px";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_preset_input_control.default,
    {
      allowNegativeOnDrag: minimumCustomValue < 0,
      ariaLabel,
      className: "spacing-sizes-control",
      customValueSettings: CUSTOM_VALUE_SETTINGS,
      disableCustomValues: disableCustomSpacingSizes,
      icon,
      isMixed,
      minimumCustomValue,
      onChange,
      onMouseOut,
      onMouseOver,
      presets,
      presetType: "spacing",
      selectedUnit,
      units,
      value,
      ...restProps
    }
  );
}
//# sourceMappingURL=spacing-input-control.cjs.map
