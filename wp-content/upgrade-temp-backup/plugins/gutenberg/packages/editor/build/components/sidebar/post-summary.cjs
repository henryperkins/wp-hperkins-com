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

// packages/editor/src/components/sidebar/post-summary.js
var post_summary_exports = {};
__export(post_summary_exports, {
  default: () => PostSummary
});
module.exports = __toCommonJS(post_summary_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_url = require("@wordpress/url");
var import_dataform_post_summary = __toESM(require("./dataform-post-summary.cjs"));
var import_plugin_post_status_info = __toESM(require("../plugin-post-status-info/index.cjs"));
var import_panel = __toESM(require("../post-author/panel.cjs"));
var import_post_card_panel = __toESM(require("../post-card-panel/index.cjs"));
var import_post_content_information = __toESM(require("../post-content-information/index.cjs"));
var import_panel2 = __toESM(require("../page-attributes/panel.cjs"));
var import_panel3 = __toESM(require("../post-discussion/panel.cjs"));
var import_panel4 = require("../post-excerpt/panel.cjs");
var import_panel5 = __toESM(require("../post-featured-image/panel.cjs"));
var import_panel6 = __toESM(require("../post-format/panel.cjs"));
var import_post_last_edited_panel = __toESM(require("../post-last-edited-panel/index.cjs"));
var import_revision_created_panel = __toESM(require("../revision-created-panel/index.cjs"));
var import_post_panel_section = __toESM(require("../post-panel-section/index.cjs"));
var import_panel7 = __toESM(require("../post-schedule/panel.cjs"));
var import_post_status = __toESM(require("../post-status/index.cjs"));
var import_post_sync_status = __toESM(require("../post-sync-status/index.cjs"));
var import_panel8 = __toESM(require("../post-template/panel.cjs"));
var import_panel9 = __toESM(require("../post-url/panel.cjs"));
var import_blog_title = __toESM(require("../blog-title/index.cjs"));
var import_posts_per_page = __toESM(require("../posts-per-page/index.cjs"));
var import_site_discussion = __toESM(require("../site-discussion/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_post_last_revision = require("../post-last-revision/index.cjs");
var import_post_trash = __toESM(require("../post-trash/index.cjs"));
var import_revision_author_panel = __toESM(require("../revision-author-panel/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var PANEL_NAME = "post-status";
function PostSummary({ onActionPerformed }) {
  const postType = (0, import_data.useSelect)(
    (select) => select(import_store.store).getCurrentPostType(),
    []
  );
  if (window?.__experimentalDataFormInspector && ["page", "post"].includes(postType)) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dataform_post_summary.default, { onActionPerformed });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassicPostSummary, { onActionPerformed });
}
function ClassicPostSummary({ onActionPerformed }) {
  const { isRemovedPostStatusPanel, postType, postId, revisionId } = (0, import_data.useSelect)((select) => {
    const {
      isEditorPanelRemoved,
      getCurrentPostType,
      getCurrentPostId,
      getCurrentRevisionId
    } = (0, import_lock_unlock.unlock)(select(import_store.store));
    return {
      isRemovedPostStatusPanel: isEditorPanelRemoved(PANEL_NAME),
      postType: getCurrentPostType(),
      postId: getCurrentPostId(),
      revisionId: getCurrentRevisionId()
    };
  }, []);
  const isRevisionsMode = !!revisionId;
  const shouldShowPostStatusPanel = !isRemovedPostStatusPanel && !isRevisionsMode;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_panel_section.default, { className: "editor-post-summary", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_plugin_post_status_info.default.Slot, { children: (fills) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_post_card_panel.default,
      {
        postType,
        postId,
        onActionPerformed
      }
    ),
    !isRevisionsMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_panel5.default,
      {
        withPanelBody: false
      }
    ),
    !isRevisionsMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_panel4.PrivatePostExcerptPanel, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 1, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_content_information.default, {}),
      isRevisionsMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_revision_created_panel.default, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_last_edited_panel.default, {})
    ] }),
    isRevisionsMode && revisionId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.ExternalLink,
        {
          href: (0, import_url.addQueryArgs)("revision.php", {
            revision: revisionId
          }),
          children: (0, import_i18n.__)(
            "Open classic revisions screen"
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_revision_author_panel.default, {})
    ] }),
    shouldShowPostStatusPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 1, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_status.default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_panel7.default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_panel9.default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_panel.default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_panel8.default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_panel3.default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_last_revision.PrivatePostLastRevision, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_panel2.default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_sync_status.default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_blog_title.default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_posts_per_page.default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_site_discussion.default, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_panel6.default, {}),
        fills
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_post_trash.default,
        {
          onActionPerformed
        }
      )
    ] })
  ] }) }) }) });
}
//# sourceMappingURL=post-summary.cjs.map
