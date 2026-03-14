// packages/block-library/src/query-title/edit.js
import {
  BlockControls,
  InspectorControls,
  useBlockProps,
  Warning,
  HeadingLevelDropdown
} from "@wordpress/block-editor";
import {
  ToggleControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { __, _x, sprintf } from "@wordpress/i18n";
import { useArchiveLabel } from "./use-archive-label.mjs";
import { usePostTypeLabel } from "./use-post-type-label.mjs";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import useDeprecatedTextAlign from "../utils/deprecated-text-align-attributes.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var SUPPORTED_TYPES = ["archive", "search", "post-type"];
function QueryTitleEdit(props) {
  useDeprecatedTextAlign(props);
  const {
    attributes: { type, level, levelOptions, showPrefix, showSearchTerm },
    setAttributes,
    context: { query }
  } = props;
  const { archiveTypeLabel, archiveNameLabel } = useArchiveLabel();
  const { postTypeLabel } = usePostTypeLabel(query?.postType);
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const TagName = level === 0 ? "p" : `h${level}`;
  const blockProps = useBlockProps({
    className: "wp-block-query-title__placeholder"
  });
  if (!SUPPORTED_TYPES.includes(type)) {
    return /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(Warning, { children: __("Provided type is not supported.") }) });
  }
  let titleElement;
  if (type === "archive") {
    let title;
    if (archiveTypeLabel) {
      if (showPrefix) {
        if (archiveNameLabel) {
          title = sprintf(
            /* translators: 1: Archive type title e.g: "Category", 2: Label of the archive e.g: "Shoes" */
            _x("%1$s: %2$s", "archive label"),
            archiveTypeLabel,
            archiveNameLabel
          );
        } else {
          title = sprintf(
            /* translators: %s: Archive type title e.g: "Category", "Tag"... */
            __("%s: Name"),
            archiveTypeLabel
          );
        }
      } else if (archiveNameLabel) {
        title = archiveNameLabel;
      } else {
        title = sprintf(
          /* translators: %s: Archive type title e.g: "Category", "Tag"... */
          __("%s name"),
          archiveTypeLabel
        );
      }
    } else {
      title = showPrefix ? __("Archive type: Name") : __("Archive title");
    }
    titleElement = /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(
        ToolsPanel,
        {
          label: __("Settings"),
          resetAll: () => setAttributes({
            showPrefix: true
          }),
          dropdownMenuProps,
          children: /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              hasValue: () => !showPrefix,
              label: __("Show archive type in title"),
              onDeselect: () => setAttributes({ showPrefix: true }),
              isShownByDefault: true,
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Show archive type in title"),
                  onChange: () => setAttributes({
                    showPrefix: !showPrefix
                  }),
                  checked: showPrefix
                }
              )
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsx(TagName, { ...blockProps, children: title })
    ] });
  }
  if (type === "search") {
    titleElement = /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(
        ToolsPanel,
        {
          label: __("Settings"),
          resetAll: () => setAttributes({
            showSearchTerm: true
          }),
          dropdownMenuProps,
          children: /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              hasValue: () => !showSearchTerm,
              label: __("Show search term in title"),
              onDeselect: () => setAttributes({ showSearchTerm: true }),
              isShownByDefault: true,
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Show search term in title"),
                  onChange: () => setAttributes({
                    showSearchTerm: !showSearchTerm
                  }),
                  checked: showSearchTerm
                }
              )
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsx(TagName, { ...blockProps, children: showSearchTerm ? __("Search results for: \u201Csearch term\u201D") : __("Search results") })
    ] });
  }
  if (type === "post-type") {
    let title;
    if (postTypeLabel) {
      if (showPrefix) {
        title = sprintf(
          /* translators: %s: Singular post type name of the queried object */
          __('Post Type: "%s"'),
          postTypeLabel
        );
      } else {
        title = postTypeLabel;
      }
    } else {
      title = showPrefix ? __("Post Type: Name") : __("Name");
    }
    titleElement = /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(
        ToolsPanel,
        {
          label: __("Settings"),
          resetAll: () => setAttributes({
            showPrefix: true
          }),
          dropdownMenuProps,
          children: /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              hasValue: () => !showPrefix,
              label: __("Show post type label"),
              onDeselect: () => setAttributes({ showPrefix: true }),
              isShownByDefault: true,
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Show post type label"),
                  onChange: () => setAttributes({
                    showPrefix: !showPrefix
                  }),
                  checked: showPrefix
                }
              )
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsx(TagName, { ...blockProps, children: title })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(BlockControls, { group: "block", children: /* @__PURE__ */ jsx(
      HeadingLevelDropdown,
      {
        value: level,
        options: levelOptions,
        onChange: (newLevel) => setAttributes({ level: newLevel })
      }
    ) }),
    titleElement
  ] });
}
export {
  QueryTitleEdit as default
};
//# sourceMappingURL=edit.mjs.map
