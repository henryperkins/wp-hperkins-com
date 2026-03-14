"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/hooks/block-fields/fields-dropdown-menu.js
var fields_dropdown_menu_exports = {};
__export(fields_dropdown_menu_exports, {
  default: () => FieldsDropdownMenu
});
module.exports = __toCommonJS(fields_dropdown_menu_exports);
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_i18n = require("@wordpress/i18n");
var import_use_inspector_popover_placement = require("./use-inspector-popover-placement.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function FieldsDropdownMenu({
  fields,
  visibleFields,
  onToggleField
}) {
  const { popoverProps } = (0, import_use_inspector_popover_placement.useInspectorPopoverPlacement)();
  if (!fields || fields.length === 0) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.DropdownMenu,
    {
      icon: import_icons.moreVertical,
      label: (0, import_i18n.__)("Options"),
      popoverProps,
      toggleProps: { size: "small" },
      children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { label: (0, import_i18n.__)("Show / Hide"), children: fields.map((field) => {
        const isVisible = visibleFields.includes(field.id);
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.MenuItem,
          {
            isSelected: isVisible,
            onClick: () => {
              onToggleField(field.id);
              onClose();
            },
            role: "menuitemcheckbox",
            icon: isVisible ? import_icons.check : null,
            children: field.label
          },
          field.id
        );
      }) })
    }
  );
}
//# sourceMappingURL=fields-dropdown-menu.cjs.map
