// packages/edit-widgets/src/components/secondary-sidebar/inserter-sidebar.js
import { __experimentalLibrary as Library } from "@wordpress/block-editor";
import { useViewportMatch } from "@wordpress/compose";
import { useCallback, useRef } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import useWidgetLibraryInsertionPoint from "../../hooks/use-widget-library-insertion-point.mjs";
import { store as editWidgetsStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function InserterSidebar() {
  const isMobileViewport = useViewportMatch("medium", "<");
  const { rootClientId, insertionIndex } = useWidgetLibraryInsertionPoint();
  const { setIsInserterOpened } = useDispatch(editWidgetsStore);
  const closeInserter = useCallback(() => {
    return setIsInserterOpened(false);
  }, [setIsInserterOpened]);
  const libraryRef = useRef();
  return /* @__PURE__ */ jsx("div", { className: "edit-widgets-layout__inserter-panel", children: /* @__PURE__ */ jsx("div", { className: "edit-widgets-layout__inserter-panel-content", children: /* @__PURE__ */ jsx(
    Library,
    {
      showInserterHelpPanel: true,
      shouldFocusBlock: isMobileViewport,
      rootClientId,
      __experimentalInsertionIndex: insertionIndex,
      ref: libraryRef,
      onClose: closeInserter
    }
  ) }) });
}
export {
  InserterSidebar as default
};
//# sourceMappingURL=inserter-sidebar.mjs.map
