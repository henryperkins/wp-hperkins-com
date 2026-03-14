// packages/global-styles-ui/src/font-families.tsx
import { __ } from "@wordpress/i18n";
import {
  __experimentalText as Text,
  __experimentalItemGroup as ItemGroup,
  __experimentalVStack as VStack,
  __experimentalHStack as HStack,
  Button
} from "@wordpress/components";
import { settings } from "@wordpress/icons";
import { useContext } from "@wordpress/element";
import { Subtitle } from "./subtitle.mjs";
import { useSetting } from "./hooks.mjs";
import FontLibraryProvider, {
  FontLibraryContext
} from "./font-library/context.mjs";
import FontLibraryModal from "./font-library/modal.mjs";
import FontFamilyItem from "./font-family-item.mjs";
import { setUIValuesNeeded } from "./font-library/utils/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function mapFontsWithSource(fonts, source) {
  return fonts ? fonts.map((f) => setUIValuesNeeded(f, { source })) : [];
}
function FontFamiliesInner() {
  const { baseCustomFonts, modalTabOpen, setModalTabOpen } = useContext(FontLibraryContext);
  const [fontFamilies] = useSetting("typography.fontFamilies");
  const [baseFontFamilies] = useSetting(
    "typography.fontFamilies",
    void 0,
    "base"
  );
  const themeFonts = mapFontsWithSource(fontFamilies?.theme, "theme");
  const customFonts = mapFontsWithSource(fontFamilies?.custom, "custom");
  const activeFonts = [...themeFonts, ...customFonts].sort(
    (a, b) => a.name.localeCompare(b.name)
  );
  const hasFonts = 0 < activeFonts.length;
  const hasInstalledFonts = hasFonts || baseFontFamilies?.theme?.length > 0 || (baseCustomFonts?.length ?? 0) > 0;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    !!modalTabOpen && /* @__PURE__ */ jsx(
      FontLibraryModal,
      {
        onRequestClose: () => setModalTabOpen?.(""),
        defaultTabId: modalTabOpen
      }
    ),
    /* @__PURE__ */ jsxs(VStack, { spacing: 2, children: [
      /* @__PURE__ */ jsxs(HStack, { justify: "space-between", children: [
        /* @__PURE__ */ jsx(Subtitle, { level: 3, children: __("Fonts") }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => setModalTabOpen?.("installed-fonts"),
            label: __("Manage fonts"),
            icon: settings,
            size: "small"
          }
        )
      ] }),
      activeFonts.length > 0 && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(ItemGroup, { size: "large", isBordered: true, isSeparated: true, children: activeFonts.map((font) => /* @__PURE__ */ jsx(
        FontFamilyItem,
        {
          font
        },
        font.slug
      )) }) }),
      !hasFonts && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Text, { as: "p", children: hasInstalledFonts ? __("No fonts activated.") : __("No fonts installed.") }),
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "global-styles-ui-font-families__manage-fonts",
            variant: "secondary",
            __next40pxDefaultSize: true,
            onClick: () => {
              setModalTabOpen?.(
                hasInstalledFonts ? "installed-fonts" : "upload-fonts"
              );
            },
            children: hasInstalledFonts ? __("Manage fonts") : __("Add fonts")
          }
        )
      ] })
    ] })
  ] });
}
function FontFamilies({ ...props }) {
  return /* @__PURE__ */ jsx(FontLibraryProvider, { children: /* @__PURE__ */ jsx(FontFamiliesInner, { ...props }) });
}
export {
  FontFamilies as default
};
//# sourceMappingURL=font-families.mjs.map
