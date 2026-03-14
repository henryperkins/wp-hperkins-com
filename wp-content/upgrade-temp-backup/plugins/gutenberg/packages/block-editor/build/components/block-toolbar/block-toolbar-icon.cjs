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

// packages/block-editor/src/components/block-toolbar/block-toolbar-icon.js
var block_toolbar_icon_exports = {};
__export(block_toolbar_icon_exports, {
  default: () => BlockToolbarIcon
});
module.exports = __toCommonJS(block_toolbar_icon_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_icons = require("@wordpress/icons");
var import_blocks = require("@wordpress/blocks");
var import_preferences = require("@wordpress/preferences");
var import_block_switcher = __toESM(require("../block-switcher/index.cjs"));
var import_block_icon = __toESM(require("../block-icon/index.cjs"));
var import_block_styles_dropdown = __toESM(require("./block-styles-dropdown.cjs"));
var import_pattern_overrides_dropdown = __toESM(require("./pattern-overrides-dropdown.cjs"));
var import_use_block_display_title = __toESM(require("../block-title/use-block-display-title.cjs"));
var import_store = require("../../store/index.cjs");
var import_block_bindings = require("../../utils/block-bindings.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function getBlockIconVariant({ select, clientIds }) {
  const {
    getBlockName,
    getBlockAttributes,
    getBlockParentsByBlockName,
    canRemoveBlocks,
    getTemplateLock,
    getBlockEditingMode,
    canEditBlock
  } = (0, import_lock_unlock.unlock)(select(import_store.store));
  const { getBlockStyles } = select(import_blocks.store);
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
    (clientId) => (0, import_block_bindings.hasPatternOverridesDefaultBinding)(
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
  const { getBlockName, getBlockAttributes } = (0, import_lock_unlock.unlock)(
    select(import_store.store)
  );
  const _isSingleBlock = clientIds.length === 1;
  const firstClientId = clientIds[0];
  const blockAttributes = getBlockAttributes(firstClientId);
  if (_isSingleBlock && blockAttributes?.metadata?.patternName) {
    return import_icons.symbol;
  }
  const blockName = getBlockName(firstClientId);
  const blockType = (0, import_blocks.getBlockType)(blockName);
  if (_isSingleBlock) {
    const { getActiveBlockVariation } = select(import_blocks.store);
    const match = getActiveBlockVariation(blockName, blockAttributes);
    return match?.icon || blockType?.icon;
  }
  const blockNames = clientIds.map((id) => getBlockName(id));
  const isSelectionOfSameType = new Set(blockNames).size === 1;
  return isSelectionOfSameType ? blockType?.icon : import_icons.copy;
}
function BlockToolbarIcon({ clientIds, isSynced }) {
  const { icon, showIconLabels, variant } = (0, import_data.useSelect)(
    (select) => {
      return {
        icon: getBlockIcon({ select, clientIds }),
        showIconLabels: select(import_preferences.store).get(
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
  const blockTitle = (0, import_use_block_display_title.default)({
    clientId: clientIds?.[0],
    maximumLength: 35
  });
  const isSingleBlock = clientIds.length === 1;
  const showBlockTitle = isSingleBlock && isSynced && !showIconLabels;
  const label = isSingleBlock ? blockTitle : (0, import_i18n.__)("Multiple blocks selected");
  const text = showBlockTitle && blockTitle ? blockTitle : void 0;
  const BlockIconElement = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_block_icon.default,
    {
      className: "block-editor-block-toolbar__block-icon",
      icon
    }
  );
  if (variant === "switcher") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_switcher.default,
      {
        clientIds,
        label,
        text,
        children: BlockIconElement
      }
    );
  }
  if (variant === "styles-only") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_styles_dropdown.default,
      {
        clientIds,
        label,
        text,
        children: BlockIconElement
      }
    );
  }
  if (variant === "pattern-overrides") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_pattern_overrides_dropdown.default,
      {
        icon: BlockIconElement,
        clientIds,
        blockTitle,
        label
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ToolbarButton,
    {
      disabled: true,
      className: "block-editor-block-toolbar__block-icon-button",
      title: label,
      icon: BlockIconElement,
      text
    }
  );
}
//# sourceMappingURL=block-toolbar-icon.cjs.map
