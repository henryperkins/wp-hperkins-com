// packages/block-library/src/terms-query/edit/inspector-controls/empty-terms-control.js
import { ToggleControl } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
function EmptyTermsControl({ value, onChange, ...props }) {
  return /* @__PURE__ */ jsx(
    ToggleControl,
    {
      checked: !value,
      onChange: (showEmpty) => onChange(!showEmpty),
      ...props
    }
  );
}
export {
  EmptyTermsControl as default
};
//# sourceMappingURL=empty-terms-control.mjs.map
