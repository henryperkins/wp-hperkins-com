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

// packages/widgets/src/register-legacy-widget-variations.js
var register_legacy_widget_variations_exports = {};
__export(register_legacy_widget_variations_exports, {
  default: () => registerLegacyWidgetVariations
});
module.exports = __toCommonJS(register_legacy_widget_variations_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_blocks = require("@wordpress/blocks");
function registerLegacyWidgetVariations(settings) {
  const unsubscribe = (0, import_data.subscribe)(() => {
    const hiddenIds = settings?.widgetTypesToHideFromLegacyWidgetBlock ?? [];
    const widgetTypes = (0, import_data.select)(import_core_data.store).getWidgetTypes({ per_page: -1 })?.filter((widgetType) => !hiddenIds.includes(widgetType.id));
    if (widgetTypes) {
      unsubscribe();
      (0, import_data.dispatch)(import_blocks.store).addBlockVariations(
        "core/legacy-widget",
        widgetTypes.map((widgetType) => ({
          name: widgetType.id,
          title: widgetType.name,
          description: widgetType.description,
          attributes: widgetType.is_multi ? {
            idBase: widgetType.id,
            instance: {}
          } : {
            id: widgetType.id
          }
        }))
      );
    }
  });
}
//# sourceMappingURL=register-legacy-widget-variations.cjs.map
