// packages/customize-widgets/src/filters/wide-widget-display.js
import { createHigherOrderComponent } from "@wordpress/compose";
import { addFilter } from "@wordpress/hooks";
import { jsx } from "react/jsx-runtime";
var { wp } = window;
var withWideWidgetDisplay = createHigherOrderComponent(
  (BlockEdit) => (props) => {
    const { idBase } = props.attributes;
    const isWide = wp.customize.Widgets.data.availableWidgets.find(
      (widget) => widget.id_base === idBase
    )?.is_wide ?? false;
    return /* @__PURE__ */ jsx(BlockEdit, { ...props, isWide }, "edit");
  },
  "withWideWidgetDisplay"
);
addFilter(
  "editor.BlockEdit",
  "core/customize-widgets/wide-widget-display",
  withWideWidgetDisplay
);
//# sourceMappingURL=wide-widget-display.mjs.map
