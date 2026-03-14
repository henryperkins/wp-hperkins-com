// packages/ui/src/card/root.tsx
import { mergeProps, useRender } from "@base-ui/react";
import clsx from "clsx";
import { forwardRef } from "@wordpress/element";

// packages/ui/src/utils/css/resets.module.css
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='671ebfc62d']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "671ebfc62d");
  style.appendChild(document.createTextNode("@layer wp-ui-utilities, wp-ui-components, wp-ui-compositions, wp-ui-overrides;@layer wp-ui-utilities{._336cd3e4e743482f__box-sizing{box-sizing:border-box;*,:after,:before{box-sizing:inherit}}}"));
  document.head.appendChild(style);
}
var resets_default = { "box-sizing": "_336cd3e4e743482f__box-sizing" };

// packages/ui/src/card/style.module.css
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='f377a3cf09']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "f377a3cf09");
  style.appendChild(document.createTextNode('@layer wp-ui-utilities, wp-ui-components, wp-ui-compositions, wp-ui-overrides;@layer wp-ui-components{._02872bf298eadc43__root{--wp-ui-card-padding:var(--wpds-dimension-padding-xl,20px);--wp-ui-card-header-content-gap:var(--wpds-dimension-gap-lg,16px);background-color:var(--wpds-color-bg-surface-neutral-strong,#fff);border:1px solid var(--wpds-color-stroke-surface-neutral-weak,#e0e0e0);border-radius:var(--wpds-border-radius-lg,8px);display:flex;flex-direction:column}._5dffdaf2a6e669ac__content,.bbccc92e6ba5662d__header{padding:var(--wp-ui-card-padding);&:not(:first-child):not(:last-child){padding-block-end:0}}.bbccc92e6ba5662d__header+._5dffdaf2a6e669ac__content{margin-block-start:calc(var(--wp-ui-card-header-content-gap) - var(--wp-ui-card-padding));padding-block-start:0}.c1fa192587e1b4a6__fullbleed{margin-inline:calc(var(--wp-ui-card-padding)*-1);width:calc(100% + var(--wp-ui-card-padding)*2)}._3c83b3f0225d6364__title{color:var(--wpds-color-fg-content-neutral,#1e1e1e);font-family:var(--wpds-font-family-heading,-apple-system,system-ui,"Segoe UI","Roboto","Oxygen-Sans","Ubuntu","Cantarell","Helvetica Neue",sans-serif);font-size:var(--wpds-font-size-lg,15px);font-weight:var(--wpds-font-weight-medium,499);line-height:var(--wpds-font-line-height-sm,20px);margin:0}}'));
  document.head.appendChild(style);
}
var style_default = { "root": "_02872bf298eadc43__root", "header": "bbccc92e6ba5662d__header", "content": "_5dffdaf2a6e669ac__content", "fullbleed": "c1fa192587e1b4a6__fullbleed", "title": "_3c83b3f0225d6364__title" };

// packages/ui/src/card/root.tsx
var Root = forwardRef(function Card({ render, ...restProps }, ref) {
  const mergedClassName = clsx(style_default.root, resets_default["box-sizing"]);
  const element = useRender({
    defaultTagName: "div",
    render,
    ref,
    props: mergeProps({ className: mergedClassName }, restProps)
  });
  return element;
});
export {
  Root
};
//# sourceMappingURL=root.mjs.map
