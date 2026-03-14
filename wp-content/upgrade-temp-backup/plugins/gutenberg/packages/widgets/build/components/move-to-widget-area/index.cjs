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

// packages/widgets/src/components/move-to-widget-area/index.js
var move_to_widget_area_exports = {};
__export(move_to_widget_area_exports, {
  default: () => MoveToWidgetArea
});
module.exports = __toCommonJS(move_to_widget_area_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_jsx_runtime = require("react/jsx-runtime");
function MoveToWidgetArea({
  currentWidgetAreaId,
  widgetAreas,
  onSelect
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarItem, { children: (toggleProps) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.DropdownMenu,
    {
      icon: import_icons.moveTo,
      label: (0, import_i18n.__)("Move to widget area"),
      toggleProps,
      children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { label: (0, import_i18n.__)("Move to"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.MenuItemsChoice,
        {
          choices: widgetAreas.map(
            (widgetArea) => ({
              value: widgetArea.id,
              label: widgetArea.name,
              info: widgetArea.description
            })
          ),
          value: currentWidgetAreaId,
          onSelect: (value) => {
            onSelect(value);
            onClose();
          }
        }
      ) })
    }
  ) }) });
}
//# sourceMappingURL=index.cjs.map
