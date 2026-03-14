// packages/boot/src/components/site-icon-link/index.tsx
import { Link, privateApis as routePrivateApis } from "@wordpress/route";
import { Tooltip } from "@wordpress/components";
import { unlock } from "../../lock-unlock.mjs";
import SiteIcon from "../site-icon/index.mjs";

// packages/boot/src/components/site-icon-link/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='3de37b6316']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "3de37b6316");
  style.appendChild(document.createTextNode(".boot-site-icon-link{align-items:center;background:var(--wpds-color-bg-surface-neutral-weak,#f0f0f0);display:inline-flex;height:64px;justify-content:center;text-decoration:none;width:64px}@media not (prefers-reduced-motion){.boot-site-icon-link{transition:outline .1s ease-out}}.boot-site-icon-link:focus:not(:active){outline:var(--wpds-border-width-focus,2px) solid var(--wpds-color-stroke-focus-brand,#0073aa);outline-offset:calc(var(--wpds-border-width-focus, 2px)*-1)}"));
  document.head.appendChild(style);
}

// packages/boot/src/components/site-icon-link/index.tsx
import { jsx } from "react/jsx-runtime";
var { useCanGoBack, useRouter } = unlock(routePrivateApis);
function SiteIconLink({
  to,
  isBackButton,
  ...props
}) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  return /* @__PURE__ */ jsx(Tooltip, { text: props["aria-label"], placement: "right", children: /* @__PURE__ */ jsx(
    Link,
    {
      to,
      "aria-label": props["aria-label"],
      className: "boot-site-icon-link",
      onClick: (event) => {
        if (canGoBack && isBackButton) {
          event.preventDefault();
          router.history.back();
        }
      },
      children: /* @__PURE__ */ jsx(SiteIcon, {})
    }
  ) });
}
var site_icon_link_default = SiteIconLink;
export {
  site_icon_link_default as default
};
//# sourceMappingURL=index.mjs.map
