// packages/block-editor/src/components/block-list/use-in-between-inserter.js
import { useRefEffect } from "@wordpress/compose";
import { useSelect, useDispatch } from "@wordpress/data";
import { useContext } from "@wordpress/element";
import { isRTL } from "@wordpress/i18n";
import { store as blockEditorStore } from "../../store/index.mjs";
import { InsertionPointOpenRef } from "../block-tools/insertion-point.mjs";
import { unlock } from "../../lock-unlock.mjs";
function useInBetweenInserter() {
  const openRef = useContext(InsertionPointOpenRef);
  const isInBetweenInserterDisabled = useSelect((select) => {
    const settings = select(blockEditorStore).getSettings();
    return settings.isDistractionFree || settings.isPreviewMode || unlock(select(blockEditorStore)).isZoomOut();
  }, []);
  const {
    getBlockListSettings,
    getBlockIndex,
    isMultiSelecting,
    getSelectedBlockClientIds,
    getSettings,
    getTemplateLock,
    __unstableIsWithinBlockOverlay,
    getBlockEditingMode,
    getBlockName,
    getBlockAttributes,
    getParentSectionBlock
  } = unlock(useSelect(blockEditorStore));
  const { showInsertionPoint, hideInsertionPoint } = useDispatch(blockEditorStore);
  return useRefEffect(
    (node) => {
      if (isInBetweenInserterDisabled) {
        return;
      }
      function onMouseMove(event) {
        if (openRef === void 0 || openRef.current) {
          return;
        }
        if (event.target.nodeType === event.target.TEXT_NODE) {
          return;
        }
        if (isMultiSelecting()) {
          return;
        }
        if (!event.target.classList.contains(
          "block-editor-block-list__layout"
        )) {
          hideInsertionPoint();
          return;
        }
        let rootClientId;
        if (!event.target.classList.contains("is-root-container")) {
          const blockElement = !!event.target.getAttribute(
            "data-block"
          ) ? event.target : event.target.closest("[data-block]");
          rootClientId = blockElement.getAttribute("data-block");
        }
        if (getTemplateLock(rootClientId) || getBlockEditingMode(rootClientId) === "disabled" || getBlockName(rootClientId) === "core/block" || rootClientId && getBlockAttributes(rootClientId).layout?.isManualPlacement) {
          return;
        }
        const blockListSettings = getBlockListSettings(rootClientId);
        const orientation = blockListSettings?.orientation || "vertical";
        const captureToolbars = !!blockListSettings?.__experimentalCaptureToolbars;
        const offsetTop = event.clientY;
        const offsetLeft = event.clientX;
        const children = Array.from(event.target.children);
        let element = children.find((blockEl) => {
          const blockElRect = blockEl.getBoundingClientRect();
          return blockEl.classList.contains("wp-block") && orientation === "vertical" && blockElRect.top > offsetTop || blockEl.classList.contains("wp-block") && orientation === "horizontal" && (isRTL() ? blockElRect.right < offsetLeft : blockElRect.left > offsetLeft);
        });
        if (!element) {
          hideInsertionPoint();
          return;
        }
        if (!element.id) {
          element = element.firstElementChild;
          if (!element) {
            hideInsertionPoint();
            return;
          }
        }
        const clientId = element.id.slice("block-".length);
        if (!clientId || __unstableIsWithinBlockOverlay(clientId) || !!getParentSectionBlock(clientId)) {
          return;
        }
        if (getSelectedBlockClientIds().includes(clientId) && orientation === "vertical" && !captureToolbars && !getSettings().hasFixedToolbar) {
          return;
        }
        const elementRect = element.getBoundingClientRect();
        if (orientation === "horizontal" && (event.clientY > elementRect.bottom || event.clientY < elementRect.top) || orientation === "vertical" && (event.clientX > elementRect.right || event.clientX < elementRect.left)) {
          hideInsertionPoint();
          return;
        }
        const index = getBlockIndex(clientId);
        if (index === 0) {
          hideInsertionPoint();
          return;
        }
        showInsertionPoint(rootClientId, index, {
          __unstableWithInserter: true
        });
      }
      node.addEventListener("mousemove", onMouseMove);
      return () => {
        node.removeEventListener("mousemove", onMouseMove);
      };
    },
    [
      openRef,
      getBlockListSettings,
      getBlockIndex,
      isMultiSelecting,
      showInsertionPoint,
      hideInsertionPoint,
      getSelectedBlockClientIds,
      isInBetweenInserterDisabled
    ]
  );
}
export {
  useInBetweenInserter
};
//# sourceMappingURL=use-in-between-inserter.mjs.map
