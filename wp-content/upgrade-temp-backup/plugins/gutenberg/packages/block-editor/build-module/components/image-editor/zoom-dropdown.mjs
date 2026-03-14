// packages/block-editor/src/components/image-editor/zoom-dropdown.js
import {
  ToolbarButton,
  RangeControl,
  Dropdown,
  __experimentalDropdownContentWrapper as DropdownContentWrapper
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { search } from "@wordpress/icons";
import { MIN_ZOOM, MAX_ZOOM, POPOVER_PROPS } from "./constants.mjs";
import { useImageEditingContext } from "./context.mjs";
import { jsx } from "react/jsx-runtime";
function ZoomDropdown() {
  const { isInProgress, zoom, setZoom } = useImageEditingContext();
  return /* @__PURE__ */ jsx(
    Dropdown,
    {
      contentClassName: "wp-block-image__zoom",
      popoverProps: POPOVER_PROPS,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ jsx(
        ToolbarButton,
        {
          icon: search,
          label: __("Zoom"),
          onClick: onToggle,
          "aria-expanded": isOpen,
          disabled: isInProgress
        }
      ),
      renderContent: () => /* @__PURE__ */ jsx(DropdownContentWrapper, { paddingSize: "medium", children: /* @__PURE__ */ jsx(
        RangeControl,
        {
          __next40pxDefaultSize: true,
          label: __("Zoom"),
          min: MIN_ZOOM,
          max: MAX_ZOOM,
          value: Math.round(zoom * 100),
          onChange: (newZoom) => setZoom(newZoom / 100)
        }
      ) })
    }
  );
}
export {
  ZoomDropdown as default
};
//# sourceMappingURL=zoom-dropdown.mjs.map
