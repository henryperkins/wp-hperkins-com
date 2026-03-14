// packages/editor/src/components/blog-title/index.js
import { __, sprintf } from "@wordpress/i18n";
import { debounce } from "@wordpress/compose";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { decodeEntities } from "@wordpress/html-entities";
import {
  Button,
  Dropdown,
  __experimentalInputControl as InputControl
} from "@wordpress/components";
import { useState, useMemo } from "@wordpress/element";
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from "@wordpress/block-editor";
import { TEMPLATE_POST_TYPE } from "../../store/constants.mjs";
import PostPanelRow from "../post-panel-row/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var EMPTY_OBJECT = {};
function BlogTitle() {
  const { editEntityRecord } = useDispatch(coreStore);
  const { postsPageTitle, postsPageId, isTemplate, postSlug } = useSelect(
    (select) => {
      const { getEntityRecord, getEditedEntityRecord, canUser } = select(coreStore);
      const siteSettings = canUser("read", {
        kind: "root",
        name: "site"
      }) ? getEntityRecord("root", "site") : void 0;
      const _postsPageRecord = siteSettings?.page_for_posts ? getEditedEntityRecord(
        "postType",
        "page",
        siteSettings?.page_for_posts
      ) : EMPTY_OBJECT;
      const { getEditedPostAttribute, getCurrentPostType } = select(editorStore);
      return {
        postsPageId: _postsPageRecord?.id,
        postsPageTitle: _postsPageRecord?.title,
        isTemplate: getCurrentPostType() === TEMPLATE_POST_TYPE,
        postSlug: getEditedPostAttribute("slug")
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
  if (!isTemplate || !["home", "index"].includes(postSlug) || !postsPageId) {
    return null;
  }
  const setPostsPageTitle = (newValue) => {
    editEntityRecord("postType", "page", postsPageId, {
      title: newValue
    });
  };
  const decodedTitle = decodeEntities(postsPageTitle);
  return /* @__PURE__ */ jsx(PostPanelRow, { label: __("Blog title"), ref: setPopoverAnchor, children: /* @__PURE__ */ jsx(
    Dropdown,
    {
      popoverProps,
      contentClassName: "editor-blog-title-dropdown__content",
      focusOnMount: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ jsx(
        Button,
        {
          size: "compact",
          variant: "tertiary",
          "aria-expanded": isOpen,
          "aria-label": sprintf(
            // translators: %s: Current post link.
            __("Change blog title: %s"),
            decodedTitle
          ),
          onClick: onToggle,
          children: decodedTitle
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          InspectorPopoverHeader,
          {
            title: __("Blog title"),
            onClose
          }
        ),
        /* @__PURE__ */ jsx(
          InputControl,
          {
            placeholder: __("No title"),
            size: "__unstable-large",
            value: postsPageTitle,
            onChange: debounce(setPostsPageTitle, 300),
            label: __("Blog title"),
            help: __(
              "Set the Posts Page title. Appears in search results, and when the page is shared on social media."
            ),
            hideLabelFromVision: true
          }
        )
      ] })
    }
  ) });
}
export {
  BlogTitle as default
};
//# sourceMappingURL=index.mjs.map
