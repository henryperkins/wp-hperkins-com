// packages/editor/src/components/inserter-sidebar/index.js
import { useDispatch, useSelect } from "@wordpress/data";
import {
  store as blockEditorStore,
  privateApis as blockEditorPrivateApis
} from "@wordpress/block-editor";
import { useViewportMatch } from "@wordpress/compose";
import { useCallback, useRef } from "@wordpress/element";
import { store as preferencesStore } from "@wordpress/preferences";
import { ESCAPE } from "@wordpress/keycodes";
import { store as interfaceStore } from "@wordpress/interface";
import { unlock } from "../../lock-unlock.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
var { PrivateInserterLibrary } = unlock(blockEditorPrivateApis);
function InserterSidebar() {
  const {
    blockSectionRootClientId,
    inserterSidebarToggleRef,
    inserter,
    showMostUsedBlocks,
    sidebarIsOpened
  } = useSelect((select) => {
    const {
      getInserterSidebarToggleRef,
      getInserter,
      isPublishSidebarOpened
    } = unlock(select(editorStore));
    const { getBlockRootClientId, isZoomOut, getSectionRootClientId } = unlock(select(blockEditorStore));
    const { get } = select(preferencesStore);
    const { getActiveComplementaryArea } = select(interfaceStore);
    const getBlockSectionRootClientId = () => {
      if (isZoomOut()) {
        const sectionRootClientId = getSectionRootClientId();
        if (sectionRootClientId) {
          return sectionRootClientId;
        }
      }
      return getBlockRootClientId();
    };
    return {
      inserterSidebarToggleRef: getInserterSidebarToggleRef(),
      inserter: getInserter(),
      showMostUsedBlocks: get("core", "mostUsedBlocks"),
      blockSectionRootClientId: getBlockSectionRootClientId(),
      sidebarIsOpened: !!(getActiveComplementaryArea("core") || isPublishSidebarOpened())
    };
  }, []);
  const { setIsInserterOpened } = useDispatch(editorStore);
  const { disableComplementaryArea } = useDispatch(interfaceStore);
  const isMobileViewport = useViewportMatch("medium", "<");
  const libraryRef = useRef();
  const closeInserterSidebar = useCallback(() => {
    setIsInserterOpened(false);
    inserterSidebarToggleRef.current?.focus();
  }, [inserterSidebarToggleRef, setIsInserterOpened]);
  const closeOnEscape = useCallback(
    (event) => {
      if (event.keyCode === ESCAPE && !event.defaultPrevented) {
        event.preventDefault();
        closeInserterSidebar();
      }
    },
    [closeInserterSidebar]
  );
  const inserterContents = /* @__PURE__ */ jsx("div", { className: "editor-inserter-sidebar__content", children: /* @__PURE__ */ jsx(
    PrivateInserterLibrary,
    {
      showMostUsedBlocks,
      showInserterHelpPanel: true,
      shouldFocusBlock: isMobileViewport,
      rootClientId: blockSectionRootClientId,
      onSelect: inserter.onSelect,
      __experimentalInitialTab: inserter.tab,
      __experimentalInitialCategory: inserter.category,
      __experimentalFilterValue: inserter.filterValue,
      onPatternCategorySelection: sidebarIsOpened ? () => disableComplementaryArea("core") : void 0,
      ref: libraryRef,
      onClose: closeInserterSidebar
    }
  ) });
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    /* @__PURE__ */ jsx("div", { onKeyDown: closeOnEscape, className: "editor-inserter-sidebar", children: inserterContents })
  );
}
export {
  InserterSidebar as default
};
//# sourceMappingURL=index.mjs.map
