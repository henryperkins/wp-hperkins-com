// packages/edit-site/src/components/sidebar-navigation-screen-global-styles/index.js
import { __ } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { store as preferencesStore } from "@wordpress/preferences";
import { store as editorStore } from "@wordpress/editor";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { addQueryArgs } from "@wordpress/url";
import SidebarNavigationScreen from "../sidebar-navigation-screen/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { store as editSiteStore } from "../../store/index.mjs";
import SidebarNavigationItem from "../sidebar-navigation-item/index.mjs";
import { useGlobalStylesRevisions } from "@wordpress/global-styles-ui";
import SidebarNavigationScreenDetailsFooter from "../sidebar-navigation-screen-details-footer/index.mjs";
import { MainSidebarNavigationContent } from "../sidebar-navigation-screen-main/index.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
var { useLocation, useHistory } = unlock(routerPrivateApis);
function SidebarNavigationItemGlobalStyles(props) {
  const { name } = useLocation();
  return /* @__PURE__ */ jsx(
    SidebarNavigationItem,
    {
      ...props,
      "aria-current": name === "styles"
    }
  );
}
function SidebarNavigationScreenGlobalStyles() {
  const history = useHistory();
  const { path } = useLocation();
  const {
    revisions,
    isLoading: isLoadingRevisions,
    revisionsCount
  } = useGlobalStylesRevisions();
  const { openGeneralSidebar } = useDispatch(editSiteStore);
  const { setStylesPath } = unlock(useDispatch(editorStore));
  const { set: setPreference } = useDispatch(preferencesStore);
  const openGlobalStyles = useCallback(async () => {
    history.navigate(addQueryArgs(path, { canvas: "edit" }), {
      transition: "canvas-mode-edit-transition"
    });
    return Promise.all([
      setPreference("core", "distractionFree", false),
      openGeneralSidebar("edit-site/global-styles")
    ]);
  }, [path, history, openGeneralSidebar, setPreference]);
  const openRevisions = useCallback(async () => {
    await openGlobalStyles();
    setStylesPath("/revisions");
  }, [openGlobalStyles, setStylesPath]);
  const shouldShowGlobalStylesFooter = !!revisionsCount && !isLoadingRevisions;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    SidebarNavigationScreen,
    {
      title: __("Design"),
      isRoot: true,
      description: __(
        "Customize the appearance of your website using the block editor."
      ),
      content: /* @__PURE__ */ jsx(MainSidebarNavigationContent, { activeItem: "styles-navigation-item" }),
      footer: shouldShowGlobalStylesFooter && /* @__PURE__ */ jsx(
        SidebarNavigationScreenDetailsFooter,
        {
          record: revisions?.[0],
          revisionsCount,
          onClick: openRevisions
        }
      )
    }
  ) });
}
export {
  SidebarNavigationItemGlobalStyles,
  SidebarNavigationScreenGlobalStyles as default
};
//# sourceMappingURL=index.mjs.map
