// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menu/single-navigation-menu.js
import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";
import { SidebarNavigationScreenWrapper } from "../sidebar-navigation-screen-navigation-menus/index.mjs";
import ScreenNavigationMoreMenu from "./more-menu.mjs";
import NavigationMenuEditor from "./navigation-menu-editor.mjs";
import buildNavigationLabel from "../sidebar-navigation-screen-navigation-menus/build-navigation-label.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
function SingleNavigationMenu({
  navigationMenu,
  backPath,
  handleDelete,
  handleDuplicate,
  handleSave
}) {
  const menuTitle = navigationMenu?.title?.rendered;
  return /* @__PURE__ */ jsx(
    SidebarNavigationScreenWrapper,
    {
      actions: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
        ScreenNavigationMoreMenu,
        {
          menuId: navigationMenu?.id,
          menuTitle: decodeEntities(menuTitle),
          onDelete: handleDelete,
          onSave: handleSave,
          onDuplicate: handleDuplicate
        }
      ) }),
      backPath,
      title: buildNavigationLabel(
        navigationMenu?.title,
        navigationMenu?.id,
        navigationMenu?.status
      ),
      description: __(
        "Navigation Menus are a curated collection of blocks that allow visitors to get around your site."
      ),
      children: /* @__PURE__ */ jsx(NavigationMenuEditor, { navigationMenuId: navigationMenu?.id })
    }
  );
}
export {
  SingleNavigationMenu as default
};
//# sourceMappingURL=single-navigation-menu.mjs.map
