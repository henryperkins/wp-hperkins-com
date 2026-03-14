// packages/block-library/src/latest-comments/edit.js
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
  RangeControl,
  SelectControl,
  Spinner,
  ToggleControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { useServerSideRender } from "@wordpress/server-side-render";
import { useDisabled } from "@wordpress/compose";
import { useToolsPanelDropdownMenuProps } from "../utils/hooks.mjs";
import HtmlRenderer from "../utils/html-renderer.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var MIN_COMMENTS = 1;
var MAX_COMMENTS = 100;
function LatestComments({ attributes, setAttributes, name }) {
  const { commentsToShow, displayAvatar, displayDate, displayContent } = attributes;
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const { content, status, error } = useServerSideRender({
    attributes,
    skipBlockSupportAttributes: true,
    block: name,
    urlQueryArgs: {
      // The preview uses the site's locale to make it more true to how
      // the block appears on the frontend. Setting the locale
      // explicitly prevents any middleware from setting it to 'user'.
      _locale: "site"
    }
  });
  const disabledRef = useDisabled();
  const blockProps = useBlockProps({ ref: disabledRef });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsxs(
      ToolsPanel,
      {
        label: __("Settings"),
        resetAll: () => {
          setAttributes({
            commentsToShow: 5,
            displayAvatar: true,
            displayDate: true,
            displayContent: "excerpt"
          });
        },
        dropdownMenuProps,
        children: [
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              hasValue: () => !displayAvatar,
              label: __("Display avatar"),
              onDeselect: () => setAttributes({ displayAvatar: true }),
              isShownByDefault: true,
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Display avatar"),
                  checked: displayAvatar,
                  onChange: () => setAttributes({
                    displayAvatar: !displayAvatar
                  })
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              hasValue: () => !displayDate,
              label: __("Display date"),
              onDeselect: () => setAttributes({ displayDate: true }),
              isShownByDefault: true,
              children: /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Display date"),
                  checked: displayDate,
                  onChange: () => setAttributes({ displayDate: !displayDate })
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              hasValue: () => displayContent !== "excerpt",
              label: __("Display content"),
              onDeselect: () => setAttributes({ displayContent: "excerpt" }),
              isShownByDefault: true,
              children: /* @__PURE__ */ jsx(
                SelectControl,
                {
                  __next40pxDefaultSize: true,
                  label: __("Display content"),
                  value: displayContent,
                  options: [
                    { label: __("No content"), value: "none" },
                    { label: __("Excerpt"), value: "excerpt" },
                    { label: __("Full content"), value: "full" }
                  ],
                  onChange: (value) => setAttributes({
                    displayContent: value
                  })
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            ToolsPanelItem,
            {
              hasValue: () => commentsToShow !== 5,
              label: __("Number of comments"),
              onDeselect: () => setAttributes({ commentsToShow: 5 }),
              isShownByDefault: true,
              children: /* @__PURE__ */ jsx(
                RangeControl,
                {
                  __next40pxDefaultSize: true,
                  label: __("Number of comments"),
                  value: commentsToShow,
                  onChange: (value) => setAttributes({ commentsToShow: value }),
                  min: MIN_COMMENTS,
                  max: MAX_COMMENTS,
                  required: true
                }
              )
            }
          )
        ]
      }
    ) }),
    status === "loading" && /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(Spinner, {}) }),
    status === "error" && /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx("p", { children: sprintf(
      /* translators: %s: error message returned when rendering the block. */
      __("Error: %s"),
      error
    ) }) }),
    status === "success" && /* @__PURE__ */ jsx(HtmlRenderer, { wrapperProps: blockProps, html: content })
  ] });
}
export {
  LatestComments as default
};
//# sourceMappingURL=edit.mjs.map
