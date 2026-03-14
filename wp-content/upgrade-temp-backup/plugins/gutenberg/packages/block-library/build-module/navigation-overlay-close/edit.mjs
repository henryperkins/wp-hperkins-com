// packages/block-library/src/navigation-overlay-close/edit.js
import {
  InspectorControls,
  useBlockProps,
  RichText
} from "@wordpress/block-editor";
import {
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem,
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { Icon, close } from "@wordpress/icons";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function NavigationOverlayCloseEdit({
  attributes,
  setAttributes
}) {
  const { displayMode, text } = attributes;
  const showIcon = displayMode === "icon" || displayMode === "both";
  const showText = displayMode === "text" || displayMode === "both";
  const displayText = text || __("Close");
  const blockProps = useBlockProps({
    className: "wp-block-navigation-overlay-close"
  });
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(
      ToolsPanel,
      {
        label: __("Settings"),
        resetAll: () => setAttributes({ displayMode: "icon" }),
        dropdownMenuProps,
        children: /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Display Mode"),
            isShownByDefault: true,
            hasValue: () => displayMode !== "icon",
            onDeselect: () => setAttributes({ displayMode: "icon" }),
            children: /* @__PURE__ */ jsxs(
              ToggleGroupControl,
              {
                label: __("Display Mode"),
                value: displayMode,
                onChange: (value) => setAttributes({ displayMode: value }),
                isBlock: true,
                __next40pxDefaultSize: true,
                children: [
                  /* @__PURE__ */ jsx(
                    ToggleGroupControlOption,
                    {
                      value: "icon",
                      label: __("Icon")
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    ToggleGroupControlOption,
                    {
                      value: "text",
                      label: __("Text")
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    ToggleGroupControlOption,
                    {
                      value: "both",
                      label: __("Both")
                    }
                  )
                ]
              }
            )
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        ...blockProps,
        type: "button",
        "aria-label": !showText ? __("Close") : void 0,
        children: [
          showIcon && /* @__PURE__ */ jsx(Icon, { icon: close }),
          showText && /* @__PURE__ */ jsx(
            RichText,
            {
              identifier: "text",
              value: displayText,
              onChange: (value) => setAttributes({ text: value }),
              tagName: "span",
              className: "wp-block-navigation-overlay-close__text",
              allowedFormats: ["core/bold", "core/italic"]
            }
          )
        ]
      }
    )
  ] });
}
export {
  NavigationOverlayCloseEdit as default
};
//# sourceMappingURL=edit.mjs.map
