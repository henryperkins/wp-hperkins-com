// packages/widgets/src/components/move-to-widget-area/index.js
import {
  DropdownMenu,
  MenuGroup,
  MenuItemsChoice,
  ToolbarGroup,
  ToolbarItem
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { moveTo } from "@wordpress/icons";
import { jsx } from "react/jsx-runtime";
function MoveToWidgetArea({
  currentWidgetAreaId,
  widgetAreas,
  onSelect
}) {
  return /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(ToolbarItem, { children: (toggleProps) => /* @__PURE__ */ jsx(
    DropdownMenu,
    {
      icon: moveTo,
      label: __("Move to widget area"),
      toggleProps,
      children: ({ onClose }) => /* @__PURE__ */ jsx(MenuGroup, { label: __("Move to"), children: /* @__PURE__ */ jsx(
        MenuItemsChoice,
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
export {
  MoveToWidgetArea as default
};
//# sourceMappingURL=index.mjs.map
