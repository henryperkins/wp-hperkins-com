// packages/block-library/src/query/edit/inspector-controls/pages-control.js
import { __experimentalNumberControl as NumberControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
var PagesControl = ({ pages, onChange }) => {
  return /* @__PURE__ */ jsx(
    NumberControl,
    {
      __next40pxDefaultSize: true,
      label: __("Max pages to show"),
      value: pages,
      min: 0,
      onChange: (newPages) => {
        if (isNaN(newPages) || newPages < 0) {
          return;
        }
        onChange({ pages: newPages });
      },
      help: __(
        "Limit the pages you want to show, even if the query has more results. To show all pages use 0 (zero)."
      )
    }
  );
};
var pages_control_default = PagesControl;
export {
  PagesControl,
  pages_control_default as default
};
//# sourceMappingURL=pages-control.mjs.map
