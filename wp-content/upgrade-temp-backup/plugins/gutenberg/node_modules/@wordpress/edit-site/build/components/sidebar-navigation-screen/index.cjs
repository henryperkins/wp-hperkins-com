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

// packages/edit-site/src/components/sidebar-navigation-screen/index.js
var sidebar_navigation_screen_exports = {};
__export(sidebar_navigation_screen_exports, {
  default: () => SidebarNavigationScreen
});
module.exports = __toCommonJS(sidebar_navigation_screen_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_router = require("@wordpress/router");
var import_element = require("@wordpress/element");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_sidebar_button = __toESM(require("../sidebar-button/index.cjs"));
var import_is_previewing_theme = require("../../utils/is-previewing-theme.cjs");
var import_sidebar = require("../sidebar/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useHistory, useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function SidebarNavigationScreen({
  isRoot,
  title,
  actions,
  content,
  footer,
  description,
  backPath: backPathProp
}) {
  const { dashboardLink, dashboardLinkText, previewingThemeName } = (0, import_data.useSelect)(
    (select) => {
      const { getSettings } = (0, import_lock_unlock.unlock)(select(import_store.store));
      const currentlyPreviewingThemeId = (0, import_is_previewing_theme.currentlyPreviewingTheme)();
      return {
        dashboardLink: getSettings().__experimentalDashboardLink,
        dashboardLinkText: getSettings().__experimentalDashboardLinkText,
        // Do not call `getTheme` with null, it will cause a request to
        // the server.
        previewingThemeName: currentlyPreviewingThemeId ? select(import_core_data.store).getTheme(currentlyPreviewingThemeId)?.name?.rendered : void 0
      };
    },
    []
  );
  const location = useLocation();
  const history = useHistory();
  const { navigate } = (0, import_element.useContext)(import_sidebar.SidebarNavigationContext);
  const backPath = backPathProp ?? location.state?.backPath;
  const icon = (0, import_i18n.isRTL)() ? import_icons.chevronRight : import_icons.chevronLeft;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_components.__experimentalVStack,
      {
        className: (0, import_clsx.default)("edit-site-sidebar-navigation-screen__main", {
          "has-footer": !!footer
        }),
        spacing: 0,
        justify: "flex-start",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            import_components.__experimentalHStack,
            {
              spacing: 3,
              alignment: "flex-start",
              className: "edit-site-sidebar-navigation-screen__title-icon",
              children: [
                !isRoot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_sidebar_button.default,
                  {
                    onClick: () => {
                      history.navigate(backPath);
                      navigate("back");
                    },
                    icon,
                    label: (0, import_i18n.__)("Back"),
                    showTooltip: false
                  }
                ),
                isRoot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_sidebar_button.default,
                  {
                    icon,
                    label: dashboardLinkText || (0, import_i18n.__)("Go to the Dashboard"),
                    href: dashboardLink
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.__experimentalHeading,
                  {
                    className: "edit-site-sidebar-navigation-screen__title",
                    color: "#e0e0e0",
                    level: 1,
                    size: 20,
                    children: !(0, import_is_previewing_theme.isPreviewingTheme)() ? title : (0, import_i18n.sprintf)(
                      /* translators: 1: theme name. 2: title */
                      (0, import_i18n.__)("Previewing %1$s: %2$s"),
                      previewingThemeName,
                      title
                    )
                  }
                ),
                actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-site-sidebar-navigation-screen__actions", children: actions })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "edit-site-sidebar-navigation-screen__content", children: [
            description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-site-sidebar-navigation-screen__description", children: description }),
            content
          ] })
        ]
      }
    ),
    footer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", { className: "edit-site-sidebar-navigation-screen__footer", children: footer })
  ] });
}
//# sourceMappingURL=index.cjs.map
