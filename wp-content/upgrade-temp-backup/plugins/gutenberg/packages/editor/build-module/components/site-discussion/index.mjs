// packages/editor/src/components/site-discussion/index.js
import { __, _x } from "@wordpress/i18n";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import {
  Button,
  Dropdown,
  RadioControl,
  __experimentalVStack as VStack,
  __experimentalText as Text
} from "@wordpress/components";
import { useState, useMemo } from "@wordpress/element";
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from "@wordpress/block-editor";
import { TEMPLATE_POST_TYPE } from "../../store/constants.mjs";
import PostPanelRow from "../post-panel-row/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var COMMENT_OPTIONS = [
  {
    label: _x("Open", 'Adjective: e.g. "Comments are open"'),
    value: "open",
    description: __("Visitors can add new comments and replies.")
  },
  {
    label: __("Closed"),
    value: "",
    description: [
      __("Visitors cannot add new comments or replies."),
      __("Existing comments remain visible.")
    ].join(" ")
  }
];
function SiteDiscussion() {
  const { editEntityRecord } = useDispatch(coreStore);
  const { allowCommentsOnNewPosts, isTemplate, postSlug } = useSelect(
    (select) => {
      const { getEditedPostAttribute, getCurrentPostType } = select(editorStore);
      const { getEditedEntityRecord, canUser } = select(coreStore);
      const siteSettings = canUser("read", {
        kind: "root",
        name: "site"
      }) ? getEditedEntityRecord("root", "site") : void 0;
      return {
        isTemplate: getCurrentPostType() === TEMPLATE_POST_TYPE,
        postSlug: getEditedPostAttribute("slug"),
        allowCommentsOnNewPosts: siteSettings?.default_comment_status || ""
      };
    },
    []
  );
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const popoverProps = useMemo(
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
  return /* @__PURE__ */ jsx(PostPanelRow, { label: __("Discussion"), ref: setPopoverAnchor, children: /* @__PURE__ */ jsx(
    Dropdown,
    {
      popoverProps,
      contentClassName: "editor-site-discussion-dropdown__content",
      focusOnMount: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ jsx(
        Button,
        {
          size: "compact",
          variant: "tertiary",
          "aria-expanded": isOpen,
          "aria-label": __("Change discussion settings"),
          onClick: onToggle,
          children: allowCommentsOnNewPosts ? __("Comments open") : __("Comments closed")
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          InspectorPopoverHeader,
          {
            title: __("Discussion"),
            onClose
          }
        ),
        /* @__PURE__ */ jsxs(VStack, { spacing: 3, children: [
          /* @__PURE__ */ jsx(Text, { children: __(
            "Changes will apply to new posts only. Individual posts may override these settings."
          ) }),
          /* @__PURE__ */ jsx(
            RadioControl,
            {
              className: "editor-site-discussion__options",
              hideLabelFromVision: true,
              label: __("Comment status"),
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
export {
  SiteDiscussion as default
};
//# sourceMappingURL=index.mjs.map
