// packages/edit-site/src/components/sidebar-navigation-screen/index.js
import clsx from "clsx";
import {
  __experimentalHStack as HStack,
  __experimentalHeading as Heading,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { isRTL, __, sprintf } from "@wordpress/i18n";
import { chevronRight, chevronLeft } from "@wordpress/icons";
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { useContext } from "@wordpress/element";
import { store as editSiteStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import SidebarButton from "../sidebar-button/index.mjs";
import {
  isPreviewingTheme,
  currentlyPreviewingTheme
} from "../../utils/is-previewing-theme.mjs";
import { SidebarNavigationContext } from "../sidebar/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useHistory, useLocation } = unlock(routerPrivateApis);
function SidebarNavigationScreen({
  isRoot,
  title,
  actions,
  content,
  footer,
  description,
  backPath: backPathProp
}) {
  const { dashboardLink, dashboardLinkText, previewingThemeName } = useSelect(
    (select) => {
      const { getSettings } = unlock(select(editSiteStore));
      const currentlyPreviewingThemeId = currentlyPreviewingTheme();
      return {
        dashboardLink: getSettings().__experimentalDashboardLink,
        dashboardLinkText: getSettings().__experimentalDashboardLinkText,
        // Do not call `getTheme` with null, it will cause a request to
        // the server.
        previewingThemeName: currentlyPreviewingThemeId ? select(coreStore).getTheme(currentlyPreviewingThemeId)?.name?.rendered : void 0
      };
    },
    []
  );
  const location = useLocation();
  const history = useHistory();
  const { navigate } = useContext(SidebarNavigationContext);
  const backPath = backPathProp ?? location.state?.backPath;
  const icon = isRTL() ? chevronRight : chevronLeft;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      VStack,
      {
        className: clsx("edit-site-sidebar-navigation-screen__main", {
          "has-footer": !!footer
        }),
        spacing: 0,
        justify: "flex-start",
        children: [
          /* @__PURE__ */ jsxs(
            HStack,
            {
              spacing: 3,
              alignment: "flex-start",
              className: "edit-site-sidebar-navigation-screen__title-icon",
              children: [
                !isRoot && /* @__PURE__ */ jsx(
                  SidebarButton,
                  {
                    onClick: () => {
                      history.navigate(backPath);
                      navigate("back");
                    },
                    icon,
                    label: __("Back"),
                    showTooltip: false
                  }
                ),
                isRoot && /* @__PURE__ */ jsx(
                  SidebarButton,
                  {
                    icon,
                    label: dashboardLinkText || __("Go to the Dashboard"),
                    href: dashboardLink
                  }
                ),
                /* @__PURE__ */ jsx(
                  Heading,
                  {
                    className: "edit-site-sidebar-navigation-screen__title",
                    color: "#e0e0e0",
                    level: 1,
                    size: 20,
                    children: !isPreviewingTheme() ? title : sprintf(
                      /* translators: 1: theme name. 2: title */
                      __("Previewing %1$s: %2$s"),
                      previewingThemeName,
                      title
                    )
                  }
                ),
                actions && /* @__PURE__ */ jsx("div", { className: "edit-site-sidebar-navigation-screen__actions", children: actions })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "edit-site-sidebar-navigation-screen__content", children: [
            description && /* @__PURE__ */ jsx("div", { className: "edit-site-sidebar-navigation-screen__description", children: description }),
            content
          ] })
        ]
      }
    ),
    footer && /* @__PURE__ */ jsx("footer", { className: "edit-site-sidebar-navigation-screen__footer", children: footer })
  ] });
}
export {
  SidebarNavigationScreen as default
};
//# sourceMappingURL=index.mjs.map
