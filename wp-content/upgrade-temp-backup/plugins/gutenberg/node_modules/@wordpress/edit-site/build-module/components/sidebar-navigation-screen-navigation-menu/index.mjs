// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menu/index.js
import { useEntityRecord, store as coreStore } from "@wordpress/core-data";
import { Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { decodeEntities } from "@wordpress/html-entities";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { SidebarNavigationScreenWrapper } from "../sidebar-navigation-screen-navigation-menus/index.mjs";
import ScreenNavigationMoreMenu from "./more-menu.mjs";
import SingleNavigationMenu from "./single-navigation-menu.mjs";
import useNavigationMenuHandlers from "./use-navigation-menu-handlers.mjs";
import buildNavigationLabel from "../sidebar-navigation-screen-navigation-menus/build-navigation-label.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { useLocation } = unlock(routerPrivateApis);
var postType = `wp_navigation`;
function SidebarNavigationScreenNavigationMenu({ backPath }) {
  const {
    params: { postId }
  } = useLocation();
  const { record: navigationMenu, isResolving } = useEntityRecord(
    "postType",
    postType,
    postId
  );
  const { isSaving, isDeleting } = useSelect(
    (select) => {
      const { isSavingEntityRecord, isDeletingEntityRecord } = select(coreStore);
      return {
        isSaving: isSavingEntityRecord("postType", postType, postId),
        isDeleting: isDeletingEntityRecord(
          "postType",
          postType,
          postId
        )
      };
    },
    [postId]
  );
  const isLoading = isResolving || isSaving || isDeleting;
  const menuTitle = navigationMenu?.title?.rendered || navigationMenu?.slug;
  const { handleSave, handleDelete, handleDuplicate } = useNavigationMenuHandlers();
  const _handleDelete = () => handleDelete(navigationMenu);
  const _handleSave = (edits) => handleSave(navigationMenu, edits);
  const _handleDuplicate = () => handleDuplicate(navigationMenu);
  if (isLoading) {
    return /* @__PURE__ */ jsx(
      SidebarNavigationScreenWrapper,
      {
        description: __(
          "Navigation Menus are a curated collection of blocks that allow visitors to get around your site."
        ),
        backPath,
        children: /* @__PURE__ */ jsx(Spinner, { className: "edit-site-sidebar-navigation-screen-navigation-menus__loading" })
      }
    );
  }
  if (!isLoading && !navigationMenu) {
    return /* @__PURE__ */ jsx(
      SidebarNavigationScreenWrapper,
      {
        description: __("Navigation Menu missing."),
        backPath
      }
    );
  }
  if (!navigationMenu?.content?.raw) {
    return /* @__PURE__ */ jsx(
      SidebarNavigationScreenWrapper,
      {
        actions: /* @__PURE__ */ jsx(
          ScreenNavigationMoreMenu,
          {
            menuId: navigationMenu?.id,
            menuTitle: decodeEntities(menuTitle),
            onDelete: _handleDelete,
            onSave: _handleSave,
            onDuplicate: _handleDuplicate
          }
        ),
        backPath,
        title: buildNavigationLabel(
          navigationMenu?.title,
          navigationMenu?.id,
          navigationMenu?.status
        ),
        description: __("This Navigation Menu is empty.")
      }
    );
  }
  return /* @__PURE__ */ jsx(
    SingleNavigationMenu,
    {
      navigationMenu,
      backPath,
      handleDelete: _handleDelete,
      handleSave: _handleSave,
      handleDuplicate: _handleDuplicate
    }
  );
}
export {
  SidebarNavigationScreenNavigationMenu as default,
  postType
};
//# sourceMappingURL=index.mjs.map
