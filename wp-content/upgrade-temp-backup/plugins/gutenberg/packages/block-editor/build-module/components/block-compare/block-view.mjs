// packages/block-editor/src/components/block-compare/block-view.js
import { Button } from "@wordpress/components";
import { RawHTML } from "@wordpress/element";
import { safeHTML } from "@wordpress/dom";
import { jsx, jsxs } from "react/jsx-runtime";
function BlockView({
  title,
  rawContent,
  renderedContent,
  action,
  actionText,
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsxs("div", { className: "block-editor-block-compare__content", children: [
      /* @__PURE__ */ jsx("h2", { className: "block-editor-block-compare__heading", children: title }),
      /* @__PURE__ */ jsx("div", { className: "block-editor-block-compare__html", children: rawContent }),
      /* @__PURE__ */ jsx("div", { className: "block-editor-block-compare__preview edit-post-visual-editor", children: /* @__PURE__ */ jsx(RawHTML, { children: safeHTML(renderedContent) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "block-editor-block-compare__action", children: /* @__PURE__ */ jsx(
      Button,
      {
        __next40pxDefaultSize: true,
        variant: "secondary",
        tabIndex: "0",
        onClick: action,
        children: actionText
      }
    ) })
  ] });
}
export {
  BlockView as default
};
//# sourceMappingURL=block-view.mjs.map
