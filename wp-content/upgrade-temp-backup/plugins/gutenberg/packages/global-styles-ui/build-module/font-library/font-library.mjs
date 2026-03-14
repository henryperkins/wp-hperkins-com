// packages/global-styles-ui/src/font-library/font-library.tsx
import { GlobalStylesProvider } from "../provider.mjs";
import FontLibraryProvider from "./context.mjs";
import InstalledFonts from "./installed-fonts.mjs";
import UploadFonts from "./upload-fonts.mjs";
import FontCollection from "./font-collection.mjs";
import { jsx } from "react/jsx-runtime";
function FontLibrary({
  value,
  baseValue,
  onChange,
  activeTab = "installed-fonts"
}) {
  let content;
  switch (activeTab) {
    case "upload-fonts":
      content = /* @__PURE__ */ jsx(UploadFonts, {});
      break;
    case "installed-fonts":
      content = /* @__PURE__ */ jsx(InstalledFonts, {});
      break;
    default:
      content = /* @__PURE__ */ jsx(FontCollection, { slug: activeTab });
  }
  return /* @__PURE__ */ jsx(
    GlobalStylesProvider,
    {
      value,
      baseValue,
      onChange,
      children: /* @__PURE__ */ jsx(FontLibraryProvider, { children: content })
    }
  );
}
export {
  FontLibrary
};
//# sourceMappingURL=font-library.mjs.map
