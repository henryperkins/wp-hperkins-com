// packages/editor/src/components/post-status/index.js
import {
  Button,
  CheckboxControl,
  Dropdown,
  __experimentalVStack as VStack,
  TextControl,
  RadioControl
} from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { useState, useMemo } from "@wordpress/element";
import { store as coreStore } from "@wordpress/core-data";
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from "@wordpress/block-editor";
import { useInstanceId } from "@wordpress/compose";
import {
  drafts,
  published,
  scheduled,
  pending,
  notAllowed
} from "@wordpress/icons";
import { DESIGN_POST_TYPES } from "../../store/constants.mjs";
import PostPanelRow from "../post-panel-row/index.mjs";
import PostSticky from "../post-sticky/index.mjs";
import { PrivatePostSchedule } from "../post-schedule/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var postStatusesInfo = {
  "auto-draft": { label: __("Draft"), icon: drafts },
  draft: { label: __("Draft"), icon: drafts },
  pending: { label: __("Pending"), icon: pending },
  private: { label: __("Private"), icon: notAllowed },
  future: { label: __("Scheduled"), icon: scheduled },
  publish: { label: __("Published"), icon: published }
};
var STATUS_OPTIONS = [
  {
    label: __("Draft"),
    value: "draft",
    description: __("Not ready to publish.")
  },
  {
    label: __("Pending"),
    value: "pending",
    description: __("Waiting for review before publishing.")
  },
  {
    label: __("Private"),
    value: "private",
    description: __("Only visible to site admins and editors.")
  },
  {
    label: __("Scheduled"),
    value: "future",
    description: __("Publish automatically on a chosen date.")
  },
  {
    label: __("Published"),
    value: "publish",
    description: __("Visible to everyone.")
  }
];
function PostStatus() {
  const { status, date, password, postId, postType, canEdit } = useSelect(
    (select) => {
      const {
        getEditedPostAttribute,
        getCurrentPostId,
        getCurrentPostType,
        getCurrentPost
      } = select(editorStore);
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
  const [showPassword, setShowPassword] = useState(!!password);
  const passwordInputId = useInstanceId(
    PostStatus,
    "editor-change-status__password-input"
  );
  const { editEntityRecord } = useDispatch(coreStore);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const popoverProps = useMemo(
    () => ({
      // Anchor the popover to the middle of the entire row so that it doesn't
      // move around when the label changes.
      anchor: popoverAnchor,
      "aria-label": __("Status & visibility"),
      headerTitle: __("Status & visibility"),
      placement: "left-start",
      offset: 36,
      shift: true
    }),
    [popoverAnchor]
  );
  if (DESIGN_POST_TYPES.includes(postType)) {
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
  return /* @__PURE__ */ jsx(PostPanelRow, { label: __("Status"), ref: setPopoverAnchor, children: canEdit ? /* @__PURE__ */ jsx(
    Dropdown,
    {
      className: "editor-post-status",
      contentClassName: "editor-change-status__content",
      popoverProps,
      focusOnMount: true,
      renderToggle: ({ onToggle, isOpen }) => /* @__PURE__ */ jsx(
        Button,
        {
          className: "editor-post-status__toggle",
          variant: "tertiary",
          size: "compact",
          onClick: onToggle,
          icon: postStatusesInfo[status]?.icon,
          "aria-label": sprintf(
            // translators: %s: Current post status.
            __("Change status: %s"),
            postStatusesInfo[status]?.label
          ),
          "aria-expanded": isOpen,
          children: postStatusesInfo[status]?.label
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          InspectorPopoverHeader,
          {
            title: __("Status & visibility"),
            onClose
          }
        ),
        /* @__PURE__ */ jsx(
          "form",
          {
            onSubmit: (event) => {
              event.preventDefault();
              onClose();
            },
            children: /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
              /* @__PURE__ */ jsx(
                RadioControl,
                {
                  className: "editor-change-status__options",
                  hideLabelFromVision: true,
                  label: __("Status"),
                  options: STATUS_OPTIONS,
                  onChange: handleStatus,
                  selected: status === "auto-draft" ? "draft" : status
                }
              ),
              status === "future" && /* @__PURE__ */ jsx("div", { className: "editor-change-status__publish-date-wrapper", children: /* @__PURE__ */ jsx(
                PrivatePostSchedule,
                {
                  showPopoverHeaderActions: false,
                  isCompact: true
                }
              ) }),
              status !== "private" && /* @__PURE__ */ jsxs(
                VStack,
                {
                  as: "fieldset",
                  spacing: 4,
                  className: "editor-change-status__password-fieldset",
                  children: [
                    /* @__PURE__ */ jsx(
                      CheckboxControl,
                      {
                        label: __(
                          "Password protected"
                        ),
                        help: __(
                          "Only visible to those who know the password."
                        ),
                        checked: showPassword,
                        onChange: handleTogglePassword
                      }
                    ),
                    showPassword && /* @__PURE__ */ jsx("div", { className: "editor-change-status__password-input", children: /* @__PURE__ */ jsx(
                      TextControl,
                      {
                        label: __(
                          "Password"
                        ),
                        onChange: (value) => updatePost({
                          password: value
                        }),
                        value: password,
                        placeholder: __(
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
              /* @__PURE__ */ jsx(PostSticky, {})
            ] })
          }
        )
      ] })
    }
  ) : /* @__PURE__ */ jsx("div", { className: "editor-post-status is-read-only", children: postStatusesInfo[status]?.label }) });
}
export {
  STATUS_OPTIONS,
  PostStatus as default
};
//# sourceMappingURL=index.mjs.map
