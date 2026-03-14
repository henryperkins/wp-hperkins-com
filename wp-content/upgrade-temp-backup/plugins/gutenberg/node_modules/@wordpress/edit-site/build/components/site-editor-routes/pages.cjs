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

// packages/edit-site/src/components/site-editor-routes/pages.js
var pages_exports = {};
__export(pages_exports, {
  pagesRoute: () => pagesRoute
});
module.exports = __toCommonJS(pages_exports);
var import_router = require("@wordpress/router");
var import_i18n = require("@wordpress/i18n");
var import_views = require("@wordpress/views");
var import_editor = __toESM(require("../editor/index.cjs"));
var import_sidebar_navigation_screen = __toESM(require("../sidebar-navigation-screen/index.cjs"));
var import_sidebar_navigation_screen_unsupported = __toESM(require("../sidebar-navigation-screen-unsupported/index.cjs"));
var import_sidebar_dataviews = __toESM(require("../sidebar-dataviews/index.cjs"));
var import_post_list = __toESM(require("../post-list/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_view_utils = require("../post-list/view-utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
async function isListView(query) {
  const { activeView = "all" } = query;
  const view = await (0, import_views.loadView)({
    kind: "postType",
    name: "page",
    slug: "default",
    defaultView: import_view_utils.DEFAULT_VIEW,
    activeViewOverrides: (0, import_view_utils.getActiveViewOverridesForTab)(activeView)
  });
  return view.type === "list";
}
function MobilePagesView() {
  const { query = {} } = useLocation();
  const { canvas = "view" } = query;
  return canvas === "edit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.default, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_list.default, { postType: "page" });
}
var pagesRoute = {
  name: "pages",
  path: "/page",
  areas: {
    sidebar({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_sidebar_navigation_screen.default,
        {
          title: (0, import_i18n.__)("Pages"),
          backPath: "/",
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_dataviews.default, { postType: "page" })
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_navigation_screen_unsupported.default, {});
    },
    content({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_list.default, { postType: "page" }) : void 0;
    },
    async preview({ query, siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      if (!isBlockTheme) {
        return void 0;
      }
      const isList = await isListView(query);
      return isList ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.default, {}) : void 0;
    },
    mobile({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobilePagesView, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_navigation_screen_unsupported.default, {});
    }
  },
  widths: {
    async content({ query }) {
      const isList = await isListView(query);
      return isList ? 380 : void 0;
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  pagesRoute
});
//# sourceMappingURL=pages.cjs.map
