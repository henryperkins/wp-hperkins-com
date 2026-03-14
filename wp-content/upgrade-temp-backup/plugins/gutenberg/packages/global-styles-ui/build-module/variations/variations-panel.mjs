// packages/global-styles-ui/src/variations/variations-panel.tsx
import { store as blocksStore } from "@wordpress/blocks";
import { useSelect } from "@wordpress/data";
import { __experimentalItemGroup as ItemGroup } from "@wordpress/components";
import { NavigationButtonAsItem } from "../navigation-button.mjs";
import { useStyle } from "../hooks.mjs";
import { jsx } from "react/jsx-runtime";
function getFilteredBlockStyles(blockStyles, variations) {
  return blockStyles?.filter(
    (style) => style.source === "block" || variations.includes(style.name)
  ) || [];
}
function useBlockVariations(name) {
  const blockStyles = useSelect(
    (select) => {
      const { getBlockStyles } = select(blocksStore);
      return getBlockStyles(name);
    },
    [name]
  );
  const [variations] = useStyle("variations", name);
  const variationNames = Object.keys(variations ?? {});
  return getFilteredBlockStyles(blockStyles, variationNames);
}
function VariationsPanel({ name }) {
  const coreBlockStyles = useBlockVariations(name);
  return /* @__PURE__ */ jsx(ItemGroup, { isBordered: true, isSeparated: true, children: coreBlockStyles.map((style, index) => {
    if (style?.isDefault) {
      return null;
    }
    return /* @__PURE__ */ jsx(
      NavigationButtonAsItem,
      {
        path: "/blocks/" + encodeURIComponent(name) + "/variations/" + encodeURIComponent(style.name),
        children: style.label
      },
      index
    );
  }) });
}
export {
  VariationsPanel,
  useBlockVariations
};
//# sourceMappingURL=variations-panel.mjs.map
