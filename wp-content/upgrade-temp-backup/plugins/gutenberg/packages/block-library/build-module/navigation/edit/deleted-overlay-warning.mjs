// packages/block-library/src/navigation/edit/deleted-overlay-warning.js
import { Notice, Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { createInterpolateElement } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
function DeletedOverlayWarning({ onClear, onCreate, isCreating = false }) {
  const message = createInterpolateElement(
    __(
      "The selected overlay template part is missing or has been deleted. <clearButton>Reset to default overlay</clearButton> or <createButton>create a new overlay</createButton>."
    ),
    {
      clearButton: /* @__PURE__ */ jsx(
        Button,
        {
          __next40pxDefaultSize: true,
          onClick: onClear,
          variant: "link",
          disabled: isCreating,
          accessibleWhenDisabled: true
        }
      ),
      createButton: /* @__PURE__ */ jsx(
        Button,
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
  return /* @__PURE__ */ jsx(
    Notice,
    {
      status: "warning",
      isDismissible: false,
      className: "wp-block-navigation__deleted-overlay-warning",
      children: message
    }
  );
}
var deleted_overlay_warning_default = DeletedOverlayWarning;
export {
  deleted_overlay_warning_default as default
};
//# sourceMappingURL=deleted-overlay-warning.mjs.map
