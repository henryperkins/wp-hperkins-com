// packages/edit-site/src/components/site-hub/index.js
import clsx from "clsx";
import { useSelect, useDispatch } from "@wordpress/data";
import {
  Button,
  __experimentalHStack as HStack,
  VisuallyHidden
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { store as coreStore } from "@wordpress/core-data";
import { decodeEntities } from "@wordpress/html-entities";
import { memo, forwardRef, useContext } from "@wordpress/element";
import { search } from "@wordpress/icons";
import { store as commandsStore } from "@wordpress/commands";
import { displayShortcut } from "@wordpress/keycodes";
import { filterURLForDisplay } from "@wordpress/url";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { store as editSiteStore } from "../../store/index.mjs";
import SiteIcon from "../site-icon/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { SidebarNavigationContext } from "../sidebar/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { useLocation, useHistory } = unlock(routerPrivateApis);
var SiteHub = memo(
  forwardRef(({ isTransparent }, ref) => {
    const { dashboardLink, homeUrl, siteTitle } = useSelect((select) => {
      const { getSettings } = unlock(select(editSiteStore));
      const { getEntityRecord } = select(coreStore);
      const _site = getEntityRecord("root", "site");
      return {
        dashboardLink: getSettings().__experimentalDashboardLink,
        homeUrl: getEntityRecord("root", "__unstableBase")?.home,
        siteTitle: !_site?.title && !!_site?.url ? filterURLForDisplay(_site?.url) : _site?.title
      };
    }, []);
    const { open: openCommandCenter } = useDispatch(commandsStore);
    return /* @__PURE__ */ jsx("div", { className: "edit-site-site-hub", children: /* @__PURE__ */ jsxs(HStack, { justify: "flex-start", spacing: "0", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: clsx(
            "edit-site-site-hub__view-mode-toggle-container",
            {
              "has-transparent-background": isTransparent
            }
          ),
          children: /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              ref,
              href: dashboardLink,
              label: __("Go to the Dashboard"),
              className: "edit-site-layout__view-mode-toggle",
              style: {
                transform: "scale(0.5333) translateX(-4px)",
                // Offset to position the icon 12px from viewport edge
                borderRadius: 4
              },
              children: /* @__PURE__ */ jsx(SiteIcon, { className: "edit-site-layout__view-mode-toggle-icon" })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs(HStack, { children: [
        /* @__PURE__ */ jsx("div", { className: "edit-site-site-hub__title", children: /* @__PURE__ */ jsxs(
          Button,
          {
            __next40pxDefaultSize: true,
            variant: "link",
            href: homeUrl,
            target: "_blank",
            children: [
              decodeEntities(siteTitle),
              /* @__PURE__ */ jsx(VisuallyHidden, {
                as: "span",
                /* translators: accessibility text */
                children: __("(opens in a new tab)")
              })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(
          HStack,
          {
            spacing: 0,
            expanded: false,
            className: "edit-site-site-hub__actions",
            children: /* @__PURE__ */ jsx(
              Button,
              {
                size: "compact",
                className: "edit-site-site-hub_toggle-command-center",
                icon: search,
                onClick: () => openCommandCenter(),
                label: __("Open command palette"),
                shortcut: displayShortcut.primary("k")
              }
            )
          }
        )
      ] })
    ] }) });
  })
);
var site_hub_default = SiteHub;
var SiteHubMobile = memo(
  forwardRef(({ isTransparent }, ref) => {
    const { path } = useLocation();
    const history = useHistory();
    const { navigate } = useContext(SidebarNavigationContext);
    const {
      dashboardLink,
      homeUrl,
      siteTitle,
      isBlockTheme,
      isClassicThemeWithStyleBookSupport
    } = useSelect((select) => {
      const { getSettings } = unlock(select(editSiteStore));
      const { getEntityRecord, getCurrentTheme } = select(coreStore);
      const _site = getEntityRecord("root", "site");
      const currentTheme = getCurrentTheme();
      const settings = getSettings();
      const supportsEditorStyles = currentTheme?.theme_supports["editor-styles"];
      const hasThemeJson = settings.supportsLayout;
      return {
        dashboardLink: settings.__experimentalDashboardLink,
        homeUrl: getEntityRecord("root", "__unstableBase")?.home,
        siteTitle: !_site?.title && !!_site?.url ? filterURLForDisplay(_site?.url) : _site?.title,
        isBlockTheme: currentTheme?.is_block_theme,
        isClassicThemeWithStyleBookSupport: !currentTheme?.is_block_theme && (supportsEditorStyles || hasThemeJson)
      };
    }, []);
    const { open: openCommandCenter } = useDispatch(commandsStore);
    let backPath;
    if (path !== "/") {
      if (isBlockTheme || isClassicThemeWithStyleBookSupport) {
        backPath = "/";
      } else if (path !== "/pattern") {
        backPath = "/pattern";
      }
    }
    const backButtonProps = {
      href: !!backPath ? void 0 : dashboardLink,
      label: !!backPath ? __("Go to Site Editor") : __("Go to the Dashboard"),
      onClick: !!backPath ? () => {
        history.navigate(backPath);
        navigate("back");
      } : void 0
    };
    return /* @__PURE__ */ jsx("div", { className: "edit-site-site-hub", children: /* @__PURE__ */ jsxs(HStack, { justify: "flex-start", spacing: "0", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: clsx(
            "edit-site-site-hub__view-mode-toggle-container",
            {
              "has-transparent-background": isTransparent
            }
          ),
          children: /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              ref,
              className: "edit-site-layout__view-mode-toggle",
              style: {
                transform: "scale(0.5)",
                borderRadius: 4
              },
              ...backButtonProps,
              children: /* @__PURE__ */ jsx(SiteIcon, { className: "edit-site-layout__view-mode-toggle-icon" })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs(HStack, { children: [
        /* @__PURE__ */ jsx("div", { className: "edit-site-site-hub__title", children: /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            variant: "link",
            href: homeUrl,
            target: "_blank",
            label: __("View site (opens in a new tab)"),
            children: decodeEntities(siteTitle)
          }
        ) }),
        /* @__PURE__ */ jsx(
          HStack,
          {
            spacing: 0,
            expanded: false,
            className: "edit-site-site-hub__actions",
            children: /* @__PURE__ */ jsx(
              Button,
              {
                __next40pxDefaultSize: true,
                className: "edit-site-site-hub_toggle-command-center",
                icon: search,
                onClick: () => openCommandCenter(),
                label: __("Open command palette"),
                shortcut: displayShortcut.primary("k")
              }
            )
          }
        )
      ] })
    ] }) });
  })
);
export {
  SiteHubMobile,
  site_hub_default as default
};
//# sourceMappingURL=index.mjs.map
