// packages/block-editor/src/components/inspector-controls/list-view-content-popover.js
import {
  createSlotFill,
  Popover,
  __experimentalUseSlotFills as useSlotFills
} from "@wordpress/components";
import { useState, useLayoutEffect } from "@wordpress/element";
import { useViewportMatch } from "@wordpress/compose";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var LIST_VIEW_CONTENT_PANEL_SLOT = /* @__PURE__ */ Symbol("ListViewContentPopover");
var { Fill, Slot } = createSlotFill(LIST_VIEW_CONTENT_PANEL_SLOT);
function useInspectorPopoverPlacement() {
  const isMobile = useViewportMatch("medium", "<");
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
  const fills = useSlotFills(LIST_VIEW_CONTENT_PANEL_SLOT);
  const hasFills = Boolean(fills && fills.length);
  const { selectedClientId, isOpen } = useSelect((select) => {
    const { getSelectedBlockClientId } = select(blockEditorStore);
    const privateSelectors = unlock(select(blockEditorStore));
    return {
      selectedClientId: getSelectedBlockClientId(),
      isOpen: privateSelectors.isListViewContentPanelOpen()
    };
  }, []);
  const [anchorElement, setAnchorElement] = useState(null);
  useLayoutEffect(() => {
    if (!selectedClientId || !listViewRef?.current) {
      setAnchorElement(null);
      return;
    }
    const element = listViewRef.current.querySelector(
      `[data-block="${selectedClientId}"]`
    );
    setAnchorElement(element);
  }, [selectedClientId, listViewRef]);
  const { closeListViewContentPanel } = unlock(
    useDispatch(blockEditorStore)
  );
  if (!isOpen || !hasFills || !anchorElement) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    Popover,
    {
      ...popoverProps ?? {},
      className: "block-editor-inspector-list-view-content-popover",
      anchor: anchorElement,
      onClose: closeListViewContentPanel,
      children: /* @__PURE__ */ jsx("div", { style: { width: "280px" }, children: /* @__PURE__ */ jsx(Slot, {}) })
    }
  );
}
export {
  Fill as ListViewContentFill,
  ListViewContentPopover
};
//# sourceMappingURL=list-view-content-popover.mjs.map
