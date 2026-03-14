"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-schedule/panel.js
var panel_exports = {};
__export(panel_exports, {
  default: () => PostSchedulePanel
});
module.exports = __toCommonJS(panel_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_check = __toESM(require("./check.cjs"));
var import_index = __toESM(require("./index.cjs"));
var import_label = require("./label.cjs");
var import_post_panel_row = __toESM(require("../post-panel-row/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_constants = require("../../store/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostSchedulePanel() {
  const [popoverAnchor, setPopoverAnchor] = (0, import_element.useState)(null);
  const postType = (0, import_data.useSelect)(
    (select) => select(import_store.store).getCurrentPostType(),
    []
  );
  const popoverProps = (0, import_element.useMemo)(
    () => ({
      // Anchor the popover to the middle of the entire row so that it doesn't
      // move around when the label changes.
      anchor: popoverAnchor,
      "aria-label": (0, import_i18n.__)("Change publish date"),
      placement: "left-start",
      offset: 36,
      shift: true
    }),
    [popoverAnchor]
  );
  const label = (0, import_label.usePostScheduleLabel)();
  const fullLabel = (0, import_label.usePostScheduleLabel)({ full: true });
  if (import_constants.DESIGN_POST_TYPES.includes(postType)) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_check.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_panel_row.default, { label: (0, import_i18n.__)("Publish"), ref: setPopoverAnchor, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Dropdown,
    {
      popoverProps,
      focusOnMount: true,
      className: "editor-post-schedule__panel-dropdown",
      contentClassName: "editor-post-schedule__dialog",
      renderToggle: ({ onToggle, isOpen }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          size: "compact",
          className: "editor-post-schedule__dialog-toggle",
          variant: "tertiary",
          tooltipPosition: "middle left",
          onClick: onToggle,
          "aria-label": (0, import_i18n.sprintf)(
            // translators: %s: Current post date.
            (0, import_i18n.__)("Change date: %s"),
            label
          ),
          label: fullLabel,
          showTooltip: label !== fullLabel,
          "aria-expanded": isOpen,
          children: label
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_index.default, { onClose })
    }
  ) }) });
}
//# sourceMappingURL=panel.cjs.map
