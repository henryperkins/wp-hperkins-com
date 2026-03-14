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

// packages/widgets/src/blocks/legacy-widget/edit/widget-type-selector.js
var widget_type_selector_exports = {};
__export(widget_type_selector_exports, {
  default: () => WidgetTypeSelector
});
module.exports = __toCommonJS(widget_type_selector_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var import_jsx_runtime = require("react/jsx-runtime");
function WidgetTypeSelector({ selectedId, onSelect }) {
  const widgetTypes = (0, import_data.useSelect)((select) => {
    const hiddenIds = select(import_block_editor.store).getSettings()?.widgetTypesToHideFromLegacyWidgetBlock ?? [];
    return select(import_core_data.store).getWidgetTypes({ per_page: -1 })?.filter((widgetType) => !hiddenIds.includes(widgetType.id));
  }, []);
  if (!widgetTypes) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {});
  }
  if (widgetTypes.length === 0) {
    return (0, import_i18n.__)("There are no widgets available.");
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.SelectControl,
    {
      __next40pxDefaultSize: true,
      label: (0, import_i18n.__)("Legacy widget"),
      value: selectedId ?? "",
      options: [
        { value: "", label: (0, import_i18n.__)("Select widget") },
        ...widgetTypes.map((widgetType) => ({
          value: widgetType.id,
          label: widgetType.name
        }))
      ],
      onChange: (value) => {
        if (value) {
          const selected = widgetTypes.find(
            (widgetType) => widgetType.id === value
          );
          onSelect({
            selectedId: selected.id,
            isMulti: selected.is_multi
          });
        } else {
          onSelect({ selectedId: null });
        }
      }
    }
  );
}
//# sourceMappingURL=widget-type-selector.cjs.map
