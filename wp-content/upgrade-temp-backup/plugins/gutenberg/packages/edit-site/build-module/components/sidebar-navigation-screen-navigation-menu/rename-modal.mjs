// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menu/rename-modal.js
import {
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  Button,
  TextControl,
  Modal
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { jsx, jsxs } from "react/jsx-runtime";
var notEmptyString = (testString) => testString?.trim()?.length > 0;
function RenameModal({ menuTitle, onClose, onSave }) {
  const [editedMenuTitle, setEditedMenuTitle] = useState(menuTitle);
  const titleHasChanged = editedMenuTitle !== menuTitle;
  const isEditedMenuTitleValid = titleHasChanged && notEmptyString(editedMenuTitle);
  return /* @__PURE__ */ jsx(
    Modal,
    {
      title: __("Rename"),
      onRequestClose: onClose,
      focusOnMount: "firstContentElement",
      size: "small",
      children: /* @__PURE__ */ jsx("form", { className: "sidebar-navigation__rename-modal-form", children: /* @__PURE__ */ jsxs(VStack, { spacing: "3", children: [
        /* @__PURE__ */ jsx(
          TextControl,
          {
            __next40pxDefaultSize: true,
            value: editedMenuTitle,
            placeholder: __("Navigation title"),
            onChange: setEditedMenuTitle,
            label: __("Name")
          }
        ),
        /* @__PURE__ */ jsxs(HStack, { justify: "right", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              variant: "tertiary",
              onClick: onClose,
              children: __("Cancel")
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              accessibleWhenDisabled: true,
              disabled: !isEditedMenuTitleValid,
              variant: "primary",
              type: "submit",
              onClick: (e) => {
                e.preventDefault();
                if (!isEditedMenuTitleValid) {
                  return;
                }
                onSave({ title: editedMenuTitle });
                onClose();
              },
              children: __("Save")
            }
          )
        ] })
      ] }) })
    }
  );
}
export {
  RenameModal as default
};
//# sourceMappingURL=rename-modal.mjs.map
