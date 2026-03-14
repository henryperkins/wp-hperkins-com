"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-taxonomies/most-used-terms.js
var most_used_terms_exports = {};
__export(most_used_terms_exports, {
  default: () => MostUsedTerms
});
module.exports = __toCommonJS(most_used_terms_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_terms = require("../../utils/terms.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var MIN_MOST_USED_TERMS = 3;
var DEFAULT_QUERY = {
  per_page: 10,
  orderby: "count",
  order: "desc",
  hide_empty: true,
  _fields: "id,name,count",
  context: "view"
};
function MostUsedTerms({ onSelect, taxonomy }) {
  const { _terms, showTerms } = (0, import_data.useSelect)(
    (select) => {
      const mostUsedTerms = select(import_core_data.store).getEntityRecords(
        "taxonomy",
        taxonomy.slug,
        DEFAULT_QUERY
      );
      return {
        _terms: mostUsedTerms,
        showTerms: mostUsedTerms?.length >= MIN_MOST_USED_TERMS
      };
    },
    [taxonomy.slug]
  );
  if (!showTerms) {
    return null;
  }
  const terms = (0, import_terms.unescapeTerms)(_terms);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-post-taxonomies__flat-term-most-used", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.BaseControl.VisualLabel,
      {
        as: "h3",
        className: "editor-post-taxonomies__flat-term-most-used-label",
        children: taxonomy.labels.most_used
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "ul",
      {
        role: "list",
        className: "editor-post-taxonomies__flat-term-most-used-list",
        children: terms.map((term) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            variant: "link",
            onClick: () => onSelect(term),
            children: term.name
          }
        ) }, term.id))
      }
    )
  ] });
}
//# sourceMappingURL=most-used-terms.cjs.map
