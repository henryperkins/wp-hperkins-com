// packages/block-library/src/embed/embed-controls.js
import { __ } from "@wordpress/i18n";
import {
  ToolbarButton,
  ToggleControl,
  ToolbarGroup,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { BlockControls, InspectorControls } from "@wordpress/block-editor";
import { pencil } from "@wordpress/icons";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function getResponsiveHelp(checked) {
  return checked ? __(
    "This embed will preserve its aspect ratio when the browser is resized."
  ) : __(
    "This embed may not preserve its aspect ratio when the browser is resized."
  );
}
var EmbedControls = ({
  blockSupportsResponsive,
  showEditButton,
  themeSupportsResponsive,
  allowResponsive,
  toggleResponsive,
  switchBackToURLInput
}) => {
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(BlockControls, { children: /* @__PURE__ */ jsx(ToolbarGroup, { children: showEditButton && /* @__PURE__ */ jsx(
      ToolbarButton,
      {
        className: "components-toolbar__control",
        label: __("Edit URL"),
        icon: pencil,
        onClick: switchBackToURLInput
      }
    ) }) }),
    themeSupportsResponsive && blockSupportsResponsive && /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(
      ToolsPanel,
      {
        label: __("Media settings"),
        resetAll: () => {
          toggleResponsive(true);
        },
        dropdownMenuProps,
        children: /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Media settings"),
            isShownByDefault: true,
            hasValue: () => !allowResponsive,
            onDeselect: () => {
              toggleResponsive(!allowResponsive);
            },
            children: /* @__PURE__ */ jsx(
              ToggleControl,
              {
                label: __("Resize for smaller devices"),
                checked: allowResponsive,
                help: getResponsiveHelp,
                onChange: toggleResponsive
              }
            )
          }
        )
      }
    ) })
  ] });
};
var embed_controls_default = EmbedControls;
export {
  embed_controls_default as default
};
//# sourceMappingURL=embed-controls.mjs.map
