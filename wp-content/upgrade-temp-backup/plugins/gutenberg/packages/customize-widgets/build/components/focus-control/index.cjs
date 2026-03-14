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

// packages/customize-widgets/src/components/focus-control/index.js
var focus_control_exports = {};
__export(focus_control_exports, {
  default: () => FocusControl,
  useFocusControl: () => useFocusControl
});
module.exports = __toCommonJS(focus_control_exports);
var import_element = require("@wordpress/element");
var import_utils = require("../../utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var FocusControlContext = (0, import_element.createContext)();
FocusControlContext.displayName = "FocusControlContext";
function FocusControl({ api, sidebarControls, children }) {
  const [focusedWidgetIdRef, setFocusedWidgetIdRef] = (0, import_element.useState)({
    current: null
  });
  const focusWidget = (0, import_element.useCallback)(
    (widgetId) => {
      for (const sidebarControl of sidebarControls) {
        const widgets = sidebarControl.setting.get();
        if (widgets.includes(widgetId)) {
          sidebarControl.sectionInstance.expand({
            // Schedule it after the complete callback so that
            // it won't be overridden by the "Back" button focus.
            completeCallback() {
              setFocusedWidgetIdRef({ current: widgetId });
            }
          });
          break;
        }
      }
    },
    [sidebarControls]
  );
  (0, import_element.useEffect)(() => {
    function handleFocus(settingId) {
      const widgetId = (0, import_utils.settingIdToWidgetId)(settingId);
      focusWidget(widgetId);
    }
    let previewBound = false;
    function handleReady() {
      api.previewer.preview.bind(
        "focus-control-for-setting",
        handleFocus
      );
      previewBound = true;
    }
    api.previewer.bind("ready", handleReady);
    return () => {
      api.previewer.unbind("ready", handleReady);
      if (previewBound) {
        api.previewer.preview.unbind(
          "focus-control-for-setting",
          handleFocus
        );
      }
    };
  }, [api, focusWidget]);
  const context = (0, import_element.useMemo)(
    () => [focusedWidgetIdRef, focusWidget],
    [focusedWidgetIdRef, focusWidget]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusControlContext.Provider, { value: context, children });
}
var useFocusControl = () => (0, import_element.useContext)(FocusControlContext);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useFocusControl
});
//# sourceMappingURL=index.cjs.map
