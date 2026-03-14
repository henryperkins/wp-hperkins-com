// packages/global-styles-ui/src/font-sizes/rename-font-size-dialog.tsx
import {
  __experimentalInputControl as InputControl,
  __experimentalVStack as VStack,
  __experimentalHStack as HStack,
  Button,
  Modal
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { jsx, jsxs } from "react/jsx-runtime";
function RenameFontSizeDialog({
  fontSize,
  toggleOpen,
  handleRename
}) {
  const [newName, setNewName] = useState(
    fontSize.name
  );
  const handleConfirm = () => {
    if (newName && newName.trim()) {
      handleRename(newName);
    }
    toggleOpen();
  };
  return /* @__PURE__ */ jsx(
    Modal,
    {
      onRequestClose: toggleOpen,
      focusOnMount: "firstContentElement",
      title: __("Rename"),
      size: "small",
      children: /* @__PURE__ */ jsx(
        "form",
        {
          onSubmit: (event) => {
            event.preventDefault();
            handleConfirm();
            toggleOpen();
          },
          children: /* @__PURE__ */ jsxs(VStack, { spacing: "3", children: [
            /* @__PURE__ */ jsx(
              InputControl,
              {
                __next40pxDefaultSize: true,
                autoComplete: "off",
                value: newName,
                onChange: setNewName,
                label: __("Name"),
                placeholder: __("Font size preset name")
              }
            ),
            /* @__PURE__ */ jsxs(HStack, { justify: "right", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  __next40pxDefaultSize: true,
                  variant: "tertiary",
                  onClick: toggleOpen,
                  children: __("Cancel")
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  __next40pxDefaultSize: true,
                  variant: "primary",
                  type: "submit",
                  children: __("Save")
                }
              )
            ] })
          ] })
        }
      )
    }
  );
}
var rename_font_size_dialog_default = RenameFontSizeDialog;
export {
  rename_font_size_dialog_default as default
};
//# sourceMappingURL=rename-font-size-dialog.mjs.map
