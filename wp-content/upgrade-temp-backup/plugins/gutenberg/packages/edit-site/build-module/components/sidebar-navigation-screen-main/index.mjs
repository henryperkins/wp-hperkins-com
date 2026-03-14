// packages/edit-site/src/components/sidebar-navigation-screen-main/index.js
import { __experimentalItemGroup as ItemGroup } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
  layout,
  symbol,
  navigation,
  styles,
  page,
  siteLogo
} from "@wordpress/icons";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import SidebarNavigationScreen from "../sidebar-navigation-screen/index.mjs";
import SidebarNavigationItem from "../sidebar-navigation-item/index.mjs";
import { SidebarNavigationItemGlobalStyles } from "../sidebar-navigation-screen-global-styles/index.mjs";
import { SidebarNavigationItemIdentity } from "../sidebar-navigation-screen-identity/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function MainSidebarNavigationContent({ isBlockBasedTheme = true }) {
  return /* @__PURE__ */ jsxs(ItemGroup, { className: "edit-site-sidebar-navigation-screen-main", children: [
    isBlockBasedTheme && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        SidebarNavigationItemGlobalStyles,
        {
          to: "/styles",
          uid: "global-styles-navigation-item",
          icon: styles,
          children: __("Styles")
        }
      ),
      /* @__PURE__ */ jsx(
        SidebarNavigationItem,
        {
          uid: "navigation-navigation-item",
          to: "/navigation",
          withChevron: true,
          icon: navigation,
          children: __("Navigation")
        }
      ),
      /* @__PURE__ */ jsx(
        SidebarNavigationItemIdentity,
        {
          to: "/identity",
          uid: "identity-navigation-item",
          icon: siteLogo,
          children: __("Identity")
        }
      ),
      /* @__PURE__ */ jsx(
        SidebarNavigationItem,
        {
          uid: "page-navigation-item",
          to: "/page",
          withChevron: true,
          icon: page,
          children: __("Pages")
        }
      ),
      /* @__PURE__ */ jsx(
        SidebarNavigationItem,
        {
          uid: "template-navigation-item",
          to: "/template",
          withChevron: true,
          icon: layout,
          children: __("Templates")
        }
      )
    ] }),
    !isBlockBasedTheme && /* @__PURE__ */ jsx(
      SidebarNavigationItem,
      {
        uid: "stylebook-navigation-item",
        to: "/stylebook",
        withChevron: true,
        icon: styles,
        children: __("Styles")
      }
    ),
    /* @__PURE__ */ jsx(
      SidebarNavigationItem,
      {
        uid: "patterns-navigation-item",
        to: "/pattern",
        withChevron: true,
        icon: symbol,
        children: __("Patterns")
      }
    )
  ] });
}
function SidebarNavigationScreenMain({ customDescription }) {
  const isBlockBasedTheme = useSelect(
    (select) => select(coreStore).getCurrentTheme()?.is_block_theme,
    []
  );
  let description;
  if (customDescription) {
    description = customDescription;
  } else if (isBlockBasedTheme) {
    description = __(
      "Customize the appearance of your website using the block editor."
    );
  } else {
    description = __(
      "Explore block styles and patterns to refine your site."
    );
  }
  return /* @__PURE__ */ jsx(
    SidebarNavigationScreen,
    {
      isRoot: true,
      title: __("Design"),
      description,
      content: /* @__PURE__ */ jsx(
        MainSidebarNavigationContent,
        {
          isBlockBasedTheme
        }
      )
    }
  );
}
export {
  MainSidebarNavigationContent,
  SidebarNavigationScreenMain as default
};
//# sourceMappingURL=index.mjs.map
