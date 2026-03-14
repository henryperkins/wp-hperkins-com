// packages/block-editor/src/store/private-selectors.js
import { createSelector, createRegistrySelector } from "@wordpress/data";
import {
  hasBlockSupport,
  privateApis as blocksPrivateApis
} from "@wordpress/blocks";
import {
  getBlockOrder,
  getBlockParents,
  getBlockEditingMode,
  getSettings,
  canInsertBlockType,
  getBlockName,
  getTemplateLock,
  getClientIdsWithDescendants,
  getBlockRootClientId,
  getBlockAttributes
} from "./selectors.mjs";
import {
  checkAllowListRecursive,
  getAllPatternsDependants,
  getInsertBlockTypeDependants,
  getGrammar,
  mapUserPattern
} from "./utils.mjs";
import { STORE_NAME } from "./constants.mjs";
import { unlock } from "../lock-unlock.mjs";
import {
  selectBlockPatternsKey,
  reusableBlocksSelectKey,
  sectionRootClientIdKey,
  isIsolatedEditorKey
} from "./private-keys.mjs";
import { BLOCK_VISIBILITY_VIEWPORTS } from "../components/block-visibility/constants.mjs";
import { getBlockSettings } from "./get-block-settings.mjs";
var { isContentBlock } = unlock(blocksPrivateApis);
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
    return getBlockEditingMode(state, childClientId) === "disabled" && getBlockOrder(state, childClientId).every(
      isChildSubtreeDisabled
    );
  };
  return getBlockOrder(state, clientId).every(isChildSubtreeDisabled);
};
function isContainerInsertableToInContentOnlyMode(state, blockName, rootClientId) {
  const isBlockContentBlock = isContentBlock(blockName);
  const rootBlockName = getBlockName(state, rootClientId);
  const isContainerContentBlock = isContentBlock(rootBlockName);
  const isRootBlockMain = getSectionRootClientId(state) === rootClientId;
  return isRootBlockMain || isContainerContentBlock && isBlockContentBlock;
}
function getEnabledClientIdsTreeUnmemoized(state, rootClientId) {
  const blockOrder = getBlockOrder(state, rootClientId);
  const result = [];
  for (const clientId of blockOrder) {
    const innerBlocks = getEnabledClientIdsTreeUnmemoized(
      state,
      clientId
    );
    if (getBlockEditingMode(state, clientId) !== "disabled") {
      result.push({ clientId, innerBlocks });
    } else {
      result.push(...innerBlocks);
    }
  }
  return result;
}
var getEnabledClientIdsTree = createRegistrySelector(
  () => createSelector(getEnabledClientIdsTreeUnmemoized, (state) => [
    state.blocks.order,
    state.derivedBlockEditingModes,
    state.blockEditingModes
  ])
);
var getEnabledBlockParents = createSelector(
  (state, clientId, ascending = false) => {
    return getBlockParents(state, clientId, ascending).filter(
      (parent) => getBlockEditingMode(state, parent) !== "disabled"
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
var getStyleOverrides = createSelector(
  (state) => {
    const clientIds = getClientIdsWithDescendants(state);
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
var getInserterMediaCategories = createSelector(
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
var hasAllowedPatterns = createRegistrySelector(
  (select) => createSelector(
    (state, rootClientId = null) => {
      const { getAllPatterns: getAllPatterns2 } = unlock(select(STORE_NAME));
      const patterns = getAllPatterns2();
      const { allowedBlockTypes } = getSettings(state);
      return patterns.some((pattern) => {
        const { inserter = true } = pattern;
        if (!inserter) {
          return false;
        }
        const grammar = getGrammar(pattern);
        return checkAllowListRecursive(grammar, allowedBlockTypes) && grammar.every(
          ({ name: blockName }) => canInsertBlockType(state, blockName, rootClientId)
        );
      });
    },
    (state, rootClientId) => [
      ...getAllPatternsDependants(select)(state),
      ...getInsertBlockTypeDependants(select)(state, rootClientId)
    ]
  )
);
var getPatternBySlug = createRegistrySelector(
  (select) => createSelector(
    (state, patternName) => {
      if (patternName?.startsWith("core/block/")) {
        const _id = parseInt(
          patternName.slice("core/block/".length),
          10
        );
        const block = unlock(select(STORE_NAME)).getReusableBlocks().find(({ id }) => id === _id);
        if (!block) {
          return null;
        }
        return mapUserPattern(
          block,
          state.settings.__experimentalUserPatternCategories
        );
      }
      return [
        // This setting is left for back compat.
        ...state.settings.__experimentalBlockPatterns ?? [],
        ...state.settings[selectBlockPatternsKey]?.(select) ?? []
      ].find(({ name }) => name === patternName);
    },
    (state, patternName) => patternName?.startsWith("core/block/") ? [
      unlock(select(STORE_NAME)).getReusableBlocks(),
      state.settings.__experimentalReusableBlocks
    ] : [
      state.settings.__experimentalBlockPatterns,
      state.settings[selectBlockPatternsKey]?.(select)
    ]
  )
);
var getAllPatterns = createRegistrySelector(
  (select) => createSelector((state) => {
    return [
      ...unlock(select(STORE_NAME)).getReusableBlocks().map(
        (userPattern) => mapUserPattern(
          userPattern,
          state.settings.__experimentalUserPatternCategories
        )
      ),
      // This setting is left for back compat.
      ...state.settings.__experimentalBlockPatterns ?? [],
      ...state.settings[selectBlockPatternsKey]?.(select) ?? []
    ].filter(
      (x, index, arr) => index === arr.findIndex((y) => x.name === y.name)
    );
  }, getAllPatternsDependants(select))
);
var EMPTY_ARRAY = [];
var getReusableBlocks = createRegistrySelector(
  (select) => (state) => {
    const reusableBlocksSelect = state.settings[reusableBlocksSelectKey];
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
    if (getTemplateLock(state, current) === "contentOnly") {
      result = current;
    }
  }
  return result;
};
function isSectionBlockCandidate(state, clientId) {
  const blockName = getBlockName(state, clientId);
  if (blockName === "core/block") {
    return true;
  }
  const attributes = getBlockAttributes(state, clientId);
  const isTemplatePart = blockName === "core/template-part";
  const isIsolatedEditor = state.settings?.[isIsolatedEditorKey];
  const disableContentOnlyForUnsyncedPatterns = state.settings?.disableContentOnlyForUnsyncedPatterns;
  if ((!disableContentOnlyForUnsyncedPatterns && attributes?.metadata?.patternName || isTemplatePart) && !isIsolatedEditor) {
    return true;
  }
  const hasContentOnlyTemplateLock = getTemplateLock(state, clientId) === "contentOnly";
  const rootClientId = getBlockRootClientId(state, clientId);
  const hasRootContentOnlyTemplateLock = getTemplateLock(state, rootClientId) === "contentOnly";
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
var getBlockStyles = createSelector(
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
  return state.settings?.[sectionRootClientIdKey];
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
    (currentName) => canInsertBlockType(state, currentName, id)
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
    const parentClientId = getBlockRootClientId(state, current);
    current = parentClientId;
  }
  return current;
}
function getClosestAllowedInsertionPointForPattern(state, pattern, clientId) {
  const { allowedBlockTypes } = getSettings(state);
  const isAllowed = checkAllowListRecursive(
    getGrammar(pattern),
    allowedBlockTypes
  );
  if (!isAllowed) {
    return null;
  }
  const names = getGrammar(pattern).map(({ blockName: name }) => name);
  return getClosestAllowedInsertionPoint(state, names, clientId);
}
function getInsertionPoint(state) {
  return state.insertionPoint;
}
var isBlockHiddenAnywhere = (state, clientId) => {
  const blockName = getBlockName(state, clientId);
  if (!hasBlockSupport(blockName, "visibility", true)) {
    return false;
  }
  const attributes = state.blocks.attributes.get(clientId);
  const blockVisibility = attributes?.metadata?.blockVisibility;
  if (blockVisibility === false) {
    return true;
  }
  if (typeof blockVisibility?.viewport === "object" && blockVisibility?.viewport !== null) {
    return Object.values(BLOCK_VISIBILITY_VIEWPORTS).some(
      (viewport) => blockVisibility?.viewport?.[viewport.key] === false
    );
  }
  return false;
};
var isBlockHiddenEverywhere = (state, clientId) => {
  const blockName = getBlockName(state, clientId);
  if (!hasBlockSupport(blockName, "visibility", true)) {
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
  const parents = getBlockParents(state, clientId);
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
  const parents = getBlockParents(state, clientId);
  return parents.some(
    (parentId) => isBlockHiddenAtViewport(state, parentId, viewport)
  );
};
function hasBlockSpotlight(state) {
  return !!state.hasBlockSpotlight || !!state.editedContentOnlySection;
}
function isEditLockedBlock(state, clientId) {
  const attributes = getBlockAttributes(state, clientId);
  return !!attributes?.lock?.edit;
}
function isMoveLockedBlock(state, clientId) {
  const attributes = getBlockAttributes(state, clientId);
  if (attributes?.lock?.move !== void 0) {
    return !!attributes?.lock?.move;
  }
  const rootClientId = getBlockRootClientId(state, clientId);
  const templateLock = getTemplateLock(state, rootClientId);
  return templateLock === "all";
}
function isRemoveLockedBlock(state, clientId) {
  const attributes = getBlockAttributes(state, clientId);
  if (attributes?.lock?.remove !== void 0) {
    return !!attributes?.lock?.remove;
  }
  const rootClientId = getBlockRootClientId(state, clientId);
  const templateLock = getTemplateLock(state, rootClientId);
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
export {
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
};
//# sourceMappingURL=private-selectors.mjs.map
