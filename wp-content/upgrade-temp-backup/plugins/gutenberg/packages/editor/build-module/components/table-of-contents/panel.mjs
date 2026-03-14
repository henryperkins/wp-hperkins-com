// packages/editor/src/components/table-of-contents/panel.js
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import WordCount from "../word-count/index.mjs";
import TimeToRead from "../time-to-read/index.mjs";
import DocumentOutline from "../document-outline/index.mjs";
import CharacterCount from "../character-count/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function TableOfContentsPanel({ hasOutlineItemsDisabled, onRequestClose }) {
  const { headingCount, paragraphCount, numberOfBlocks } = useSelect(
    (select) => {
      const { getGlobalBlockCount } = select(blockEditorStore);
      return {
        headingCount: getGlobalBlockCount("core/heading"),
        paragraphCount: getGlobalBlockCount("core/paragraph"),
        numberOfBlocks: getGlobalBlockCount()
      };
    },
    []
  );
  return (
    /*
     * Disable reason: The `list` ARIA role is redundant but
     * Safari+VoiceOver won't announce the list otherwise.
     */
    /* eslint-disable jsx-a11y/no-redundant-roles */
    /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "table-of-contents__wrapper",
          role: "note",
          "aria-label": __("Document Statistics"),
          tabIndex: "0",
          children: /* @__PURE__ */ jsxs("ul", { role: "list", className: "table-of-contents__counts", children: [
            /* @__PURE__ */ jsxs("li", { className: "table-of-contents__count", children: [
              __("Words"),
              /* @__PURE__ */ jsx(WordCount, {})
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "table-of-contents__count", children: [
              __("Characters"),
              /* @__PURE__ */ jsx("span", { className: "table-of-contents__number", children: /* @__PURE__ */ jsx(CharacterCount, {}) })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "table-of-contents__count", children: [
              __("Time to read"),
              /* @__PURE__ */ jsx(TimeToRead, {})
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "table-of-contents__count", children: [
              __("Headings"),
              /* @__PURE__ */ jsx("span", { className: "table-of-contents__number", children: headingCount })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "table-of-contents__count", children: [
              __("Paragraphs"),
              /* @__PURE__ */ jsx("span", { className: "table-of-contents__number", children: paragraphCount })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "table-of-contents__count", children: [
              __("Blocks"),
              /* @__PURE__ */ jsx("span", { className: "table-of-contents__number", children: numberOfBlocks })
            ] })
          ] })
        }
      ),
      headingCount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("hr", {}),
        /* @__PURE__ */ jsx("h2", { className: "table-of-contents__title", children: __("Document Outline") }),
        /* @__PURE__ */ jsx(
          DocumentOutline,
          {
            onSelect: onRequestClose,
            hasOutlineItemsDisabled
          }
        )
      ] })
    ] })
  );
}
var panel_default = TableOfContentsPanel;
export {
  panel_default as default
};
//# sourceMappingURL=panel.mjs.map
