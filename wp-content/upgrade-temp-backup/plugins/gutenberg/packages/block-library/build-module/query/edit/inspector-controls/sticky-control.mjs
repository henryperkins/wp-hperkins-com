// packages/block-library/src/query/edit/inspector-controls/sticky-control.js
import { SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
var stickyOptions = [
  { label: __("Include"), value: "" },
  { label: __("Ignore"), value: "ignore" },
  { label: __("Exclude"), value: "exclude" },
  { label: __("Only"), value: "only" }
];
function StickyControl({ value, onChange }) {
  return /* @__PURE__ */ jsx(
    SelectControl,
    {
      __next40pxDefaultSize: true,
      label: __("Sticky posts"),
      options: stickyOptions,
      value,
      onChange,
      help: __(
        "Sticky posts always appear first, regardless of their publish date."
      )
    }
  );
}
export {
  StickyControl as default
};
//# sourceMappingURL=sticky-control.mjs.map
