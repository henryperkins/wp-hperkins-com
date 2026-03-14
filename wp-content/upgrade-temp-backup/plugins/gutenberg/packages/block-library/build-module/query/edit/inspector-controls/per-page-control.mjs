// packages/block-library/src/query/edit/inspector-controls/per-page-control.js
import { RangeControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
var MIN_POSTS_PER_PAGE = 1;
var MAX_POSTS_PER_PAGE = 100;
var PerPageControl = ({ perPage, offset = 0, onChange }) => {
  return /* @__PURE__ */ jsx(
    RangeControl,
    {
      __next40pxDefaultSize: true,
      label: __("Items per page"),
      min: MIN_POSTS_PER_PAGE,
      max: MAX_POSTS_PER_PAGE,
      onChange: (newPerPage) => {
        if (isNaN(newPerPage) || newPerPage < MIN_POSTS_PER_PAGE || newPerPage > MAX_POSTS_PER_PAGE) {
          return;
        }
        onChange({ perPage: newPerPage, offset });
      },
      value: parseInt(perPage, 10)
    }
  );
};
var per_page_control_default = PerPageControl;
export {
  per_page_control_default as default
};
//# sourceMappingURL=per-page-control.mjs.map
