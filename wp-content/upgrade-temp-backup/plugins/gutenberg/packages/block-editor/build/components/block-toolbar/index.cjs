"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/block-toolbar/index.js
var block_toolbar_exports = {};
__export(block_toolbar_exports, {
  PrivateBlockToolbar: () => PrivateBlockToolbar,
  default: () => BlockToolbar
});
module.exports = __toCommonJS(block_toolbar_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_blocks = require("@wordpress/blocks");
var import_components = require("@wordpress/components");
var import_block_mover = __toESM(require("../block-mover/index.cjs"));
var import_block_parent_selector = __toESM(require("../block-parent-selector/index.cjs"));
var import_block_controls = __toESM(require("../block-controls/index.cjs"));
var import_block_toolbar_last_item = __toESM(require("./block-toolbar-last-item.cjs"));
var import_block_settings_menu = __toESM(require("../block-settings-menu/index.cjs"));
var import_block_lock = require("../block-lock/index.cjs");
var import_block_visibility = require("../block-visibility/index.cjs");
var import_convert_to_group_buttons = require("../convert-to-group-buttons/index.cjs");
var import_block_edit_visually_button = __toESM(require("../block-edit-visually-button/index.cjs"));
var import_utils = require("./utils.cjs");
var import_store = require("../../store/index.cjs");
var import_navigable_toolbar = __toESM(require("../navigable-toolbar/index.cjs"));
var import_use_has_block_toolbar = require("./use-has-block-toolbar.cjs");
var import_change_design = __toESM(require("./change-design.cjs"));
var import_switch_section_style = __toESM(require("./switch-section-style.cjs"));
var import_edit_section_button = __toESM(require("./edit-section-button.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_private_keys = require("../../store/private-keys.cjs");
var import_block_toolbar_icon = __toESM(require("./block-toolbar-icon.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
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
  } = (0, import_data.useSelect)((select) => {
    const { canEditBlock } = select(import_store.store);
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
    } = (0, import_lock_unlock.unlock)(select(import_store.store));
    const selectedBlockClientIds = getSelectedBlockClientIds();
    const selectedBlockClientId = selectedBlockClientIds[0];
    const parents = getBlockParents(selectedBlockClientId);
    const parentSection = getParentSectionBlock(selectedBlockClientId);
    const parentClientId = parentSection ?? parents[parents.length - 1];
    const parentBlockName = getBlockName(parentClientId);
    const parentBlockType = (0, import_blocks.getBlockType)(parentBlockName);
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
    const _currentDeviceType = getSettings()?.[import_private_keys.deviceTypeKey]?.toLowerCase() || "desktop";
    const _areSelectedBlocksHiddenOnViewport = selectedBlockClientIds.length > 0 && selectedBlockClientIds.every(
      (id) => isBlockHiddenAtViewport(id, _currentDeviceType)
    );
    return {
      blockClientId: selectedBlockClientId,
      blockClientIds: selectedBlockClientIds,
      isDefaultEditingMode: _isDefaultEditingMode,
      blockType: selectedBlockClientId && (0, import_blocks.getBlockType)(_blockName),
      shouldShowVisualToolbar: isValid && isVisual,
      toolbarKey: `${selectedBlockClientId}${parentClientId}`,
      showParentSelector: !_isZoomOut && parentBlockType && editingMode !== "contentOnly" && getBlockEditingMode(parentClientId) !== "disabled" && (0, import_blocks.hasBlockSupport)(
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
  const toolbarWrapperRef = (0, import_element.useRef)(null);
  const nodeRef = (0, import_element.useRef)();
  const showHoveredOrFocusedGestures = (0, import_utils.useShowHoveredOrFocusedGestures)({
    ref: nodeRef
  });
  const isLargeViewport = !(0, import_compose.useViewportMatch)("medium", "<");
  const hasBlockToolbar = (0, import_use_has_block_toolbar.useHasBlockToolbar)();
  if (!hasBlockToolbar) {
    return null;
  }
  const isMultiToolbar = blockClientIds.length > 1;
  const isSynced = (0, import_blocks.isReusableBlock)(blockType) || (0, import_blocks.isTemplatePart)(blockType);
  const classes = (0, import_clsx.default)("block-editor-block-contextual-toolbar", {
    "has-parent": showParentSelector
  });
  const innerClasses = (0, import_clsx.default)("block-editor-block-toolbar", {
    "is-synced": isSynced,
    "is-connected": isUsingBindings
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_navigable_toolbar.default,
    {
      focusEditorOnEscape: true,
      className: classes,
      "aria-label": (0, import_i18n.__)("Block tools"),
      variant: variant === "toolbar" ? void 0 : variant,
      focusOnMount,
      __experimentalInitialIndex,
      __experimentalOnIndexChange,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ref: toolbarWrapperRef, className: innerClasses, children: [
        showParentSelector && !isMultiToolbar && isLargeViewport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_parent_selector.default, {}),
        (shouldShowVisualToolbar || isMultiToolbar) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: nodeRef, ...showHoveredOrFocusedGestures, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.ToolbarGroup, { className: "block-editor-block-toolbar__block-controls", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_block_toolbar_icon.default,
            {
              clientIds: blockClientIds,
              isSynced
            }
          ),
          isDefaultEditingMode && showBlockVisibilityButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_block_visibility.ViewportVisibilityToolbar,
            {
              clientIds: blockClientIds
            }
          ),
          !isMultiToolbar && isDefaultEditingMode && showLockButtons && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_block_lock.BlockLockToolbar,
            {
              clientId: blockClientId
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_block_mover.default,
            {
              clientIds: blockClientIds,
              hideDragHandle
            }
          )
        ] }) }),
        !areSelectedBlocksHiddenOnViewport && !hasContentOnlyLocking && shouldShowVisualToolbar && isMultiToolbar && showGroupButtons && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_convert_to_group_buttons.BlockGroupToolbar, {}),
        !isMultiToolbar && canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_edit_section_button.default, { clientId: blockClientIds[0] }),
        !areSelectedBlocksHiddenOnViewport && showShuffleButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_change_design.default, { clientId: blockClientIds[0] }),
        !areSelectedBlocksHiddenOnViewport && showSwitchSectionStyleButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_switch_section_style.default, { clientId: blockClientIds[0] }),
        !areSelectedBlocksHiddenOnViewport && shouldShowVisualToolbar && showSlots && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          !isSectionContainer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_block_controls.default.Slot,
              {
                group: "parent",
                className: "block-editor-block-toolbar__slot"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_block_controls.default.Slot,
              {
                group: "block",
                className: "block-editor-block-toolbar__slot"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_controls.default.Slot, { className: "block-editor-block-toolbar__slot" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_block_controls.default.Slot,
              {
                group: "inline",
                className: "block-editor-block-toolbar__slot"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_block_controls.default.Slot,
            {
              group: "other",
              className: "block-editor-block-toolbar__slot"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_toolbar_last_item.default.Slot, {})
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_edit_visually_button.default, { clientIds: blockClientIds }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_settings_menu.default, { clientIds: blockClientIds })
      ] })
    },
    toolbarKey
  );
}
function BlockToolbar({ hideDragHandle, variant }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrivateBlockToolbar
});
//# sourceMappingURL=index.cjs.map
