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

// packages/edit-site/src/components/sidebar-navigation-screen-main/index.js
var sidebar_navigation_screen_main_exports = {};
__export(sidebar_navigation_screen_main_exports, {
  MainSidebarNavigationContent: () => MainSidebarNavigationContent,
  default: () => SidebarNavigationScreenMain
});
module.exports = __toCommonJS(sidebar_navigation_screen_main_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_sidebar_navigation_screen = __toESM(require("../sidebar-navigation-screen/index.cjs"));
var import_sidebar_navigation_item = __toESM(require("../sidebar-navigation-item/index.cjs"));
var import_sidebar_navigation_screen_global_styles = require("../sidebar-navigation-screen-global-styles/index.cjs");
var import_sidebar_navigation_screen_identity = require("../sidebar-navigation-screen-identity/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function MainSidebarNavigationContent({ isBlockBasedTheme = true }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalItemGroup, { className: "edit-site-sidebar-navigation-screen-main", children: [
    isBlockBasedTheme && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_sidebar_navigation_screen_global_styles.SidebarNavigationItemGlobalStyles,
        {
          to: "/styles",
          uid: "global-styles-navigation-item",
          icon: import_icons.styles,
          children: (0, import_i18n.__)("Styles")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_sidebar_navigation_item.default,
        {
          uid: "navigation-navigation-item",
          to: "/navigation",
          withChevron: true,
          icon: import_icons.navigation,
          children: (0, import_i18n.__)("Navigation")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_sidebar_navigation_screen_identity.SidebarNavigationItemIdentity,
        {
          to: "/identity",
          uid: "identity-navigation-item",
          icon: import_icons.siteLogo,
          children: (0, import_i18n.__)("Identity")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_sidebar_navigation_item.default,
        {
          uid: "page-navigation-item",
          to: "/page",
          withChevron: true,
          icon: import_icons.page,
          children: (0, import_i18n.__)("Pages")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_sidebar_navigation_item.default,
        {
          uid: "template-navigation-item",
          to: "/template",
          withChevron: true,
          icon: import_icons.layout,
          children: (0, import_i18n.__)("Templates")
        }
      )
    ] }),
    !isBlockBasedTheme && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_sidebar_navigation_item.default,
      {
        uid: "stylebook-navigation-item",
        to: "/stylebook",
        withChevron: true,
        icon: import_icons.styles,
        children: (0, import_i18n.__)("Styles")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_sidebar_navigation_item.default,
      {
        uid: "patterns-navigation-item",
        to: "/pattern",
        withChevron: true,
        icon: import_icons.symbol,
        children: (0, import_i18n.__)("Patterns")
      }
    )
  ] });
}
function SidebarNavigationScreenMain({ customDescription }) {
  const isBlockBasedTheme = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getCurrentTheme()?.is_block_theme,
    []
  );
  let description;
  if (customDescription) {
    description = customDescription;
  } else if (isBlockBasedTheme) {
    description = (0, import_i18n.__)(
      "Customize the appearance of your website using the block editor."
    );
  } else {
    description = (0, import_i18n.__)(
      "Explore block styles and patterns to refine your site."
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_sidebar_navigation_screen.default,
    {
      isRoot: true,
      title: (0, import_i18n.__)("Design"),
      description,
      content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        MainSidebarNavigationContent,
        {
          isBlockBasedTheme
        }
      )
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MainSidebarNavigationContent
});
//# sourceMappingURL=index.cjs.map
