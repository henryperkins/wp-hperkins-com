// packages/block-editor/src/components/link-picker/link-picker.js
import {
  BaseControl,
  Button,
  Popover,
  VisuallyHidden,
  useBaseControlProps
} from "@wordpress/components";
import { useState, useId, useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import LinkControl from "../link-control/index.mjs";
import { LinkPreview } from "./link-preview.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function LinkPicker({
  preview,
  onSelect,
  suggestionsQuery,
  label,
  help
}) {
  const [isOpen, setIsOpen] = useState(false);
  const instanceId = useId();
  const dialogTitleId = `link-picker-title-${instanceId}`;
  const dialogDescriptionId = `link-picker-description-${instanceId}`;
  const anchorRef = useRef(null);
  const { baseControlProps, controlProps } = useBaseControlProps({
    help
  });
  const handleChange = (newValue) => {
    setIsOpen(false);
    if (newValue) {
      const suggestion = {
        url: newValue.url,
        kind: newValue.kind,
        type: newValue.type,
        id: newValue.id,
        title: newValue.title
      };
      onSelect(suggestion);
    }
  };
  return /* @__PURE__ */ jsxs(BaseControl, { ...baseControlProps, children: [
    /* @__PURE__ */ jsx(BaseControl.VisualLabel, { children: label }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        ref: anchorRef,
        onClick: () => setIsOpen(!isOpen),
        "aria-haspopup": "dialog",
        "aria-expanded": isOpen,
        "aria-describedby": controlProps["aria-describedby"],
        variant: "secondary",
        __next40pxDefaultSize: true,
        className: "link-preview-button",
        children: [
          label && /* @__PURE__ */ jsxs(VisuallyHidden, { children: [
            label,
            ":"
          ] }),
          /* @__PURE__ */ jsx(
            LinkPreview,
            {
              title: preview.title || __("Add link"),
              url: preview.url,
              image: preview.image,
              badges: preview.badges
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsx(
      Popover,
      {
        anchor: anchorRef.current,
        onClose: () => setIsOpen(false),
        placement: "left-start",
        offset: 36,
        shift: true,
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            role: "dialog",
            "aria-labelledby": dialogTitleId,
            "aria-describedby": dialogDescriptionId,
            children: [
              /* @__PURE__ */ jsxs(VisuallyHidden, { children: [
                /* @__PURE__ */ jsx("h2", { id: dialogTitleId, children: __("Select a link") }),
                /* @__PURE__ */ jsx("p", { id: dialogDescriptionId, children: __(
                  "Search for and add a link to the navigation item."
                ) })
              ] }),
              /* @__PURE__ */ jsx(
                LinkControl,
                {
                  value: null,
                  onChange: handleChange,
                  suggestionsQuery,
                  showInitialSuggestions: true,
                  forceIsEditingLink: true,
                  settings: []
                }
              )
            ]
          }
        )
      }
    )
  ] });
}
export {
  LinkPicker
};
//# sourceMappingURL=link-picker.mjs.map
