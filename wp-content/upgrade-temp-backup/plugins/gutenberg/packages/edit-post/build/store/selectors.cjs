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

// packages/edit-post/src/store/selectors.js
var selectors_exports = {};
__export(selectors_exports, {
  __experimentalGetInsertionPoint: () => __experimentalGetInsertionPoint,
  __experimentalGetPreviewDeviceType: () => __experimentalGetPreviewDeviceType,
  areMetaBoxesInitialized: () => areMetaBoxesInitialized,
  getActiveGeneralSidebarName: () => getActiveGeneralSidebarName,
  getActiveMetaBoxLocations: () => getActiveMetaBoxLocations,
  getAllMetaBoxes: () => getAllMetaBoxes,
  getEditedPostTemplate: () => getEditedPostTemplate,
  getEditorMode: () => getEditorMode,
  getHiddenBlockTypes: () => getHiddenBlockTypes,
  getMetaBoxesPerLocation: () => getMetaBoxesPerLocation,
  getPreference: () => getPreference,
  getPreferences: () => getPreferences,
  hasMetaBoxes: () => hasMetaBoxes,
  isEditingTemplate: () => isEditingTemplate,
  isEditorPanelEnabled: () => isEditorPanelEnabled,
  isEditorPanelOpened: () => isEditorPanelOpened,
  isEditorPanelRemoved: () => isEditorPanelRemoved,
  isEditorSidebarOpened: () => isEditorSidebarOpened,
  isFeatureActive: () => isFeatureActive,
  isInserterOpened: () => isInserterOpened,
  isListViewOpened: () => isListViewOpened,
  isMetaBoxLocationActive: () => isMetaBoxLocationActive,
  isMetaBoxLocationVisible: () => isMetaBoxLocationVisible,
  isModalActive: () => isModalActive,
  isPluginItemPinned: () => isPluginItemPinned,
  isPluginSidebarOpened: () => isPluginSidebarOpened,
  isPublishSidebarOpened: () => isPublishSidebarOpened,
  isSavingMetaBoxes: () => isSavingMetaBoxes
});
module.exports = __toCommonJS(selectors_exports);
var import_data = require("@wordpress/data");
var import_preferences = require("@wordpress/preferences");
var import_core_data = require("@wordpress/core-data");
var import_editor = require("@wordpress/editor");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_lock_unlock = require("../lock-unlock.cjs");
var { interfaceStore } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var EMPTY_ARRAY = [];
var EMPTY_OBJECT = {};
var getEditorMode = (0, import_data.createRegistrySelector)(
  (select) => () => select(import_preferences.store).get("core", "editorMode") ?? "visual"
);
var isEditorSidebarOpened = (0, import_data.createRegistrySelector)(
  (select) => () => {
    const activeGeneralSidebar = select(interfaceStore).getActiveComplementaryArea("core");
    return ["edit-post/document", "edit-post/block"].includes(
      activeGeneralSidebar
    );
  }
);
var isPluginSidebarOpened = (0, import_data.createRegistrySelector)(
  (select) => () => {
    const activeGeneralSidebar = select(interfaceStore).getActiveComplementaryArea("core");
    return !!activeGeneralSidebar && !["edit-post/document", "edit-post/block"].includes(
      activeGeneralSidebar
    );
  }
);
var getActiveGeneralSidebarName = (0, import_data.createRegistrySelector)(
  (select) => () => {
    return select(interfaceStore).getActiveComplementaryArea("core");
  }
);
function convertPanelsToOldFormat(inactivePanels, openPanels) {
  const panelsWithEnabledState = inactivePanels?.reduce(
    (accumulatedPanels, panelName) => ({
      ...accumulatedPanels,
      [panelName]: {
        enabled: false
      }
    }),
    {}
  );
  const panels = openPanels?.reduce((accumulatedPanels, panelName) => {
    const currentPanelState = accumulatedPanels?.[panelName];
    return {
      ...accumulatedPanels,
      [panelName]: {
        ...currentPanelState,
        opened: true
      }
    };
  }, panelsWithEnabledState ?? {});
  return panels ?? panelsWithEnabledState ?? EMPTY_OBJECT;
}
var getPreferences = (0, import_data.createRegistrySelector)((select) => () => {
  (0, import_deprecated.default)(`select( 'core/edit-post' ).getPreferences`, {
    since: "6.0",
    alternative: `select( 'core/preferences' ).get`
  });
  const corePreferences = ["editorMode", "hiddenBlockTypes"].reduce(
    (accumulatedPrefs, preferenceKey) => {
      const value = select(import_preferences.store).get(
        "core",
        preferenceKey
      );
      return {
        ...accumulatedPrefs,
        [preferenceKey]: value
      };
    },
    {}
  );
  const inactivePanels = select(import_preferences.store).get(
    "core",
    "inactivePanels"
  );
  const openPanels = select(import_preferences.store).get("core", "openPanels");
  const panels = convertPanelsToOldFormat(inactivePanels, openPanels);
  return {
    ...corePreferences,
    panels
  };
});
function getPreference(state, preferenceKey, defaultValue) {
  (0, import_deprecated.default)(`select( 'core/edit-post' ).getPreference`, {
    since: "6.0",
    alternative: `select( 'core/preferences' ).get`
  });
  const preferences = getPreferences(state);
  const value = preferences[preferenceKey];
  return value === void 0 ? defaultValue : value;
}
var getHiddenBlockTypes = (0, import_data.createRegistrySelector)((select) => () => {
  return select(import_preferences.store).get("core", "hiddenBlockTypes") ?? EMPTY_ARRAY;
});
var isPublishSidebarOpened = (0, import_data.createRegistrySelector)(
  (select) => () => {
    (0, import_deprecated.default)(`select( 'core/edit-post' ).isPublishSidebarOpened`, {
      since: "6.6",
      alternative: `select( 'core/editor' ).isPublishSidebarOpened`
    });
    return select(import_editor.store).isPublishSidebarOpened();
  }
);
var isEditorPanelRemoved = (0, import_data.createRegistrySelector)(
  (select) => (state, panelName) => {
    (0, import_deprecated.default)(`select( 'core/edit-post' ).isEditorPanelRemoved`, {
      since: "6.5",
      alternative: `select( 'core/editor' ).isEditorPanelRemoved`
    });
    return select(import_editor.store).isEditorPanelRemoved(panelName);
  }
);
var isEditorPanelEnabled = (0, import_data.createRegistrySelector)(
  (select) => (state, panelName) => {
    (0, import_deprecated.default)(`select( 'core/edit-post' ).isEditorPanelEnabled`, {
      since: "6.5",
      alternative: `select( 'core/editor' ).isEditorPanelEnabled`
    });
    return select(import_editor.store).isEditorPanelEnabled(panelName);
  }
);
var isEditorPanelOpened = (0, import_data.createRegistrySelector)(
  (select) => (state, panelName) => {
    (0, import_deprecated.default)(`select( 'core/edit-post' ).isEditorPanelOpened`, {
      since: "6.5",
      alternative: `select( 'core/editor' ).isEditorPanelOpened`
    });
    return select(import_editor.store).isEditorPanelOpened(panelName);
  }
);
var isModalActive = (0, import_data.createRegistrySelector)(
  (select) => (state, modalName) => {
    (0, import_deprecated.default)(`select( 'core/edit-post' ).isModalActive`, {
      since: "6.3",
      alternative: `select( 'core/interface' ).isModalActive`
    });
    return !!select(interfaceStore).isModalActive(modalName);
  }
);
var isFeatureActive = (0, import_data.createRegistrySelector)(
  (select) => (state, feature) => {
    return !!select(import_preferences.store).get("core/edit-post", feature);
  }
);
var isPluginItemPinned = (0, import_data.createRegistrySelector)(
  (select) => (state, pluginName) => {
    return select(interfaceStore).isItemPinned("core", pluginName);
  }
);
var getActiveMetaBoxLocations = (0, import_data.createSelector)(
  (state) => {
    return Object.keys(state.metaBoxes.locations).filter(
      (location) => isMetaBoxLocationActive(state, location)
    );
  },
  (state) => [state.metaBoxes.locations]
);
var isMetaBoxLocationVisible = (0, import_data.createRegistrySelector)(
  (select) => (state, location) => {
    return isMetaBoxLocationActive(state, location) && getMetaBoxesPerLocation(state, location)?.some(({ id }) => {
      return select(import_editor.store).isEditorPanelEnabled(
        `meta-box-${id}`
      );
    });
  }
);
function isMetaBoxLocationActive(state, location) {
  const metaBoxes = getMetaBoxesPerLocation(state, location);
  return !!metaBoxes && metaBoxes.length !== 0;
}
function getMetaBoxesPerLocation(state, location) {
  return state.metaBoxes.locations[location];
}
var getAllMetaBoxes = (0, import_data.createSelector)(
  (state) => {
    return Object.values(state.metaBoxes.locations).flat();
  },
  (state) => [state.metaBoxes.locations]
);
function hasMetaBoxes(state) {
  return getActiveMetaBoxLocations(state).length > 0;
}
function isSavingMetaBoxes(state) {
  return state.metaBoxes.isSaving;
}
var __experimentalGetPreviewDeviceType = (0, import_data.createRegistrySelector)(
  (select) => () => {
    (0, import_deprecated.default)(
      `select( 'core/edit-site' ).__experimentalGetPreviewDeviceType`,
      {
        since: "6.5",
        version: "6.7",
        alternative: `select( 'core/editor' ).getDeviceType`
      }
    );
    return select(import_editor.store).getDeviceType();
  }
);
var isInserterOpened = (0, import_data.createRegistrySelector)((select) => () => {
  (0, import_deprecated.default)(`select( 'core/edit-post' ).isInserterOpened`, {
    since: "6.5",
    alternative: `select( 'core/editor' ).isInserterOpened`
  });
  return select(import_editor.store).isInserterOpened();
});
var __experimentalGetInsertionPoint = (0, import_data.createRegistrySelector)(
  (select) => () => {
    (0, import_deprecated.default)(
      `select( 'core/edit-post' ).__experimentalGetInsertionPoint`,
      {
        since: "6.5",
        version: "6.7"
      }
    );
    return (0, import_lock_unlock.unlock)(select(import_editor.store)).getInserter();
  }
);
var isListViewOpened = (0, import_data.createRegistrySelector)((select) => () => {
  (0, import_deprecated.default)(`select( 'core/edit-post' ).isListViewOpened`, {
    since: "6.5",
    alternative: `select( 'core/editor' ).isListViewOpened`
  });
  return select(import_editor.store).isListViewOpened();
});
var isEditingTemplate = (0, import_data.createRegistrySelector)((select) => () => {
  (0, import_deprecated.default)(`select( 'core/edit-post' ).isEditingTemplate`, {
    since: "6.5",
    alternative: `select( 'core/editor' ).getRenderingMode`
  });
  return select(import_editor.store).getCurrentPostType() === "wp_template";
});
function areMetaBoxesInitialized(state) {
  return state.metaBoxes.initialized;
}
var getEditedPostTemplate = (0, import_data.createRegistrySelector)(
  (select) => () => {
    const { id: postId, type: postType } = select(import_editor.store).getCurrentPost();
    const templateId = (0, import_lock_unlock.unlock)(select(import_core_data.store)).getTemplateId(
      postType,
      postId
    );
    if (!templateId) {
      return void 0;
    }
    return select(import_core_data.store).getEditedEntityRecord(
      "postType",
      "wp_template",
      templateId
    );
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __experimentalGetInsertionPoint,
  __experimentalGetPreviewDeviceType,
  areMetaBoxesInitialized,
  getActiveGeneralSidebarName,
  getActiveMetaBoxLocations,
  getAllMetaBoxes,
  getEditedPostTemplate,
  getEditorMode,
  getHiddenBlockTypes,
  getMetaBoxesPerLocation,
  getPreference,
  getPreferences,
  hasMetaBoxes,
  isEditingTemplate,
  isEditorPanelEnabled,
  isEditorPanelOpened,
  isEditorPanelRemoved,
  isEditorSidebarOpened,
  isFeatureActive,
  isInserterOpened,
  isListViewOpened,
  isMetaBoxLocationActive,
  isMetaBoxLocationVisible,
  isModalActive,
  isPluginItemPinned,
  isPluginSidebarOpened,
  isPublishSidebarOpened,
  isSavingMetaBoxes
});
//# sourceMappingURL=selectors.cjs.map
