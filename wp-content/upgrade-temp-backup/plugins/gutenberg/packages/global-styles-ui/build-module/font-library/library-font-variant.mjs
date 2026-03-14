// packages/global-styles-ui/src/font-library/library-font-variant.tsx
import { useContext, useId } from "@wordpress/element";
import { CheckboxControl, Flex } from "@wordpress/components";
import { getFontFaceVariantName } from "./utils/index.mjs";
import { FontLibraryContext } from "./context.mjs";
import FontDemo from "./font-demo.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function LibraryFontVariant({
  face,
  font
}) {
  const { isFontActivated, toggleActivateFont } = useContext(FontLibraryContext);
  const isInstalled = (font?.fontFace?.length ?? 0) > 0 ? isFontActivated(
    font.slug,
    face.fontStyle,
    face.fontWeight,
    font.source
  ) : isFontActivated(font.slug, void 0, void 0, font.source);
  const handleToggleActivation = () => {
    if ((font?.fontFace?.length ?? 0) > 0) {
      toggleActivateFont(font, face);
      return;
    }
    toggleActivateFont(font);
  };
  const displayName = font.name + " " + getFontFaceVariantName(face);
  const checkboxId = useId();
  return /* @__PURE__ */ jsx("div", { className: "font-library__font-card", children: /* @__PURE__ */ jsxs(Flex, { justify: "flex-start", align: "center", gap: "1rem", children: [
    /* @__PURE__ */ jsx(
      CheckboxControl,
      {
        checked: isInstalled,
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
var library_font_variant_default = LibraryFontVariant;
export {
  library_font_variant_default as default
};
//# sourceMappingURL=library-font-variant.mjs.map
