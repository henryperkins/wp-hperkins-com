// packages/edit-site/src/components/sidebar-navigation-screen-templates-browse/content-legacy.js
import { useEntityRecords } from "@wordpress/core-data";
import { useMemo } from "@wordpress/element";
import { __experimentalItemGroup as ItemGroup } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { addQueryArgs } from "@wordpress/url";
import SidebarNavigationItem from "../sidebar-navigation-item/index.mjs";
import { useAddedBy } from "../page-templates/hooks.mjs";
import { layout } from "@wordpress/icons";
import { TEMPLATE_POST_TYPE } from "../../utils/constants.mjs";
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
    query: { activeView = "all" }
  } = useLocation();
  const { records } = useEntityRecords("postType", TEMPLATE_POST_TYPE, {
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
        icon: layout,
        "aria-current": activeView === "all",
        children: __("All templates")
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
//# sourceMappingURL=content-legacy.mjs.map
