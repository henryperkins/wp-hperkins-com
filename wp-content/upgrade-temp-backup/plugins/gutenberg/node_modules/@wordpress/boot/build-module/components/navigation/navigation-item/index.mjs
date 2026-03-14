// packages/boot/src/components/navigation/navigation-item/index.tsx
import clsx from "clsx";
import {
  FlexBlock,
  __experimentalItem as Item,
  __experimentalHStack as HStack
} from "@wordpress/components";
import RouterLinkItem from "../router-link-item.mjs";
import { wrapIcon } from "../items.mjs";

// packages/boot/src/components/navigation/navigation-item/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='ead8c8ad15']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "ead8c8ad15");
  style.appendChild(document.createTextNode('.boot-navigation-item.components-item{align-items:center;border:none;color:var(--wpds-color-fg-interactive-neutral,#1e1e1e);display:flex;font-family:-apple-system,"system-ui",Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif;font-size:13px;font-weight:400;line-height:20px;margin-block-end:4px;margin-inline:12px;min-height:32px;padding-block:0;padding-inline:4px;width:calc(100% - 24px)}.boot-dropdown-item__children .boot-navigation-item.components-item{min-height:24px}.boot-navigation-item.components-item{border-radius:var(--wpds-border-radius-sm,2px)}.boot-navigation-item.components-item.active,.boot-navigation-item.components-item:focus,.boot-navigation-item.components-item:hover,.boot-navigation-item.components-item[aria-current=true]{color:var(--wpds-color-fg-interactive-brand-active,#0073aa)}.boot-navigation-item.components-item.active{font-weight:499}.boot-navigation-item.components-item svg:last-child{padding:4px}.boot-navigation-item.components-item[aria-current=true]{color:var(--wpds-color-fg-interactive-brand-active,#0073aa);font-weight:499}.boot-navigation-item.components-item:focus-visible{transform:translateZ(0)}.boot-navigation-item.components-item.with-suffix{padding-right:16px}'));
  document.head.appendChild(style);
}

// packages/boot/src/components/navigation/navigation-item/index.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function NavigationItem({
  className,
  icon,
  shouldShowPlaceholder = true,
  children,
  to
}) {
  const isExternal = !String(
    new URL(to, window.location.origin)
  ).startsWith(window.location.origin);
  const content = /* @__PURE__ */ jsxs(HStack, { justify: "flex-start", spacing: 2, style: { flexGrow: "1" }, children: [
    wrapIcon(icon, shouldShowPlaceholder),
    /* @__PURE__ */ jsx(FlexBlock, { children })
  ] });
  if (isExternal) {
    return /* @__PURE__ */ jsx(
      Item,
      {
        as: "a",
        href: to,
        className: clsx("boot-navigation-item", className),
        children: content
      }
    );
  }
  return /* @__PURE__ */ jsx(
    RouterLinkItem,
    {
      to,
      className: clsx("boot-navigation-item", className),
      children: content
    }
  );
}
export {
  NavigationItem as default
};
//# sourceMappingURL=index.mjs.map
