// packages/boot/src/components/site-icon/index.tsx
import clsx from "clsx";
import { useSelect } from "@wordpress/data";
import { Icon, wordpress } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import { store as coreDataStore } from "@wordpress/core-data";

// packages/boot/src/components/site-icon/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='1a8e849690']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "1a8e849690");
  style.appendChild(document.createTextNode(".boot-site-icon{display:flex}.boot-site-icon__icon{fill:var(--wpds-color-fg-content-neutral,#1e1e1e);height:32px;width:32px}.boot-site-icon__image{aspect-ratio:1/1;border-radius:var(--wpds-border-radius-md,4px);height:32px;object-fit:cover;width:32px}"));
  document.head.appendChild(style);
}

// packages/boot/src/components/site-icon/index.tsx
import { jsx } from "react/jsx-runtime";
function SiteIcon({ className }) {
  const { isRequestingSite, siteIconUrl } = useSelect((select) => {
    const { getEntityRecord } = select(coreDataStore);
    const siteData = getEntityRecord(
      "root",
      "__unstableBase",
      void 0
    );
    return {
      isRequestingSite: !siteData,
      siteIconUrl: siteData?.site_icon_url
    };
  }, []);
  let icon = null;
  if (isRequestingSite && !siteIconUrl) {
    icon = /* @__PURE__ */ jsx("div", { className: "boot-site-icon__image" });
  } else {
    icon = siteIconUrl ? /* @__PURE__ */ jsx(
      "img",
      {
        className: "boot-site-icon__image",
        alt: __("Site Icon"),
        src: siteIconUrl
      }
    ) : /* @__PURE__ */ jsx(
      Icon,
      {
        className: "boot-site-icon__icon",
        icon: wordpress,
        size: 48
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: clsx(className, "boot-site-icon"), children: icon });
}
var site_icon_default = SiteIcon;
export {
  site_icon_default as default
};
//# sourceMappingURL=index.mjs.map
