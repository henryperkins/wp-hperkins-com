// packages/customize-widgets/src/filters/wide-widget-display.js
var import_compose = require("@wordpress/compose");
var import_hooks = require("@wordpress/hooks");
var import_jsx_runtime = require("react/jsx-runtime");
var { wp } = window;
var withWideWidgetDisplay = (0, import_compose.createHigherOrderComponent)(
  (BlockEdit) => (props) => {
    const { idBase } = props.attributes;
    const isWide = wp.customize.Widgets.data.availableWidgets.find(
      (widget) => widget.id_base === idBase
    )?.is_wide ?? false;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockEdit, { ...props, isWide }, "edit");
  },
  "withWideWidgetDisplay"
);
(0, import_hooks.addFilter)(
  "editor.BlockEdit",
  "core/customize-widgets/wide-widget-display",
  withWideWidgetDisplay
);
//# sourceMappingURL=wide-widget-display.cjs.map
