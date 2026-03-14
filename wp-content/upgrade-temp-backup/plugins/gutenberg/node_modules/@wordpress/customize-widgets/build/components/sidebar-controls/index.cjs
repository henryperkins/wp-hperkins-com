var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/customize-widgets/src/components/sidebar-controls/index.js
var sidebar_controls_exports = {};
__export(sidebar_controls_exports, {
  SidebarControlsContext: () => SidebarControlsContext,
  default: () => SidebarControls,
  useActiveSidebarControl: () => useActiveSidebarControl,
  useSidebarControls: () => useSidebarControls
});
module.exports = __toCommonJS(sidebar_controls_exports);
var import_element = require("@wordpress/element");
var import_jsx_runtime = require("react/jsx-runtime");
var SidebarControlsContext = (0, import_element.createContext)();
SidebarControlsContext.displayName = "SidebarControlsContext";
function SidebarControls({
  sidebarControls,
  activeSidebarControl,
  children
}) {
  const context = (0, import_element.useMemo)(
    () => ({
      sidebarControls,
      activeSidebarControl
    }),
    [sidebarControls, activeSidebarControl]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarControlsContext.Provider, { value: context, children });
}
function useSidebarControls() {
  const { sidebarControls } = (0, import_element.useContext)(SidebarControlsContext);
  return sidebarControls;
}
function useActiveSidebarControl() {
  const { activeSidebarControl } = (0, import_element.useContext)(SidebarControlsContext);
  return activeSidebarControl;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SidebarControlsContext,
  useActiveSidebarControl,
  useSidebarControls
});
//# sourceMappingURL=index.cjs.map
