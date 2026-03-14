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

// packages/editor/src/components/post-status/index.js
var post_status_exports = {};
__export(post_status_exports, {
  STATUS_OPTIONS: () => STATUS_OPTIONS,
  default: () => PostStatus
});
module.exports = __toCommonJS(post_status_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var import_compose = require("@wordpress/compose");
var import_icons = require("@wordpress/icons");
var import_constants = require("../../store/constants.cjs");
var import_post_panel_row = __toESM(require("../post-panel-row/index.cjs"));
var import_post_sticky = __toESM(require("../post-sticky/index.cjs"));
var import_post_schedule = require("../post-schedule/index.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var postStatusesInfo = {
  "auto-draft": { label: (0, import_i18n.__)("Draft"), icon: import_icons.drafts },
  draft: { label: (0, import_i18n.__)("Draft"), icon: import_icons.drafts },
  pending: { label: (0, import_i18n.__)("Pending"), icon: import_icons.pending },
  private: { label: (0, import_i18n.__)("Private"), icon: import_icons.notAllowed },
  future: { label: (0, import_i18n.__)("Scheduled"), icon: import_icons.scheduled },
  publish: { label: (0, import_i18n.__)("Published"), icon: import_icons.published }
};
var STATUS_OPTIONS = [
  {
    label: (0, import_i18n.__)("Draft"),
    value: "draft",
    description: (0, import_i18n.__)("Not ready to publish.")
  },
  {
    label: (0, import_i18n.__)("Pending"),
    value: "pending",
    description: (0, import_i18n.__)("Waiting for review before publishing.")
  },
  {
    label: (0, import_i18n.__)("Private"),
    value: "private",
    description: (0, import_i18n.__)("Only visible to site admins and editors.")
  },
  {
    label: (0, import_i18n.__)("Scheduled"),
    value: "future",
    description: (0, import_i18n.__)("Publish automatically on a chosen date.")
  },
  {
    label: (0, import_i18n.__)("Published"),
    value: "publish",
    description: (0, import_i18n.__)("Visible to everyone.")
  }
];
function PostStatus() {
  const { status, date, password, postId, postType, canEdit } = (0, import_data.useSelect)(
    (select) => {
      const {
        getEditedPostAttribute,
        getCurrentPostId,
        getCurrentPostType,
        getCurrentPost
      } = select(import_store.store);
      return {
        status: getEditedPostAttribute("status"),
        date: getEditedPostAttribute("date"),
        password: getEditedPostAttribute("password"),
        postId: getCurrentPostId(),
        postType: getCurrentPostType(),
        canEdit: getCurrentPost()._links?.["wp:action-publish"] ?? false
      };
    },
    []
  );
  const [showPassword, setShowPassword] = (0, import_element.useState)(!!password);
  const passwordInputId = (0, import_compose.useInstanceId)(
    PostStatus,
    "editor-change-status__password-input"
  );
  const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const [popoverAnchor, setPopoverAnchor] = (0, import_element.useState)(null);
  const popoverProps = (0, import_element.useMemo)(
    () => ({
      // Anchor the popover to the middle of the entire row so that it doesn't
      // move around when the label changes.
      anchor: popoverAnchor,
      "aria-label": (0, import_i18n.__)("Status & visibility"),
      headerTitle: (0, import_i18n.__)("Status & visibility"),
      placement: "left-start",
      offset: 36,
      shift: true
    }),
    [popoverAnchor]
  );
  if (import_constants.DESIGN_POST_TYPES.includes(postType)) {
    return null;
  }
  const updatePost = ({
    status: newStatus = status,
    password: newPassword = password,
    date: newDate = date
  }) => {
    editEntityRecord("postType", postType, postId, {
      status: newStatus,
      date: newDate,
      password: newPassword
    });
  };
  const handleTogglePassword = (value) => {
    setShowPassword(value);
    if (!value) {
      updatePost({ password: "" });
    }
  };
  const handleStatus = (value) => {
    let newDate = date;
    let newPassword = password;
    if (status === "future" && new Date(date) > /* @__PURE__ */ new Date()) {
      newDate = null;
    }
    if (value === "private" && password) {
      newPassword = "";
    }
    updatePost({
      status: value,
      date: newDate,
      password: newPassword
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_panel_row.default, { label: (0, import_i18n.__)("Status"), ref: setPopoverAnchor, children: canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Dropdown,
    {
      className: "editor-post-status",
      contentClassName: "editor-change-status__content",
      popoverProps,
      focusOnMount: true,
      renderToggle: ({ onToggle, isOpen }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          className: "editor-post-status__toggle",
          variant: "tertiary",
          size: "compact",
          onClick: onToggle,
          icon: postStatusesInfo[status]?.icon,
          "aria-label": (0, import_i18n.sprintf)(
            // translators: %s: Current post status.
            (0, import_i18n.__)("Change status: %s"),
            postStatusesInfo[status]?.label
          ),
          "aria-expanded": isOpen,
          children: postStatusesInfo[status]?.label
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_editor.__experimentalInspectorPopoverHeader,
          {
            title: (0, import_i18n.__)("Status & visibility"),
            onClose
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "form",
          {
            onSubmit: (event) => {
              event.preventDefault();
              onClose();
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.RadioControl,
                {
                  className: "editor-change-status__options",
                  hideLabelFromVision: true,
                  label: (0, import_i18n.__)("Status"),
                  options: STATUS_OPTIONS,
                  onChange: handleStatus,
                  selected: status === "auto-draft" ? "draft" : status
                }
              ),
              status === "future" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-change-status__publish-date-wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_post_schedule.PrivatePostSchedule,
                {
                  showPopoverHeaderActions: false,
                  isCompact: true
                }
              ) }),
              status !== "private" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                import_components.__experimentalVStack,
                {
                  as: "fieldset",
                  spacing: 4,
                  className: "editor-change-status__password-fieldset",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.CheckboxControl,
                      {
                        label: (0, import_i18n.__)(
                          "Password protected"
                        ),
                        help: (0, import_i18n.__)(
                          "Only visible to those who know the password."
                        ),
                        checked: showPassword,
                        onChange: handleTogglePassword
                      }
                    ),
                    showPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-change-status__password-input", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_components.TextControl,
                      {
                        label: (0, import_i18n.__)(
                          "Password"
                        ),
                        onChange: (value) => updatePost({
                          password: value
                        }),
                        value: password,
                        placeholder: (0, import_i18n.__)(
                          "Use a secure password"
                        ),
                        type: "text",
                        id: passwordInputId,
                        __next40pxDefaultSize: true,
                        maxLength: 255
                      }
                    ) })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_sticky.default, {})
            ] })
          }
        )
      ] })
    }
  ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-post-status is-read-only", children: postStatusesInfo[status]?.label }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  STATUS_OPTIONS
});
//# sourceMappingURL=index.cjs.map
