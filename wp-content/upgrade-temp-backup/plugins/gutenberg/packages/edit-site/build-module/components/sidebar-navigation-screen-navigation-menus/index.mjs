// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menus/index.js
import { __, _x, sprintf } from "@wordpress/i18n";
import { useEntityRecords, store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { decodeEntities } from "@wordpress/html-entities";
import {
  __experimentalItemGroup as ItemGroup,
  Spinner
} from "@wordpress/components";
import { navigation } from "@wordpress/icons";
import SidebarNavigationScreen from "../sidebar-navigation-screen/index.mjs";
import SidebarNavigationItem from "../sidebar-navigation-item/index.mjs";
import { PRELOADED_NAVIGATION_MENUS_QUERY } from "./constants.mjs";
import SingleNavigationMenu from "../sidebar-navigation-screen-navigation-menu/single-navigation-menu.mjs";
import useNavigationMenuHandlers from "../sidebar-navigation-screen-navigation-menu/use-navigation-menu-handlers.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { NAVIGATION_POST_TYPE } from "../../utils/constants.mjs";
import { jsx } from "react/jsx-runtime";
function buildMenuLabel(title, id, status) {
  if (!title) {
    return sprintf(__("(no title %s)"), id);
  }
  if (status === "publish") {
    return decodeEntities(title);
  }
  return sprintf(
    // translators: 1: title of the menu. 2: status of the menu (draft, pending, etc.).
    _x("%1$s (%2$s)", "menu label"),
    decodeEntities(title),
    status
  );
}
function SidebarNavigationScreenNavigationMenus({ backPath }) {
  const {
    records: navigationMenus,
    isResolving: isResolvingNavigationMenus,
    hasResolved: hasResolvedNavigationMenus
  } = useEntityRecords(
    "postType",
    NAVIGATION_POST_TYPE,
    PRELOADED_NAVIGATION_MENUS_QUERY
  );
  const isLoading = isResolvingNavigationMenus && !hasResolvedNavigationMenus;
  const { getNavigationFallbackId } = unlock(useSelect(coreStore));
  const isCreatingNavigationFallback = useSelect(
    (select) => select(coreStore).isResolving("getNavigationFallbackId"),
    []
  );
  const firstNavigationMenu = navigationMenus?.[0];
  if (!firstNavigationMenu && !isResolvingNavigationMenus && hasResolvedNavigationMenus && // Ensure a fallback navigation is created only once
  !isCreatingNavigationFallback) {
    getNavigationFallbackId();
  }
  const { handleSave, handleDelete, handleDuplicate } = useNavigationMenuHandlers();
  const hasNavigationMenus = !!navigationMenus?.length;
  if (isLoading) {
    return /* @__PURE__ */ jsx(SidebarNavigationScreenWrapper, { backPath, children: /* @__PURE__ */ jsx(Spinner, { className: "edit-site-sidebar-navigation-screen-navigation-menus__loading" }) });
  }
  if (!isLoading && !hasNavigationMenus) {
    return /* @__PURE__ */ jsx(
      SidebarNavigationScreenWrapper,
      {
        description: __("No Navigation Menus found."),
        backPath
      }
    );
  }
  if (navigationMenus?.length === 1) {
    return /* @__PURE__ */ jsx(
      SingleNavigationMenu,
      {
        navigationMenu: firstNavigationMenu,
        backPath,
        handleDelete: () => handleDelete(firstNavigationMenu),
        handleDuplicate: () => handleDuplicate(firstNavigationMenu),
        handleSave: (edits) => handleSave(firstNavigationMenu, edits)
      }
    );
  }
  return /* @__PURE__ */ jsx(SidebarNavigationScreenWrapper, { backPath, children: /* @__PURE__ */ jsx(ItemGroup, { className: "edit-site-sidebar-navigation-screen-navigation-menus", children: navigationMenus?.map(({ id, title, status }, index) => /* @__PURE__ */ jsx(
    NavMenuItem,
    {
      postId: id,
      withChevron: true,
      icon: navigation,
      children: buildMenuLabel(title?.rendered, index + 1, status)
    },
    id
  )) }) });
}
function SidebarNavigationScreenWrapper({
  children,
  actions,
  title,
  description,
  backPath
}) {
  return /* @__PURE__ */ jsx(
    SidebarNavigationScreen,
    {
      title: title || __("Navigation"),
      actions,
      description: description || __("Manage your Navigation Menus."),
      backPath,
      content: children
    }
  );
}
var NavMenuItem = ({ postId, ...props }) => {
  return /* @__PURE__ */ jsx(
    SidebarNavigationItem,
    {
      to: `/wp_navigation/${postId}`,
      ...props
    }
  );
};
export {
  SidebarNavigationScreenWrapper,
  SidebarNavigationScreenNavigationMenus as default
};
//# sourceMappingURL=index.mjs.map
