// packages/block-library/src/terms-query/edit/inspector-controls/max-terms-control.js
import { __ } from "@wordpress/i18n";
import { RangeControl } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
function MaxTermsControl({ value, onChange, ...props }) {
  return /* @__PURE__ */ jsx(
    RangeControl,
    {
      __next40pxDefaultSize: true,
      value,
      min: 0,
      max: 100,
      onChange,
      help: __(
        "Limit the number of terms you want to show. To show all terms, use 0 (zero)."
      ),
      ...props
    }
  );
}
export {
  MaxTermsControl as default
};
//# sourceMappingURL=max-terms-control.mjs.map
