// packages/editor/src/components/post-author/panel.js
import { __, sprintf } from "@wordpress/i18n";
import { Button, Dropdown } from "@wordpress/components";
import { useState, useMemo } from "@wordpress/element";
import { decodeEntities } from "@wordpress/html-entities";
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import PostAuthorCheck from "./check.mjs";
import PostAuthorForm from "./index.mjs";
import PostPanelRow from "../post-panel-row/index.mjs";
import { BASE_QUERY } from "./constants.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function PostAuthorToggle({ isOpen, onClick }) {
  const { postAuthor } = useSelect((select) => {
    const id = select(editorStore).getEditedPostAttribute("author");
    return {
      postAuthor: select(coreStore).getUser(id, BASE_QUERY)
    };
  }, []);
  const authorName = decodeEntities(postAuthor?.name) || __("(No author)");
  return /* @__PURE__ */ jsx(
    Button,
    {
      size: "compact",
      variant: "tertiary",
      "aria-expanded": isOpen,
      "aria-label": (
        // translators: %s: Author name.
        sprintf(__("Change author: %s"), authorName)
      ),
      onClick,
      children: authorName
    }
  );
}
function PostAuthor() {
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
  return /* @__PURE__ */ jsx(PostAuthorCheck, { children: /* @__PURE__ */ jsx(PostPanelRow, { label: __("Author"), ref: setPopoverAnchor, children: /* @__PURE__ */ jsx(
    Dropdown,
    {
      popoverProps,
      contentClassName: "editor-post-author__panel-dialog",
      focusOnMount: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ jsx(
        PostAuthorToggle,
        {
          isOpen,
          onClick: onToggle
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ jsxs("div", { className: "editor-post-author", children: [
        /* @__PURE__ */ jsx(
          InspectorPopoverHeader,
          {
            title: __("Author"),
            onClose
          }
        ),
        /* @__PURE__ */ jsx(PostAuthorForm, { onClose })
      ] })
    }
  ) }) });
}
var panel_default = PostAuthor;
export {
  PostAuthor,
  panel_default as default
};
//# sourceMappingURL=panel.mjs.map
