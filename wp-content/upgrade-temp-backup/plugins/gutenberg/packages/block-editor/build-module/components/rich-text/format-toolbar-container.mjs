// packages/block-editor/src/components/rich-text/format-toolbar-container.js
import { __ } from "@wordpress/i18n";
import { Popover, ToolbarGroup } from "@wordpress/components";
import BlockControls from "../block-controls/index.mjs";
import FormatToolbar from "./format-toolbar/index.mjs";
import NavigableToolbar from "../navigable-toolbar/index.mjs";
import { jsx } from "react/jsx-runtime";
function InlineToolbar({ popoverAnchor }) {
  return /* @__PURE__ */ jsx(
    Popover,
    {
      placement: "top",
      focusOnMount: false,
      anchor: popoverAnchor,
      className: "block-editor-rich-text__inline-format-toolbar",
      __unstableSlotName: "block-toolbar",
      children: /* @__PURE__ */ jsx(
        NavigableToolbar,
        {
          className: "block-editor-rich-text__inline-format-toolbar-group",
          "aria-label": __("Format tools"),
          children: /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(FormatToolbar, {}) })
        }
      )
    }
  );
}
var FormatToolbarContainer = ({ inline, editableContentElement }) => {
  if (inline) {
    return /* @__PURE__ */ jsx(InlineToolbar, { popoverAnchor: editableContentElement });
  }
  return /* @__PURE__ */ jsx(BlockControls, { group: "inline", children: /* @__PURE__ */ jsx(FormatToolbar, {}) });
};
var format_toolbar_container_default = FormatToolbarContainer;
export {
  format_toolbar_container_default as default
};
//# sourceMappingURL=format-toolbar-container.mjs.map
