// packages/block-editor/src/components/block-variation-transforms/index.js
import { store as blocksStore } from "@wordpress/blocks";
import { __, sprintf } from "@wordpress/i18n";
import {
  Button,
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
  VisuallyHidden,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import BlockIcon from "../block-icon/index.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { Menu } = unlock(componentsPrivateApis);
function VariationsButtons({
  className,
  onSelectVariation,
  selectedValue,
  variations
}) {
  return /* @__PURE__ */ jsxs("fieldset", { className, children: [
    /* @__PURE__ */ jsx(VisuallyHidden, { as: "legend", children: __("Transform to variation") }),
    variations.map((variation) => /* @__PURE__ */ jsx(
      Button,
      {
        __next40pxDefaultSize: true,
        size: "compact",
        icon: /* @__PURE__ */ jsx(BlockIcon, { icon: variation.icon, showColors: true }),
        isPressed: selectedValue === variation.name,
        label: selectedValue === variation.name ? variation.title : sprintf(
          /* translators: %s: Block or block variation name. */
          __("Transform to %s"),
          variation.title
        ),
        onClick: () => onSelectVariation(variation.name),
        "aria-label": variation.title,
        showTooltip: true
      },
      variation.name
    ))
  ] });
}
function VariationsDropdown({
  className,
  onSelectVariation,
  selectedValue,
  variations
}) {
  return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsxs(Menu, { children: [
    /* @__PURE__ */ jsx(
      Menu.TriggerButton,
      {
        render: /* @__PURE__ */ jsx(
          Button,
          {
            className: "block-editor-block-variation-transforms__button",
            __next40pxDefaultSize: true,
            variant: "secondary",
            children: __("Transform to variation")
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(Menu.Popover, { position: "bottom", children: /* @__PURE__ */ jsx(Menu.Group, { children: variations.map((variation) => /* @__PURE__ */ jsxs(
      Menu.RadioItem,
      {
        value: variation.name,
        checked: selectedValue === variation.name,
        onChange: () => onSelectVariation(variation.name),
        children: [
          /* @__PURE__ */ jsx(Menu.ItemLabel, { children: variation.title }),
          variation.description && /* @__PURE__ */ jsx(Menu.ItemHelpText, { children: variation.description })
        ]
      },
      variation.name
    )) }) })
  ] }) });
}
function VariationsToggleGroupControl({
  className,
  onSelectVariation,
  selectedValue,
  variations
}) {
  return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx(
    ToggleGroupControl,
    {
      label: __("Transform to variation"),
      value: selectedValue,
      hideLabelFromVision: true,
      onChange: onSelectVariation,
      __next40pxDefaultSize: true,
      children: variations.map((variation) => /* @__PURE__ */ jsx(
        ToggleGroupControlOptionIcon,
        {
          icon: /* @__PURE__ */ jsx(BlockIcon, { icon: variation.icon, showColors: true }),
          value: variation.name,
          label: selectedValue === variation.name ? variation.title : sprintf(
            /* translators: %s: Block or block variation name. */
            __("Transform to %s"),
            variation.title
          )
        },
        variation.name
      ))
    }
  ) });
}
function __experimentalBlockVariationTransforms({ blockClientId }) {
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  const { activeBlockVariation, variations, isContentOnly, isSection } = useSelect(
    (select) => {
      const { getActiveBlockVariation, getBlockVariations } = select(blocksStore);
      const {
        getBlockName,
        getBlockAttributes,
        getBlockEditingMode,
        isSectionBlock
      } = unlock(select(blockEditorStore));
      const name = blockClientId && getBlockName(blockClientId);
      const { hasContentRoleAttribute } = unlock(
        select(blocksStore)
      );
      const isContentBlock = hasContentRoleAttribute(name);
      return {
        activeBlockVariation: getActiveBlockVariation(
          name,
          getBlockAttributes(blockClientId),
          "transform"
        ),
        variations: name && getBlockVariations(name, "transform"),
        isContentOnly: getBlockEditingMode(blockClientId) === "contentOnly" && !isContentBlock,
        isSection: isSectionBlock(blockClientId)
      };
    },
    [blockClientId]
  );
  const selectedValue = activeBlockVariation?.name;
  const hasUniqueIcons = useMemo(() => {
    const variationIcons = /* @__PURE__ */ new Set();
    if (!variations) {
      return false;
    }
    variations.forEach((variation) => {
      if (variation.icon) {
        variationIcons.add(variation.icon?.src || variation.icon);
      }
    });
    return variationIcons.size === variations.length;
  }, [variations]);
  const onSelectVariation = (variationName) => {
    updateBlockAttributes(blockClientId, {
      ...variations.find(({ name }) => name === variationName).attributes
    });
  };
  if (!variations?.length || isContentOnly || isSection) {
    return null;
  }
  const baseClass = "block-editor-block-variation-transforms";
  const showButtons = variations.length > 6;
  const ButtonComponent = showButtons ? VariationsButtons : VariationsToggleGroupControl;
  const Component = hasUniqueIcons ? ButtonComponent : VariationsDropdown;
  return /* @__PURE__ */ jsx(
    Component,
    {
      className: baseClass,
      onSelectVariation,
      selectedValue,
      variations
    }
  );
}
var block_variation_transforms_default = __experimentalBlockVariationTransforms;
export {
  block_variation_transforms_default as default
};
//# sourceMappingURL=index.mjs.map
