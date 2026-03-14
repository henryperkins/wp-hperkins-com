// packages/edit-site/src/store/selectors.js
import { store as coreDataStore } from "@wordpress/core-data";
import { createRegistrySelector, createSelector } from "@wordpress/data";
import deprecated from "@wordpress/deprecated";
import { Platform } from "@wordpress/element";
import { store as preferencesStore } from "@wordpress/preferences";
import { store as editorStore } from "@wordpress/editor";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { unlock } from "../lock-unlock.mjs";
import { TEMPLATE_PART_POST_TYPE } from "../utils/constants.mjs";
import getFilteredTemplatePartBlocks from "../utils/get-filtered-template-parts.mjs";
var isFeatureActive = createRegistrySelector(
  (select) => (_, featureName) => {
    deprecated(`select( 'core/edit-site' ).isFeatureActive`, {
      since: "6.0",
      alternative: `select( 'core/preferences' ).get`
    });
    return !!select(preferencesStore).get(
      "core/edit-site",
      featureName
    );
  }
);
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
var getCanUserCreateMedia = createRegistrySelector(
  (select) => () => {
    deprecated(
      `wp.data.select( 'core/edit-site' ).getCanUserCreateMedia()`,
      {
        since: "6.7",
        alternative: `wp.data.select( 'core' ).canUser( 'create', { kind: 'postType', type: 'attachment' } )`
      }
    );
    return select(coreDataStore).canUser("create", "media");
  }
);
var getReusableBlocks = createRegistrySelector((select) => () => {
  deprecated(`select( 'core/edit-site' ).getReusableBlocks()`, {
    since: "6.5",
    version: "6.8",
    alternative: `select( 'core/core' ).getEntityRecords( 'postType', 'wp_block' )`
  });
  const isWeb = Platform.OS === "web";
  return isWeb ? select(coreDataStore).getEntityRecords("postType", "wp_block", {
    per_page: -1
  }) : [];
});
function getSettings(state) {
  return state.settings;
}
function getHomeTemplateId() {
  deprecated("select( 'core/edit-site' ).getHomeTemplateId", {
    since: "6.2",
    version: "6.4"
  });
}
function getEditedPostType(state) {
  deprecated("select( 'core/edit-site' ).getEditedPostType", {
    since: "6.8",
    alternative: "select( 'core/editor' ).getCurrentPostType"
  });
  return state.editedPost.postType;
}
function getEditedPostId(state) {
  deprecated("select( 'core/edit-site' ).getEditedPostId", {
    since: "6.8",
    alternative: "select( 'core/editor' ).getCurrentPostId"
  });
  return state.editedPost.id;
}
function getEditedPostContext(state) {
  deprecated("select( 'core/edit-site' ).getEditedPostContext", {
    since: "6.8"
  });
  return state.editedPost.context;
}
function getPage(state) {
  deprecated("select( 'core/edit-site' ).getPage", {
    since: "6.8"
  });
  return { context: state.editedPost.context };
}
var isInserterOpened = createRegistrySelector((select) => () => {
  deprecated(`select( 'core/edit-site' ).isInserterOpened`, {
    since: "6.5",
    alternative: `select( 'core/editor' ).isInserterOpened`
  });
  return select(editorStore).isInserterOpened();
});
var __experimentalGetInsertionPoint = createRegistrySelector(
  (select) => () => {
    deprecated(
      `select( 'core/edit-site' ).__experimentalGetInsertionPoint`,
      {
        since: "6.5",
        version: "6.7"
      }
    );
    return unlock(select(editorStore)).getInserter();
  }
);
var isListViewOpened = createRegistrySelector((select) => () => {
  deprecated(`select( 'core/edit-site' ).isListViewOpened`, {
    since: "6.5",
    alternative: `select( 'core/editor' ).isListViewOpened`
  });
  return select(editorStore).isListViewOpened();
});
function isSaveViewOpened(state) {
  return state.saveViewPanel;
}
function getBlocksAndTemplateParts(select) {
  const templateParts = select(coreDataStore).getEntityRecords(
    "postType",
    TEMPLATE_PART_POST_TYPE,
    { per_page: -1 }
  );
  const { getBlocksByName, getBlocksByClientId } = select(blockEditorStore);
  const clientIds = getBlocksByName("core/template-part");
  const blocks = getBlocksByClientId(clientIds);
  return [blocks, templateParts];
}
var getCurrentTemplateTemplateParts = createRegistrySelector(
  (select) => createSelector(
    () => {
      deprecated(
        `select( 'core/edit-site' ).getCurrentTemplateTemplateParts()`,
        {
          since: "6.7",
          version: "6.9",
          alternative: `select( 'core/block-editor' ).getBlocksByName( 'core/template-part' )`
        }
      );
      return getFilteredTemplatePartBlocks(
        ...getBlocksAndTemplateParts(select)
      );
    },
    () => getBlocksAndTemplateParts(select)
  )
);
var getEditorMode = createRegistrySelector((select) => () => {
  return select(preferencesStore).get("core", "editorMode");
});
function getCurrentTemplateNavigationPanelSubMenu() {
  deprecated(
    "dispatch( 'core/edit-site' ).getCurrentTemplateNavigationPanelSubMenu",
    {
      since: "6.2",
      version: "6.4"
    }
  );
}
function getNavigationPanelActiveMenu() {
  deprecated("dispatch( 'core/edit-site' ).getNavigationPanelActiveMenu", {
    since: "6.2",
    version: "6.4"
  });
}
function isNavigationOpened() {
  deprecated("dispatch( 'core/edit-site' ).isNavigationOpened", {
    since: "6.2",
    version: "6.4"
  });
}
function isPage(state) {
  deprecated("select( 'core/edit-site' ).isPage", {
    since: "6.8",
    alternative: "select( 'core/editor' ).getCurrentPostType"
  });
  return !!state.editedPost.context?.postId;
}
function hasPageContentFocus() {
  deprecated(`select( 'core/edit-site' ).hasPageContentFocus`, {
    since: "6.5"
  });
  return false;
}
export {
  __experimentalGetInsertionPoint,
  __experimentalGetPreviewDeviceType,
  getCanUserCreateMedia,
  getCurrentTemplateNavigationPanelSubMenu,
  getCurrentTemplateTemplateParts,
  getEditedPostContext,
  getEditedPostId,
  getEditedPostType,
  getEditorMode,
  getHomeTemplateId,
  getNavigationPanelActiveMenu,
  getPage,
  getReusableBlocks,
  getSettings,
  hasPageContentFocus,
  isFeatureActive,
  isInserterOpened,
  isListViewOpened,
  isNavigationOpened,
  isPage,
  isSaveViewOpened
};
//# sourceMappingURL=selectors.mjs.map
