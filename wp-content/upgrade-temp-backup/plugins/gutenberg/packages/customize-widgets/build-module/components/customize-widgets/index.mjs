// packages/customize-widgets/src/components/customize-widgets/index.js
import { useState, useEffect, useRef, createPortal } from "@wordpress/element";
import { SlotFillProvider, Popover } from "@wordpress/components";
import ErrorBoundary from "../error-boundary/index.mjs";
import SidebarBlockEditor from "../sidebar-block-editor/index.mjs";
import FocusControl from "../focus-control/index.mjs";
import SidebarControls from "../sidebar-controls/index.mjs";
import useClearSelectedBlock from "./use-clear-selected-block.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function CustomizeWidgets({
  api,
  sidebarControls,
  blockEditorSettings
}) {
  const [activeSidebarControl, setActiveSidebarControl] = useState(null);
  const parentContainer = document.getElementById(
    "customize-theme-controls"
  );
  const popoverRef = useRef();
  useClearSelectedBlock(activeSidebarControl, popoverRef);
  useEffect(() => {
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
  const activeSidebar = activeSidebarControl && createPortal(
    /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(
      SidebarBlockEditor,
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
  const popover = parentContainer && createPortal(
    /* @__PURE__ */ jsx("div", { className: "customize-widgets-popover", ref: popoverRef, children: /* @__PURE__ */ jsx(Popover.Slot, {}) }),
    parentContainer
  );
  return /* @__PURE__ */ jsx(SlotFillProvider, { children: /* @__PURE__ */ jsx(
    SidebarControls,
    {
      sidebarControls,
      activeSidebarControl,
      children: /* @__PURE__ */ jsxs(FocusControl, { api, sidebarControls, children: [
        activeSidebar,
        popover
      ] })
    }
  ) });
}
export {
  CustomizeWidgets as default
};
//# sourceMappingURL=index.mjs.map
