// packages/block-library/src/navigation/edit/overlay-visibility-control.js
import {
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { jsx, jsxs } from "react/jsx-runtime";
function OverlayVisibilityControl({
  overlayMenu,
  setAttributes
}) {
  return /* @__PURE__ */ jsxs(
    ToggleGroupControl,
    {
      __next40pxDefaultSize: true,
      label: __("Overlay Visibility"),
      "aria-label": __("Configure overlay visibility"),
      value: overlayMenu,
      help: __(
        "Collapses the navigation options in a menu icon opening an overlay."
      ),
      onChange: (value) => setAttributes({ overlayMenu: value }),
      isBlock: true,
      children: [
        /* @__PURE__ */ jsx(ToggleGroupControlOption, { value: "never", label: __("Off") }),
        /* @__PURE__ */ jsx(ToggleGroupControlOption, { value: "mobile", label: __("Mobile") }),
        /* @__PURE__ */ jsx(ToggleGroupControlOption, { value: "always", label: __("Always") })
      ]
    }
  );
}
export {
  OverlayVisibilityControl as default
};
//# sourceMappingURL=overlay-visibility-control.mjs.map
