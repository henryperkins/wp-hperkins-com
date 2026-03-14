// packages/global-styles-ui/src/font-library/library-font-details.tsx
import {
  __experimentalVStack as VStack,
  __experimentalSpacer as Spacer
} from "@wordpress/components";
import LibraryFontVariant from "./library-font-variant.mjs";
import { sortFontFaces } from "./utils/sort-font-faces.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function LibraryFontDetails({ font }) {
  const fontFaces = font.fontFace && font.fontFace.length ? sortFontFaces(font.fontFace) : [
    {
      fontFamily: font.fontFamily,
      fontStyle: "normal",
      fontWeight: "400"
    }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Spacer, { margin: 4 }),
    /* @__PURE__ */ jsxs(VStack, { spacing: 0, children: [
      /* @__PURE__ */ jsx(Spacer, { margin: 8 }),
      fontFaces.map((face, i) => /* @__PURE__ */ jsx(
        LibraryFontVariant,
        {
          font,
          face
        },
        `face${i}`
      ))
    ] }),
    /* @__PURE__ */ jsx(Spacer, { margin: 8 })
  ] });
}
var library_font_details_default = LibraryFontDetails;
export {
  library_font_details_default as default
};
//# sourceMappingURL=library-font-details.mjs.map
