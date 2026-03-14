// packages/editor/src/components/posts-per-page/index.js
import { __ } from "@wordpress/i18n";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import {
  Button,
  Dropdown,
  __experimentalNumberControl as NumberControl
} from "@wordpress/components";
import { useState, useMemo } from "@wordpress/element";
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from "@wordpress/block-editor";
import { TEMPLATE_POST_TYPE } from "../../store/constants.mjs";
import { store as editorStore } from "../../store/index.mjs";
import PostPanelRow from "../post-panel-row/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function PostsPerPage() {
  const { editEntityRecord } = useDispatch(coreStore);
  const { postsPerPage, isTemplate, postSlug } = useSelect((select) => {
    const { getEditedPostAttribute, getCurrentPostType } = select(editorStore);
    const { getEditedEntityRecord, canUser } = select(coreStore);
    const siteSettings = canUser("read", {
      kind: "root",
      name: "site"
    }) ? getEditedEntityRecord("root", "site") : void 0;
    return {
      isTemplate: getCurrentPostType() === TEMPLATE_POST_TYPE,
      postSlug: getEditedPostAttribute("slug"),
      postsPerPage: siteSettings?.posts_per_page || 1
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
  if (!isTemplate || !["home", "index"].includes(postSlug)) {
    return null;
  }
  const setPostsPerPage = (newValue) => {
    editEntityRecord("root", "site", void 0, {
      posts_per_page: newValue
    });
  };
  return /* @__PURE__ */ jsx(PostPanelRow, { label: __("Posts per page"), ref: setPopoverAnchor, children: /* @__PURE__ */ jsx(
    Dropdown,
    {
      popoverProps,
      contentClassName: "editor-posts-per-page-dropdown__content",
      focusOnMount: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ jsx(
        Button,
        {
          size: "compact",
          variant: "tertiary",
          "aria-expanded": isOpen,
          "aria-label": __("Change posts per page"),
          onClick: onToggle,
          children: postsPerPage
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          InspectorPopoverHeader,
          {
            title: __("Posts per page"),
            onClose
          }
        ),
        /* @__PURE__ */ jsx(
          NumberControl,
          {
            placeholder: 0,
            value: postsPerPage,
            size: "__unstable-large",
            spinControls: "custom",
            step: "1",
            min: "1",
            onChange: setPostsPerPage,
            label: __("Posts per page"),
            help: __(
              "Set the default number of posts to display on blog pages, including categories and tags. Some templates may override this setting."
            ),
            hideLabelFromVision: true
          }
        )
      ] })
    }
  ) });
}
export {
  PostsPerPage as default
};
//# sourceMappingURL=index.mjs.map
