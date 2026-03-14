// packages/editor/src/components/styles-canvas/style-book.js
import { forwardRef } from "@wordpress/element";
import StyleBook from "../style-book/index.mjs";
import { STYLE_BOOK_COLOR_GROUPS } from "../style-book/constants.mjs";
import { jsx } from "react/jsx-runtime";
function StylesCanvasStyleBook({ path, onPathChange }, ref) {
  return /* @__PURE__ */ jsx(
    StyleBook,
    {
      ref,
      isSelected: (blockName) => (
        // Match '/blocks/core%2Fbutton' and
        // '/blocks/core%2Fbutton/typography', but not
        // '/blocks/core%2Fbuttons'.
        path === `/blocks/${encodeURIComponent(blockName)}` || path?.startsWith(
          `/blocks/${encodeURIComponent(blockName)}/`
        )
      ),
      onSelect: (blockName) => {
        if (STYLE_BOOK_COLOR_GROUPS.find(
          (group) => group.slug === blockName
        )) {
          onPathChange?.("/colors/palette");
          return;
        }
        if (blockName === "typography") {
          onPathChange?.("/typography");
          return;
        }
        onPathChange?.("/blocks/" + encodeURIComponent(blockName));
      }
    }
  );
}
var style_book_default = forwardRef(StylesCanvasStyleBook);
export {
  style_book_default as default
};
//# sourceMappingURL=style-book.mjs.map
