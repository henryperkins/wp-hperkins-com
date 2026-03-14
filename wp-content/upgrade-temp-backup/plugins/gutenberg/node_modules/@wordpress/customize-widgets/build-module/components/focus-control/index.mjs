// packages/customize-widgets/src/components/focus-control/index.js
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo
} from "@wordpress/element";
import { settingIdToWidgetId } from "../../utils.mjs";
import { jsx } from "react/jsx-runtime";
var FocusControlContext = createContext();
FocusControlContext.displayName = "FocusControlContext";
function FocusControl({ api, sidebarControls, children }) {
  const [focusedWidgetIdRef, setFocusedWidgetIdRef] = useState({
    current: null
  });
  const focusWidget = useCallback(
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
  useEffect(() => {
    function handleFocus(settingId) {
      const widgetId = settingIdToWidgetId(settingId);
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
  const context = useMemo(
    () => [focusedWidgetIdRef, focusWidget],
    [focusedWidgetIdRef, focusWidget]
  );
  return /* @__PURE__ */ jsx(FocusControlContext.Provider, { value: context, children });
}
var useFocusControl = () => useContext(FocusControlContext);
export {
  FocusControl as default,
  useFocusControl
};
//# sourceMappingURL=index.mjs.map
