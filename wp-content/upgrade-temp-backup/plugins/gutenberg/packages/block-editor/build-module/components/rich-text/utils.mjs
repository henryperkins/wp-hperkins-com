// packages/block-editor/src/components/rich-text/utils.js
import { renderToString } from "@wordpress/element";
import { createBlock } from "@wordpress/blocks";
import { jsx } from "react/jsx-runtime";
function addActiveFormats(value, activeFormats) {
  if (activeFormats?.length) {
    let index = value.formats.length;
    while (index--) {
      value.formats[index] = [
        ...activeFormats,
        ...value.formats[index] || []
      ];
    }
  }
}
function getMultilineTag(multiline) {
  if (multiline !== true && multiline !== "p" && multiline !== "li") {
    return;
  }
  return multiline === true ? "p" : multiline;
}
function getAllowedFormats({ allowedFormats, disableFormats }) {
  if (disableFormats) {
    return getAllowedFormats.EMPTY_ARRAY;
  }
  return allowedFormats;
}
getAllowedFormats.EMPTY_ARRAY = [];
function createLinkInParagraph(url, onReplace) {
  const link = /* @__PURE__ */ jsx("a", { href: url, children: url });
  onReplace(
    createBlock("core/paragraph", { content: renderToString(link) })
  );
}
export {
  addActiveFormats,
  createLinkInParagraph,
  getAllowedFormats,
  getMultilineTag
};
//# sourceMappingURL=utils.mjs.map
