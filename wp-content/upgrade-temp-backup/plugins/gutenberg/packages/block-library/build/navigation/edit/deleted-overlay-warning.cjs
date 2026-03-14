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

// packages/block-library/src/navigation/edit/deleted-overlay-warning.js
var deleted_overlay_warning_exports = {};
__export(deleted_overlay_warning_exports, {
  default: () => deleted_overlay_warning_default
});
module.exports = __toCommonJS(deleted_overlay_warning_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_jsx_runtime = require("react/jsx-runtime");
function DeletedOverlayWarning({ onClear, onCreate, isCreating = false }) {
  const message = (0, import_element.createInterpolateElement)(
    (0, import_i18n.__)(
      "The selected overlay template part is missing or has been deleted. <clearButton>Reset to default overlay</clearButton> or <createButton>create a new overlay</createButton>."
    ),
    {
      clearButton: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          onClick: onClear,
          variant: "link",
          disabled: isCreating,
          accessibleWhenDisabled: true
        }
      ),
      createButton: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          onClick: onCreate,
          variant: "link",
          disabled: isCreating,
          accessibleWhenDisabled: true,
          isBusy: isCreating
        }
      )
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Notice,
    {
      status: "warning",
      isDismissible: false,
      className: "wp-block-navigation__deleted-overlay-warning",
      children: message
    }
  );
}
var deleted_overlay_warning_default = DeletedOverlayWarning;
//# sourceMappingURL=deleted-overlay-warning.cjs.map
