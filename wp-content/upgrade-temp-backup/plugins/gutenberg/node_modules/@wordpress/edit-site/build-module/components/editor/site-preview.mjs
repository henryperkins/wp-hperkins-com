// packages/edit-site/src/components/editor/site-preview.js
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { focus } from "@wordpress/dom";
import { addQueryArgs } from "@wordpress/url";
import { jsx } from "react/jsx-runtime";
function SitePreview() {
  const siteUrl = useSelect((select) => {
    const { getEntityRecord } = select(coreStore);
    const siteData = getEntityRecord("root", "__unstableBase");
    return siteData?.home;
  }, []);
  return /* @__PURE__ */ jsx(
    "iframe",
    {
      src: addQueryArgs(siteUrl, {
        // Parameter for hiding the admin bar.
        wp_site_preview: 1
      }),
      title: __("Site Preview"),
      style: {
        display: "block",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff"
      },
      onLoad: (event) => {
        const document = event.target.contentDocument;
        const focusableElements = focus.focusable.find(document);
        focusableElements.forEach((element) => {
          element.style.pointerEvents = "none";
          element.tabIndex = -1;
          element.setAttribute("aria-hidden", "true");
        });
      }
    }
  );
}
export {
  SitePreview as default
};
//# sourceMappingURL=site-preview.mjs.map
