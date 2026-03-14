// packages/block-editor/src/components/image-editor/form-controls.js
import { ToolbarButton } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useImageEditingContext } from "./context.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function FormControls() {
  const { isInProgress, apply, cancel } = useImageEditingContext();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ToolbarButton, { onClick: apply, disabled: isInProgress, children: __("Apply") }),
    /* @__PURE__ */ jsx(ToolbarButton, { onClick: cancel, children: __("Cancel") })
  ] });
}
export {
  FormControls as default
};
//# sourceMappingURL=form-controls.mjs.map
