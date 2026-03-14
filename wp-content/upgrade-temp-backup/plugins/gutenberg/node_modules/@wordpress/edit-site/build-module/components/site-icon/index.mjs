// packages/edit-site/src/components/site-icon/index.js
import clsx from "clsx";
import { useSelect } from "@wordpress/data";
import { Icon } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { wordpress } from "@wordpress/icons";
import { store as coreDataStore } from "@wordpress/core-data";
import { jsx } from "react/jsx-runtime";
function SiteIcon({ className }) {
  const { isRequestingSite, siteIconUrl } = useSelect((select) => {
    const { getEntityRecord } = select(coreDataStore);
    const siteData = getEntityRecord("root", "__unstableBase", void 0);
    return {
      isRequestingSite: !siteData,
      siteIconUrl: siteData?.site_icon_url
    };
  }, []);
  if (isRequestingSite && !siteIconUrl) {
    return /* @__PURE__ */ jsx("div", { className: "edit-site-site-icon__image" });
  }
  const icon = siteIconUrl ? /* @__PURE__ */ jsx(
    "img",
    {
      className: "edit-site-site-icon__image",
      alt: __("Site Icon"),
      src: siteIconUrl
    }
  ) : /* @__PURE__ */ jsx(
    Icon,
    {
      className: "edit-site-site-icon__icon",
      icon: wordpress,
      size: 48
    }
  );
  return /* @__PURE__ */ jsx("div", { className: clsx(className, "edit-site-site-icon"), children: icon });
}
var site_icon_default = SiteIcon;
export {
  site_icon_default as default
};
//# sourceMappingURL=index.mjs.map
