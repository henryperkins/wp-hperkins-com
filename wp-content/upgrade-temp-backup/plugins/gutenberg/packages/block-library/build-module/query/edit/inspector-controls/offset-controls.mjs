// packages/block-library/src/query/edit/inspector-controls/offset-controls.js
import { __experimentalNumberControl as NumberControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
var MIN_OFFSET = 0;
var MAX_OFFSET = 100;
var OffsetControl = ({ offset = 0, onChange }) => {
  return /* @__PURE__ */ jsx(
    NumberControl,
    {
      __next40pxDefaultSize: true,
      label: __("Offset"),
      value: offset,
      min: MIN_OFFSET,
      onChange: (newOffset) => {
        if (isNaN(newOffset) || newOffset < MIN_OFFSET || newOffset > MAX_OFFSET) {
          return;
        }
        onChange({ offset: newOffset });
      }
    }
  );
};
var offset_controls_default = OffsetControl;
export {
  OffsetControl,
  offset_controls_default as default
};
//# sourceMappingURL=offset-controls.mjs.map
