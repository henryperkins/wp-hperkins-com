"use strict";
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

// packages/editor/src/components/inserter-sidebar/index.js
var inserter_sidebar_exports = {};
__export(inserter_sidebar_exports, {
  default: () => InserterSidebar
});
module.exports = __toCommonJS(inserter_sidebar_exports);
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_preferences = require("@wordpress/preferences");
var import_keycodes = require("@wordpress/keycodes");
var import_interface = require("@wordpress/interface");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { PrivateInserterLibrary } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function InserterSidebar() {
  const {
    blockSectionRootClientId,
    inserterSidebarToggleRef,
    inserter,
    showMostUsedBlocks,
    sidebarIsOpened
  } = (0, import_data.useSelect)((select) => {
    const {
      getInserterSidebarToggleRef,
      getInserter,
      isPublishSidebarOpened
    } = (0, import_lock_unlock.unlock)(select(import_store.store));
    const { getBlockRootClientId, isZoomOut, getSectionRootClientId } = (0, import_lock_unlock.unlock)(select(import_block_editor.store));
    const { get } = select(import_preferences.store);
    const { getActiveComplementaryArea } = select(import_interface.store);
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
  const { setIsInserterOpened } = (0, import_data.useDispatch)(import_store.store);
  const { disableComplementaryArea } = (0, import_data.useDispatch)(import_interface.store);
  const isMobileViewport = (0, import_compose.useViewportMatch)("medium", "<");
  const libraryRef = (0, import_element.useRef)();
  const closeInserterSidebar = (0, import_element.useCallback)(() => {
    setIsInserterOpened(false);
    inserterSidebarToggleRef.current?.focus();
  }, [inserterSidebarToggleRef, setIsInserterOpened]);
  const closeOnEscape = (0, import_element.useCallback)(
    (event) => {
      if (event.keyCode === import_keycodes.ESCAPE && !event.defaultPrevented) {
        event.preventDefault();
        closeInserterSidebar();
      }
    },
    [closeInserterSidebar]
  );
  const inserterContents = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-inserter-sidebar__content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { onKeyDown: closeOnEscape, className: "editor-inserter-sidebar", children: inserterContents })
  );
}
//# sourceMappingURL=index.cjs.map
