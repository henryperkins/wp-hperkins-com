// packages/global-styles-ui/src/font-library/collection-font-variant.tsx
import { useId } from "@wordpress/element";
import { CheckboxControl, Flex } from "@wordpress/components";
import { getFontFaceVariantName } from "./utils/index.mjs";
import FontDemo from "./font-demo.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function CollectionFontVariant({
  face,
  font,
  handleToggleVariant,
  selected
}) {
  const handleToggleActivation = () => {
    if (font?.fontFace) {
      handleToggleVariant(font, face);
      return;
    }
    handleToggleVariant(font);
  };
  const displayName = font.name + " " + getFontFaceVariantName(face);
  const checkboxId = useId();
  return /* @__PURE__ */ jsx("div", { className: "font-library__font-card", children: /* @__PURE__ */ jsxs(Flex, { justify: "flex-start", align: "center", gap: "1rem", children: [
    /* @__PURE__ */ jsx(
      CheckboxControl,
      {
        checked: selected,
        onChange: handleToggleActivation,
        id: checkboxId
      }
    ),
    /* @__PURE__ */ jsx("label", { htmlFor: checkboxId, children: /* @__PURE__ */ jsx(
      FontDemo,
      {
        font: face,
        text: displayName,
        onClick: handleToggleActivation
      }
    ) })
  ] }) });
}
var collection_font_variant_default = CollectionFontVariant;
export {
  collection_font_variant_default as default
};
//# sourceMappingURL=collection-font-variant.mjs.map
