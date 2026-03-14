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

// packages/block-editor/src/store/private-selectors.js
var private_selectors_exports = {};
__export(private_selectors_exports, {
  getAllPatterns: () => getAllPatterns,
  getBlockRemovalRules: () => getBlockRemovalRules,
  getBlockSettings: () => import_get_block_settings.getBlockSettings,
  getBlockStyles: () => getBlockStyles,
  getBlockWithoutAttributes: () => getBlockWithoutAttributes,
  getClosestAllowedInsertionPoint: () => getClosestAllowedInsertionPoint,
  getClosestAllowedInsertionPointForPattern: () => getClosestAllowedInsertionPointForPattern,
  getContentLockingParent: () => getContentLockingParent,
  getEditedContentOnlySection: () => getEditedContentOnlySection,
  getEnabledBlockParents: () => getEnabledBlockParents,
  getEnabledClientIdsTree: () => getEnabledClientIdsTree,
  getExpandedBlock: () => getExpandedBlock,
  getInserterMediaCategories: () => getInserterMediaCategories,
  getInsertionPoint: () => getInsertionPoint,
  getLastFocus: () => getLastFocus,
  getLastInsertedBlocksClientIds: () => getLastInsertedBlocksClientIds,
  getListViewExpandRevision: () => getListViewExpandRevision,
  getParentSectionBlock: () => getParentSectionBlock,
  getPatternBySlug: () => getPatternBySlug,
  getRegisteredInserterMediaCategories: () => getRegisteredInserterMediaCategories,
  getRemovalPromptData: () => getRemovalPromptData,
  getRequestedInspectorTab: () => getRequestedInspectorTab,
  getReusableBlocks: () => getReusableBlocks,
  getSectionRootClientId: () => getSectionRootClientId,
  getStyleOverrides: () => getStyleOverrides,
  getViewportModalClientIds: () => getViewportModalClientIds,
  getZoomLevel: () => getZoomLevel,
  hasAllowedPatterns: () => hasAllowedPatterns,
  hasBlockSpotlight: () => hasBlockSpotlight,
  isBlockHiddenAnywhere: () => isBlockHiddenAnywhere,
  isBlockHiddenAtViewport: () => isBlockHiddenAtViewport,
  isBlockHiddenEverywhere: () => isBlockHiddenEverywhere,
  isBlockInterfaceHidden: () => isBlockInterfaceHidden,
  isBlockParentHiddenAtViewport: () => isBlockParentHiddenAtViewport,
  isBlockParentHiddenEverywhere: () => isBlockParentHiddenEverywhere,
  isBlockSubtreeDisabled: () => isBlockSubtreeDisabled,
  isContainerInsertableToInContentOnlyMode: () => isContainerInsertableToInContentOnlyMode,
  isDragging: () => isDragging,
  isEditLockedBlock: () => isEditLockedBlock,
  isListViewContentPanelOpen: () => isListViewContentPanelOpen,
  isListViewPanelOpened: () => isListViewPanelOpened,
  isLockedBlock: () => isLockedBlock,
  isMoveLockedBlock: () => isMoveLockedBlock,
  isRemoveLockedBlock: () => isRemoveLockedBlock,
  isSectionBlock: () => isSectionBlock,
  isWithinEditedContentOnlySection: () => isWithinEditedContentOnlySection,
  isZoomOut: () => isZoomOut
});
module.exports = __toCommonJS(private_selectors_exports);
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_selectors = require("./selectors.cjs");
var import_utils = require("./utils.cjs");
var import_constants = require("./constants.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_private_keys = require("./private-keys.cjs");
var import_constants2 = require("../components/block-visibility/constants.cjs");
var import_get_block_settings = require("./get-block-settings.cjs");
var { isContentBlock } = (0, import_lock_unlock.unlock)(import_blocks.privateApis);
function isBlockInterfaceHidden(state) {
  return state.isBlockInterfaceHidden;
}
function getLastInsertedBlocksClientIds(state) {
  return state?.lastBlockInserted?.clientIds;
}
function getBlockWithoutAttributes(state, clientId) {
  return state.blocks.byClientId.get(clientId);
}
var isBlockSubtreeDisabled = (state, clientId) => {
  const isChildSubtreeDisabled = (childClientId) => {
    return (0, import_selectors.getBlockEditingMode)(state, childClientId) === "disabled" && (0, import_selectors.getBlockOrder)(state, childClientId).every(
      isChildSubtreeDisabled
    );
  };
  return (0, import_selectors.getBlockOrder)(state, clientId).every(isChildSubtreeDisabled);
};
function isContainerInsertableToInContentOnlyMode(state, blockName, rootClientId) {
  const isBlockContentBlock = isContentBlock(blockName);
  const rootBlockName = (0, import_selectors.getBlockName)(state, rootClientId);
  const isContainerContentBlock = isContentBlock(rootBlockName);
  const isRootBlockMain = getSectionRootClientId(state) === rootClientId;
  return isRootBlockMain || isContainerContentBlock && isBlockContentBlock;
}
function getEnabledClientIdsTreeUnmemoized(state, rootClientId) {
  const blockOrder = (0, import_selectors.getBlockOrder)(state, rootClientId);
  const result = [];
  for (const clientId of blockOrder) {
    const innerBlocks = getEnabledClientIdsTreeUnmemoized(
      state,
      clientId
    );
    if ((0, import_selectors.getBlockEditingMode)(state, clientId) !== "disabled") {
      result.push({ clientId, innerBlocks });
    } else {
      result.push(...innerBlocks);
    }
  }
  return result;
}
var getEnabledClientIdsTree = (0, import_data.createRegistrySelector)(
  () => (0, import_data.createSelector)(getEnabledClientIdsTreeUnmemoized, (state) => [
    state.blocks.order,
    state.derivedBlockEditingModes,
    state.blockEditingModes
  ])
);
var getEnabledBlockParents = (0, import_data.createSelector)(
  (state, clientId, ascending = false) => {
    return (0, import_selectors.getBlockParents)(state, clientId, ascending).filter(
      (parent) => (0, import_selectors.getBlockEditingMode)(state, parent) !== "disabled"
    );
  },
  (state) => [
    state.blocks.parents,
    state.blockEditingModes,
    state.settings.templateLock,
    state.blockListSettings
  ]
);
function getRemovalPromptData(state) {
  return state.removalPromptData;
}
function getBlockRemovalRules(state) {
  return state.blockRemovalRules;
}
var getStyleOverrides = (0, import_data.createSelector)(
  (state) => {
    const clientIds = (0, import_selectors.getClientIdsWithDescendants)(state);
    const clientIdMap = clientIds.reduce((acc, clientId, index) => {
      acc[clientId] = index;
      return acc;
    }, {});
    return [...state.styleOverrides].sort((overrideA, overrideB) => {
      const [, { clientId: clientIdA }] = overrideA;
      const [, { clientId: clientIdB }] = overrideB;
      const aIndex = clientIdMap[clientIdA] ?? -1;
      const bIndex = clientIdMap[clientIdB] ?? -1;
      return aIndex - bIndex;
    });
  },
  (state) => [state.blocks.order, state.styleOverrides]
);
function getRegisteredInserterMediaCategories(state) {
  return state.registeredInserterMediaCategories;
}
var getInserterMediaCategories = (0, import_data.createSelector)(
  (state) => {
    const {
      settings: {
        inserterMediaCategories,
        allowedMimeTypes,
        enableOpenverseMediaCategory
      },
      registeredInserterMediaCategories
    } = state;
    if (!inserterMediaCategories && !registeredInserterMediaCategories.length || !allowedMimeTypes) {
      return;
    }
    const coreInserterMediaCategoriesNames = inserterMediaCategories?.map(({ name }) => name) || [];
    const mergedCategories = [
      ...inserterMediaCategories || [],
      ...(registeredInserterMediaCategories || []).filter(
        ({ name }) => !coreInserterMediaCategoriesNames.includes(name)
      )
    ];
    return mergedCategories.filter((category) => {
      if (!enableOpenverseMediaCategory && category.name === "openverse") {
        return false;
      }
      return Object.values(allowedMimeTypes).some(
        (mimeType) => mimeType.startsWith(`${category.mediaType}/`)
      );
    });
  },
  (state) => [
    state.settings.inserterMediaCategories,
    state.settings.allowedMimeTypes,
    state.settings.enableOpenverseMediaCategory,
    state.registeredInserterMediaCategories
  ]
);
var hasAllowedPatterns = (0, import_data.createRegistrySelector)(
  (select) => (0, import_data.createSelector)(
    (state, rootClientId = null) => {
      const { getAllPatterns: getAllPatterns2 } = (0, import_lock_unlock.unlock)(select(import_constants.STORE_NAME));
      const patterns = getAllPatterns2();
      const { allowedBlockTypes } = (0, import_selectors.getSettings)(state);
      return patterns.some((pattern) => {
        const { inserter = true } = pattern;
        if (!inserter) {
          return false;
        }
        const grammar = (0, import_utils.getGrammar)(pattern);
        return (0, import_utils.checkAllowListRecursive)(grammar, allowedBlockTypes) && grammar.every(
          ({ name: blockName }) => (0, import_selectors.canInsertBlockType)(state, blockName, rootClientId)
        );
      });
    },
    (state, rootClientId) => [
      ...(0, import_utils.getAllPatternsDependants)(select)(state),
      ...(0, import_utils.getInsertBlockTypeDependants)(select)(state, rootClientId)
    ]
  )
);
var getPatternBySlug = (0, import_data.createRegistrySelector)(
  (select) => (0, import_data.createSelector)(
    (state, patternName) => {
      if (patternName?.startsWith("core/block/")) {
        const _id = parseInt(
          patternName.slice("core/block/".length),
          10
        );
        const block = (0, import_lock_unlock.unlock)(select(import_constants.STORE_NAME)).getReusableBlocks().find(({ id }) => id === _id);
        if (!block) {
          return null;
        }
        return (0, import_utils.mapUserPattern)(
          block,
          state.settings.__experimentalUserPatternCategories
        );
      }
      return [
        // This setting is left for back compat.
        ...state.settings.__experimentalBlockPatterns ?? [],
        ...state.settings[import_private_keys.selectBlockPatternsKey]?.(select) ?? []
      ].find(({ name }) => name === patternName);
    },
    (state, patternName) => patternName?.startsWith("core/block/") ? [
      (0, import_lock_unlock.unlock)(select(import_constants.STORE_NAME)).getReusableBlocks(),
      state.settings.__experimentalReusableBlocks
    ] : [
      state.settings.__experimentalBlockPatterns,
      state.settings[import_private_keys.selectBlockPatternsKey]?.(select)
    ]
  )
);
var getAllPatterns = (0, import_data.createRegistrySelector)(
  (select) => (0, import_data.createSelector)((state) => {
    return [
      ...(0, import_lock_unlock.unlock)(select(import_constants.STORE_NAME)).getReusableBlocks().map(
        (userPattern) => (0, import_utils.mapUserPattern)(
          userPattern,
          state.settings.__experimentalUserPatternCategories
        )
      ),
      // This setting is left for back compat.
      ...state.settings.__experimentalBlockPatterns ?? [],
      ...state.settings[import_private_keys.selectBlockPatternsKey]?.(select) ?? []
    ].filter(
      (x, index, arr) => index === arr.findIndex((y) => x.name === y.name)
    );
  }, (0, import_utils.getAllPatternsDependants)(select))
);
var EMPTY_ARRAY = [];
var getReusableBlocks = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    const reusableBlocksSelect = state.settings[import_private_keys.reusableBlocksSelectKey];
    return (reusableBlocksSelect ? reusableBlocksSelect(select) : state.settings.__experimentalReusableBlocks) ?? EMPTY_ARRAY;
  }
);
function getLastFocus(state) {
  return state.lastFocus;
}
function isDragging(state) {
  return state.isDragging;
}
function getExpandedBlock(state) {
  return state.expandedBlock;
}
var getContentLockingParent = (state, clientId) => {
  let current = clientId;
  let result;
  while (!result && (current = state.blocks.parents.get(current))) {
    if ((0, import_selectors.getTemplateLock)(state, current) === "contentOnly") {
      result = current;
    }
  }
  return result;
};
function isSectionBlockCandidate(state, clientId) {
  const blockName = (0, import_selectors.getBlockName)(state, clientId);
  if (blockName === "core/block") {
    return true;
  }
  const attributes = (0, import_selectors.getBlockAttributes)(state, clientId);
  const isTemplatePart = blockName === "core/template-part";
  const isIsolatedEditor = state.settings?.[import_private_keys.isIsolatedEditorKey];
  const disableContentOnlyForUnsyncedPatterns = state.settings?.disableContentOnlyForUnsyncedPatterns;
  if ((!disableContentOnlyForUnsyncedPatterns && attributes?.metadata?.patternName || isTemplatePart) && !isIsolatedEditor) {
    return true;
  }
  const hasContentOnlyTemplateLock = (0, import_selectors.getTemplateLock)(state, clientId) === "contentOnly";
  const rootClientId = (0, import_selectors.getBlockRootClientId)(state, clientId);
  const hasRootContentOnlyTemplateLock = (0, import_selectors.getTemplateLock)(state, rootClientId) === "contentOnly";
  if (hasContentOnlyTemplateLock && !hasRootContentOnlyTemplateLock) {
    return true;
  }
  return false;
}
var getParentSectionBlock = (state, clientId) => {
  if (isWithinEditedContentOnlySection(state, clientId)) {
    return void 0;
  }
  let current = clientId;
  let result;
  while (current = state.blocks.parents.get(current)) {
    if (isSectionBlockCandidate(state, current)) {
      result = current;
    }
  }
  return result;
};
function isSectionBlock(state, clientId) {
  if (isWithinEditedContentOnlySection(state, clientId) || getParentSectionBlock(state, clientId)) {
    return false;
  }
  return isSectionBlockCandidate(state, clientId);
}
function getEditedContentOnlySection(state) {
  return state.editedContentOnlySection;
}
function isWithinEditedContentOnlySection(state, clientId) {
  if (!state.editedContentOnlySection) {
    return false;
  }
  if (state.editedContentOnlySection === clientId) {
    return true;
  }
  let current = clientId;
  while (current = state.blocks.parents.get(current)) {
    if (state.editedContentOnlySection === current) {
      return true;
    }
  }
  return false;
}
var getBlockStyles = (0, import_data.createSelector)(
  (state, clientIds) => clientIds.reduce((styles, clientId) => {
    styles[clientId] = state.blocks.attributes.get(clientId)?.style;
    return styles;
  }, {}),
  (state, clientIds) => [
    ...clientIds.map(
      (clientId) => state.blocks.attributes.get(clientId)?.style
    )
  ]
);
function getSectionRootClientId(state) {
  return state.settings?.[import_private_keys.sectionRootClientIdKey];
}
function isZoomOut(state) {
  return state.zoomLevel === "auto-scaled" || state.zoomLevel < 100;
}
function getZoomLevel(state) {
  return state.zoomLevel;
}
function getClosestAllowedInsertionPoint(state, name, clientId = "") {
  const blockNames = Array.isArray(name) ? name : [name];
  const areBlockNamesAllowedInClientId = (id) => blockNames.every(
    (currentName) => (0, import_selectors.canInsertBlockType)(state, currentName, id)
  );
  if (!clientId) {
    if (areBlockNamesAllowedInClientId(clientId)) {
      return clientId;
    }
    const sectionRootClientId = getSectionRootClientId(state);
    if (sectionRootClientId && areBlockNamesAllowedInClientId(sectionRootClientId)) {
      return sectionRootClientId;
    }
    return null;
  }
  let current = clientId;
  while (current !== null && !areBlockNamesAllowedInClientId(current)) {
    const parentClientId = (0, import_selectors.getBlockRootClientId)(state, current);
    current = parentClientId;
  }
  return current;
}
function getClosestAllowedInsertionPointForPattern(state, pattern, clientId) {
  const { allowedBlockTypes } = (0, import_selectors.getSettings)(state);
  const isAllowed = (0, import_utils.checkAllowListRecursive)(
    (0, import_utils.getGrammar)(pattern),
    allowedBlockTypes
  );
  if (!isAllowed) {
    return null;
  }
  const names = (0, import_utils.getGrammar)(pattern).map(({ blockName: name }) => name);
  return getClosestAllowedInsertionPoint(state, names, clientId);
}
function getInsertionPoint(state) {
  return state.insertionPoint;
}
var isBlockHiddenAnywhere = (state, clientId) => {
  const blockName = (0, import_selectors.getBlockName)(state, clientId);
  if (!(0, import_blocks.hasBlockSupport)(blockName, "visibility", true)) {
    return false;
  }
  const attributes = state.blocks.attributes.get(clientId);
  const blockVisibility = attributes?.metadata?.blockVisibility;
  if (blockVisibility === false) {
    return true;
  }
  if (typeof blockVisibility?.viewport === "object" && blockVisibility?.viewport !== null) {
    return Object.values(import_constants2.BLOCK_VISIBILITY_VIEWPORTS).some(
      (viewport) => blockVisibility?.viewport?.[viewport.key] === false
    );
  }
  return false;
};
var isBlockHiddenEverywhere = (state, clientId) => {
  const blockName = (0, import_selectors.getBlockName)(state, clientId);
  if (!(0, import_blocks.hasBlockSupport)(blockName, "visibility", true)) {
    return false;
  }
  const attributes = state.blocks.attributes.get(clientId);
  const blockVisibility = attributes?.metadata?.blockVisibility;
  if (blockVisibility === false) {
    return true;
  }
  return false;
};
var isBlockParentHiddenEverywhere = (state, clientId) => {
  const parents = (0, import_selectors.getBlockParents)(state, clientId);
  return parents.some(
    (parentId) => isBlockHiddenEverywhere(state, parentId)
  );
};
var isBlockHiddenAtViewport = (state, clientId, viewport) => {
  if (isBlockHiddenEverywhere(state, clientId)) {
    return true;
  }
  const attributes = state.blocks.attributes.get(clientId);
  const blockVisibilityViewport = attributes?.metadata?.blockVisibility?.viewport;
  if (typeof blockVisibilityViewport === "object" && blockVisibilityViewport !== null && typeof viewport === "string") {
    return blockVisibilityViewport?.[viewport.toLowerCase()] === false;
  }
  return false;
};
var isBlockParentHiddenAtViewport = (state, clientId, viewport) => {
  const parents = (0, import_selectors.getBlockParents)(state, clientId);
  return parents.some(
    (parentId) => isBlockHiddenAtViewport(state, parentId, viewport)
  );
};
function hasBlockSpotlight(state) {
  return !!state.hasBlockSpotlight || !!state.editedContentOnlySection;
}
function isEditLockedBlock(state, clientId) {
  const attributes = (0, import_selectors.getBlockAttributes)(state, clientId);
  return !!attributes?.lock?.edit;
}
function isMoveLockedBlock(state, clientId) {
  const attributes = (0, import_selectors.getBlockAttributes)(state, clientId);
  if (attributes?.lock?.move !== void 0) {
    return !!attributes?.lock?.move;
  }
  const rootClientId = (0, import_selectors.getBlockRootClientId)(state, clientId);
  const templateLock = (0, import_selectors.getTemplateLock)(state, rootClientId);
  return templateLock === "all";
}
function isRemoveLockedBlock(state, clientId) {
  const attributes = (0, import_selectors.getBlockAttributes)(state, clientId);
  if (attributes?.lock?.remove !== void 0) {
    return !!attributes?.lock?.remove;
  }
  const rootClientId = (0, import_selectors.getBlockRootClientId)(state, clientId);
  const templateLock = (0, import_selectors.getTemplateLock)(state, rootClientId);
  return templateLock === "all" || templateLock === "insert";
}
function isLockedBlock(state, clientId) {
  return isEditLockedBlock(state, clientId) || isMoveLockedBlock(state, clientId) || isRemoveLockedBlock(state, clientId);
}
function isListViewContentPanelOpen(state) {
  return state.listViewContentPanelOpen;
}
function isListViewPanelOpened(state, clientId) {
  if (state.openedListViewPanels?.allOpen) {
    return true;
  }
  return state.openedListViewPanels?.panels?.[clientId] === true;
}
function getListViewExpandRevision(state) {
  return state.listViewExpandRevision || 0;
}
function getViewportModalClientIds(state) {
  return state.viewportModalClientIds;
}
function getRequestedInspectorTab(state) {
  return state.requestedInspectorTab;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAllPatterns,
  getBlockRemovalRules,
  getBlockSettings,
  getBlockStyles,
  getBlockWithoutAttributes,
  getClosestAllowedInsertionPoint,
  getClosestAllowedInsertionPointForPattern,
  getContentLockingParent,
  getEditedContentOnlySection,
  getEnabledBlockParents,
  getEnabledClientIdsTree,
  getExpandedBlock,
  getInserterMediaCategories,
  getInsertionPoint,
  getLastFocus,
  getLastInsertedBlocksClientIds,
  getListViewExpandRevision,
  getParentSectionBlock,
  getPatternBySlug,
  getRegisteredInserterMediaCategories,
  getRemovalPromptData,
  getRequestedInspectorTab,
  getReusableBlocks,
  getSectionRootClientId,
  getStyleOverrides,
  getViewportModalClientIds,
  getZoomLevel,
  hasAllowedPatterns,
  hasBlockSpotlight,
  isBlockHiddenAnywhere,
  isBlockHiddenAtViewport,
  isBlockHiddenEverywhere,
  isBlockInterfaceHidden,
  isBlockParentHiddenAtViewport,
  isBlockParentHiddenEverywhere,
  isBlockSubtreeDisabled,
  isContainerInsertableToInContentOnlyMode,
  isDragging,
  isEditLockedBlock,
  isListViewContentPanelOpen,
  isListViewPanelOpened,
  isLockedBlock,
  isMoveLockedBlock,
  isRemoveLockedBlock,
  isSectionBlock,
  isWithinEditedContentOnlySection,
  isZoomOut
});
//# sourceMappingURL=private-selectors.cjs.map
