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

// packages/editor/src/components/site-discussion/index.js
var site_discussion_exports = {};
__export(site_discussion_exports, {
  default: () => SiteDiscussion
});
module.exports = __toCommonJS(site_discussion_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_constants = require("../../store/constants.cjs");
var import_post_panel_row = __toESM(require("../post-panel-row/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var COMMENT_OPTIONS = [
  {
    label: (0, import_i18n._x)("Open", 'Adjective: e.g. "Comments are open"'),
    value: "open",
    description: (0, import_i18n.__)("Visitors can add new comments and replies.")
  },
  {
    label: (0, import_i18n.__)("Closed"),
    value: "",
    description: [
      (0, import_i18n.__)("Visitors cannot add new comments or replies."),
      (0, import_i18n.__)("Existing comments remain visible.")
    ].join(" ")
  }
];
function SiteDiscussion() {
  const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const { allowCommentsOnNewPosts, isTemplate, postSlug } = (0, import_data.useSelect)(
    (select) => {
      const { getEditedPostAttribute, getCurrentPostType } = select(import_store.store);
      const { getEditedEntityRecord, canUser } = select(import_core_data.store);
      const siteSettings = canUser("read", {
        kind: "root",
        name: "site"
      }) ? getEditedEntityRecord("root", "site") : void 0;
      return {
        isTemplate: getCurrentPostType() === import_constants.TEMPLATE_POST_TYPE,
        postSlug: getEditedPostAttribute("slug"),
        allowCommentsOnNewPosts: siteSettings?.default_comment_status || ""
      };
    },
    []
  );
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
  if (!isTemplate || !["home", "index"].includes(postSlug)) {
    return null;
  }
  const setAllowCommentsOnNewPosts = (newValue) => {
    editEntityRecord("root", "site", void 0, {
      default_comment_status: newValue ? "open" : null
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_panel_row.default, { label: (0, import_i18n.__)("Discussion"), ref: setPopoverAnchor, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Dropdown,
    {
      popoverProps,
      contentClassName: "editor-site-discussion-dropdown__content",
      focusOnMount: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          size: "compact",
          variant: "tertiary",
          "aria-expanded": isOpen,
          "aria-label": (0, import_i18n.__)("Change discussion settings"),
          onClick: onToggle,
          children: allowCommentsOnNewPosts ? (0, import_i18n.__)("Comments open") : (0, import_i18n.__)("Comments closed")
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_editor.__experimentalInspectorPopoverHeader,
          {
            title: (0, import_i18n.__)("Discussion"),
            onClose
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 3, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: (0, import_i18n.__)(
            "Changes will apply to new posts only. Individual posts may override these settings."
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.RadioControl,
            {
              className: "editor-site-discussion__options",
              hideLabelFromVision: true,
              label: (0, import_i18n.__)("Comment status"),
              options: COMMENT_OPTIONS,
              onChange: setAllowCommentsOnNewPosts,
              selected: allowCommentsOnNewPosts
            }
          )
        ] })
      ] })
    }
  ) });
}
//# sourceMappingURL=index.cjs.map
