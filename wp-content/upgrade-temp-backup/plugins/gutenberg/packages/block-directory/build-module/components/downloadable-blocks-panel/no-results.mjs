// packages/block-directory/src/components/downloadable-blocks-panel/no-results.js
import { __ } from "@wordpress/i18n";
import { Tip, ExternalLink } from "@wordpress/components";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function DownloadableBlocksNoResults() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "block-editor-inserter__no-results", children: /* @__PURE__ */ jsx("p", { children: __("No results found.") }) }),
    /* @__PURE__ */ jsx("div", { className: "block-editor-inserter__tips", children: /* @__PURE__ */ jsxs(Tip, { children: [
      __("Interested in creating your own block?"),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsxs(ExternalLink, { href: "https://developer.wordpress.org/block-editor/", children: [
        __("Get started here"),
        "."
      ] })
    ] }) })
  ] });
}
var no_results_default = DownloadableBlocksNoResults;
export {
  no_results_default as default
};
//# sourceMappingURL=no-results.mjs.map
