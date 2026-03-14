"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/table-of-contents/panel.js
var panel_exports = {};
__export(panel_exports, {
  default: () => panel_default
});
module.exports = __toCommonJS(panel_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_word_count = __toESM(require("../word-count/index.cjs"));
var import_time_to_read = __toESM(require("../time-to-read/index.cjs"));
var import_document_outline = __toESM(require("../document-outline/index.cjs"));
var import_character_count = __toESM(require("../character-count/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function TableOfContentsPanel({ hasOutlineItemsDisabled, onRequestClose }) {
  const { headingCount, paragraphCount, numberOfBlocks } = (0, import_data.useSelect)(
    (select) => {
      const { getGlobalBlockCount } = select(import_block_editor.store);
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
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "div",
        {
          className: "table-of-contents__wrapper",
          role: "note",
          "aria-label": (0, import_i18n.__)("Document Statistics"),
          tabIndex: "0",
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { role: "list", className: "table-of-contents__counts", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "table-of-contents__count", children: [
              (0, import_i18n.__)("Words"),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_word_count.default, {})
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "table-of-contents__count", children: [
              (0, import_i18n.__)("Characters"),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "table-of-contents__number", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_character_count.default, {}) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "table-of-contents__count", children: [
              (0, import_i18n.__)("Time to read"),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_time_to_read.default, {})
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "table-of-contents__count", children: [
              (0, import_i18n.__)("Headings"),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "table-of-contents__number", children: headingCount })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "table-of-contents__count", children: [
              (0, import_i18n.__)("Paragraphs"),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "table-of-contents__number", children: paragraphCount })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { className: "table-of-contents__count", children: [
              (0, import_i18n.__)("Blocks"),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "table-of-contents__number", children: numberOfBlocks })
            ] })
          ] })
        }
      ),
      headingCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "table-of-contents__title", children: (0, import_i18n.__)("Document Outline") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_document_outline.default,
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
//# sourceMappingURL=panel.cjs.map
