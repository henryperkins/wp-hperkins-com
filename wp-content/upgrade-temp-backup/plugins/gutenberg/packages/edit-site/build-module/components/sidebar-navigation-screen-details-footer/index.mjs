// packages/edit-site/src/components/sidebar-navigation-screen-details-footer/index.js
import { _n, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { __experimentalItemGroup as ItemGroup } from "@wordpress/components";
import { backup } from "@wordpress/icons";
import SidebarNavigationItem from "../sidebar-navigation-item/index.mjs";
import { jsx } from "react/jsx-runtime";
function SidebarNavigationScreenDetailsFooter({
  record,
  revisionsCount,
  ...otherProps
}) {
  const hrefProps = {};
  const lastRevisionId = record?._links?.["predecessor-version"]?.[0]?.id ?? null;
  revisionsCount = revisionsCount || record?._links?.["version-history"]?.[0]?.count || 0;
  if (lastRevisionId && revisionsCount > 1) {
    hrefProps.href = addQueryArgs("revision.php", {
      revision: record?._links["predecessor-version"][0].id
    });
    hrefProps.as = "a";
  }
  return /* @__PURE__ */ jsx(
    ItemGroup,
    {
      size: "large",
      className: "edit-site-sidebar-navigation-screen-details-footer",
      children: /* @__PURE__ */ jsx(
        SidebarNavigationItem,
        {
          icon: backup,
          ...hrefProps,
          ...otherProps,
          children: sprintf(
            /* translators: %d: Number of Styles revisions. */
            _n("%d Revision", "%d Revisions", revisionsCount),
            revisionsCount
          )
        }
      )
    }
  );
}
export {
  SidebarNavigationScreenDetailsFooter as default
};
//# sourceMappingURL=index.mjs.map
