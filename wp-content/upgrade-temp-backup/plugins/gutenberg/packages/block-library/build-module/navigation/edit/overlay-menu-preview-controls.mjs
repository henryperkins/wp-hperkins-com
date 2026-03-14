// packages/block-library/src/navigation/edit/overlay-menu-preview-controls.js
import {
  __experimentalVStack as VStack,
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption,
  ToggleControl
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import OverlayMenuIcon from "./overlay-menu-icon.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function OverlayMenuPreviewControls({
  hasIcon,
  icon,
  setAttributes
}) {
  return /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
    /* @__PURE__ */ jsx(
      ToggleControl,
      {
        label: __("Show icon button"),
        help: __(
          "Configure the visual appearance of the button that toggles the overlay menu."
        ),
        onChange: (value) => setAttributes({ hasIcon: value }),
        checked: hasIcon
      }
    ),
    /* @__PURE__ */ jsxs(
      ToggleGroupControl,
      {
        __next40pxDefaultSize: true,
        className: "wp-block-navigation__overlay-menu-icon-toggle-group",
        label: __("Icon"),
        value: icon,
        onChange: (value) => setAttributes({ icon: value }),
        isBlock: true,
        children: [
          /* @__PURE__ */ jsx(
            ToggleGroupControlOption,
            {
              value: "handle",
              "aria-label": __("handle"),
              label: /* @__PURE__ */ jsx(OverlayMenuIcon, { icon: "handle" })
            }
          ),
          /* @__PURE__ */ jsx(
            ToggleGroupControlOption,
            {
              value: "menu",
              "aria-label": __("menu"),
              label: /* @__PURE__ */ jsx(OverlayMenuIcon, { icon: "menu" })
            }
          )
        ]
      }
    )
  ] });
}
export {
  OverlayMenuPreviewControls as default
};
//# sourceMappingURL=overlay-menu-preview-controls.mjs.map
