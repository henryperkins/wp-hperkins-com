// packages/editor/src/components/post-discussion/panel.js
import { __, _x } from "@wordpress/i18n";
import {
  Dropdown,
  Button,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useState, useMemo } from "@wordpress/element";
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from "@wordpress/block-editor";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
import PostTypeSupportCheck from "../post-type-support-check/index.mjs";
import PostComments from "../post-comments/index.mjs";
import PostPingbacks from "../post-pingbacks/index.mjs";
import PostPanelRow from "../post-panel-row/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var PANEL_NAME = "discussion-panel";
function ModalContents({ onClose }) {
  return /* @__PURE__ */ jsxs("div", { className: "editor-post-discussion", children: [
    /* @__PURE__ */ jsx(
      InspectorPopoverHeader,
      {
        title: __("Discussion"),
        onClose
      }
    ),
    /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
      /* @__PURE__ */ jsx(PostTypeSupportCheck, { supportKeys: "comments", children: /* @__PURE__ */ jsx(PostComments, {}) }),
      /* @__PURE__ */ jsx(PostTypeSupportCheck, { supportKeys: "trackbacks", children: /* @__PURE__ */ jsx(PostPingbacks, {}) })
    ] })
  ] });
}
function PostDiscussionToggle({ isOpen, onClick }) {
  const {
    commentStatus,
    pingStatus,
    commentsSupported,
    trackbacksSupported
  } = useSelect((select) => {
    const { getEditedPostAttribute } = select(editorStore);
    const { getPostType } = select(coreStore);
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
      label = _x("Open", 'Adjective: e.g. "Comments are open"');
    } else {
      label = trackbacksSupported ? __("Comments only") : _x("Open", 'Adjective: e.g. "Comments are open"');
    }
  } else if (pingStatus === "open") {
    label = commentsSupported ? __("Pings only") : __("Pings enabled");
  } else {
    label = __("Closed");
  }
  return /* @__PURE__ */ jsx(
    Button,
    {
      size: "compact",
      className: "editor-post-discussion__panel-toggle",
      variant: "tertiary",
      "aria-label": __("Change discussion options"),
      "aria-expanded": isOpen,
      onClick,
      children: label
    }
  );
}
function PostDiscussionPanel() {
  const { isEnabled } = useSelect((select) => {
    const { isEditorPanelEnabled } = select(editorStore);
    return {
      isEnabled: isEditorPanelEnabled(PANEL_NAME)
    };
  }, []);
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
  if (!isEnabled) {
    return null;
  }
  return /* @__PURE__ */ jsx(PostTypeSupportCheck, { supportKeys: ["comments", "trackbacks"], children: /* @__PURE__ */ jsx(PostPanelRow, { label: __("Discussion"), ref: setPopoverAnchor, children: /* @__PURE__ */ jsx(
    Dropdown,
    {
      popoverProps,
      className: "editor-post-discussion__panel-dropdown",
      contentClassName: "editor-post-discussion__panel-dialog",
      focusOnMount: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ jsx(
        PostDiscussionToggle,
        {
          isOpen,
          onClick: onToggle
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ jsx(ModalContents, { onClose })
    }
  ) }) });
}
export {
  PostDiscussionPanel as default
};
//# sourceMappingURL=panel.mjs.map
