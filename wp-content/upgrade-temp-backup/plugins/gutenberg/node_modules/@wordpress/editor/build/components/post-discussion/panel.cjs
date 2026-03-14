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

// packages/editor/src/components/post-discussion/panel.js
var panel_exports = {};
__export(panel_exports, {
  default: () => PostDiscussionPanel
});
module.exports = __toCommonJS(panel_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
var import_post_type_support_check = __toESM(require("../post-type-support-check/index.cjs"));
var import_post_comments = __toESM(require("../post-comments/index.cjs"));
var import_post_pingbacks = __toESM(require("../post-pingbacks/index.cjs"));
var import_post_panel_row = __toESM(require("../post-panel-row/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var PANEL_NAME = "discussion-panel";
function ModalContents({ onClose }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-post-discussion", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.__experimentalInspectorPopoverHeader,
      {
        title: (0, import_i18n.__)("Discussion"),
        onClose
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_type_support_check.default, { supportKeys: "comments", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_comments.default, {}) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_type_support_check.default, { supportKeys: "trackbacks", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_pingbacks.default, {}) })
    ] })
  ] });
}
function PostDiscussionToggle({ isOpen, onClick }) {
  const {
    commentStatus,
    pingStatus,
    commentsSupported,
    trackbacksSupported
  } = (0, import_data.useSelect)((select) => {
    const { getEditedPostAttribute } = select(import_store.store);
    const { getPostType } = select(import_core_data.store);
    const postType = getPostType(getEditedPostAttribute("type"));
    return {
      commentStatus: getEditedPostAttribute("comment_status") ?? "open",
      pingStatus: getEditedPostAttribute("ping_status") ?? "open",
      commentsSupported: !!postType.supports.comments,
      trackbacksSupported: !!postType.supports.trackbacks
    };
  }, []);
  let label;
  if (commentStatus === "open") {
    if (pingStatus === "open") {
      label = (0, import_i18n._x)("Open", 'Adjective: e.g. "Comments are open"');
    } else {
      label = trackbacksSupported ? (0, import_i18n.__)("Comments only") : (0, import_i18n._x)("Open", 'Adjective: e.g. "Comments are open"');
    }
  } else if (pingStatus === "open") {
    label = commentsSupported ? (0, import_i18n.__)("Pings only") : (0, import_i18n.__)("Pings enabled");
  } else {
    label = (0, import_i18n.__)("Closed");
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      size: "compact",
      className: "editor-post-discussion__panel-toggle",
      variant: "tertiary",
      "aria-label": (0, import_i18n.__)("Change discussion options"),
      "aria-expanded": isOpen,
      onClick,
      children: label
    }
  );
}
function PostDiscussionPanel() {
  const { isEnabled } = (0, import_data.useSelect)((select) => {
    const { isEditorPanelEnabled } = select(import_store.store);
    return {
      isEnabled: isEditorPanelEnabled(PANEL_NAME)
    };
  }, []);
  const [popoverAnchor, setPopoverAnchor] = (0, import_element.useState)(null);
  const popoverProps = (0, import_element.useMemo)(
    () => ({
      // Anchor the popover to the middle of the entire row so that it doesn't
      // move around when the label changes.
      anchor: popoverAnchor,
      placement: "left-start",
      offset: 36,
      shift: true
    }),
    [popoverAnchor]
  );
  if (!isEnabled) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_type_support_check.default, { supportKeys: ["comments", "trackbacks"], children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_panel_row.default, { label: (0, import_i18n.__)("Discussion"), ref: setPopoverAnchor, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Dropdown,
    {
      popoverProps,
      className: "editor-post-discussion__panel-dropdown",
      contentClassName: "editor-post-discussion__panel-dialog",
      focusOnMount: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        PostDiscussionToggle,
        {
          isOpen,
          onClick: onToggle
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalContents, { onClose })
    }
  ) }) });
}
//# sourceMappingURL=panel.cjs.map
