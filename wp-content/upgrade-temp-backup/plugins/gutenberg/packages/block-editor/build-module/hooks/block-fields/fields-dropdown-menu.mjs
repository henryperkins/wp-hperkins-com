// packages/block-editor/src/hooks/block-fields/fields-dropdown-menu.js
import { DropdownMenu, MenuGroup, MenuItem } from "@wordpress/components";
import { moreVertical, check } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import { useInspectorPopoverPlacement } from "./use-inspector-popover-placement.mjs";
import { jsx } from "react/jsx-runtime";
function FieldsDropdownMenu({
  fields,
  visibleFields,
  onToggleField
}) {
  const { popoverProps } = useInspectorPopoverPlacement();
  if (!fields || fields.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    DropdownMenu,
    {
      icon: moreVertical,
      label: __("Options"),
      popoverProps,
      toggleProps: { size: "small" },
      children: ({ onClose }) => /* @__PURE__ */ jsx(MenuGroup, { label: __("Show / Hide"), children: fields.map((field) => {
        const isVisible = visibleFields.includes(field.id);
        return /* @__PURE__ */ jsx(
          MenuItem,
          {
            isSelected: isVisible,
            onClick: () => {
              onToggleField(field.id);
              onClose();
            },
            role: "menuitemcheckbox",
            icon: isVisible ? check : null,
            children: field.label
          },
          field.id
        );
      }) })
    }
  );
}
export {
  FieldsDropdownMenu as default
};
//# sourceMappingURL=fields-dropdown-menu.mjs.map
