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

// packages/editor/src/components/post-publish-panel/prepublish.js
var prepublish_exports = {};
__export(prepublish_exports, {
  default: () => prepublish_default
});
module.exports = __toCommonJS(prepublish_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_icons = require("@wordpress/icons");
var import_url = require("@wordpress/url");
var import_core_data = require("@wordpress/core-data");
var import_html_entities = require("@wordpress/html-entities");
var import_post_visibility = __toESM(require("../post-visibility/index.cjs"));
var import_label = __toESM(require("../post-visibility/label.cjs"));
var import_post_schedule = __toESM(require("../post-schedule/index.cjs"));
var import_label2 = __toESM(require("../post-schedule/label.cjs"));
var import_maybe_tags_panel = __toESM(require("./maybe-tags-panel.cjs"));
var import_maybe_post_format_panel = __toESM(require("./maybe-post-format-panel.cjs"));
var import_store = require("../../store/index.cjs");
var import_maybe_category_panel = __toESM(require("./maybe-category-panel.cjs"));
var import_maybe_upload_media = __toESM(require("./maybe-upload-media.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function PostPublishPanelPrepublish({ children }) {
  const {
    isBeingScheduled,
    isRequestingSiteIcon,
    hasPublishAction,
    siteIconUrl,
    siteTitle,
    siteHome
  } = (0, import_data.useSelect)((select) => {
    const { getCurrentPost, isEditedPostBeingScheduled } = select(import_store.store);
    const { getEntityRecord, isResolving } = select(import_core_data.store);
    const siteData = getEntityRecord("root", "__unstableBase", void 0) || {};
    return {
      hasPublishAction: getCurrentPost()._links?.["wp:action-publish"] ?? false,
      isBeingScheduled: isEditedPostBeingScheduled(),
      isRequestingSiteIcon: isResolving("getEntityRecord", [
        "root",
        "__unstableBase",
        void 0
      ]),
      siteIconUrl: siteData.site_icon_url,
      siteTitle: siteData.name,
      siteHome: siteData.home && (0, import_url.filterURLForDisplay)(siteData.home)
    };
  }, []);
  let siteIcon = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { className: "components-site-icon", size: "36px", icon: import_icons.wordpress });
  if (siteIconUrl) {
    siteIcon = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "img",
      {
        alt: (0, import_i18n.__)("Site Icon"),
        className: "components-site-icon",
        src: siteIconUrl
      }
    );
  }
  if (isRequestingSiteIcon) {
    siteIcon = null;
  }
  let prePublishTitle, prePublishBodyText;
  if (!hasPublishAction) {
    prePublishTitle = (0, import_i18n.__)("Are you ready to submit for review?");
    prePublishBodyText = (0, import_i18n.__)(
      "Your work will be reviewed and then approved."
    );
  } else if (isBeingScheduled) {
    prePublishTitle = (0, import_i18n.__)("Are you ready to schedule?");
    prePublishBodyText = (0, import_i18n.__)(
      "Your work will be published at the specified date and time."
    );
  } else {
    prePublishTitle = (0, import_i18n.__)("Are you ready to publish?");
    prePublishBodyText = (0, import_i18n.__)(
      "Double-check your settings before publishing."
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-post-publish-panel__prepublish", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: prePublishTitle }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: prePublishBodyText }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "components-site-card", children: [
      siteIcon,
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "components-site-info", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "components-site-name", children: (0, import_html_entities.decodeEntities)(siteTitle) || (0, import_i18n.__)("(Untitled)") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "components-site-home", children: siteHome })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_maybe_upload_media.default, {}),
    hasPublishAction && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.PanelBody,
        {
          initialOpen: false,
          title: [
            (0, import_i18n.__)("Visibility:"),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "span",
              {
                className: "editor-post-publish-panel__link",
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_label.default, {})
              },
              "label"
            )
          ],
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_visibility.default, {})
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.PanelBody,
        {
          initialOpen: false,
          title: [
            (0, import_i18n.__)("Publish:"),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "span",
              {
                className: "editor-post-publish-panel__link",
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_label2.default, {})
              },
              "label"
            )
          ],
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_schedule.default, {})
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_maybe_post_format_panel.default, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_maybe_tags_panel.default, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_maybe_category_panel.default, {}),
    children
  ] });
}
var prepublish_default = PostPublishPanelPrepublish;
//# sourceMappingURL=prepublish.cjs.map
