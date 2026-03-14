// packages/editor/src/components/post-format/panel.js
import { Button, Dropdown } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { useState, useMemo } from "@wordpress/element";
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from "@wordpress/block-editor";
import { default as PostFormatForm, POST_FORMATS } from "./index.mjs";
import PostFormatCheck from "./check.mjs";
import PostPanelRow from "../post-panel-row/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function PostFormat() {
  const { postFormat } = useSelect((select) => {
    const { getEditedPostAttribute } = select(editorStore);
    const _postFormat = getEditedPostAttribute("format");
    return {
      postFormat: _postFormat ?? "standard"
    };
  }, []);
  const activeFormat = POST_FORMATS.find(
    (format) => format.id === postFormat
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
  return /* @__PURE__ */ jsx(PostFormatCheck, { children: /* @__PURE__ */ jsx(PostPanelRow, { label: __("Format"), ref: setPopoverAnchor, children: /* @__PURE__ */ jsx(
    Dropdown,
    {
      popoverProps,
      contentClassName: "editor-post-format__dialog",
      focusOnMount: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ jsx(
        Button,
        {
          size: "compact",
          variant: "tertiary",
          "aria-expanded": isOpen,
          "aria-label": sprintf(
            // translators: %s: Current post format.
            __("Change format: %s"),
            activeFormat?.caption
          ),
          onClick: onToggle,
          children: activeFormat?.caption
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ jsxs("div", { className: "editor-post-format__dialog-content", children: [
        /* @__PURE__ */ jsx(
          InspectorPopoverHeader,
          {
            title: __("Format"),
            onClose
          }
        ),
        /* @__PURE__ */ jsx(PostFormatForm, {})
      ] })
    }
  ) }) });
}
var panel_default = PostFormat;
export {
  panel_default as default
};
//# sourceMappingURL=panel.mjs.map
