// packages/block-editor/src/components/block-toolbar/index.js
import clsx from "clsx";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { useRef } from "@wordpress/element";
import { useViewportMatch } from "@wordpress/compose";
import {
  getBlockType,
  hasBlockSupport,
  isReusableBlock,
  isTemplatePart
} from "@wordpress/blocks";
import { ToolbarGroup } from "@wordpress/components";
import BlockMover from "../block-mover/index.mjs";
import BlockParentSelector from "../block-parent-selector/index.mjs";
import BlockControls from "../block-controls/index.mjs";
import __unstableBlockToolbarLastItem from "./block-toolbar-last-item.mjs";
import BlockSettingsMenu from "../block-settings-menu/index.mjs";
import { BlockLockToolbar } from "../block-lock/index.mjs";
import { ViewportVisibilityToolbar } from "../block-visibility/index.mjs";
import { BlockGroupToolbar } from "../convert-to-group-buttons/index.mjs";
import BlockEditVisuallyButton from "../block-edit-visually-button/index.mjs";
import { useShowHoveredOrFocusedGestures } from "./utils.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import NavigableToolbar from "../navigable-toolbar/index.mjs";
import { useHasBlockToolbar } from "./use-has-block-toolbar.mjs";
import ChangeDesign from "./change-design.mjs";
import SwitchSectionStyle from "./switch-section-style.mjs";
import EditSectionButton from "./edit-section-button.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { deviceTypeKey } from "../../store/private-keys.mjs";
import BlockToolbarIcon from "./block-toolbar-icon.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function PrivateBlockToolbar({
  hideDragHandle,
  focusOnMount,
  __experimentalInitialIndex,
  __experimentalOnIndexChange,
  variant = "unstyled"
}) {
  const {
    blockClientId,
    blockClientIds,
    isDefaultEditingMode,
    blockType,
    toolbarKey,
    shouldShowVisualToolbar,
    showParentSelector,
    isUsingBindings,
    isSectionContainer,
    hasContentOnlyLocking,
    showShuffleButton,
    showSlots,
    showGroupButtons,
    showLockButtons,
    showBlockVisibilityButton,
    showSwitchSectionStyleButton,
    areSelectedBlocksHiddenOnViewport,
    canEdit
  } = useSelect((select) => {
    const { canEditBlock } = select(blockEditorStore);
    const {
      getBlockName,
      getBlockMode,
      getBlockParents,
      getSelectedBlockClientIds,
      isBlockValid,
      getBlockEditingMode,
      getBlockAttributes,
      getSettings,
      getTemplateLock,
      getParentSectionBlock,
      isZoomOut,
      isSectionBlock,
      isBlockHiddenAtViewport
    } = unlock(select(blockEditorStore));
    const selectedBlockClientIds = getSelectedBlockClientIds();
    const selectedBlockClientId = selectedBlockClientIds[0];
    const parents = getBlockParents(selectedBlockClientId);
    const parentSection = getParentSectionBlock(selectedBlockClientId);
    const parentClientId = parentSection ?? parents[parents.length - 1];
    const parentBlockName = getBlockName(parentClientId);
    const parentBlockType = getBlockType(parentBlockName);
    const editingMode = getBlockEditingMode(selectedBlockClientId);
    const _isDefaultEditingMode = editingMode === "default";
    const _blockName = getBlockName(selectedBlockClientId);
    const isValid = selectedBlockClientIds.every(
      (id) => isBlockValid(id)
    );
    const isVisual = selectedBlockClientIds.every(
      (id) => getBlockMode(id) === "visual"
    );
    const _isUsingBindings = selectedBlockClientIds.every(
      (clientId) => !!getBlockAttributes(clientId)?.metadata?.bindings
    );
    const _hasTemplateLock = selectedBlockClientIds.some(
      (id) => getTemplateLock(id) === "contentOnly"
    );
    const _isZoomOut = isZoomOut();
    const _isSectionBlock = isSectionBlock(selectedBlockClientId);
    const _canEditBlock = canEditBlock(selectedBlockClientId);
    const _showSwitchSectionStyleButton = _canEditBlock && (_isZoomOut || _isSectionBlock);
    const _currentDeviceType = getSettings()?.[deviceTypeKey]?.toLowerCase() || "desktop";
    const _areSelectedBlocksHiddenOnViewport = selectedBlockClientIds.length > 0 && selectedBlockClientIds.every(
      (id) => isBlockHiddenAtViewport(id, _currentDeviceType)
    );
    return {
      blockClientId: selectedBlockClientId,
      blockClientIds: selectedBlockClientIds,
      isDefaultEditingMode: _isDefaultEditingMode,
      blockType: selectedBlockClientId && getBlockType(_blockName),
      shouldShowVisualToolbar: isValid && isVisual,
      toolbarKey: `${selectedBlockClientId}${parentClientId}`,
      showParentSelector: !_isZoomOut && parentBlockType && editingMode !== "contentOnly" && getBlockEditingMode(parentClientId) !== "disabled" && hasBlockSupport(
        parentBlockType,
        "__experimentalParentSelector",
        true
      ) && selectedBlockClientIds.length === 1,
      isUsingBindings: _isUsingBindings,
      isSectionContainer: _isSectionBlock,
      hasContentOnlyLocking: _hasTemplateLock,
      showShuffleButton: _isZoomOut,
      showSlots: !_isZoomOut,
      showGroupButtons: !_isZoomOut,
      showLockButtons: !_isZoomOut,
      showBlockVisibilityButton: !_isZoomOut,
      showSwitchSectionStyleButton: _showSwitchSectionStyleButton,
      areSelectedBlocksHiddenOnViewport: _areSelectedBlocksHiddenOnViewport,
      canEdit: _canEditBlock
    };
  }, []);
  const toolbarWrapperRef = useRef(null);
  const nodeRef = useRef();
  const showHoveredOrFocusedGestures = useShowHoveredOrFocusedGestures({
    ref: nodeRef
  });
  const isLargeViewport = !useViewportMatch("medium", "<");
  const hasBlockToolbar = useHasBlockToolbar();
  if (!hasBlockToolbar) {
    return null;
  }
  const isMultiToolbar = blockClientIds.length > 1;
  const isSynced = isReusableBlock(blockType) || isTemplatePart(blockType);
  const classes = clsx("block-editor-block-contextual-toolbar", {
    "has-parent": showParentSelector
  });
  const innerClasses = clsx("block-editor-block-toolbar", {
    "is-synced": isSynced,
    "is-connected": isUsingBindings
  });
  return /* @__PURE__ */ jsx(
    NavigableToolbar,
    {
      focusEditorOnEscape: true,
      className: classes,
      "aria-label": __("Block tools"),
      variant: variant === "toolbar" ? void 0 : variant,
      focusOnMount,
      __experimentalInitialIndex,
      __experimentalOnIndexChange,
      children: /* @__PURE__ */ jsxs("div", { ref: toolbarWrapperRef, className: innerClasses, children: [
        showParentSelector && !isMultiToolbar && isLargeViewport && /* @__PURE__ */ jsx(BlockParentSelector, {}),
        (shouldShowVisualToolbar || isMultiToolbar) && /* @__PURE__ */ jsx("div", { ref: nodeRef, ...showHoveredOrFocusedGestures, children: /* @__PURE__ */ jsxs(ToolbarGroup, { className: "block-editor-block-toolbar__block-controls", children: [
          /* @__PURE__ */ jsx(
            BlockToolbarIcon,
            {
              clientIds: blockClientIds,
              isSynced
            }
          ),
          isDefaultEditingMode && showBlockVisibilityButton && /* @__PURE__ */ jsx(
            ViewportVisibilityToolbar,
            {
              clientIds: blockClientIds
            }
          ),
          !isMultiToolbar && isDefaultEditingMode && showLockButtons && /* @__PURE__ */ jsx(
            BlockLockToolbar,
            {
              clientId: blockClientId
            }
          ),
          /* @__PURE__ */ jsx(
            BlockMover,
            {
              clientIds: blockClientIds,
              hideDragHandle
            }
          )
        ] }) }),
        !areSelectedBlocksHiddenOnViewport && !hasContentOnlyLocking && shouldShowVisualToolbar && isMultiToolbar && showGroupButtons && /* @__PURE__ */ jsx(BlockGroupToolbar, {}),
        !isMultiToolbar && canEdit && /* @__PURE__ */ jsx(EditSectionButton, { clientId: blockClientIds[0] }),
        !areSelectedBlocksHiddenOnViewport && showShuffleButton && /* @__PURE__ */ jsx(ChangeDesign, { clientId: blockClientIds[0] }),
        !areSelectedBlocksHiddenOnViewport && showSwitchSectionStyleButton && /* @__PURE__ */ jsx(SwitchSectionStyle, { clientId: blockClientIds[0] }),
        !areSelectedBlocksHiddenOnViewport && shouldShowVisualToolbar && showSlots && /* @__PURE__ */ jsxs(Fragment, { children: [
          !isSectionContainer && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              BlockControls.Slot,
              {
                group: "parent",
                className: "block-editor-block-toolbar__slot"
              }
            ),
            /* @__PURE__ */ jsx(
              BlockControls.Slot,
              {
                group: "block",
                className: "block-editor-block-toolbar__slot"
              }
            ),
            /* @__PURE__ */ jsx(BlockControls.Slot, { className: "block-editor-block-toolbar__slot" }),
            /* @__PURE__ */ jsx(
              BlockControls.Slot,
              {
                group: "inline",
                className: "block-editor-block-toolbar__slot"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            BlockControls.Slot,
            {
              group: "other",
              className: "block-editor-block-toolbar__slot"
            }
          ),
          /* @__PURE__ */ jsx(__unstableBlockToolbarLastItem.Slot, {})
        ] }),
        /* @__PURE__ */ jsx(BlockEditVisuallyButton, { clientIds: blockClientIds }),
        /* @__PURE__ */ jsx(BlockSettingsMenu, { clientIds: blockClientIds })
      ] })
    },
    toolbarKey
  );
}
function BlockToolbar({ hideDragHandle, variant }) {
  return /* @__PURE__ */ jsx(
    PrivateBlockToolbar,
    {
      hideDragHandle,
      variant,
      focusOnMount: void 0,
      __experimentalInitialIndex: void 0,
      __experimentalOnIndexChange: void 0
    }
  );
}
export {
  PrivateBlockToolbar,
  BlockToolbar as default
};
//# sourceMappingURL=index.mjs.map
