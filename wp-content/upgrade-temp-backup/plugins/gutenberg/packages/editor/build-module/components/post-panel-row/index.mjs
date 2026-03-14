// packages/editor/src/components/post-panel-row/index.js
import clsx from "clsx";
import { __experimentalHStack as HStack } from "@wordpress/components";
import { forwardRef } from "@wordpress/element";
import { jsx, jsxs } from "react/jsx-runtime";
var PostPanelRow = forwardRef(({ className, label, children }, ref) => {
  return /* @__PURE__ */ jsxs(
    HStack,
    {
      className: clsx("editor-post-panel__row", className),
      ref,
      children: [
        label && /* @__PURE__ */ jsx("div", { className: "editor-post-panel__row-label", children: label }),
        /* @__PURE__ */ jsx("div", { className: "editor-post-panel__row-control", children })
      ]
    }
  );
});
var post_panel_row_default = PostPanelRow;
export {
  post_panel_row_default as default
};
//# sourceMappingURL=index.mjs.map
