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

// packages/editor/src/store/private-selectors.js
var private_selectors_exports = {};
__export(private_selectors_exports, {
  getCanvasMinHeight: () => getCanvasMinHeight,
  getCurrentRevision: () => getCurrentRevision,
  getCurrentRevisionId: () => getCurrentRevisionId,
  getDefaultRenderingMode: () => getDefaultRenderingMode,
  getEntityActions: () => getEntityActions,
  getEntityFields: () => getEntityFields,
  getInserter: () => getInserter,
  getInserterSidebarToggleRef: () => getInserterSidebarToggleRef,
  getListViewToggleRef: () => getListViewToggleRef,
  getPostBlocksByName: () => getPostBlocksByName,
  getPostIcon: () => getPostIcon,
  getPreviousRevision: () => getPreviousRevision,
  getSelectedNote: () => getSelectedNote,
  getShowStylebook: () => getShowStylebook,
  getStylesPath: () => getStylesPath,
  hasPostMetaChanges: () => hasPostMetaChanges,
  isEntityReady: () => isEntityReady,
  isNoteFocused: () => isNoteFocused,
  isRevisionsMode: () => isRevisionsMode
});
module.exports = __toCommonJS(private_selectors_exports);
var import_fast_deep_equal = __toESM(require("fast-deep-equal"));
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_icons = require("@wordpress/icons");
var import_core_data = require("@wordpress/core-data");
var import_preferences = require("@wordpress/preferences");
var import_selectors = require("./selectors.cjs");
var import_private_selectors = require("../dataviews/store/private-selectors.cjs");
var import_utils = require("../utils/index.cjs");
var EMPTY_INSERTION_POINT = {
  rootClientId: void 0,
  insertionIndex: void 0,
  filterValue: void 0
};
var RENDERING_MODES = ["post-only", "template-locked"];
var getInserter = (0, import_data.createRegistrySelector)(
  (select) => (0, import_data.createSelector)(
    (state) => {
      if (typeof state.blockInserterPanel === "object") {
        return state.blockInserterPanel;
      }
      if ((0, import_selectors.getRenderingMode)(state) === "template-locked") {
        const [postContentClientId] = select(import_block_editor.store).getBlocksByName(
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
      const [postContentClientId] = select(import_block_editor.store).getBlocksByName(
        "core/post-content"
      );
      return [
        state.blockInserterPanel,
        (0, import_selectors.getRenderingMode)(state),
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
  wp_block: import_icons.symbol,
  wp_navigation: import_icons.navigation,
  page: import_icons.page,
  post: import_icons.verse
};
var getPostIcon = (0, import_data.createRegistrySelector)(
  (select) => (state, postType, options) => {
    {
      if (postType === "wp_template_part" || postType === "wp_template") {
        const templateAreas = select(import_core_data.store).getCurrentTheme()?.default_template_part_areas || [];
        const areaData = templateAreas.find(
          (item) => options.area === item.area
        );
        if (areaData?.icon) {
          return (0, import_utils.getTemplatePartIcon)(areaData.icon);
        }
        return import_icons.layout;
      }
      if (CARD_ICONS[postType]) {
        return CARD_ICONS[postType];
      }
      const postTypeEntity = select(import_core_data.store).getPostType(postType);
      if (typeof postTypeEntity?.icon === "string" && postTypeEntity.icon.startsWith("dashicons-")) {
        return postTypeEntity.icon.slice(10);
      }
      return import_icons.page;
    }
  }
);
var hasPostMetaChanges = (0, import_data.createRegistrySelector)(
  (select) => (state, postType, postId) => {
    const { type: currentPostType, id: currentPostId } = (0, import_selectors.getCurrentPost)(state);
    const edits = select(import_core_data.store).getEntityRecordNonTransientEdits(
      "postType",
      postType || currentPostType,
      postId || currentPostId
    );
    if (!edits?.meta) {
      return false;
    }
    const originalPostMeta = select(import_core_data.store).getEntityRecord(
      "postType",
      postType || currentPostType,
      postId || currentPostId
    )?.meta;
    return !(0, import_fast_deep_equal.default)(
      { ...originalPostMeta, footnotes: void 0 },
      { ...edits.meta, footnotes: void 0 }
    );
  }
);
function getEntityActions(state, ...args) {
  return (0, import_private_selectors.getEntityActions)(state.dataviews, ...args);
}
function isEntityReady(state, ...args) {
  return (0, import_private_selectors.isEntityReady)(state.dataviews, ...args);
}
function getEntityFields(state, ...args) {
  return (0, import_private_selectors.getEntityFields)(state.dataviews, ...args);
}
var getPostBlocksByName = (0, import_data.createRegistrySelector)(
  (select) => (0, import_data.createSelector)(
    (state, blockNames) => {
      blockNames = Array.isArray(blockNames) ? blockNames : [blockNames];
      const { getBlocksByName, getBlockParents, getBlockName } = select(import_block_editor.store);
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
    () => [select(import_block_editor.store).getBlocks()]
  )
);
var getDefaultRenderingMode = (0, import_data.createRegistrySelector)(
  (select) => (state, postType) => {
    const { getPostType, getCurrentTheme, hasFinishedResolution } = select(import_core_data.store);
    const currentTheme = getCurrentTheme();
    const postTypeEntity = getPostType(postType);
    if (!hasFinishedResolution("getPostType", [postType]) || !hasFinishedResolution("getCurrentTheme")) {
      return void 0;
    }
    const theme = currentTheme?.stylesheet;
    const defaultModePreference = select(import_preferences.store).get(
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
var getCurrentRevision = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    const revisionId = getCurrentRevisionId(state);
    if (!revisionId) {
      return void 0;
    }
    const { type: postType, id: postId } = (0, import_selectors.getCurrentPost)(state);
    const revisions = select(import_core_data.store).getRevisions(
      "postType",
      postType,
      postId,
      { per_page: -1, context: "edit" }
    );
    if (!revisions) {
      return null;
    }
    const entityConfig = select(import_core_data.store).getEntityConfig(
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
var getPreviousRevision = (0, import_data.createRegistrySelector)(
  (select) => (state) => {
    const currentRevisionId = getCurrentRevisionId(state);
    if (!currentRevisionId) {
      return void 0;
    }
    const { type: postType, id: postId } = (0, import_selectors.getCurrentPost)(state);
    const revisions = select(import_core_data.store).getRevisions(
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
    const entityConfig = select(import_core_data.store).getEntityConfig(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=private-selectors.cjs.map
