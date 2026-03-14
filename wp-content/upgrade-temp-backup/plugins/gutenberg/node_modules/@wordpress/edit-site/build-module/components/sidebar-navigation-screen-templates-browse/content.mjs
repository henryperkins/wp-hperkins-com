// packages/edit-site/src/components/sidebar-navigation-screen-templates-browse/content.js
import { useEntityRecords } from "@wordpress/core-data";
import { useMemo } from "@wordpress/element";
import { __experimentalItemGroup as ItemGroup } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { addQueryArgs } from "@wordpress/url";
import SidebarNavigationItem from "../sidebar-navigation-item/index.mjs";
import { useAddedBy } from "../page-templates/hooks.mjs";
import { commentAuthorAvatar, published } from "@wordpress/icons";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { useLocation } = unlock(routerPrivateApis);
var EMPTY_ARRAY = [];
function TemplateDataviewItem({ template, isActive }) {
  const { text, icon } = useAddedBy(template.type, template.id);
  return /* @__PURE__ */ jsx(
    SidebarNavigationItem,
    {
      to: addQueryArgs("/template", { activeView: text }),
      icon,
      "aria-current": isActive,
      children: text
    }
  );
}
function DataviewsTemplatesSidebarContent() {
  const {
    query: { activeView = "active" }
  } = useLocation();
  const { records } = useEntityRecords("root", "registeredTemplate", {
    // This should not be needed, the endpoint returns all registered
    // templates, but it's not possible right now to turn off pagination for
    // entity configs.
    per_page: -1
  });
  const firstItemPerAuthorText = useMemo(() => {
    const firstItemPerAuthor = records?.reduce((acc, template) => {
      const author = template.author_text;
      if (author && !acc[author]) {
        acc[author] = template;
      }
      return acc;
    }, {});
    return (firstItemPerAuthor && Object.values(firstItemPerAuthor)) ?? EMPTY_ARRAY;
  }, [records]);
  return /* @__PURE__ */ jsxs(ItemGroup, { className: "edit-site-sidebar-navigation-screen-templates-browse", children: [
    /* @__PURE__ */ jsx(
      SidebarNavigationItem,
      {
        to: "/template",
        icon: published,
        "aria-current": activeView === "active",
        children: __("Active templates")
      }
    ),
    /* @__PURE__ */ jsx(
      SidebarNavigationItem,
      {
        to: addQueryArgs("/template", { activeView: "user" }),
        icon: commentAuthorAvatar,
        "aria-current": activeView === "user",
        // Let's avoid calling them "custom templates" to avoid
        // confusion. "Created" is closest to meaning database
        // templates, created by users.
        // https://developer.wordpress.org/themes/classic-themes/templates/page-template-files/#creating-custom-page-templates-for-global-use
        children: __("Created templates")
      }
    ),
    firstItemPerAuthorText.map((template) => {
      return /* @__PURE__ */ jsx(
        TemplateDataviewItem,
        {
          template,
          isActive: activeView === template.author_text
        },
        template.author_text
      );
    })
  ] });
}
export {
  DataviewsTemplatesSidebarContent as default
};
//# sourceMappingURL=content.mjs.map
