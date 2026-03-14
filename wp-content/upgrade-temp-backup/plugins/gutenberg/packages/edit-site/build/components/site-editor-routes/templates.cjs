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

// packages/edit-site/src/components/site-editor-routes/templates.js
var templates_exports = {};
__export(templates_exports, {
  templatesRoute: () => templatesRoute
});
module.exports = __toCommonJS(templates_exports);
var import_views = require("@wordpress/views");
var import_editor = __toESM(require("../editor/index.cjs"));
var import_sidebar_navigation_screen_templates_browse = __toESM(require("../sidebar-navigation-screen-templates-browse/index.cjs"));
var import_sidebar_navigation_screen_unsupported = __toESM(require("../sidebar-navigation-screen-unsupported/index.cjs"));
var import_page_templates = __toESM(require("../page-templates/index.cjs"));
var import_index_legacy = __toESM(require("../page-templates/index-legacy.cjs"));
var import_view_utils = require("../page-templates/view-utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
async function isTemplateListView(query) {
  const { activeView = "active" } = query;
  const view = await (0, import_views.loadView)({
    kind: "postType",
    name: "wp_template",
    slug: "default",
    defaultView: import_view_utils.DEFAULT_VIEW,
    activeViewOverrides: (0, import_view_utils.getActiveViewOverridesForTab)(activeView)
  });
  return view.type === "list";
}
var templatesRoute = {
  name: "templates",
  path: "/template",
  areas: {
    sidebar({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_navigation_screen_templates_browse.default, { backPath: "/" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_navigation_screen_unsupported.default, {});
    },
    content({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      if (!isBlockTheme) {
        return void 0;
      }
      return window?.__experimentalTemplateActivate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_page_templates.default, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_index_legacy.default, {});
    },
    async preview({ query, siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      if (!isBlockTheme) {
        return void 0;
      }
      const isListView = await isTemplateListView(query);
      return isListView ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.default, {}) : void 0;
    },
    mobile({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      if (!isBlockTheme) {
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_navigation_screen_unsupported.default, {});
      }
      const isTemplateActivateEnabled = typeof window !== "undefined" && window.__experimentalTemplateActivate;
      return isTemplateActivateEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_page_templates.default, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_index_legacy.default, {});
    }
  },
  widths: {
    async content({ query }) {
      const isListView = await isTemplateListView(query);
      return isListView ? 380 : void 0;
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  templatesRoute
});
//# sourceMappingURL=templates.cjs.map
