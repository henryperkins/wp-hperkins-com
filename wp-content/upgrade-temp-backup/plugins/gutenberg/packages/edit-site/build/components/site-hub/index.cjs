"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-site/src/components/site-hub/index.js
var site_hub_exports = {};
__export(site_hub_exports, {
  SiteHubMobile: () => SiteHubMobile,
  default: () => site_hub_default
});
module.exports = __toCommonJS(site_hub_exports);
var import_clsx = __toESM(require("clsx"));
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_core_data = require("@wordpress/core-data");
var import_html_entities = require("@wordpress/html-entities");
var import_element = require("@wordpress/element");
var import_icons = require("@wordpress/icons");
var import_commands = require("@wordpress/commands");
var import_keycodes = require("@wordpress/keycodes");
var import_url = require("@wordpress/url");
var import_router = require("@wordpress/router");
var import_store = require("../../store/index.cjs");
var import_site_icon = __toESM(require("../site-icon/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_sidebar = require("../sidebar/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useLocation, useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var SiteHub = (0, import_element.memo)(
  (0, import_element.forwardRef)(({ isTransparent }, ref) => {
    const { dashboardLink, homeUrl, siteTitle } = (0, import_data.useSelect)((select) => {
      const { getSettings } = (0, import_lock_unlock.unlock)(select(import_store.store));
      const { getEntityRecord } = select(import_core_data.store);
      const _site = getEntityRecord("root", "site");
      return {
        dashboardLink: getSettings().__experimentalDashboardLink,
        homeUrl: getEntityRecord("root", "__unstableBase")?.home,
        siteTitle: !_site?.title && !!_site?.url ? (0, import_url.filterURLForDisplay)(_site?.url) : _site?.title
      };
    }, []);
    const { open: openCommandCenter } = (0, import_data.useDispatch)(import_commands.store);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-site-site-hub", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "flex-start", spacing: "0", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "div",
        {
          className: (0, import_clsx.default)(
            "edit-site-site-hub__view-mode-toggle-container",
            {
              "has-transparent-background": isTransparent
            }
          ),
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              ref,
              href: dashboardLink,
              label: (0, import_i18n.__)("Go to the Dashboard"),
              className: "edit-site-layout__view-mode-toggle",
              style: {
                transform: "scale(0.5333) translateX(-4px)",
                // Offset to position the icon 12px from viewport edge
                borderRadius: 4
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_site_icon.default, { className: "edit-site-layout__view-mode-toggle-icon" })
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-site-site-hub__title", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            variant: "link",
            href: homeUrl,
            target: "_blank",
            children: [
              (0, import_html_entities.decodeEntities)(siteTitle),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.VisuallyHidden, {
                as: "span",
                /* translators: accessibility text */
                children: (0, import_i18n.__)("(opens in a new tab)")
              })
            ]
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalHStack,
          {
            spacing: 0,
            expanded: false,
            className: "edit-site-site-hub__actions",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Button,
              {
                size: "compact",
                className: "edit-site-site-hub_toggle-command-center",
                icon: import_icons.search,
                onClick: () => openCommandCenter(),
                label: (0, import_i18n.__)("Open command palette"),
                shortcut: import_keycodes.displayShortcut.primary("k")
              }
            )
          }
        )
      ] })
    ] }) });
  })
);
var site_hub_default = SiteHub;
var SiteHubMobile = (0, import_element.memo)(
  (0, import_element.forwardRef)(({ isTransparent }, ref) => {
    const { path } = useLocation();
    const history = useHistory();
    const { navigate } = (0, import_element.useContext)(import_sidebar.SidebarNavigationContext);
    const {
      dashboardLink,
      homeUrl,
      siteTitle,
      isBlockTheme,
      isClassicThemeWithStyleBookSupport
    } = (0, import_data.useSelect)((select) => {
      const { getSettings } = (0, import_lock_unlock.unlock)(select(import_store.store));
      const { getEntityRecord, getCurrentTheme } = select(import_core_data.store);
      const _site = getEntityRecord("root", "site");
      const currentTheme = getCurrentTheme();
      const settings = getSettings();
      const supportsEditorStyles = currentTheme?.theme_supports["editor-styles"];
      const hasThemeJson = settings.supportsLayout;
      return {
        dashboardLink: settings.__experimentalDashboardLink,
        homeUrl: getEntityRecord("root", "__unstableBase")?.home,
        siteTitle: !_site?.title && !!_site?.url ? (0, import_url.filterURLForDisplay)(_site?.url) : _site?.title,
        isBlockTheme: currentTheme?.is_block_theme,
        isClassicThemeWithStyleBookSupport: !currentTheme?.is_block_theme && (supportsEditorStyles || hasThemeJson)
      };
    }, []);
    const { open: openCommandCenter } = (0, import_data.useDispatch)(import_commands.store);
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
      label: !!backPath ? (0, import_i18n.__)("Go to Site Editor") : (0, import_i18n.__)("Go to the Dashboard"),
      onClick: !!backPath ? () => {
        history.navigate(backPath);
        navigate("back");
      } : void 0
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-site-site-hub", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "flex-start", spacing: "0", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "div",
        {
          className: (0, import_clsx.default)(
            "edit-site-site-hub__view-mode-toggle-container",
            {
              "has-transparent-background": isTransparent
            }
          ),
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              ref,
              className: "edit-site-layout__view-mode-toggle",
              style: {
                transform: "scale(0.5)",
                borderRadius: 4
              },
              ...backButtonProps,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_site_icon.default, { className: "edit-site-layout__view-mode-toggle-icon" })
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-site-site-hub__title", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            variant: "link",
            href: homeUrl,
            target: "_blank",
            label: (0, import_i18n.__)("View site (opens in a new tab)"),
            children: (0, import_html_entities.decodeEntities)(siteTitle)
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalHStack,
          {
            spacing: 0,
            expanded: false,
            className: "edit-site-site-hub__actions",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Button,
              {
                __next40pxDefaultSize: true,
                className: "edit-site-site-hub_toggle-command-center",
                icon: import_icons.search,
                onClick: () => openCommandCenter(),
                label: (0, import_i18n.__)("Open command palette"),
                shortcut: import_keycodes.displayShortcut.primary("k")
              }
            )
          }
        )
      ] })
    ] }) });
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SiteHubMobile
});
//# sourceMappingURL=index.cjs.map
