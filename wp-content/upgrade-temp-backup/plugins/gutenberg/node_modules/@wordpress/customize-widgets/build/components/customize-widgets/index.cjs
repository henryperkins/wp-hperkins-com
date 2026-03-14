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

// packages/customize-widgets/src/components/customize-widgets/index.js
var customize_widgets_exports = {};
__export(customize_widgets_exports, {
  default: () => CustomizeWidgets
});
module.exports = __toCommonJS(customize_widgets_exports);
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_error_boundary = __toESM(require("../error-boundary/index.cjs"));
var import_sidebar_block_editor = __toESM(require("../sidebar-block-editor/index.cjs"));
var import_focus_control = __toESM(require("../focus-control/index.cjs"));
var import_sidebar_controls = __toESM(require("../sidebar-controls/index.cjs"));
var import_use_clear_selected_block = __toESM(require("./use-clear-selected-block.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function CustomizeWidgets({
  api,
  sidebarControls,
  blockEditorSettings
}) {
  const [activeSidebarControl, setActiveSidebarControl] = (0, import_element.useState)(null);
  const parentContainer = document.getElementById(
    "customize-theme-controls"
  );
  const popoverRef = (0, import_element.useRef)();
  (0, import_use_clear_selected_block.default)(activeSidebarControl, popoverRef);
  (0, import_element.useEffect)(() => {
    const unsubscribers = sidebarControls.map(
      (sidebarControl) => sidebarControl.subscribe((expanded) => {
        if (expanded) {
          setActiveSidebarControl(sidebarControl);
        }
      })
    );
    return () => {
      unsubscribers.forEach((unsubscriber) => unsubscriber());
    };
  }, [sidebarControls]);
  const activeSidebar = activeSidebarControl && (0, import_element.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_error_boundary.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_sidebar_block_editor.default,
      {
        blockEditorSettings,
        sidebar: activeSidebarControl.sidebarAdapter,
        inserter: activeSidebarControl.inserter,
        inspector: activeSidebarControl.inspector
      },
      activeSidebarControl.id
    ) }),
    activeSidebarControl.container[0]
  );
  const popover = parentContainer && (0, import_element.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "customize-widgets-popover", ref: popoverRef, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Popover.Slot, {}) }),
    parentContainer
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.SlotFillProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_sidebar_controls.default,
    {
      sidebarControls,
      activeSidebarControl,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_focus_control.default, { api, sidebarControls, children: [
        activeSidebar,
        popover
      ] })
    }
  ) });
}
//# sourceMappingURL=index.cjs.map
