// packages/editor/src/store/private-selectors.js
import fastDeepEqual from "fast-deep-equal";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { createSelector, createRegistrySelector } from "@wordpress/data";
import {
  layout,
  symbol,
  navigation,
  page as pageIcon,
  verse
} from "@wordpress/icons";
import { store as coreStore } from "@wordpress/core-data";
import { store as preferencesStore } from "@wordpress/preferences";
import { getRenderingMode, getCurrentPost } from "./selectors.mjs";
import {
  getEntityActions as _getEntityActions,
  getEntityFields as _getEntityFields,
  isEntityReady as _isEntityReady
} from "../dataviews/store/private-selectors.mjs";
import { getTemplatePartIcon } from "../utils/index.mjs";
var EMPTY_INSERTION_POINT = {
  rootClientId: void 0,
  insertionIndex: void 0,
  filterValue: void 0
};
var RENDERING_MODES = ["post-only", "template-locked"];
var getInserter = createRegistrySelector(
  (select) => createSelector(
    (state) => {
      if (typeof state.blockInserterPanel === "object") {
        return state.blockInserterPanel;
      }
      if (getRenderingMode(state) === "template-locked") {
        const [postContentClientId] = select(blockEditorStore).getBlocksByName(
          "core/post-content"
        );
        if (postContentClientId) {
          return {
            rootClientId: postContentClientId,
            insertionIndex: void 0,
            filterValue: void 0
          };
        }
      }
      return EMPTY_INSERTION_POINT;
    },
    (state) => {
      const [postContentClientId] = select(blockEditorStore).getBlocksByName(
        "core/post-content"
      );
      return [
        state.blockInserterPanel,
        getRenderingMode(state),
        postContentClientId
      ];
    }
  )
);
function getListViewToggleRef(state) {
  return state.listViewToggleRef;
}
function getInserterSidebarToggleRef(state) {
  return state.inserterSidebarToggleRef;
}
var CARD_ICONS = {
  wp_block: symbol,
  wp_navigation: navigation,
  page: pageIcon,
  post: verse
};
var getPostIcon = createRegistrySelector(
  (select) => (state, postType, options) => {
    {
      if (postType === "wp_template_part" || postType === "wp_template") {
        const templateAreas = select(coreStore).getCurrentTheme()?.default_template_part_areas || [];
        const areaData = templateAreas.find(
          (item) => options.area === item.area
        );
        if (areaData?.icon) {
          return getTemplatePartIcon(areaData.icon);
        }
        return layout;
      }
      if (CARD_ICONS[postType]) {
        return CARD_ICONS[postType];
      }
      const postTypeEntity = select(coreStore).getPostType(postType);
      if (typeof postTypeEntity?.icon === "string" && postTypeEntity.icon.startsWith("dashicons-")) {
        return postTypeEntity.icon.slice(10);
      }
      return pageIcon;
    }
  }
);
var hasPostMetaChanges = createRegistrySelector(
  (select) => (state, postType, postId) => {
    const { type: currentPostType, id: currentPostId } = getCurrentPost(state);
    const edits = select(coreStore).getEntityRecordNonTransientEdits(
      "postType",
      postType || currentPostType,
      postId || currentPostId
    );
    if (!edits?.meta) {
      return false;
    }
    const originalPostMeta = select(coreStore).getEntityRecord(
      "postType",
      postType || currentPostType,
      postId || currentPostId
    )?.meta;
    return !fastDeepEqual(
      { ...originalPostMeta, footnotes: void 0 },
      { ...edits.meta, footnotes: void 0 }
    );
  }
);
function getEntityActions(state, ...args) {
  return _getEntityActions(state.dataviews, ...args);
}
function isEntityReady(state, ...args) {
  return _isEntityReady(state.dataviews, ...args);
}
function getEntityFields(state, ...args) {
  return _getEntityFields(state.dataviews, ...args);
}
var getPostBlocksByName = createRegistrySelector(
  (select) => createSelector(
    (state, blockNames) => {
      blockNames = Array.isArray(blockNames) ? blockNames : [blockNames];
      const { getBlocksByName, getBlockParents, getBlockName } = select(blockEditorStore);
      return getBlocksByName(blockNames).filter(
        (clientId) => getBlockParents(clientId).every((parentClientId) => {
          const parentBlockName = getBlockName(parentClientId);
          return (
            // Ignore descendents of the query block.
            parentBlockName !== "core/query" && // Enable only the top-most block.
            !blockNames.includes(parentBlockName)
          );
        })
      );
    },
    () => [select(blockEditorStore).getBlocks()]
  )
);
var getDefaultRenderingMode = createRegistrySelector(
  (select) => (state, postType) => {
    const { getPostType, getCurrentTheme, hasFinishedResolution } = select(coreStore);
    const currentTheme = getCurrentTheme();
    const postTypeEntity = getPostType(postType);
    if (!hasFinishedResolution("getPostType", [postType]) || !hasFinishedResolution("getCurrentTheme")) {
      return void 0;
    }
    const theme = currentTheme?.stylesheet;
    const defaultModePreference = select(preferencesStore).get(
      "core",
      "renderingModes"
    )?.[theme]?.[postType];
    const postTypeDefaultMode = Array.isArray(
      postTypeEntity?.supports?.editor
    ) ? postTypeEntity.supports.editor.find(
      (features) => "default-mode" in features
    )?.["default-mode"] : void 0;
    const defaultMode = defaultModePreference || postTypeDefaultMode;
    if (!RENDERING_MODES.includes(defaultMode)) {
      return "post-only";
    }
    return defaultMode;
  }
);
function getStylesPath(state) {
  return state.stylesPath ?? "/";
}
function getShowStylebook(state) {
  return state.showStylebook ?? false;
}
function getCanvasMinHeight(state) {
  return state.canvasMinHeight;
}
function isRevisionsMode(state) {
  return state.revisionId !== null;
}
function getCurrentRevisionId(state) {
  return state.revisionId;
}
var getCurrentRevision = createRegistrySelector(
  (select) => (state) => {
    const revisionId = getCurrentRevisionId(state);
    if (!revisionId) {
      return void 0;
    }
    const { type: postType, id: postId } = getCurrentPost(state);
    const revisions = select(coreStore).getRevisions(
      "postType",
      postType,
      postId,
      { per_page: -1, context: "edit" }
    );
    if (!revisions) {
      return null;
    }
    const entityConfig = select(coreStore).getEntityConfig(
      "postType",
      postType
    );
    const revKey = entityConfig?.revisionKey || "id";
    return revisions.find((r) => r[revKey] === revisionId) ?? null;
  }
);
function getSelectedNote(state) {
  return state.selectedNote?.noteId;
}
function isNoteFocused(state) {
  return !!state.selectedNote?.options?.focus;
}
var getPreviousRevision = createRegistrySelector(
  (select) => (state) => {
    const currentRevisionId = getCurrentRevisionId(state);
    if (!currentRevisionId) {
      return void 0;
    }
    const { type: postType, id: postId } = getCurrentPost(state);
    const revisions = select(coreStore).getRevisions(
      "postType",
      postType,
      postId,
      { per_page: -1, context: "edit" }
    );
    if (!revisions) {
      return null;
    }
    const sortedRevisions = [...revisions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const entityConfig = select(coreStore).getEntityConfig(
      "postType",
      postType
    );
    const revKey = entityConfig?.revisionKey || "id";
    const currentIndex = sortedRevisions.findIndex(
      (r) => r[revKey] === currentRevisionId
    );
    if (currentIndex > 0) {
      return sortedRevisions[currentIndex - 1];
    }
    return null;
  }
);
export {
  getCanvasMinHeight,
  getCurrentRevision,
  getCurrentRevisionId,
  getDefaultRenderingMode,
  getEntityActions,
  getEntityFields,
  getInserter,
  getInserterSidebarToggleRef,
  getListViewToggleRef,
  getPostBlocksByName,
  getPostIcon,
  getPreviousRevision,
  getSelectedNote,
  getShowStylebook,
  getStylesPath,
  hasPostMetaChanges,
  isEntityReady,
  isNoteFocused,
  isRevisionsMode
};
//# sourceMappingURL=private-selectors.mjs.map
