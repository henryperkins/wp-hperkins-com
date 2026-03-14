// packages/global-styles-ui/src/font-family-item.tsx
import { _n, sprintf } from "@wordpress/i18n";
import {
  __experimentalHStack as HStack,
  __experimentalItem as Item,
  FlexItem
} from "@wordpress/components";
import { useContext } from "@wordpress/element";
import { FontLibraryContext } from "./font-library/context.mjs";
import { getFamilyPreviewStyle } from "./font-library/utils/preview-styles.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function FontFamilyItem({ font }) {
  const { handleSetLibraryFontSelected, setModalTabOpen } = useContext(FontLibraryContext);
  const variantsCount = font?.fontFace?.length || 1;
  const handleClick = () => {
    handleSetLibraryFontSelected?.(font);
    setModalTabOpen?.("installed-fonts");
  };
  const previewStyle = getFamilyPreviewStyle(font);
  return /* @__PURE__ */ jsx(Item, { onClick: handleClick, children: /* @__PURE__ */ jsxs(HStack, { justify: "space-between", children: [
    /* @__PURE__ */ jsx(FlexItem, { style: previewStyle, children: font.name }),
    /* @__PURE__ */ jsx(FlexItem, { className: "global-styles-ui-screen-typography__font-variants-count", children: sprintf(
      /* translators: %d: Number of font variants. */
      _n("%d variant", "%d variants", variantsCount),
      variantsCount
    ) })
  ] }) });
}
var font_family_item_default = FontFamilyItem;
export {
  font_family_item_default as default
};
//# sourceMappingURL=font-family-item.mjs.map
