// packages/global-styles-engine/src/index.ts
import { getSetting } from "./settings/get-setting.mjs";
import { setSetting } from "./settings/set-setting.mjs";
import { getStyle } from "./settings/get-style.mjs";
import { setStyle } from "./settings/set-style.mjs";
import { default as default2 } from "./settings/get-palette.mjs";
import { areGlobalStylesEqual } from "./core/equal.mjs";
import { mergeGlobalStyles } from "./core/merge.mjs";
import { default as default3 } from "./utils/get-global-styles-changes.mjs";
import { generateGlobalStyles } from "./core/render.mjs";
import {
  transformToStyles,
  getBlockSelectors,
  getLayoutStyles,
  processCSSNesting
} from "./core/render.mjs";
import { getBlockSelector } from "./core/selectors.mjs";
import { getTypographyFontSizeValue } from "./utils/typography.mjs";
import { getDimensionPresetCssVar } from "./utils/dimensions.mjs";
import {
  getValueFromVariable,
  getPresetVariableFromValue,
  getResolvedValue
} from "./utils/common.mjs";
export {
  areGlobalStylesEqual,
  generateGlobalStyles,
  getBlockSelector,
  getBlockSelectors,
  getDimensionPresetCssVar,
  default3 as getGlobalStylesChanges,
  getLayoutStyles,
  default2 as getPalettes,
  getPresetVariableFromValue,
  getResolvedValue,
  getSetting,
  getStyle,
  getTypographyFontSizeValue,
  getValueFromVariable,
  mergeGlobalStyles,
  processCSSNesting,
  setSetting,
  setStyle,
  transformToStyles as toStyles
};
//# sourceMappingURL=index.mjs.map
