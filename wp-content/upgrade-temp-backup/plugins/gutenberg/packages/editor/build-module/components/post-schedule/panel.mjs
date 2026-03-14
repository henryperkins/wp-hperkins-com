// packages/editor/src/components/post-schedule/panel.js
import { Button, Dropdown } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { useState, useMemo } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import PostScheduleCheck from "./check.mjs";
import PostScheduleForm from "./index.mjs";
import { usePostScheduleLabel } from "./label.mjs";
import PostPanelRow from "../post-panel-row/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { DESIGN_POST_TYPES } from "../../store/constants.mjs";
import { jsx } from "react/jsx-runtime";
function PostSchedulePanel() {
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const postType = useSelect(
    (select) => select(editorStore).getCurrentPostType(),
    []
  );
  const popoverProps = useMemo(
    () => ({
      // Anchor the popover to the middle of the entire row so that it doesn't
      // move around when the label changes.
      anchor: popoverAnchor,
      "aria-label": __("Change publish date"),
      placement: "left-start",
      offset: 36,
      shift: true
    }),
    [popoverAnchor]
  );
  const label = usePostScheduleLabel();
  const fullLabel = usePostScheduleLabel({ full: true });
  if (DESIGN_POST_TYPES.includes(postType)) {
    return null;
  }
  return /* @__PURE__ */ jsx(PostScheduleCheck, { children: /* @__PURE__ */ jsx(PostPanelRow, { label: __("Publish"), ref: setPopoverAnchor, children: /* @__PURE__ */ jsx(
    Dropdown,
    {
      popoverProps,
      focusOnMount: true,
      className: "editor-post-schedule__panel-dropdown",
      contentClassName: "editor-post-schedule__dialog",
      renderToggle: ({ onToggle, isOpen }) => /* @__PURE__ */ jsx(
        Button,
        {
          size: "compact",
          className: "editor-post-schedule__dialog-toggle",
          variant: "tertiary",
          tooltipPosition: "middle left",
          onClick: onToggle,
          "aria-label": sprintf(
            // translators: %s: Current post date.
            __("Change date: %s"),
            label
          ),
          label: fullLabel,
          showTooltip: label !== fullLabel,
          "aria-expanded": isOpen,
          children: label
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ jsx(PostScheduleForm, { onClose })
    }
  ) }) });
}
export {
  PostSchedulePanel as default
};
//# sourceMappingURL=panel.mjs.map
