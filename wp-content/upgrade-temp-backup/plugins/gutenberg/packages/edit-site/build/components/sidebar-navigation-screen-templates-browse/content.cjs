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

// packages/edit-site/src/components/sidebar-navigation-screen-templates-browse/content.js
var content_exports = {};
__export(content_exports, {
  default: () => DataviewsTemplatesSidebarContent
});
module.exports = __toCommonJS(content_exports);
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_router = require("@wordpress/router");
var import_url = require("@wordpress/url");
var import_sidebar_navigation_item = __toESM(require("../sidebar-navigation-item/index.cjs"));
var import_hooks = require("../page-templates/hooks.cjs");
var import_icons = require("@wordpress/icons");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var EMPTY_ARRAY = [];
function TemplateDataviewItem({ template, isActive }) {
  const { text, icon } = (0, import_hooks.useAddedBy)(template.type, template.id);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_sidebar_navigation_item.default,
    {
      to: (0, import_url.addQueryArgs)("/template", { activeView: text }),
      icon,
      "aria-current": isActive,
      children: text
    }
  );
}
function DataviewsTemplatesSidebarContent() {
  const {
    query: { activeView = "active" }
  } = useLocation();
  const { records } = (0, import_core_data.useEntityRecords)("root", "registeredTemplate", {
    // This should not be needed, the endpoint returns all registered
    // templates, but it's not possible right now to turn off pagination for
    // entity configs.
    per_page: -1
  });
  const firstItemPerAuthorText = (0, import_element.useMemo)(() => {
    const firstItemPerAuthor = records?.reduce((acc, template) => {
      const author = template.author_text;
      if (author && !acc[author]) {
        acc[author] = template;
      }
      return acc;
    }, {});
    return (firstItemPerAuthor && Object.values(firstItemPerAuthor)) ?? EMPTY_ARRAY;
  }, [records]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalItemGroup, { className: "edit-site-sidebar-navigation-screen-templates-browse", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_sidebar_navigation_item.default,
      {
        to: "/template",
        icon: import_icons.published,
        "aria-current": activeView === "active",
        children: (0, import_i18n.__)("Active templates")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_sidebar_navigation_item.default,
      {
        to: (0, import_url.addQueryArgs)("/template", { activeView: "user" }),
        icon: import_icons.commentAuthorAvatar,
        "aria-current": activeView === "user",
        // Let's avoid calling them "custom templates" to avoid
        // confusion. "Created" is closest to meaning database
        // templates, created by users.
        // https://developer.wordpress.org/themes/classic-themes/templates/page-template-files/#creating-custom-page-templates-for-global-use
        children: (0, import_i18n.__)("Created templates")
      }
    ),
    firstItemPerAuthorText.map((template) => {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        TemplateDataviewItem,
        {
          template,
          isActive: activeView === template.author_text
        },
        template.author_text
      );
    })
  ] });
}
//# sourceMappingURL=content.cjs.map
