// packages/block-library/src/comment-author-name/edit.js
import { __, _x } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { store as coreStore } from "@wordpress/core-data";
import {
  ToggleControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import useDeprecatedTextAlign from "../utils/deprecated-text-align-attributes.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Edit(props) {
  const {
    attributes: { isLink, linkTarget },
    context: { commentId },
    setAttributes
  } = props;
  useDeprecatedTextAlign(props);
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const blockProps = useBlockProps();
  let displayName = useSelect(
    (select) => {
      const { getEntityRecord } = select(coreStore);
      const comment = getEntityRecord("root", "comment", commentId);
      const authorName = comment?.author_name;
      if (comment && !authorName) {
        const user = getEntityRecord("root", "user", comment.author);
        return user?.name ?? __("Anonymous");
      }
      return authorName ?? "";
    },
    [commentId]
  );
  const inspectorControls = /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsxs(
    ToolsPanel,
    {
      label: __("Settings"),
      resetAll: () => {
        setAttributes({
          isLink: true,
          linkTarget: "_self"
        });
      },
      dropdownMenuProps,
      children: [
        /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Link to authors URL"),
            isShownByDefault: true,
            hasValue: () => !isLink,
            onDeselect: () => setAttributes({
              isLink: true
            }),
            children: /* @__PURE__ */ jsx(
              ToggleControl,
              {
                label: __("Link to authors URL"),
                onChange: () => setAttributes({ isLink: !isLink }),
                checked: isLink
              }
            )
          }
        ),
        isLink && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Open in new tab"),
            isShownByDefault: true,
            hasValue: () => linkTarget !== "_self",
            onDeselect: () => setAttributes({
              linkTarget: "_self"
            }),
            children: /* @__PURE__ */ jsx(
              ToggleControl,
              {
                label: __("Open in new tab"),
                onChange: (value) => setAttributes({
                  linkTarget: value ? "_blank" : "_self"
                }),
                checked: linkTarget === "_blank"
              }
            )
          }
        )
      ]
    }
  ) });
  if (!commentId || !displayName) {
    displayName = _x("Comment Author", "block title");
  }
  const displayAuthor = isLink ? /* @__PURE__ */ jsx(
    "a",
    {
      href: "#comment-author-pseudo-link",
      onClick: (event) => event.preventDefault(),
      children: displayName
    }
  ) : displayName;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    inspectorControls,
    /* @__PURE__ */ jsx("div", { ...blockProps, children: displayAuthor })
  ] });
}
export {
  Edit as default
};
//# sourceMappingURL=edit.mjs.map
