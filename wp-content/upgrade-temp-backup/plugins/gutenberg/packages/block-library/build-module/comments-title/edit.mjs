// packages/block-library/src/comments-title/edit.js
import {
  BlockControls,
  useBlockProps,
  InspectorControls,
  store as blockEditorStore,
  HeadingLevelDropdown
} from "@wordpress/block-editor";
import { __, _n, sprintf } from "@wordpress/i18n";
import { useEntityProp } from "@wordpress/core-data";
import {
  ToggleControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import useDeprecatedTextAlign from "../utils/deprecated-text-align-attributes.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Edit(props) {
  useDeprecatedTextAlign(props);
  const { attributes, setAttributes, context } = props;
  const {
    showPostTitle,
    showCommentsCount,
    level = 2,
    levelOptions
  } = attributes;
  const { postId, postType } = context;
  const TagName = "h" + level;
  const [commentsCount, setCommentsCount] = useState();
  const [rawTitle] = useEntityProp("postType", postType, "title", postId);
  const isSiteEditor = typeof postId === "undefined";
  const blockProps = useBlockProps();
  const {
    threadCommentsDepth,
    threadComments,
    commentsPerPage,
    pageComments
  } = useSelect((select) => {
    const { getSettings } = select(blockEditorStore);
    return getSettings().__experimentalDiscussionSettings ?? {};
  }, []);
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  useEffect(() => {
    if (isSiteEditor) {
      const nestedCommentsNumber = threadComments ? Math.min(threadCommentsDepth, 3) - 1 : 0;
      const topLevelCommentsNumber = pageComments ? commentsPerPage : 3;
      const commentsNumber = parseInt(nestedCommentsNumber) + parseInt(topLevelCommentsNumber);
      setCommentsCount(Math.min(commentsNumber, 3));
      return;
    }
    const currentPostId = postId;
    apiFetch({
      path: addQueryArgs("/wp/v2/comments", {
        post: postId,
        _fields: "id"
      }),
      method: "HEAD",
      parse: false
    }).then((res) => {
      if (currentPostId === postId) {
        setCommentsCount(
          parseInt(res.headers.get("X-WP-Total"))
        );
      }
    }).catch(() => {
      setCommentsCount(0);
    });
  }, [postId]);
  const blockControls = /* @__PURE__ */ jsx(BlockControls, { group: "block", children: /* @__PURE__ */ jsx(
    HeadingLevelDropdown,
    {
      value: level,
      options: levelOptions,
      onChange: (newLevel) => setAttributes({ level: newLevel })
    }
  ) });
  const inspectorControls = /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsxs(
    ToolsPanel,
    {
      label: __("Settings"),
      resetAll: () => {
        setAttributes({
          showPostTitle: true,
          showCommentsCount: true
        });
      },
      dropdownMenuProps,
      children: [
        /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Show post title"),
            isShownByDefault: true,
            hasValue: () => !showPostTitle,
            onDeselect: () => setAttributes({ showPostTitle: true }),
            children: /* @__PURE__ */ jsx(
              ToggleControl,
              {
                label: __("Show post title"),
                checked: showPostTitle,
                onChange: (value) => setAttributes({ showPostTitle: value })
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Show comments count"),
            isShownByDefault: true,
            hasValue: () => !showCommentsCount,
            onDeselect: () => setAttributes({ showCommentsCount: true }),
            children: /* @__PURE__ */ jsx(
              ToggleControl,
              {
                label: __("Show comments count"),
                checked: showCommentsCount,
                onChange: (value) => setAttributes({ showCommentsCount: value })
              }
            )
          }
        )
      ]
    }
  ) });
  const postTitle = isSiteEditor ? __("Post Title") : rawTitle;
  let placeholder;
  if (showCommentsCount && commentsCount !== void 0) {
    if (showPostTitle) {
      if (commentsCount === 1) {
        placeholder = sprintf(
          /* translators: %s: Post title. */
          __('One response to "%s"'),
          postTitle
        );
      } else {
        placeholder = sprintf(
          /* translators: 1: Number of comments, 2: Post title. */
          _n(
            '%1$s response to "%2$s"',
            '%1$s responses to "%2$s"',
            commentsCount
          ),
          commentsCount,
          postTitle
        );
      }
    } else if (commentsCount === 1) {
      placeholder = __("One response");
    } else {
      placeholder = sprintf(
        /* translators: %s: Number of comments. */
        _n("%s response", "%s responses", commentsCount),
        commentsCount
      );
    }
  } else if (showPostTitle) {
    if (commentsCount === 1) {
      placeholder = sprintf(__('Response to "%s"'), postTitle);
    } else {
      placeholder = sprintf(__('Responses to "%s"'), postTitle);
    }
  } else if (commentsCount === 1) {
    placeholder = __("Response");
  } else {
    placeholder = __("Responses");
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    blockControls,
    inspectorControls,
    /* @__PURE__ */ jsx(TagName, { ...blockProps, children: placeholder })
  ] });
}
export {
  Edit as default
};
//# sourceMappingURL=edit.mjs.map
