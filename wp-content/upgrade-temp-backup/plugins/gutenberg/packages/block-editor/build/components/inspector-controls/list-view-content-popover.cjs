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

// packages/block-editor/src/components/inspector-controls/list-view-content-popover.js
var list_view_content_popover_exports = {};
__export(list_view_content_popover_exports, {
  ListViewContentFill: () => Fill,
  ListViewContentPopover: () => ListViewContentPopover
});
module.exports = __toCommonJS(list_view_content_popover_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var LIST_VIEW_CONTENT_PANEL_SLOT = /* @__PURE__ */ Symbol("ListViewContentPopover");
var { Fill, Slot } = (0, import_components.createSlotFill)(LIST_VIEW_CONTENT_PANEL_SLOT);
function useInspectorPopoverPlacement() {
  const isMobile = (0, import_compose.useViewportMatch)("medium", "<");
  return !isMobile ? {
    popoverProps: {
      placement: "left-start",
      offset: 35,
      resize: false
    }
  } : {};
}
function ListViewContentPopover({ listViewRef }) {
  const { popoverProps } = useInspectorPopoverPlacement();
  const fills = (0, import_components.__experimentalUseSlotFills)(LIST_VIEW_CONTENT_PANEL_SLOT);
  const hasFills = Boolean(fills && fills.length);
  const { selectedClientId, isOpen } = (0, import_data.useSelect)((select) => {
    const { getSelectedBlockClientId } = select(import_store.store);
    const privateSelectors = (0, import_lock_unlock.unlock)(select(import_store.store));
    return {
      selectedClientId: getSelectedBlockClientId(),
      isOpen: privateSelectors.isListViewContentPanelOpen()
    };
  }, []);
  const [anchorElement, setAnchorElement] = (0, import_element.useState)(null);
  (0, import_element.useLayoutEffect)(() => {
    if (!selectedClientId || !listViewRef?.current) {
      setAnchorElement(null);
      return;
    }
    const element = listViewRef.current.querySelector(
      `[data-block="${selectedClientId}"]`
    );
    setAnchorElement(element);
  }, [selectedClientId, listViewRef]);
  const { closeListViewContentPanel } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_store.store)
  );
  if (!isOpen || !hasFills || !anchorElement) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Popover,
    {
      ...popoverProps ?? {},
      className: "block-editor-inspector-list-view-content-popover",
      anchor: anchorElement,
      onClose: closeListViewContentPanel,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: "280px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slot, {}) })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ListViewContentFill,
  ListViewContentPopover
});
//# sourceMappingURL=list-view-content-popover.cjs.map
