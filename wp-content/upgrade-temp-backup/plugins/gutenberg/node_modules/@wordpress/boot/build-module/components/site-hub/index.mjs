// packages/boot/src/components/site-hub/index.tsx
import { useSelect, useDispatch } from "@wordpress/data";
import {
  ExternalLink,
  Button,
  __experimentalHStack as HStack
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { store as coreStore } from "@wordpress/core-data";
import { decodeEntities } from "@wordpress/html-entities";
import { search } from "@wordpress/icons";
import { displayShortcut } from "@wordpress/keycodes";
import { store as commandsStore } from "@wordpress/commands";
import { filterURLForDisplay } from "@wordpress/url";
import SiteIconLink from "../site-icon-link/index.mjs";
import { store as bootStore } from "../../store/index.mjs";

// packages/boot/src/components/site-hub/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='78184fe2c5']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "78184fe2c5");
  style.appendChild(document.createTextNode(".boot-site-hub{align-items:center;background-color:var(--wpds-color-bg-surface-neutral-weak,#f0f0f0);display:grid;flex-shrink:0;grid-template-columns:60px 1fr auto;padding-right:16px;position:sticky;top:0;z-index:1}.boot-site-hub__actions{flex-shrink:0}.boot-site-hub__title{align-items:center;display:flex;text-decoration:none}.boot-site-hub__title .components-external-link__contents{margin-inline-start:4px;max-width:140px;overflow:hidden;text-decoration:none}.boot-site-hub__title .components-external-link__icon{opacity:0;transition:opacity .1s ease-out}.boot-site-hub__title:hover .components-external-link__icon{opacity:1}@media not (prefers-reduced-motion){.boot-site-hub__title{transition:outline .1s ease-out}}.boot-site-hub__title:focus:not(:active){outline:var(--wpds-border-width-focus,2px) solid var(--wpds-color-stroke-focus-brand,#0073aa);outline-offset:calc(var(--wpds-border-width-focus, 2px)*-1)}.boot-site-hub__title-text{color:var(--wpds-color-fg-content-neutral,#1e1e1e);font-size:13px;font-weight:499}.boot-site-hub__title-text,.boot-site-hub__url{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.boot-site-hub__url{color:var(--wpds-color-fg-content-neutral-weak,#757575);font-size:12px}"));
  document.head.appendChild(style);
}

// packages/boot/src/components/site-hub/index.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function SiteHub() {
  const { dashboardLink, homeUrl, siteTitle } = useSelect((select) => {
    const { getEntityRecord } = select(coreStore);
    const _base = getEntityRecord(
      "root",
      "__unstableBase"
    );
    return {
      dashboardLink: select(bootStore).getDashboardLink(),
      homeUrl: _base?.home,
      siteTitle: !_base?.name && !!_base?.url ? filterURLForDisplay(_base?.url) : _base?.name
    };
  }, []);
  const { open: openCommandCenter } = useDispatch(commandsStore);
  return /* @__PURE__ */ jsxs("div", { className: "boot-site-hub", children: [
    /* @__PURE__ */ jsx(
      SiteIconLink,
      {
        to: dashboardLink || "/",
        "aria-label": __("Go to the Dashboard")
      }
    ),
    /* @__PURE__ */ jsxs(
      ExternalLink,
      {
        href: homeUrl ?? "/",
        className: "boot-site-hub__title",
        children: [
          /* @__PURE__ */ jsx("div", { className: "boot-site-hub__title-text", children: siteTitle && decodeEntities(siteTitle) }),
          /* @__PURE__ */ jsx("div", { className: "boot-site-hub__url", children: filterURLForDisplay(homeUrl ?? "") })
        ]
      }
    ),
    /* @__PURE__ */ jsx(HStack, { className: "boot-site-hub__actions", children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "tertiary",
        icon: search,
        onClick: () => openCommandCenter(),
        size: "compact",
        label: __("Open command palette"),
        shortcut: displayShortcut.primary("k")
      }
    ) })
  ] });
}
var site_hub_default = SiteHub;
export {
  site_hub_default as default
};
//# sourceMappingURL=index.mjs.map
