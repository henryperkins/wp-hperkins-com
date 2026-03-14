// packages/block-editor/src/components/block-toolbar/block-toolbar-icon.js
import { ToolbarButton } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { copy, symbol } from "@wordpress/icons";
import { getBlockType, store as blocksStore } from "@wordpress/blocks";
import { store as preferencesStore } from "@wordpress/preferences";
import BlockSwitcher from "../block-switcher/index.mjs";
import BlockIcon from "../block-icon/index.mjs";
import BlockStylesDropdown from "./block-styles-dropdown.mjs";
import PatternOverridesDropdown from "./pattern-overrides-dropdown.mjs";
import useBlockDisplayTitle from "../block-title/use-block-display-title.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { hasPatternOverridesDefaultBinding } from "../../utils/block-bindings.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
function getBlockIconVariant({ select, clientIds }) {
  const {
    getBlockName,
    getBlockAttributes,
    getBlockParentsByBlockName,
    canRemoveBlocks,
    getTemplateLock,
    getBlockEditingMode,
    canEditBlock
  } = unlock(select(blockEditorStore));
  const { getBlockStyles } = select(blocksStore);
  const hasTemplateLock = clientIds.some(
    (id) => getTemplateLock(id) === "contentOnly"
  );
  const isSingleBlock = clientIds.length === 1;
  const blockName = isSingleBlock && getBlockName(clientIds[0]);
  const hasBlockStyles = isSingleBlock && !!getBlockStyles(blockName)?.length;
  const hasPatternNameInSelection = clientIds.some(
    (id) => !!getBlockAttributes(id)?.metadata?.patternName
  );
  const hasPatternOverrides = clientIds.every(
    (clientId) => hasPatternOverridesDefaultBinding(
      getBlockAttributes(clientId)?.metadata?.bindings
    )
  );
  const hasParentPattern = clientIds.every(
    (clientId) => getBlockParentsByBlockName(clientId, "core/block", true).length > 0
  );
  const canRemove = canRemoveBlocks(clientIds);
  const canEdit = clientIds.every((clientId) => canEditBlock(clientId));
  const editingMode = getBlockEditingMode(clientIds[0]);
  const isDefaultEditingMode = editingMode === "default";
  const isContentOnlyMode = editingMode === "contentOnly";
  const _hideTransformsForSections = hasPatternNameInSelection;
  const _showBlockSwitcher = !_hideTransformsForSections && isDefaultEditingMode && (hasBlockStyles || canRemove) && !hasTemplateLock && canEdit;
  const _showPatternOverrides = hasPatternOverrides && hasParentPattern;
  if (_showBlockSwitcher) {
    return "switcher";
  } else if (isContentOnlyMode && hasBlockStyles && !hasPatternOverrides && canEdit) {
    return "styles-only";
  } else if (_showPatternOverrides) {
    return "pattern-overrides";
  }
  return "default";
}
function getBlockIcon({ select, clientIds }) {
  const { getBlockName, getBlockAttributes } = unlock(
    select(blockEditorStore)
  );
  const _isSingleBlock = clientIds.length === 1;
  const firstClientId = clientIds[0];
  const blockAttributes = getBlockAttributes(firstClientId);
  if (_isSingleBlock && blockAttributes?.metadata?.patternName) {
    return symbol;
  }
  const blockName = getBlockName(firstClientId);
  const blockType = getBlockType(blockName);
  if (_isSingleBlock) {
    const { getActiveBlockVariation } = select(blocksStore);
    const match = getActiveBlockVariation(blockName, blockAttributes);
    return match?.icon || blockType?.icon;
  }
  const blockNames = clientIds.map((id) => getBlockName(id));
  const isSelectionOfSameType = new Set(blockNames).size === 1;
  return isSelectionOfSameType ? blockType?.icon : copy;
}
function BlockToolbarIcon({ clientIds, isSynced }) {
  const { icon, showIconLabels, variant } = useSelect(
    (select) => {
      return {
        icon: getBlockIcon({ select, clientIds }),
        showIconLabels: select(preferencesStore).get(
          "core",
          "showIconLabels"
        ),
        variant: getBlockIconVariant({
          select,
          clientIds
        })
      };
    },
    [clientIds]
  );
  const blockTitle = useBlockDisplayTitle({
    clientId: clientIds?.[0],
    maximumLength: 35
  });
  const isSingleBlock = clientIds.length === 1;
  const showBlockTitle = isSingleBlock && isSynced && !showIconLabels;
  const label = isSingleBlock ? blockTitle : __("Multiple blocks selected");
  const text = showBlockTitle && blockTitle ? blockTitle : void 0;
  const BlockIconElement = /* @__PURE__ */ jsx(
    BlockIcon,
    {
      className: "block-editor-block-toolbar__block-icon",
      icon
    }
  );
  if (variant === "switcher") {
    return /* @__PURE__ */ jsx(
      BlockSwitcher,
      {
        clientIds,
        label,
        text,
        children: BlockIconElement
      }
    );
  }
  if (variant === "styles-only") {
    return /* @__PURE__ */ jsx(
      BlockStylesDropdown,
      {
        clientIds,
        label,
        text,
        children: BlockIconElement
      }
    );
  }
  if (variant === "pattern-overrides") {
    return /* @__PURE__ */ jsx(
      PatternOverridesDropdown,
      {
        icon: BlockIconElement,
        clientIds,
        blockTitle,
        label
      }
    );
  }
  return /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      disabled: true,
      className: "block-editor-block-toolbar__block-icon-button",
      title: label,
      icon: BlockIconElement,
      text
    }
  );
}
export {
  BlockToolbarIcon as default
};
//# sourceMappingURL=block-toolbar-icon.mjs.map
