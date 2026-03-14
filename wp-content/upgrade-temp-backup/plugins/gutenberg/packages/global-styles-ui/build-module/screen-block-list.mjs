// packages/global-styles-ui/src/screen-block-list.tsx
import { store as blocksStore } from "@wordpress/blocks";
import { __, sprintf, _n } from "@wordpress/i18n";
import {
  FlexItem,
  SearchControl,
  __experimentalHStack as HStack,
  __experimentalText as Text
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import {
  useState,
  useEffect,
  useRef,
  useDeferredValue,
  memo
} from "@wordpress/element";
import {
  BlockIcon,
  privateApis as blockEditorPrivateApis
} from "@wordpress/block-editor";
import { useDebounce } from "@wordpress/compose";
import { speak } from "@wordpress/a11y";
import { useBlockVariations } from "./variations/variations-panel.mjs";
import { ScreenHeader } from "./screen-header.mjs";
import { NavigationButtonAsItem } from "./navigation-button.mjs";
import { useSetting } from "./hooks.mjs";
import { unlock } from "./lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var {
  useHasDimensionsPanel,
  useHasTypographyPanel,
  useHasBorderPanel,
  useSettingsForBlockElement,
  useHasColorPanel
} = unlock(blockEditorPrivateApis);
function useSortedBlockTypes() {
  const blockItems = useSelect(
    (select) => select(blocksStore).getBlockTypes(),
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
  const [rawSettings] = useSetting("", blockName);
  const settings = useSettingsForBlockElement(rawSettings, blockName);
  const hasTypographyPanel = useHasTypographyPanel(settings);
  const hasColorPanel = useHasColorPanel(settings);
  const hasBorderPanel = useHasBorderPanel(settings);
  const hasDimensionsPanel = useHasDimensionsPanel(settings);
  const hasLayoutPanel = hasBorderPanel || hasDimensionsPanel;
  const hasVariationsPanel = !!useBlockVariations(blockName)?.length;
  const hasGlobalStyles = hasTypographyPanel || hasColorPanel || hasLayoutPanel || hasVariationsPanel;
  return hasGlobalStyles;
}
function BlockMenuItem({ block }) {
  const hasBlockMenuItem = useBlockHasGlobalStyles(block.name);
  if (!hasBlockMenuItem) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    NavigationButtonAsItem,
    {
      path: "/blocks/" + encodeURIComponent(block.name),
      children: /* @__PURE__ */ jsxs(HStack, { justify: "flex-start", children: [
        /* @__PURE__ */ jsx(BlockIcon, { icon: block.icon }),
        /* @__PURE__ */ jsx(FlexItem, { children: block.title })
      ] })
    }
  );
}
function BlockList({ filterValue }) {
  const sortedBlockTypes = useSortedBlockTypes();
  const debouncedSpeak = useDebounce(speak, 500);
  const { isMatchingSearchTerm } = useSelect(blocksStore);
  const filteredBlockTypes = !filterValue ? sortedBlockTypes : sortedBlockTypes.filter(
    (blockType) => isMatchingSearchTerm(blockType, filterValue)
  );
  const blockTypesListRef = useRef(null);
  useEffect(() => {
    if (!filterValue) {
      return;
    }
    const count = blockTypesListRef.current?.childElementCount || 0;
    const resultsFoundMessage = sprintf(
      /* translators: %d: number of results. */
      _n("%d result found.", "%d results found.", count),
      count
    );
    debouncedSpeak(resultsFoundMessage, "polite");
  }, [filterValue, debouncedSpeak]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: blockTypesListRef,
      className: "global-styles-ui-block-types-item-list",
      role: "list",
      children: filteredBlockTypes.length === 0 ? /* @__PURE__ */ jsx(Text, { align: "center", as: "p", children: __("No blocks found.") }) : filteredBlockTypes.map((block) => /* @__PURE__ */ jsx(
        BlockMenuItem,
        {
          block
        },
        "menu-itemblock-" + block.name
      ))
    }
  );
}
var MemoizedBlockList = memo(BlockList);
function ScreenBlockList() {
  const [filterValue, setFilterValue] = useState("");
  const deferredFilterValue = useDeferredValue(filterValue);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ScreenHeader,
      {
        title: __("Blocks"),
        description: __(
          "Customize the appearance of specific blocks and for the whole site."
        )
      }
    ),
    /* @__PURE__ */ jsx(
      SearchControl,
      {
        className: "global-styles-ui-block-types-search",
        onChange: setFilterValue,
        value: filterValue,
        label: __("Search"),
        placeholder: __("Search")
      }
    ),
    /* @__PURE__ */ jsx(MemoizedBlockList, { filterValue: deferredFilterValue })
  ] });
}
var screen_block_list_default = ScreenBlockList;
export {
  screen_block_list_default as default,
  useBlockHasGlobalStyles
};
//# sourceMappingURL=screen-block-list.mjs.map
