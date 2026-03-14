// packages/block-editor/src/components/block-inspector/index.js
import { __ } from "@wordpress/i18n";
import {
  getBlockType,
  getUnregisteredTypeHandlerName,
  hasBlockSupport,
  store as blocksStore
} from "@wordpress/blocks";
import { __unstableMotion as motion } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useRef } from "@wordpress/element";
import EditContents from "./edit-contents.mjs";
import SkipToSelectedBlock from "../skip-to-selected-block/index.mjs";
import BlockCard from "../block-card/index.mjs";
import MultiSelectionInspector from "../multi-selection-inspector/index.mjs";
import BlockVariationTransforms from "../block-variation-transforms/index.mjs";
import useBlockDisplayInformation from "../use-block-display-information/index.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import BlockStyles from "../block-styles/index.mjs";
import { ListViewContentPopover } from "../inspector-controls/list-view-content-popover.mjs";
import InspectorControls from "../inspector-controls/index.mjs";
import { default as InspectorControlsTabs } from "../inspector-controls-tabs/index.mjs";
import useInspectorControlsTabs from "../inspector-controls-tabs/use-inspector-controls-tabs.mjs";
import InspectorControlsLastItem from "../inspector-controls/last-item.mjs";
import AdvancedControls from "../inspector-controls-tabs/advanced-controls-panel.mjs";
import PositionControls from "../inspector-controls-tabs/position-controls-panel.mjs";
import useBlockInspectorAnimationSettings from "./useBlockInspectorAnimationSettings.mjs";
import { useBorderPanelLabel } from "../../hooks/border.mjs";
import ContentTab from "../inspector-controls-tabs/content-tab.mjs";
import ViewportVisibilityInfo from "../block-visibility/viewport-visibility-info.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function StyleInspectorSlots({
  blockName,
  showAdvancedControls = true,
  showPositionControls = true,
  showBindingsControls = true
}) {
  const borderPanelLabel = useBorderPanelLabel({ blockName });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(InspectorControls.Slot, {}),
    /* @__PURE__ */ jsx(
      InspectorControls.Slot,
      {
        group: "color",
        label: __("Color"),
        className: "color-block-support-panel__inner-wrapper"
      }
    ),
    /* @__PURE__ */ jsx(
      InspectorControls.Slot,
      {
        group: "background",
        label: __("Background image")
      }
    ),
    /* @__PURE__ */ jsx(
      InspectorControls.Slot,
      {
        group: "typography",
        label: __("Typography")
      }
    ),
    /* @__PURE__ */ jsx(
      InspectorControls.Slot,
      {
        group: "dimensions",
        label: __("Dimensions")
      }
    ),
    /* @__PURE__ */ jsx(InspectorControls.Slot, { group: "border", label: borderPanelLabel }),
    /* @__PURE__ */ jsx(InspectorControls.Slot, { group: "styles" }),
    showPositionControls && /* @__PURE__ */ jsx(PositionControls, {}),
    showBindingsControls && /* @__PURE__ */ jsx(InspectorControls.Slot, { group: "bindings" }),
    showAdvancedControls && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(AdvancedControls, {}) })
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
  } = useSelect((select) => {
    const {
      getSelectedBlockClientId,
      getSelectedBlockClientIds,
      getSelectedBlockCount,
      getBlockName,
      getParentSectionBlock,
      isSectionBlock: _isSectionBlock,
      getEditedContentOnlySection,
      isWithinEditedContentOnlySection
    } = unlock(select(blockEditorStore));
    const { getBlockStyles } = select(blocksStore);
    const _selectedBlockClientId = getSelectedBlockClientId();
    const isWithinEditedSection = isWithinEditedContentOnlySection(
      _selectedBlockClientId
    );
    const _renderedBlockClientId = isWithinEditedSection ? _selectedBlockClientId : getParentSectionBlock(_selectedBlockClientId) || _selectedBlockClientId;
    const _renderedBlockName = _renderedBlockClientId && getBlockName(_renderedBlockClientId);
    const _blockType = _renderedBlockName && getBlockType(_renderedBlockName);
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
  const contentClientIds = useSelect(
    (select) => {
      if (!isSectionBlock || !renderedBlockClientId) {
        return [];
      }
      const {
        getClientIdsOfDescendants,
        getBlockName,
        getBlockEditingMode
      } = unlock(select(blockEditorStore));
      const descendants = getClientIdsOfDescendants(
        renderedBlockClientId
      );
      const listViewDescendants = /* @__PURE__ */ new Set();
      descendants.forEach((clientId) => {
        const blockName = getBlockName(clientId);
        if (blockName === "core/navigation" || hasBlockSupport(blockName, "listView")) {
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
  const availableTabs = useInspectorControlsTabs(
    blockType?.name,
    contentClientIds,
    isSectionBlock,
    hasBlockStyles
  );
  const hasMultipleTabs = availableTabs?.length > 1;
  const blockInspectorAnimationSettings = useBlockInspectorAnimationSettings(blockType);
  const hasSelectedBlocks = selectedBlockCount > 1;
  if (hasSelectedBlocks && !isSectionBlockInSelection) {
    return /* @__PURE__ */ jsxs("div", { className: "block-editor-block-inspector", children: [
      /* @__PURE__ */ jsx(MultiSelectionInspector, {}),
      hasMultipleTabs ? /* @__PURE__ */ jsx(InspectorControlsTabs, { tabs: availableTabs }) : /* @__PURE__ */ jsx(
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
    return /* @__PURE__ */ jsx("div", { className: "block-editor-block-inspector", children: /* @__PURE__ */ jsx(MultiSelectionInspector, {}) });
  }
  const isRenderedBlockUnregistered = renderedBlockName === getUnregisteredTypeHandlerName();
  const shouldShowWarning = !blockType || !renderedBlockClientId || isRenderedBlockUnregistered;
  if (shouldShowWarning) {
    return /* @__PURE__ */ jsx("span", { className: "block-editor-block-inspector__no-blocks", children: __("No block selected.") });
  }
  return /* @__PURE__ */ jsx(
    BlockInspectorSingleBlockWrapper,
    {
      animate: blockInspectorAnimationSettings,
      wrapper: (children) => /* @__PURE__ */ jsx(
        AnimatedContainer,
        {
          blockInspectorAnimationSettings,
          renderedBlockClientId,
          children
        }
      ),
      children: /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsx(
    motion.div,
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
  const listViewRef = useRef(null);
  const hasMultipleTabs = availableTabs?.length > 1;
  const hasParentChildBlockCards = editedContentOnlySection && editedContentOnlySection !== renderedBlockClientId;
  const parentBlockInformation = useBlockDisplayInformation(
    editedContentOnlySection
  );
  const blockInformation = useBlockDisplayInformation(
    renderedBlockClientId
  );
  const isBlockSynced = blockInformation.isSynced;
  return /* @__PURE__ */ jsxs("div", { className: "block-editor-block-inspector", children: [
    hasParentChildBlockCards && /* @__PURE__ */ jsx(
      BlockCard,
      {
        ...parentBlockInformation,
        className: parentBlockInformation?.isSynced && "is-synced",
        parentClientId: editedContentOnlySection
      }
    ),
    /* @__PURE__ */ jsx(
      BlockCard,
      {
        ...blockInformation,
        allowParentNavigation: true,
        className: isBlockSynced && "is-synced",
        isChild: hasParentChildBlockCards,
        clientId: renderedBlockClientId
      }
    ),
    /* @__PURE__ */ jsx(ViewportVisibilityInfo, { clientId: renderedBlockClientId }),
    /* @__PURE__ */ jsx(EditContents, { clientId: renderedBlockClientId }),
    /* @__PURE__ */ jsx(BlockVariationTransforms, { blockClientId: renderedBlockClientId }),
    hasMultipleTabs && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
      InspectorControlsTabs,
      {
        hasBlockStyles,
        clientId: renderedBlockClientId,
        blockName,
        tabs: availableTabs,
        isSectionBlock,
        contentClientIds
      }
    ) }),
    !hasMultipleTabs && /* @__PURE__ */ jsxs(Fragment, { children: [
      hasBlockStyles && /* @__PURE__ */ jsx(BlockStyles, { clientId: renderedBlockClientId }),
      /* @__PURE__ */ jsx(ContentTab, { contentClientIds }),
      /* @__PURE__ */ jsx(InspectorControls.Slot, { group: "content" }),
      /* @__PURE__ */ jsx(InspectorControls.Slot, { group: "list", ref: listViewRef }),
      /* @__PURE__ */ jsx(ListViewContentPopover, { listViewRef }),
      !isSectionBlock && /* @__PURE__ */ jsx(StyleInspectorSlots, { blockName })
    ] }),
    /* @__PURE__ */ jsx(InspectorControlsLastItem.Slot, {}),
    /* @__PURE__ */ jsx(SkipToSelectedBlock, {}, "back")
  ] });
};
var block_inspector_default = BlockInspector;
export {
  block_inspector_default as default
};
//# sourceMappingURL=index.mjs.map
