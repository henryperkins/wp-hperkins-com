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

// packages/block-editor/src/hooks/index.js
var hooks_exports = {};
__export(hooks_exports, {
  __unstableBlockStyleVariationOverridesWithConfig: () => import_block_style_variation2.__unstableBlockStyleVariationOverridesWithConfig,
  getBorderClassesAndStyles: () => import_use_border_props.getBorderClassesAndStyles,
  getColorClassesAndStyles: () => import_use_color_props.getColorClassesAndStyles,
  getDimensionsClassesAndStyles: () => import_use_dimensions_props.getDimensionsClassesAndStyles,
  getGapCSSValue: () => import_gap.getGapCSSValue,
  getShadowClassesAndStyles: () => import_use_shadow_props.getShadowClassesAndStyles,
  getSpacingClassesAndStyles: () => import_use_spacing_props.getSpacingClassesAndStyles,
  getTypographyClassesAndStyles: () => import_use_typography_props.getTypographyClassesAndStyles,
  setBackgroundStyleDefaults: () => import_background2.setBackgroundStyleDefaults,
  useBorderProps: () => import_use_border_props.useBorderProps,
  useCachedTruthy: () => import_use_cached_truthy.useCachedTruthy,
  useColorProps: () => import_use_color_props.useColorProps,
  useCustomSides: () => import_dimensions2.useCustomSides,
  useLayoutClasses: () => import_layout2.useLayoutClasses,
  useLayoutStyles: () => import_layout2.useLayoutStyles,
  useStyleOverride: () => import_utils2.useStyleOverride,
  useZoomOut: () => import_use_zoom_out.useZoomOut
});
module.exports = __toCommonJS(hooks_exports);
var import_utils = require("./utils.cjs");
var import_compat = require("./compat.cjs");
var import_cross_origin_isolation = require("./cross-origin-isolation.cjs");
var import_align = __toESM(require("./align.cjs"));
var import_background = __toESM(require("./background.cjs"));
var import_lock = require("./lock.cjs");
var import_allowed_blocks = __toESM(require("./allowed-blocks.cjs"));
var import_anchor = __toESM(require("./anchor.cjs"));
var import_aria_label = __toESM(require("./aria-label.cjs"));
var import_block_fields = __toESM(require("./block-fields/index.cjs"));
var import_custom_class_name = __toESM(require("./custom-class-name.cjs"));
var import_generated_class_name = require("./generated-class-name.cjs");
var import_style = __toESM(require("./style.cjs"));
var import_settings = require("./settings.cjs");
var import_color = __toESM(require("./color.cjs"));
var import_dimensions = __toESM(require("./dimensions.cjs"));
var import_duotone = __toESM(require("./duotone.cjs"));
var import_font_family = __toESM(require("./font-family.cjs"));
var import_font_size = __toESM(require("./font-size.cjs"));
var import_text_align = __toESM(require("./text-align.cjs"));
var import_fit_text = __toESM(require("./fit-text.cjs"));
var import_border = __toESM(require("./border.cjs"));
var import_custom_css = __toESM(require("./custom-css.cjs"));
var import_position = __toESM(require("./position.cjs"));
var import_block_style_variation = __toESM(require("./block-style-variation.cjs"));
var import_layout = __toESM(require("./layout.cjs"));
var import_layout_child = __toESM(require("./layout-child.cjs"));
var import_metadata = require("./metadata.cjs");
var import_block_hooks = __toESM(require("./block-hooks.cjs"));
var import_block_bindings = __toESM(require("./block-bindings.cjs"));
var import_list_view = __toESM(require("./list-view.cjs"));
var import_block_renaming = require("./block-renaming.cjs");
var import_grid_visualizer = require("./grid-visualizer.cjs");
var import_auto_inspector_controls = __toESM(require("./auto-inspector-controls.cjs"));
var import_dimensions2 = require("./dimensions.cjs");
var import_use_dimensions_props = require("./use-dimensions-props.cjs");
var import_layout2 = require("./layout.cjs");
var import_use_border_props = require("./use-border-props.cjs");
var import_use_shadow_props = require("./use-shadow-props.cjs");
var import_use_color_props = require("./use-color-props.cjs");
var import_use_spacing_props = require("./use-spacing-props.cjs");
var import_use_typography_props = require("./use-typography-props.cjs");
var import_gap = require("./gap.cjs");
var import_use_cached_truthy = require("./use-cached-truthy.cjs");
var import_background2 = require("./background.cjs");
var import_use_zoom_out = require("./use-zoom-out.cjs");
var import_block_style_variation2 = require("./block-style-variation.cjs");
var import_utils2 = require("./utils.cjs");
(0, import_utils.createBlockEditFilter)(
  [
    import_align.default,
    import_text_align.default,
    import_anchor.default,
    import_custom_class_name.default,
    import_style.default,
    import_custom_css.default,
    import_duotone.default,
    import_fit_text.default,
    import_position.default,
    import_layout.default,
    import_block_hooks.default,
    import_block_bindings.default,
    import_layout_child.default,
    import_allowed_blocks.default,
    import_block_fields.default,
    import_list_view.default,
    import_auto_inspector_controls.default
  ].filter(Boolean)
);
(0, import_utils.createBlockListBlockFilter)([
  import_align.default,
  import_text_align.default,
  import_background.default,
  import_style.default,
  import_color.default,
  import_dimensions.default,
  import_duotone.default,
  import_font_family.default,
  import_font_size.default,
  import_fit_text.default,
  import_border.default,
  import_custom_css.default,
  import_position.default,
  import_block_style_variation.default,
  import_layout_child.default
]);
(0, import_utils.createBlockSaveFilter)([
  import_align.default,
  import_text_align.default,
  import_anchor.default,
  import_aria_label.default,
  import_custom_class_name.default,
  import_border.default,
  import_custom_css.default,
  import_fit_text.default,
  import_color.default,
  import_style.default,
  import_font_family.default,
  import_font_size.default
]);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.cjs.map
