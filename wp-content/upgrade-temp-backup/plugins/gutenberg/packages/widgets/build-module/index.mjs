// packages/widgets/src/index.js
import { registerBlockType } from "@wordpress/blocks";
import * as legacyWidget from "./blocks/legacy-widget/index.mjs";
import * as widgetGroup from "./blocks/widget-group/index.mjs";
export * from "./components/index.mjs";
export * from "./utils.mjs";
import { default as default2 } from "./register-legacy-widget-variations.mjs";
function registerLegacyWidgetBlock(supports = {}) {
  const { metadata, settings, name } = legacyWidget;
  registerBlockType(
    { name, ...metadata },
    {
      ...settings,
      supports: {
        ...settings.supports,
        ...supports
      }
    }
  );
}
function registerWidgetGroupBlock(supports = {}) {
  const { metadata, settings, name } = widgetGroup;
  registerBlockType(
    { name, ...metadata },
    {
      ...settings,
      supports: {
        ...settings.supports,
        ...supports
      }
    }
  );
}
export {
  registerLegacyWidgetBlock,
  default2 as registerLegacyWidgetVariations,
  registerWidgetGroupBlock
};
//# sourceMappingURL=index.mjs.map
