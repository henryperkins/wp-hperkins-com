// packages/block-directory/src/components/downloadable-blocks-panel/inserter-panel.js
import { __, _n, sprintf } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { speak } from "@wordpress/a11y";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function DownloadableBlocksInserterPanel({
  children,
  downloadableItems,
  hasLocalBlocks
}) {
  const count = downloadableItems.length;
  useEffect(() => {
    speak(
      sprintf(
        /* translators: %d: number of available blocks. */
        _n(
          "%d additional block is available to install.",
          "%d additional blocks are available to install.",
          count
        ),
        count
      )
    );
  }, [count]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    !hasLocalBlocks && /* @__PURE__ */ jsx("p", { className: "block-directory-downloadable-blocks-panel__no-local", children: __("No results available from your installed blocks.") }),
    /* @__PURE__ */ jsx("div", { className: "block-editor-inserter__quick-inserter-separator" }),
    /* @__PURE__ */ jsxs("div", { className: "block-directory-downloadable-blocks-panel", children: [
      /* @__PURE__ */ jsxs("div", { className: "block-directory-downloadable-blocks-panel__header", children: [
        /* @__PURE__ */ jsx("h2", { className: "block-directory-downloadable-blocks-panel__title", children: __("Available to install") }),
        /* @__PURE__ */ jsx("p", { className: "block-directory-downloadable-blocks-panel__description", children: __(
          "Select a block to install and add it to your post."
        ) })
      ] }),
      children
    ] })
  ] });
}
var inserter_panel_default = DownloadableBlocksInserterPanel;
export {
  inserter_panel_default as default
};
//# sourceMappingURL=inserter-panel.mjs.map
