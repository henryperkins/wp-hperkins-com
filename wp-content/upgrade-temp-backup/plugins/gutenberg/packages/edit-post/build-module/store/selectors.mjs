// packages/edit-post/src/store/selectors.js
import { createSelector, createRegistrySelector } from "@wordpress/data";
import { store as preferencesStore } from "@wordpress/preferences";
import { store as coreStore } from "@wordpress/core-data";
import {
  store as editorStore,
  privateApis as editorPrivateApis
} from "@wordpress/editor";
import deprecated from "@wordpress/deprecated";
import { unlock } from "../lock-unlock.mjs";
var { interfaceStore } = unlock(editorPrivateApis);
var EMPTY_ARRAY = [];
var EMPTY_OBJECT = {};
var getEditorMode = createRegistrySelector(
  (select) => () => select(preferencesStore).get("core", "editorMode") ?? "visual"
);
var isEditorSidebarOpened = createRegistrySelector(
  (select) => () => {
    const activeGeneralSidebar = select(interfaceStore).getActiveComplementaryArea("core");
    return ["edit-post/document", "edit-post/block"].includes(
      activeGeneralSidebar
    );
  }
);
var isPluginSidebarOpened = createRegistrySelector(
  (select) => () => {
    const activeGeneralSidebar = select(interfaceStore).getActiveComplementaryArea("core");
    return !!activeGeneralSidebar && !["edit-post/document", "edit-post/block"].includes(
      activeGeneralSidebar
    );
  }
);
var getActiveGeneralSidebarName = createRegistrySelector(
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
var getPreferences = createRegistrySelector((select) => () => {
  deprecated(`select( 'core/edit-post' ).getPreferences`, {
    since: "6.0",
    alternative: `select( 'core/preferences' ).get`
  });
  const corePreferences = ["editorMode", "hiddenBlockTypes"].reduce(
    (accumulatedPrefs, preferenceKey) => {
      const value = select(preferencesStore).get(
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
  const inactivePanels = select(preferencesStore).get(
    "core",
    "inactivePanels"
  );
  const openPanels = select(preferencesStore).get("core", "openPanels");
  const panels = convertPanelsToOldFormat(inactivePanels, openPanels);
  return {
    ...corePreferences,
    panels
  };
});
function getPreference(state, preferenceKey, defaultValue) {
  deprecated(`select( 'core/edit-post' ).getPreference`, {
    since: "6.0",
    alternative: `select( 'core/preferences' ).get`
  });
  const preferences = getPreferences(state);
  const value = preferences[preferenceKey];
  return value === void 0 ? defaultValue : value;
}
var getHiddenBlockTypes = createRegistrySelector((select) => () => {
  return select(preferencesStore).get("core", "hiddenBlockTypes") ?? EMPTY_ARRAY;
});
var isPublishSidebarOpened = createRegistrySelector(
  (select) => () => {
    deprecated(`select( 'core/edit-post' ).isPublishSidebarOpened`, {
      since: "6.6",
      alternative: `select( 'core/editor' ).isPublishSidebarOpened`
    });
    return select(editorStore).isPublishSidebarOpened();
  }
);
var isEditorPanelRemoved = createRegistrySelector(
  (select) => (state, panelName) => {
    deprecated(`select( 'core/edit-post' ).isEditorPanelRemoved`, {
      since: "6.5",
      alternative: `select( 'core/editor' ).isEditorPanelRemoved`
    });
    return select(editorStore).isEditorPanelRemoved(panelName);
  }
);
var isEditorPanelEnabled = createRegistrySelector(
  (select) => (state, panelName) => {
    deprecated(`select( 'core/edit-post' ).isEditorPanelEnabled`, {
      since: "6.5",
      alternative: `select( 'core/editor' ).isEditorPanelEnabled`
    });
    return select(editorStore).isEditorPanelEnabled(panelName);
  }
);
var isEditorPanelOpened = createRegistrySelector(
  (select) => (state, panelName) => {
    deprecated(`select( 'core/edit-post' ).isEditorPanelOpened`, {
      since: "6.5",
      alternative: `select( 'core/editor' ).isEditorPanelOpened`
    });
    return select(editorStore).isEditorPanelOpened(panelName);
  }
);
var isModalActive = createRegistrySelector(
  (select) => (state, modalName) => {
    deprecated(`select( 'core/edit-post' ).isModalActive`, {
      since: "6.3",
      alternative: `select( 'core/interface' ).isModalActive`
    });
    return !!select(interfaceStore).isModalActive(modalName);
  }
);
var isFeatureActive = createRegistrySelector(
  (select) => (state, feature) => {
    return !!select(preferencesStore).get("core/edit-post", feature);
  }
);
var isPluginItemPinned = createRegistrySelector(
  (select) => (state, pluginName) => {
    return select(interfaceStore).isItemPinned("core", pluginName);
  }
);
var getActiveMetaBoxLocations = createSelector(
  (state) => {
    return Object.keys(state.metaBoxes.locations).filter(
      (location) => isMetaBoxLocationActive(state, location)
    );
  },
  (state) => [state.metaBoxes.locations]
);
var isMetaBoxLocationVisible = createRegistrySelector(
  (select) => (state, location) => {
    return isMetaBoxLocationActive(state, location) && getMetaBoxesPerLocation(state, location)?.some(({ id }) => {
      return select(editorStore).isEditorPanelEnabled(
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
var getAllMetaBoxes = createSelector(
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
var __experimentalGetPreviewDeviceType = createRegistrySelector(
  (select) => () => {
    deprecated(
      `select( 'core/edit-site' ).__experimentalGetPreviewDeviceType`,
      {
        since: "6.5",
        version: "6.7",
        alternative: `select( 'core/editor' ).getDeviceType`
      }
    );
    return select(editorStore).getDeviceType();
  }
);
var isInserterOpened = createRegistrySelector((select) => () => {
  deprecated(`select( 'core/edit-post' ).isInserterOpened`, {
    since: "6.5",
    alternative: `select( 'core/editor' ).isInserterOpened`
  });
  return select(editorStore).isInserterOpened();
});
var __experimentalGetInsertionPoint = createRegistrySelector(
  (select) => () => {
    deprecated(
      `select( 'core/edit-post' ).__experimentalGetInsertionPoint`,
      {
        since: "6.5",
        version: "6.7"
      }
    );
    return unlock(select(editorStore)).getInserter();
  }
);
var isListViewOpened = createRegistrySelector((select) => () => {
  deprecated(`select( 'core/edit-post' ).isListViewOpened`, {
    since: "6.5",
    alternative: `select( 'core/editor' ).isListViewOpened`
  });
  return select(editorStore).isListViewOpened();
});
var isEditingTemplate = createRegistrySelector((select) => () => {
  deprecated(`select( 'core/edit-post' ).isEditingTemplate`, {
    since: "6.5",
    alternative: `select( 'core/editor' ).getRenderingMode`
  });
  return select(editorStore).getCurrentPostType() === "wp_template";
});
function areMetaBoxesInitialized(state) {
  return state.metaBoxes.initialized;
}
var getEditedPostTemplate = createRegistrySelector(
  (select) => () => {
    const { id: postId, type: postType } = select(editorStore).getCurrentPost();
    const templateId = unlock(select(coreStore)).getTemplateId(
      postType,
      postId
    );
    if (!templateId) {
      return void 0;
    }
    return select(coreStore).getEditedEntityRecord(
      "postType",
      "wp_template",
      templateId
    );
  }
);
export {
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
};
//# sourceMappingURL=selectors.mjs.map
