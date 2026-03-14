// packages/block-library/src/terms-query/edit/terms-query-placeholder.js
import { useSelect, useDispatch } from "@wordpress/data";
import {
  createBlocksFromInnerBlocksTemplate,
  store as blocksStore
} from "@wordpress/blocks";
import {
  store as blockEditorStore,
  __experimentalBlockVariationPicker,
  useBlockProps
} from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function TermsQueryPlaceholder({
  attributes,
  clientId,
  name
}) {
  const { blockType, activeBlockVariation, scopeVariations } = useSelect(
    (select) => {
      const {
        getActiveBlockVariation,
        getBlockType,
        getBlockVariations
      } = select(blocksStore);
      return {
        blockType: getBlockType(name),
        activeBlockVariation: getActiveBlockVariation(
          name,
          attributes
        ),
        scopeVariations: getBlockVariations(name, "block")
      };
    },
    [name, attributes]
  );
  const icon = activeBlockVariation?.icon?.src || activeBlockVariation?.icon || blockType?.icon?.src;
  const label = activeBlockVariation?.title || blockType?.title;
  const { replaceInnerBlocks } = useDispatch(blockEditorStore);
  const blockProps = useBlockProps();
  return /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(
    __experimentalBlockVariationPicker,
    {
      icon,
      label,
      variations: scopeVariations,
      onSelect: (variation) => {
        if (variation.innerBlocks) {
          replaceInnerBlocks(
            clientId,
            createBlocksFromInnerBlocksTemplate(
              variation.innerBlocks
            ),
            false
          );
        }
      }
    }
  ) });
}
export {
  TermsQueryPlaceholder as default
};
//# sourceMappingURL=terms-query-placeholder.mjs.map
