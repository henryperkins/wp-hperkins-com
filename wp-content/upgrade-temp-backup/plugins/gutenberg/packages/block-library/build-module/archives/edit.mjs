// packages/block-library/src/archives/edit.js
import {
  ToggleControl,
  SelectControl,
  Spinner,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { useServerSideRender } from "@wordpress/server-side-render";
import { useDisabled } from "@wordpress/compose";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import HtmlRenderer from "../utils/html-renderer.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function ArchivesEdit({ attributes, setAttributes, name }) {
  const { showLabel, showPostCounts, displayAsDropdown, type } = attributes;
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const { content, status, error } = useServerSideRender({
    attributes,
    skipBlockSupportAttributes: true,
    block: name
  });
  const disabledRef = useDisabled();
  const blockProps = useBlockProps({ ref: disabledRef });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsxs(
      ToolsPanel,
      {
        label: __("Settings"),
        resetAll: () => {
          setAttributes({
            displayAsDropdown: false,
            showLabel: true,
            showPostCounts: false,
            type: "monthly"
          });
        },
        dropdownMenuProps,
        children: [
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Display as dropdown"),
              isShownByDefault: true,
              hasValue: () => displayAsDropdown,
              onDeselect: () => setAttributes({ displayAsDropdown: false }),
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Display as dropdown"),
                  checked: displayAsDropdown,
                  onChange: () => setAttributes({
                    displayAsDropdown: !displayAsDropdown
                  })
                }
              )
            }
          ),
          displayAsDropdown && /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Show label"),
              isShownByDefault: true,
              hasValue: () => !showLabel,
              onDeselect: () => setAttributes({ showLabel: true }),
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Show label"),
                  checked: showLabel,
                  onChange: () => setAttributes({
                    showLabel: !showLabel
                  })
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Show post counts"),
              isShownByDefault: true,
              hasValue: () => showPostCounts,
              onDeselect: () => setAttributes({ showPostCounts: false }),
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Show post counts"),
                  checked: showPostCounts,
                  onChange: () => setAttributes({
                    showPostCounts: !showPostCounts
                  })
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              label: __("Group by"),
              isShownByDefault: true,
              hasValue: () => type !== "monthly",
              onDeselect: () => setAttributes({ type: "monthly" }),
              children: /* @__PURE__ */ jsx(
                SelectControl,
                {
                  __next40pxDefaultSize: true,
                  label: __("Group by"),
                  options: [
                    { label: __("Year"), value: "yearly" },
                    { label: __("Month"), value: "monthly" },
                    { label: __("Week"), value: "weekly" },
                    { label: __("Day"), value: "daily" }
                  ],
                  value: type,
                  onChange: (value) => setAttributes({ type: value })
                }
              )
            }
          )
        ]
      }
    ) }),
    status === "loading" && /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(Spinner, {}) }),
    status === "error" && /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx("p", { children: sprintf(
      /* translators: %s: error message returned when rendering the block. */
      __("Error: %s"),
      error
    ) }) }),
    status === "success" && /* @__PURE__ */ jsx(HtmlRenderer, { wrapperProps: blockProps, html: content })
  ] });
}
export {
  ArchivesEdit as default
};
//# sourceMappingURL=edit.mjs.map
