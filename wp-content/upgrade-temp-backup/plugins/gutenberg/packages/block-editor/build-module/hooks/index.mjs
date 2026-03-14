// packages/block-editor/src/hooks/index.js
import {
  createBlockEditFilter,
  createBlockListBlockFilter,
  createBlockSaveFilter
} from "./utils.mjs";
import "./compat.mjs";
import "./cross-origin-isolation.mjs";
import align from "./align.mjs";
import background from "./background.mjs";
import "./lock.mjs";
import allowedBlocks from "./allowed-blocks.mjs";
import anchor from "./anchor.mjs";
import ariaLabel from "./aria-label.mjs";
import blockFields from "./block-fields/index.mjs";
import customClassName from "./custom-class-name.mjs";
import "./generated-class-name.mjs";
import style from "./style.mjs";
import "./settings.mjs";
import color from "./color.mjs";
import dimensions from "./dimensions.mjs";
import duotone from "./duotone.mjs";
import fontFamily from "./font-family.mjs";
import fontSize from "./font-size.mjs";
import textAlign from "./text-align.mjs";
import fitText from "./fit-text.mjs";
import border from "./border.mjs";
import customCSS from "./custom-css.mjs";
import position from "./position.mjs";
import blockStyleVariation from "./block-style-variation.mjs";
import layout from "./layout.mjs";
import childLayout from "./layout-child.mjs";
import "./metadata.mjs";
import blockHooks from "./block-hooks.mjs";
import blockBindingsPanel from "./block-bindings.mjs";
import listView from "./list-view.mjs";
import "./block-renaming.mjs";
import "./grid-visualizer.mjs";
import AutoRegisterControls from "./auto-inspector-controls.mjs";
import { useCustomSides } from "./dimensions.mjs";
import { getDimensionsClassesAndStyles } from "./use-dimensions-props.mjs";
import { useLayoutClasses, useLayoutStyles } from "./layout.mjs";
import { getBorderClassesAndStyles, useBorderProps } from "./use-border-props.mjs";
import { getShadowClassesAndStyles } from "./use-shadow-props.mjs";
import { getColorClassesAndStyles, useColorProps } from "./use-color-props.mjs";
import { getSpacingClassesAndStyles } from "./use-spacing-props.mjs";
import { getTypographyClassesAndStyles } from "./use-typography-props.mjs";
import { getGapCSSValue } from "./gap.mjs";
import { useCachedTruthy } from "./use-cached-truthy.mjs";
import { setBackgroundStyleDefaults } from "./background.mjs";
import { useZoomOut } from "./use-zoom-out.mjs";
import { __unstableBlockStyleVariationOverridesWithConfig } from "./block-style-variation.mjs";
import { useStyleOverride } from "./utils.mjs";
createBlockEditFilter(
  [
    align,
    textAlign,
    anchor,
    customClassName,
    style,
    customCSS,
    duotone,
    fitText,
    position,
    layout,
    blockHooks,
    blockBindingsPanel,
    childLayout,
    allowedBlocks,
    blockFields,
    listView,
    AutoRegisterControls
  ].filter(Boolean)
);
createBlockListBlockFilter([
  align,
  textAlign,
  background,
  style,
  color,
  dimensions,
  duotone,
  fontFamily,
  fontSize,
  fitText,
  border,
  customCSS,
  position,
  blockStyleVariation,
  childLayout
]);
createBlockSaveFilter([
  align,
  textAlign,
  anchor,
  ariaLabel,
  customClassName,
  border,
  customCSS,
  fitText,
  color,
  style,
  fontFamily,
  fontSize
]);
export {
  __unstableBlockStyleVariationOverridesWithConfig,
  getBorderClassesAndStyles,
  getColorClassesAndStyles,
  getDimensionsClassesAndStyles,
  getGapCSSValue,
  getShadowClassesAndStyles,
  getSpacingClassesAndStyles,
  getTypographyClassesAndStyles,
  setBackgroundStyleDefaults,
  useBorderProps,
  useCachedTruthy,
  useColorProps,
  useCustomSides,
  useLayoutClasses,
  useLayoutStyles,
  useStyleOverride,
  useZoomOut
};
//# sourceMappingURL=index.mjs.map
