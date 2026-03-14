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

// packages/core-data/src/reducer.js
var reducer_exports = {};
__export(reducer_exports, {
  autosaves: () => autosaves,
  blockPatternCategories: () => blockPatternCategories,
  blockPatterns: () => blockPatterns,
  collaborationSupported: () => collaborationSupported,
  currentGlobalStylesId: () => currentGlobalStylesId,
  currentTheme: () => currentTheme,
  currentUser: () => currentUser,
  default: () => reducer_default,
  defaultTemplates: () => defaultTemplates,
  editorAssets: () => editorAssets,
  editorSettings: () => editorSettings,
  editsReference: () => editsReference,
  embedPreviews: () => embedPreviews,
  entities: () => entities,
  entitiesConfig: () => entitiesConfig,
  navigationFallbackId: () => navigationFallbackId,
  registeredPostMeta: () => registeredPostMeta,
  syncConnectionStatuses: () => syncConnectionStatuses,
  themeBaseGlobalStyles: () => themeBaseGlobalStyles,
  themeGlobalStyleRevisions: () => themeGlobalStyleRevisions,
  themeGlobalStyleVariations: () => themeGlobalStyleVariations,
  undoManager: () => undoManager,
  userPatternCategories: () => userPatternCategories,
  userPermissions: () => userPermissions,
  users: () => users
});
module.exports = __toCommonJS(reducer_exports);
var import_es6 = __toESM(require("fast-deep-equal/es6/index.js"));
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_undo_manager = require("@wordpress/undo-manager");
var import_utils = require("./utils/index.cjs");
var import_queried_data = require("./queried-data/index.cjs");
var import_entities = require("./entities.cjs");
function users(state = { byId: {}, queries: {} }, action) {
  switch (action.type) {
    case "RECEIVE_USER_QUERY":
      return {
        byId: {
          ...state.byId,
          // Key users by their ID.
          ...action.users.reduce(
            (newUsers, user) => ({
              ...newUsers,
              [user.id]: user
            }),
            {}
          )
        },
        queries: {
          ...state.queries,
          [action.queryID]: action.users.map((user) => user.id)
        }
      };
  }
  return state;
}
function currentUser(state = {}, action) {
  switch (action.type) {
    case "RECEIVE_CURRENT_USER":
      return action.currentUser;
  }
  return state;
}
function currentTheme(state = void 0, action) {
  switch (action.type) {
    case "RECEIVE_CURRENT_THEME":
      return action.currentTheme.stylesheet;
  }
  return state;
}
function currentGlobalStylesId(state = void 0, action) {
  switch (action.type) {
    case "RECEIVE_CURRENT_GLOBAL_STYLES_ID":
      return action.id;
  }
  return state;
}
function themeBaseGlobalStyles(state = {}, action) {
  switch (action.type) {
    case "RECEIVE_THEME_GLOBAL_STYLES":
      return {
        ...state,
        [action.stylesheet]: action.globalStyles
      };
  }
  return state;
}
function themeGlobalStyleVariations(state = {}, action) {
  switch (action.type) {
    case "RECEIVE_THEME_GLOBAL_STYLE_VARIATIONS":
      return {
        ...state,
        [action.stylesheet]: action.variations
      };
  }
  return state;
}
var withMultiEntityRecordEdits = (reducer) => (state, action) => {
  if (action.type === "UNDO" || action.type === "REDO") {
    const { record } = action;
    let newState = state;
    record.forEach(({ id: { kind, name, recordId }, changes }) => {
      newState = reducer(newState, {
        type: "EDIT_ENTITY_RECORD",
        kind,
        name,
        recordId,
        edits: Object.entries(changes).reduce(
          (acc, [key, value]) => {
            acc[key] = action.type === "UNDO" ? value.from : value.to;
            return acc;
          },
          {}
        )
      });
    });
    return newState;
  }
  return reducer(state, action);
};
function entity(entityConfig) {
  return (0, import_compose.compose)([
    withMultiEntityRecordEdits,
    // Limit to matching action type so we don't attempt to replace action on
    // an unhandled action.
    (0, import_utils.ifMatchingAction)(
      (action) => action.name && action.kind && action.name === entityConfig.name && action.kind === entityConfig.kind
    ),
    // Inject the entity config into the action.
    (0, import_utils.replaceAction)((action) => {
      return {
        key: entityConfig.key || import_entities.DEFAULT_ENTITY_KEY,
        ...action
      };
    })
  ])(
    (0, import_data.combineReducers)({
      queriedData: import_queried_data.reducer,
      edits: (state = {}, action) => {
        switch (action.type) {
          case "RECEIVE_ITEMS":
            const context = action?.query?.context ?? "default";
            if (context !== "default") {
              return state;
            }
            const nextState = { ...state };
            for (const record of action.items) {
              const recordId = record?.[action.key];
              const edits = nextState[recordId];
              if (!edits) {
                continue;
              }
              const nextEdits2 = Object.keys(edits).reduce(
                (acc, key) => {
                  if (
                    // Edits are the "raw" attribute values, but records may have
                    // objects with more properties, so we use `get` here for the
                    // comparison.
                    !(0, import_es6.default)(
                      edits[key],
                      record[key]?.raw ?? record[key]
                    ) && // Sometimes the server alters the sent value which means
                    // we need to also remove the edits before the api request.
                    (!action.persistedEdits || !(0, import_es6.default)(
                      edits[key],
                      action.persistedEdits[key]
                    ))
                  ) {
                    acc[key] = edits[key];
                  }
                  return acc;
                },
                {}
              );
              if (Object.keys(nextEdits2).length) {
                nextState[recordId] = nextEdits2;
              } else {
                delete nextState[recordId];
              }
            }
            return nextState;
          case "EDIT_ENTITY_RECORD":
            const nextEdits = {
              ...state[action.recordId],
              ...action.edits
            };
            Object.keys(nextEdits).forEach((key) => {
              if (nextEdits[key] === void 0) {
                delete nextEdits[key];
              }
            });
            return {
              ...state,
              [action.recordId]: nextEdits
            };
        }
        return state;
      },
      saving: (state = {}, action) => {
        switch (action.type) {
          case "SAVE_ENTITY_RECORD_START":
          case "SAVE_ENTITY_RECORD_FINISH":
            return {
              ...state,
              [action.recordId]: {
                pending: action.type === "SAVE_ENTITY_RECORD_START",
                error: action.error,
                isAutosave: action.isAutosave
              }
            };
        }
        return state;
      },
      deleting: (state = {}, action) => {
        switch (action.type) {
          case "DELETE_ENTITY_RECORD_START":
          case "DELETE_ENTITY_RECORD_FINISH":
            return {
              ...state,
              [action.recordId]: {
                pending: action.type === "DELETE_ENTITY_RECORD_START",
                error: action.error
              }
            };
        }
        return state;
      },
      revisions: (state = {}, action) => {
        if (action.type === "RECEIVE_ITEM_REVISIONS") {
          const recordKey = action.recordKey;
          delete action.recordKey;
          const newState = (0, import_queried_data.reducer)(state[recordKey], {
            ...action,
            type: "RECEIVE_ITEMS"
          });
          return {
            ...state,
            [recordKey]: newState
          };
        }
        if (action.type === "REMOVE_ITEMS") {
          return Object.fromEntries(
            Object.entries(state).filter(
              ([id]) => !action.itemIds.some((itemId) => {
                if (Number.isInteger(itemId)) {
                  return itemId === +id;
                }
                return itemId === id;
              })
            )
          );
        }
        return state;
      }
    })
  );
}
function entitiesConfig(state = import_entities.rootEntitiesConfig, action) {
  switch (action.type) {
    case "ADD_ENTITIES":
      return [...state, ...action.entities];
  }
  return state;
}
var entities = (state = {}, action) => {
  const newConfig = entitiesConfig(state.config, action);
  let entitiesDataReducer = state.reducer;
  if (!entitiesDataReducer || newConfig !== state.config) {
    const entitiesByKind = newConfig.reduce((acc, record) => {
      const { kind } = record;
      if (!acc[kind]) {
        acc[kind] = [];
      }
      acc[kind].push(record);
      return acc;
    }, {});
    entitiesDataReducer = (0, import_data.combineReducers)(
      Object.fromEntries(
        Object.entries(entitiesByKind).map(
          ([kind, subEntities]) => {
            const kindReducer = (0, import_data.combineReducers)(
              Object.fromEntries(
                subEntities.map((entityConfig) => [
                  entityConfig.name,
                  entity(entityConfig)
                ])
              )
            );
            return [kind, kindReducer];
          }
        )
      )
    );
  }
  const newData = entitiesDataReducer(state.records, action);
  if (newData === state.records && newConfig === state.config && entitiesDataReducer === state.reducer) {
    return state;
  }
  return {
    reducer: entitiesDataReducer,
    records: newData,
    config: newConfig
  };
};
function undoManager(state = (0, import_undo_manager.createUndoManager)()) {
  return state;
}
function editsReference(state = {}, action) {
  switch (action.type) {
    case "EDIT_ENTITY_RECORD":
    case "UNDO":
    case "REDO":
      return {};
  }
  return state;
}
function embedPreviews(state = {}, action) {
  switch (action.type) {
    case "RECEIVE_EMBED_PREVIEW":
      const { url, preview } = action;
      return {
        ...state,
        [url]: preview
      };
  }
  return state;
}
function userPermissions(state = {}, action) {
  switch (action.type) {
    case "RECEIVE_USER_PERMISSION":
      return {
        ...state,
        [action.key]: action.isAllowed
      };
    case "RECEIVE_USER_PERMISSIONS":
      return {
        ...state,
        ...action.permissions
      };
  }
  return state;
}
function autosaves(state = {}, action) {
  switch (action.type) {
    case "RECEIVE_AUTOSAVES":
      const { postId, autosaves: autosavesData } = action;
      return {
        ...state,
        [postId]: autosavesData
      };
  }
  return state;
}
function blockPatterns(state = [], action) {
  switch (action.type) {
    case "RECEIVE_BLOCK_PATTERNS":
      return action.patterns;
  }
  return state;
}
function blockPatternCategories(state = [], action) {
  switch (action.type) {
    case "RECEIVE_BLOCK_PATTERN_CATEGORIES":
      return action.categories;
  }
  return state;
}
function userPatternCategories(state = [], action) {
  switch (action.type) {
    case "RECEIVE_USER_PATTERN_CATEGORIES":
      return action.patternCategories;
  }
  return state;
}
function navigationFallbackId(state = null, action) {
  switch (action.type) {
    case "RECEIVE_NAVIGATION_FALLBACK_ID":
      return action.fallbackId;
  }
  return state;
}
function themeGlobalStyleRevisions(state = {}, action) {
  switch (action.type) {
    case "RECEIVE_THEME_GLOBAL_STYLE_REVISIONS":
      return {
        ...state,
        [action.currentId]: action.revisions
      };
  }
  return state;
}
function defaultTemplates(state = {}, action) {
  switch (action.type) {
    case "RECEIVE_DEFAULT_TEMPLATE":
      return {
        ...state,
        [JSON.stringify(action.query)]: action.templateId
      };
  }
  return state;
}
function registeredPostMeta(state = {}, action) {
  switch (action.type) {
    case "RECEIVE_REGISTERED_POST_META":
      return {
        ...state,
        [action.postType]: action.registeredPostMeta
      };
  }
  return state;
}
function editorSettings(state = null, action) {
  switch (action.type) {
    case "RECEIVE_EDITOR_SETTINGS":
      return action.settings;
  }
  return state;
}
function editorAssets(state = null, action) {
  switch (action.type) {
    case "RECEIVE_EDITOR_ASSETS":
      return action.assets;
  }
  return state;
}
function syncConnectionStatuses(state = {}, action) {
  switch (action.type) {
    case "SET_SYNC_CONNECTION_STATUS": {
      const key = `${action.kind}/${action.name}:${action.key}`;
      return {
        ...state,
        [key]: action.status
      };
    }
    case "CLEAR_SYNC_CONNECTION_STATUS": {
      const key = `${action.kind}/${action.name}:${action.key}`;
      const { [key]: _, ...rest } = state;
      return rest;
    }
  }
  return state;
}
function collaborationSupported(state = true, action) {
  switch (action.type) {
    case "SET_COLLABORATION_SUPPORTED":
      return action.supported;
  }
  return state;
}
var reducer_default = (0, import_data.combineReducers)({
  users,
  currentTheme,
  currentGlobalStylesId,
  currentUser,
  themeGlobalStyleVariations,
  themeBaseGlobalStyles,
  themeGlobalStyleRevisions,
  entities,
  editsReference,
  undoManager,
  embedPreviews,
  userPermissions,
  autosaves,
  blockPatterns,
  blockPatternCategories,
  userPatternCategories,
  navigationFallbackId,
  defaultTemplates,
  registeredPostMeta,
  editorSettings,
  editorAssets,
  syncConnectionStatuses,
  collaborationSupported
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  autosaves,
  blockPatternCategories,
  blockPatterns,
  collaborationSupported,
  currentGlobalStylesId,
  currentTheme,
  currentUser,
  defaultTemplates,
  editorAssets,
  editorSettings,
  editsReference,
  embedPreviews,
  entities,
  entitiesConfig,
  navigationFallbackId,
  registeredPostMeta,
  syncConnectionStatuses,
  themeBaseGlobalStyles,
  themeGlobalStyleRevisions,
  themeGlobalStyleVariations,
  undoManager,
  userPatternCategories,
  userPermissions,
  users
});
//# sourceMappingURL=reducer.cjs.map
