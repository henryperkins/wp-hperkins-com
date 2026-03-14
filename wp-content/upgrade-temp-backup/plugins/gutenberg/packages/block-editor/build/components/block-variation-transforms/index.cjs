"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/block-variation-transforms/index.js
var block_variation_transforms_exports = {};
__export(block_variation_transforms_exports, {
  default: () => block_variation_transforms_default
});
module.exports = __toCommonJS(block_variation_transforms_exports);
var import_blocks = require("@wordpress/blocks");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_block_icon = __toESM(require("../block-icon/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Menu } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function VariationsButtons({
  className,
  onSelectVariation,
  selectedValue,
  variations
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { className, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.VisuallyHidden, { as: "legend", children: (0, import_i18n.__)("Transform to variation") }),
    variations.map((variation) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        size: "compact",
        icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_icon.default, { icon: variation.icon, showColors: true }),
        isPressed: selectedValue === variation.name,
        label: selectedValue === variation.name ? variation.title : (0, import_i18n.sprintf)(
          /* translators: %s: Block or block variation name. */
          (0, import_i18n.__)("Transform to %s"),
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Menu.TriggerButton,
      {
        render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            className: "block-editor-block-variation-transforms__button",
            __next40pxDefaultSize: true,
            variant: "secondary",
            children: (0, import_i18n.__)("Transform to variation")
          }
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.Popover, { position: "bottom", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.Group, { children: variations.map((variation) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Menu.RadioItem,
      {
        value: variation.name,
        checked: selectedValue === variation.name,
        onChange: () => onSelectVariation(variation.name),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.ItemLabel, { children: variation.title }),
          variation.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.ItemHelpText, { children: variation.description })
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalToggleGroupControl,
    {
      label: (0, import_i18n.__)("Transform to variation"),
      value: selectedValue,
      hideLabelFromVision: true,
      onChange: onSelectVariation,
      __next40pxDefaultSize: true,
      children: variations.map((variation) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.__experimentalToggleGroupControlOptionIcon,
        {
          icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_icon.default, { icon: variation.icon, showColors: true }),
          value: variation.name,
          label: selectedValue === variation.name ? variation.title : (0, import_i18n.sprintf)(
            /* translators: %s: Block or block variation name. */
            (0, import_i18n.__)("Transform to %s"),
            variation.title
          )
        },
        variation.name
      ))
    }
  ) });
}
function __experimentalBlockVariationTransforms({ blockClientId }) {
  const { updateBlockAttributes } = (0, import_data.useDispatch)(import_store.store);
  const { activeBlockVariation, variations, isContentOnly, isSection } = (0, import_data.useSelect)(
    (select) => {
      const { getActiveBlockVariation, getBlockVariations } = select(import_blocks.store);
      const {
        getBlockName,
        getBlockAttributes,
        getBlockEditingMode,
        isSectionBlock
      } = (0, import_lock_unlock.unlock)(select(import_store.store));
      const name = blockClientId && getBlockName(blockClientId);
      const { hasContentRoleAttribute } = (0, import_lock_unlock.unlock)(
        select(import_blocks.store)
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
  const hasUniqueIcons = (0, import_element.useMemo)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
//# sourceMappingURL=index.cjs.map
