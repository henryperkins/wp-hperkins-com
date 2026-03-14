// packages/customize-widgets/src/components/sidebar-controls/index.js
import { createContext, useMemo, useContext } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
var SidebarControlsContext = createContext();
SidebarControlsContext.displayName = "SidebarControlsContext";
function SidebarControls({
  sidebarControls,
  activeSidebarControl,
  children
}) {
  const context = useMemo(
    () => ({
      sidebarControls,
      activeSidebarControl
    }),
    [sidebarControls, activeSidebarControl]
  );
  return /* @__PURE__ */ jsx(SidebarControlsContext.Provider, { value: context, children });
}
function useSidebarControls() {
  const { sidebarControls } = useContext(SidebarControlsContext);
  return sidebarControls;
}
function useActiveSidebarControl() {
  const { activeSidebarControl } = useContext(SidebarControlsContext);
  return activeSidebarControl;
}
export {
  SidebarControlsContext,
  SidebarControls as default,
  useActiveSidebarControl,
  useSidebarControls
};
//# sourceMappingURL=index.mjs.map
