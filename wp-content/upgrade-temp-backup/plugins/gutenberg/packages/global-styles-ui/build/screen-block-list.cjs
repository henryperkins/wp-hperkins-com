"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/global-styles-ui/src/screen-block-list.tsx
var screen_block_list_exports = {};
__export(screen_block_list_exports, {
  default: () => screen_block_list_default,
  useBlockHasGlobalStyles: () => useBlockHasGlobalStyles
});
module.exports = __toCommonJS(screen_block_list_exports);
var import_blocks = require("@wordpress/blocks");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_compose = require("@wordpress/compose");
var import_a11y = require("@wordpress/a11y");
var import_variations_panel = require("./variations/variations-panel.cjs");
var import_screen_header = require("./screen-header.cjs");
var import_navigation_button = require("./navigation-button.cjs");
var import_hooks = require("./hooks.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var {
  useHasDimensionsPanel,
  useHasTypographyPanel,
  useHasBorderPanel,
  useSettingsForBlockElement,
  useHasColorPanel
} = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function useSortedBlockTypes() {
  const blockItems = (0, import_data.useSelect)(
    (select) => select(import_blocks.store).getBlockTypes(),
    []
  );
  const groupByType = (blocks, block) => {
    const { core, noncore } = blocks;
    const type = block.name.startsWith("core/") ? core : noncore;
    type.push(block);
    return blocks;
  };
  const { core: coreItems, noncore: nonCoreItems } = blockItems.reduce(
    groupByType,
    { core: [], noncore: [] }
  );
  return [...coreItems, ...nonCoreItems];
}
function useBlockHasGlobalStyles(blockName) {
  const [rawSettings] = (0, import_hooks.useSetting)("", blockName);
  const settings = useSettingsForBlockElement(rawSettings, blockName);
  const hasTypographyPanel = useHasTypographyPanel(settings);
  const hasColorPanel = useHasColorPanel(settings);
  const hasBorderPanel = useHasBorderPanel(settings);
  const hasDimensionsPanel = useHasDimensionsPanel(settings);
  const hasLayoutPanel = hasBorderPanel || hasDimensionsPanel;
  const hasVariationsPanel = !!(0, import_variations_panel.useBlockVariations)(blockName)?.length;
  const hasGlobalStyles = hasTypographyPanel || hasColorPanel || hasLayoutPanel || hasVariationsPanel;
  return hasGlobalStyles;
}
function BlockMenuItem({ block }) {
  const hasBlockMenuItem = useBlockHasGlobalStyles(block.name);
  if (!hasBlockMenuItem) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_navigation_button.NavigationButtonAsItem,
    {
      path: "/blocks/" + encodeURIComponent(block.name),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "flex-start", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockIcon, { icon: block.icon }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: block.title })
      ] })
    }
  );
}
function BlockList({ filterValue }) {
  const sortedBlockTypes = useSortedBlockTypes();
  const debouncedSpeak = (0, import_compose.useDebounce)(import_a11y.speak, 500);
  const { isMatchingSearchTerm } = (0, import_data.useSelect)(import_blocks.store);
  const filteredBlockTypes = !filterValue ? sortedBlockTypes : sortedBlockTypes.filter(
    (blockType) => isMatchingSearchTerm(blockType, filterValue)
  );
  const blockTypesListRef = (0, import_element.useRef)(null);
  (0, import_element.useEffect)(() => {
    if (!filterValue) {
      return;
    }
    const count = blockTypesListRef.current?.childElementCount || 0;
    const resultsFoundMessage = (0, import_i18n.sprintf)(
      /* translators: %d: number of results. */
      (0, import_i18n._n)("%d result found.", "%d results found.", count),
      count
    );
    debouncedSpeak(resultsFoundMessage, "polite");
  }, [filterValue, debouncedSpeak]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      ref: blockTypesListRef,
      className: "global-styles-ui-block-types-item-list",
      role: "list",
      children: filteredBlockTypes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { align: "center", as: "p", children: (0, import_i18n.__)("No blocks found.") }) : filteredBlockTypes.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        BlockMenuItem,
        {
          block
        },
        "menu-itemblock-" + block.name
      ))
    }
  );
}
var MemoizedBlockList = (0, import_element.memo)(BlockList);
function ScreenBlockList() {
  const [filterValue, setFilterValue] = (0, import_element.useState)("");
  const deferredFilterValue = (0, import_element.useDeferredValue)(filterValue);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_screen_header.ScreenHeader,
      {
        title: (0, import_i18n.__)("Blocks"),
        description: (0, import_i18n.__)(
          "Customize the appearance of specific blocks and for the whole site."
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.SearchControl,
      {
        className: "global-styles-ui-block-types-search",
        onChange: setFilterValue,
        value: filterValue,
        label: (0, import_i18n.__)("Search"),
        placeholder: (0, import_i18n.__)("Search")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemoizedBlockList, { filterValue: deferredFilterValue })
  ] });
}
var screen_block_list_default = ScreenBlockList;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useBlockHasGlobalStyles
});
//# sourceMappingURL=screen-block-list.cjs.map
