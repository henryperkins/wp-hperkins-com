// packages/block-library/src/tag-cloud/edit.js
import {
  Flex,
  FlexItem,
  ToggleControl,
  SelectControl,
  Spinner,
  RangeControl,
  __experimentalUnitControl as UnitControl,
  __experimentalUseCustomUnits as useCustomUnits,
  __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import {
  InspectorControls,
  useBlockProps,
  useSettings
} from "@wordpress/block-editor";
import { store as coreStore } from "@wordpress/core-data";
import { useServerSideRender } from "@wordpress/server-side-render";
import { useDisabled } from "@wordpress/compose";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import HtmlRenderer from "../utils/html-renderer.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var MIN_TAGS = 1;
var MAX_TAGS = 100;
var MIN_FONT_SIZE = 0.1;
var MAX_FONT_SIZE = 100;
function TagCloudEdit({ attributes, setAttributes, name }) {
  const {
    taxonomy,
    showTagCounts,
    numberOfTags,
    smallestFontSize,
    largestFontSize
  } = attributes;
  const [availableUnits] = useSettings("spacing.units");
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const units = useCustomUnits({
    availableUnits: availableUnits ? [...availableUnits, "pt"] : ["%", "px", "em", "rem", "pt"]
  });
  const taxonomies = useSelect(
    (select) => select(coreStore).getTaxonomies({ per_page: -1 }),
    []
  );
  const getTaxonomyOptions = () => {
    const selectOption = {
      label: __("- Select -"),
      value: "",
      disabled: true
    };
    const taxonomyOptions = (taxonomies ?? []).filter((tax) => !!tax.show_cloud).map((item) => {
      return {
        value: item.slug,
        label: item.name
      };
    });
    return [selectOption, ...taxonomyOptions];
  };
  const onFontSizeChange = (fontSizeLabel, newValue) => {
    const [quantity, newUnit] = parseQuantityAndUnitFromRawValue(newValue);
    if (!Number.isFinite(quantity)) {
      return;
    }
    const updateObj = { [fontSizeLabel]: newValue };
    Object.entries({
      smallestFontSize,
      largestFontSize
    }).forEach(([attribute, currentValue]) => {
      const [currentQuantity, currentUnit] = parseQuantityAndUnitFromRawValue(currentValue);
      if (attribute !== fontSizeLabel && currentUnit !== newUnit) {
        updateObj[attribute] = `${currentQuantity}${newUnit}`;
      }
    });
    setAttributes(updateObj);
  };
  const inspectorControls = /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsxs(
    ToolsPanel,
    {
      label: __("Settings"),
      resetAll: () => {
        setAttributes({
          taxonomy: "post_tag",
          showTagCounts: false,
          numberOfTags: 45,
          smallestFontSize: "8pt",
          largestFontSize: "22pt"
        });
      },
      dropdownMenuProps,
      children: [
        /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            hasValue: () => taxonomy !== "post_tag",
            label: __("Taxonomy"),
            onDeselect: () => setAttributes({ taxonomy: "post_tag" }),
            isShownByDefault: true,
            children: /* @__PURE__ */ jsx(
              SelectControl,
              {
                __next40pxDefaultSize: true,
                label: __("Taxonomy"),
                options: getTaxonomyOptions(),
                value: taxonomy,
                onChange: (selectedTaxonomy) => setAttributes({ taxonomy: selectedTaxonomy })
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            hasValue: () => smallestFontSize !== "8pt" || largestFontSize !== "22pt",
            label: __("Font size"),
            onDeselect: () => setAttributes({
              smallestFontSize: "8pt",
              largestFontSize: "22pt"
            }),
            isShownByDefault: true,
            children: /* @__PURE__ */ jsxs(Flex, { gap: 4, children: [
              /* @__PURE__ */ jsx(FlexItem, { isBlock: true, children: /* @__PURE__ */ jsx(
                UnitControl,
                {
                  label: __("Smallest size"),
                  value: smallestFontSize,
                  onChange: (value) => {
                    onFontSizeChange(
                      "smallestFontSize",
                      value
                    );
                  },
                  units,
                  min: MIN_FONT_SIZE,
                  max: MAX_FONT_SIZE,
                  size: "__unstable-large"
                }
              ) }),
              /* @__PURE__ */ jsx(FlexItem, { isBlock: true, children: /* @__PURE__ */ jsx(
                UnitControl,
                {
                  label: __("Largest size"),
                  value: largestFontSize,
                  onChange: (value) => {
                    onFontSizeChange(
                      "largestFontSize",
                      value
                    );
                  },
                  units,
                  min: MIN_FONT_SIZE,
                  max: MAX_FONT_SIZE,
                  size: "__unstable-large"
                }
              ) })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            hasValue: () => numberOfTags !== 45,
            label: __("Number of tags"),
            onDeselect: () => setAttributes({ numberOfTags: 45 }),
            isShownByDefault: true,
            children: /* @__PURE__ */ jsx(
              RangeControl,
              {
                __next40pxDefaultSize: true,
                label: __("Number of tags"),
                value: numberOfTags,
                onChange: (value) => setAttributes({ numberOfTags: value }),
                min: MIN_TAGS,
                max: MAX_TAGS,
                required: true
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            hasValue: () => showTagCounts !== false,
            label: __("Show tag counts"),
            onDeselect: () => setAttributes({ showTagCounts: false }),
            isShownByDefault: true,
            children: /* @__PURE__ */ jsx(
              ToggleControl,
              {
                label: __("Show tag counts"),
                checked: showTagCounts,
                onChange: () => setAttributes({ showTagCounts: !showTagCounts })
              }
            )
          }
        )
      ]
    }
  ) });
  const { content, status, error } = useServerSideRender({
    attributes,
    skipBlockSupportAttributes: true,
    block: name
  });
  const disabledRef = useDisabled();
  const blockProps = useBlockProps({ ref: disabledRef });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    inspectorControls,
    status === "loading" && /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(Spinner, {}) }),
    status === "error" && /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx("p", { children: sprintf(
      /* translators: %s: error message returned when rendering the block. */
      __("Error: %s"),
      error
    ) }) }),
    status === "success" && /* @__PURE__ */ jsx(HtmlRenderer, { wrapperProps: blockProps, html: content })
  ] });
}
var edit_default = TagCloudEdit;
export {
  edit_default as default
};
//# sourceMappingURL=edit.mjs.map
