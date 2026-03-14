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

// packages/edit-site/src/components/sidebar-navigation-screen-global-styles/index.js
var sidebar_navigation_screen_global_styles_exports = {};
__export(sidebar_navigation_screen_global_styles_exports, {
  SidebarNavigationItemGlobalStyles: () => SidebarNavigationItemGlobalStyles,
  default: () => SidebarNavigationScreenGlobalStyles
});
module.exports = __toCommonJS(sidebar_navigation_screen_global_styles_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_preferences = require("@wordpress/preferences");
var import_editor = require("@wordpress/editor");
var import_router = require("@wordpress/router");
var import_url = require("@wordpress/url");
var import_sidebar_navigation_screen = __toESM(require("../sidebar-navigation-screen/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_sidebar_navigation_item = __toESM(require("../sidebar-navigation-item/index.cjs"));
var import_global_styles_ui = require("@wordpress/global-styles-ui");
var import_sidebar_navigation_screen_details_footer = __toESM(require("../sidebar-navigation-screen-details-footer/index.cjs"));
var import_sidebar_navigation_screen_main = require("../sidebar-navigation-screen-main/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useLocation, useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function SidebarNavigationItemGlobalStyles(props) {
  const { name } = useLocation();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_sidebar_navigation_item.default,
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
  } = (0, import_global_styles_ui.useGlobalStylesRevisions)();
  const { openGeneralSidebar } = (0, import_data.useDispatch)(import_store.store);
  const { setStylesPath } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_editor.store));
  const { set: setPreference } = (0, import_data.useDispatch)(import_preferences.store);
  const openGlobalStyles = (0, import_element.useCallback)(async () => {
    history.navigate((0, import_url.addQueryArgs)(path, { canvas: "edit" }), {
      transition: "canvas-mode-edit-transition"
    });
    return Promise.all([
      setPreference("core", "distractionFree", false),
      openGeneralSidebar("edit-site/global-styles")
    ]);
  }, [path, history, openGeneralSidebar, setPreference]);
  const openRevisions = (0, import_element.useCallback)(async () => {
    await openGlobalStyles();
    setStylesPath("/revisions");
  }, [openGlobalStyles, setStylesPath]);
  const shouldShowGlobalStylesFooter = !!revisionsCount && !isLoadingRevisions;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_sidebar_navigation_screen.default,
    {
      title: (0, import_i18n.__)("Design"),
      isRoot: true,
      description: (0, import_i18n.__)(
        "Customize the appearance of your website using the block editor."
      ),
      content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_navigation_screen_main.MainSidebarNavigationContent, { activeItem: "styles-navigation-item" }),
      footer: shouldShowGlobalStylesFooter && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_sidebar_navigation_screen_details_footer.default,
        {
          record: revisions?.[0],
          revisionsCount,
          onClick: openRevisions
        }
      )
    }
  ) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SidebarNavigationItemGlobalStyles
});
//# sourceMappingURL=index.cjs.map
