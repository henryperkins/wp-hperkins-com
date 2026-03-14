// packages/block-library/src/icon/edit.js
import clsx from "clsx";
import { __ } from "@wordpress/i18n";
import {
  DropdownMenu,
  TextControl,
  ToolbarButton,
  ToolbarGroup,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import {
  BlockControls,
  InspectorControls,
  useBlockProps,
  useBlockEditingMode,
  __experimentalUseColorProps as useColorProps,
  __experimentalUseBorderProps as useBorderProps,
  __experimentalGetSpacingClassesAndStyles as useSpacingProps,
  getDimensionsClassesAndStyles as useDimensionsProps
} from "@wordpress/block-editor";
import { useState } from "@wordpress/element";
import { SVG, Rect, Path } from "@wordpress/primitives";
import { useSelect } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import HtmlRenderer from "../utils/html-renderer.mjs";
import { CustomInserterModal } from "./components/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var IconPlaceholder = ({ className, style }) => /* @__PURE__ */ jsxs(
  SVG,
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 60 60",
    preserveAspectRatio: "none",
    fill: "none",
    "aria-hidden": "true",
    className: clsx("wp-block-icon__placeholder", className),
    style,
    children: [
      /* @__PURE__ */ jsx(Rect, { width: "60", height: "60", fill: "currentColor", fillOpacity: 0.1 }),
      /* @__PURE__ */ jsx(
        Path,
        {
          vectorEffect: "non-scaling-stroke",
          stroke: "currentColor",
          strokeOpacity: 0.25,
          d: "M60 60 0 0"
        }
      )
    ]
  }
);
function Edit({ attributes, setAttributes }) {
  const { icon, ariaLabel } = attributes;
  const [isInserterOpen, setInserterOpen] = useState(false);
  const isContentOnlyMode = useBlockEditingMode() === "contentOnly";
  const colorProps = useColorProps(attributes);
  const spacingProps = useSpacingProps(attributes);
  const borderProps = useBorderProps(attributes);
  const dimensionsProps = useDimensionsProps(attributes);
  const { selectedIcon, allIcons = [] } = useSelect(
    (select) => {
      const { getEntityRecord, getEntityRecords } = select(coreDataStore);
      return {
        selectedIcon: icon ? getEntityRecord("root", "icon", icon) : null,
        allIcons: isInserterOpen ? getEntityRecords("root", "icon", {
          per_page: -1
        }) : void 0
      };
    },
    [isInserterOpen, icon]
  );
  const iconToDisplay = selectedIcon?.content || "";
  const blockControls = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(BlockControls, { group: isContentOnlyMode ? "inline" : "other", children: /* @__PURE__ */ jsx(
      ToolbarButton,
      {
        onClick: () => {
          setInserterOpen(true);
        },
        children: icon ? __("Replace") : __("Choose icon")
      }
    ) }),
    isContentOnlyMode && icon && // Add some extra controls for content attributes when content only mode is active.
    // With content only mode active, the inspector is hidden, so users need another way
    // to edit these attributes.
    /* @__PURE__ */ jsx(BlockControls, { group: "other", children: /* @__PURE__ */ jsx(ToolbarGroup, { className: "components-toolbar-group", children: /* @__PURE__ */ jsx(
      DropdownMenu,
      {
        icon: "",
        popoverProps: {
          className: "is-alternate"
        },
        text: __("Label"),
        children: () => /* @__PURE__ */ jsx(
          TextControl,
          {
            className: "wp-block-icon__toolbar-content",
            label: __("Label"),
            value: ariaLabel || "",
            onChange: (value) => setAttributes({ ariaLabel: value }),
            help: __(
              "Briefly describe the icon to help screen reader users. Leave blank for decorative icons."
            ),
            __next40pxDefaultSize: true
          }
        )
      }
    ) }) })
  ] });
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const inspectorControls = icon && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(InspectorControls, { group: "settings", children: /* @__PURE__ */ jsx(
    ToolsPanel,
    {
      label: __("Settings"),
      resetAll: () => setAttributes({
        ariaLabel: void 0
      }),
      dropdownMenuProps,
      children: /* @__PURE__ */ jsx(
        ToolsPanelItem,
        {
          label: __("Label"),
          isShownByDefault: true,
          hasValue: () => !!ariaLabel,
          onDeselect: () => setAttributes({ ariaLabel: void 0 }),
          children: /* @__PURE__ */ jsx(
            TextControl,
            {
              label: __("Label"),
              help: __(
                "Briefly describe the icon to help screen reader users. Leave blank for decorative icons."
              ),
              value: ariaLabel || "",
              onChange: (value) => setAttributes({ ariaLabel: value }),
              __next40pxDefaultSize: true
            }
          )
        }
      )
    }
  ) }) });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    blockControls,
    inspectorControls,
    /* @__PURE__ */ jsx("div", { ...useBlockProps(), children: icon ? /* @__PURE__ */ jsx(
      HtmlRenderer,
      {
        html: iconToDisplay,
        wrapperProps: {
          className: clsx(
            colorProps.className,
            borderProps.className,
            spacingProps.className,
            dimensionsProps.className
          ),
          style: {
            ...colorProps.style,
            ...borderProps.style,
            ...spacingProps.style,
            ...dimensionsProps.style
          }
        }
      }
    ) : /* @__PURE__ */ jsx(
      IconPlaceholder,
      {
        className: clsx(
          borderProps.className,
          spacingProps.className,
          dimensionsProps.className
        ),
        style: {
          ...borderProps.style,
          ...spacingProps.style,
          ...dimensionsProps.style,
          height: "auto"
        }
      }
    ) }),
    isInserterOpen && /* @__PURE__ */ jsx(
      CustomInserterModal,
      {
        icons: allIcons,
        setInserterOpen,
        attributes,
        setAttributes
      }
    )
  ] });
}
var edit_default = Edit;
export {
  Edit,
  edit_default as default
};
//# sourceMappingURL=edit.mjs.map
