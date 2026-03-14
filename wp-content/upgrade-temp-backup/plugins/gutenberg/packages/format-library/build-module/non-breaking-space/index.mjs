// packages/format-library/src/non-breaking-space/index.js
import { __ } from "@wordpress/i18n";
import { insert } from "@wordpress/rich-text";
import { RichTextShortcut } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
var name = "core/non-breaking-space";
var title = __("Non breaking space");
var nonBreakingSpace = {
  name,
  title,
  tagName: "nbsp",
  className: null,
  edit({ value, onChange }) {
    function addNonBreakingSpace() {
      onChange(insert(value, "\xA0"));
    }
    return /* @__PURE__ */ jsx(
      RichTextShortcut,
      {
        type: "primaryShift",
        character: " ",
        onUse: addNonBreakingSpace
      }
    );
  }
};
export {
  nonBreakingSpace
};
//# sourceMappingURL=index.mjs.map
