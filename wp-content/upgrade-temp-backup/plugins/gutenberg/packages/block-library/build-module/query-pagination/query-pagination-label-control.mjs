// packages/block-library/src/query-pagination/query-pagination-label-control.js
import { __ } from "@wordpress/i18n";
import { ToggleControl } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
function QueryPaginationLabelControl({ value, onChange }) {
  return /* @__PURE__ */ jsx(
    ToggleControl,
    {
      label: __("Show label text"),
      help: __('Make label text visible, e.g. "Next Page".'),
      onChange,
      checked: value === true
    }
  );
}
export {
  QueryPaginationLabelControl
};
//# sourceMappingURL=query-pagination-label-control.mjs.map
