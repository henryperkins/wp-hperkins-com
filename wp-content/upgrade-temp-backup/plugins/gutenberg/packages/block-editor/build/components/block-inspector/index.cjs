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

// packages/block-editor/src/components/block-inspector/index.js
var block_inspector_exports = {};
__export(block_inspector_exports, {
  default: () => block_inspector_default
});
module.exports = __toCommonJS(block_inspector_exports);
var import_i18n = require("@wordpress/i18n");
var import_blocks = require("@wordpress/blocks");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_edit_contents = __toESM(require("./edit-contents.cjs"));
var import_skip_to_selected_block = __toESM(require("../skip-to-selected-block/index.cjs"));
var import_block_card = __toESM(require("../block-card/index.cjs"));
var import_multi_selection_inspector = __toESM(require("../multi-selection-inspector/index.cjs"));
var import_block_variation_transforms = __toESM(require("../block-variation-transforms/index.cjs"));
var import_use_block_display_information = __toESM(require("../use-block-display-information/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_block_styles = __toESM(require("../block-styles/index.cjs"));
var import_list_view_content_popover = require("../inspector-controls/list-view-content-popover.cjs");
var import_inspector_controls = __toESM(require("../inspector-controls/index.cjs"));
var import_inspector_controls_tabs = __toESM(require("../inspector-controls-tabs/index.cjs"));
var import_use_inspector_controls_tabs = __toESM(require("../inspector-controls-tabs/use-inspector-controls-tabs.cjs"));
var import_last_item = __toESM(require("../inspector-controls/last-item.cjs"));
var import_advanced_controls_panel = __toESM(require("../inspector-controls-tabs/advanced-controls-panel.cjs"));
var import_position_controls_panel = __toESM(require("../inspector-controls-tabs/position-controls-panel.cjs"));
var import_useBlockInspectorAnimationSettings = __toESM(require("./useBlockInspectorAnimationSettings.cjs"));
var import_border = require("../../hooks/border.cjs");
var import_content_tab = __toESM(require("../inspector-controls-tabs/content-tab.cjs"));
var import_viewport_visibility_info = __toESM(require("../block-visibility/viewport-visibility-info.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function StyleInspectorSlots({
  blockName,
  showAdvancedControls = true,
  showPositionControls = true,
  showBindingsControls = true
}) {
  const borderPanelLabel = (0, import_border.useBorderPanelLabel)({ blockName });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default.Slot, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_inspector_controls.default.Slot,
      {
        group: "color",
        label: (0, import_i18n.__)("Color"),
        className: "color-block-support-panel__inner-wrapper"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_inspector_controls.default.Slot,
      {
        group: "background",
        label: (0, import_i18n.__)("Background image")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_inspector_controls.default.Slot,
      {
        group: "typography",
        label: (0, import_i18n.__)("Typography")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_inspector_controls.default.Slot,
      {
        group: "dimensions",
        label: (0, import_i18n.__)("Dimensions")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default.Slot, { group: "border", label: borderPanelLabel }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default.Slot, { group: "styles" }),
    showPositionControls && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_position_controls_panel.default, {}),
    showBindingsControls && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default.Slot, { group: "bindings" }),
    showAdvancedControls && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_advanced_controls_panel.default, {}) })
  ] });
}
function BlockInspector() {
  const {
    selectedBlockCount,
    renderedBlockName,
    renderedBlockClientId,
    blockType,
    isSectionBlock,
    isSectionBlockInSelection,
    hasBlockStyles,
    editedContentOnlySection
  } = (0, import_data.useSelect)((select) => {
    const {
      getSelectedBlockClientId,
      getSelectedBlockClientIds,
      getSelectedBlockCount,
      getBlockName,
      getParentSectionBlock,
      isSectionBlock: _isSectionBlock,
      getEditedContentOnlySection,
      isWithinEditedContentOnlySection
    } = (0, import_lock_unlock.unlock)(select(import_store.store));
    const { getBlockStyles } = select(import_blocks.store);
    const _selectedBlockClientId = getSelectedBlockClientId();
    const isWithinEditedSection = isWithinEditedContentOnlySection(
      _selectedBlockClientId
    );
    const _renderedBlockClientId = isWithinEditedSection ? _selectedBlockClientId : getParentSectionBlock(_selectedBlockClientId) || _selectedBlockClientId;
    const _renderedBlockName = _renderedBlockClientId && getBlockName(_renderedBlockClientId);
    const _blockType = _renderedBlockName && (0, import_blocks.getBlockType)(_renderedBlockName);
    const selectedBlockClientIds = getSelectedBlockClientIds();
    const _isSectionBlockInSelection = selectedBlockClientIds.some(
      (id) => _isSectionBlock(id)
    );
    const blockStyles = _renderedBlockName && getBlockStyles(_renderedBlockName);
    const _hasBlockStyles = blockStyles && blockStyles.length > 0;
    return {
      selectedBlockCount: getSelectedBlockCount(),
      renderedBlockClientId: _renderedBlockClientId,
      renderedBlockName: _renderedBlockName,
      blockType: _blockType,
      isSectionBlockInSelection: _isSectionBlockInSelection,
      isSectionBlock: _isSectionBlock(_renderedBlockClientId),
      hasBlockStyles: _hasBlockStyles,
      editedContentOnlySection: getEditedContentOnlySection()
    };
  }, []);
  const contentClientIds = (0, import_data.useSelect)(
    (select) => {
      if (!isSectionBlock || !renderedBlockClientId) {
        return [];
      }
      const {
        getClientIdsOfDescendants,
        getBlockName,
        getBlockEditingMode
      } = (0, import_lock_unlock.unlock)(select(import_store.store));
      const descendants = getClientIdsOfDescendants(
        renderedBlockClientId
      );
      const listViewDescendants = /* @__PURE__ */ new Set();
      descendants.forEach((clientId) => {
        const blockName = getBlockName(clientId);
        if (blockName === "core/navigation" || (0, import_blocks.hasBlockSupport)(blockName, "listView")) {
          const listViewChildren = getClientIdsOfDescendants(clientId);
          listViewChildren.forEach(
            (childId) => listViewDescendants.add(childId)
          );
        }
      });
      return descendants.filter((current) => {
        return !listViewDescendants.has(current) && getBlockEditingMode(current) === "contentOnly";
      });
    },
    [isSectionBlock, renderedBlockClientId]
  );
  const availableTabs = (0, import_use_inspector_controls_tabs.default)(
    blockType?.name,
    contentClientIds,
    isSectionBlock,
    hasBlockStyles
  );
  const hasMultipleTabs = availableTabs?.length > 1;
  const blockInspectorAnimationSettings = (0, import_useBlockInspectorAnimationSettings.default)(blockType);
  const hasSelectedBlocks = selectedBlockCount > 1;
  if (hasSelectedBlocks && !isSectionBlockInSelection) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "block-editor-block-inspector", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_multi_selection_inspector.default, {}),
      hasMultipleTabs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls_tabs.default, { tabs: availableTabs }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        StyleInspectorSlots,
        {
          blockName: renderedBlockName,
          showAdvancedControls: false,
          showPositionControls: false,
          showBindingsControls: false
        }
      )
    ] });
  }
  if (hasSelectedBlocks && isSectionBlockInSelection) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-editor-block-inspector", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_multi_selection_inspector.default, {}) });
  }
  const isRenderedBlockUnregistered = renderedBlockName === (0, import_blocks.getUnregisteredTypeHandlerName)();
  const shouldShowWarning = !blockType || !renderedBlockClientId || isRenderedBlockUnregistered;
  if (shouldShowWarning) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-editor-block-inspector__no-blocks", children: (0, import_i18n.__)("No block selected.") });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    BlockInspectorSingleBlockWrapper,
    {
      animate: blockInspectorAnimationSettings,
      wrapper: (children) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        AnimatedContainer,
        {
          blockInspectorAnimationSettings,
          renderedBlockClientId,
          children
        }
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        BlockInspectorSingleBlock,
        {
          renderedBlockClientId,
          blockName: blockType.name,
          isSectionBlock,
          availableTabs,
          contentClientIds,
          hasBlockStyles,
          editedContentOnlySection
        }
      )
    }
  );
}
var BlockInspectorSingleBlockWrapper = ({ animate, wrapper, children }) => {
  return animate ? wrapper(children) : children;
};
var AnimatedContainer = ({
  blockInspectorAnimationSettings,
  renderedBlockClientId,
  children
}) => {
  const animationOrigin = blockInspectorAnimationSettings && blockInspectorAnimationSettings.enterDirection === "leftToRight" ? -50 : 50;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__unstableMotion.div,
    {
      animate: {
        x: 0,
        opacity: 1,
        transition: {
          ease: "easeInOut",
          duration: 0.14
        }
      },
      initial: {
        x: animationOrigin,
        opacity: 0
      },
      children
    },
    renderedBlockClientId
  );
};
var BlockInspectorSingleBlock = ({
  // The block that is displayed in the inspector. This is the block whose
  // controls and information are shown to the user.
  renderedBlockClientId,
  blockName,
  isSectionBlock,
  availableTabs,
  contentClientIds,
  hasBlockStyles,
  editedContentOnlySection
}) => {
  const listViewRef = (0, import_element.useRef)(null);
  const hasMultipleTabs = availableTabs?.length > 1;
  const hasParentChildBlockCards = editedContentOnlySection && editedContentOnlySection !== renderedBlockClientId;
  const parentBlockInformation = (0, import_use_block_display_information.default)(
    editedContentOnlySection
  );
  const blockInformation = (0, import_use_block_display_information.default)(
    renderedBlockClientId
  );
  const isBlockSynced = blockInformation.isSynced;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "block-editor-block-inspector", children: [
    hasParentChildBlockCards && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_card.default,
      {
        ...parentBlockInformation,
        className: parentBlockInformation?.isSynced && "is-synced",
        parentClientId: editedContentOnlySection
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_card.default,
      {
        ...blockInformation,
        allowParentNavigation: true,
        className: isBlockSynced && "is-synced",
        isChild: hasParentChildBlockCards,
        clientId: renderedBlockClientId
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_viewport_visibility_info.default, { clientId: renderedBlockClientId }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_edit_contents.default, { clientId: renderedBlockClientId }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_variation_transforms.default, { blockClientId: renderedBlockClientId }),
    hasMultipleTabs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_inspector_controls_tabs.default,
      {
        hasBlockStyles,
        clientId: renderedBlockClientId,
        blockName,
        tabs: availableTabs,
        isSectionBlock,
        contentClientIds
      }
    ) }),
    !hasMultipleTabs && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      hasBlockStyles && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_styles.default, { clientId: renderedBlockClientId }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_content_tab.default, { contentClientIds }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default.Slot, { group: "content" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default.Slot, { group: "list", ref: listViewRef }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_list_view_content_popover.ListViewContentPopover, { listViewRef }),
      !isSectionBlock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleInspectorSlots, { blockName })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_last_item.default.Slot, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_skip_to_selected_block.default, {}, "back")
  ] });
};
var block_inspector_default = BlockInspector;
//# sourceMappingURL=index.cjs.map
