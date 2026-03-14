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

// packages/edit-site/src/store/selectors.js
var selectors_exports = {};
__export(selectors_exports, {
  __experimentalGetInsertionPoint: () => __experimentalGetInsertionPoint,
  __experimentalGetPreviewDeviceType: () => __experimentalGetPreviewDeviceType,
  getCanUserCreateMedia: () => getCanUserCreateMedia,
  getCurrentTemplateNavigationPanelSubMenu: () => getCurrentTemplateNavigationPanelSubMenu,
  getCurrentTemplateTemplateParts: () => getCurrentTemplateTemplateParts,
  getEditedPostContext: () => getEditedPostContext,
  getEditedPostId: () => getEditedPostId,
  getEditedPostType: () => getEditedPostType,
  getEditorMode: () => getEditorMode,
  getHomeTemplateId: () => getHomeTemplateId,
  getNavigationPanelActiveMenu: () => getNavigationPanelActiveMenu,
  getPage: () => getPage,
  getReusableBlocks: () => getReusableBlocks,
  getSettings: () => getSettings,
  hasPageContentFocus: () => hasPageContentFocus,
  isFeatureActive: () => isFeatureActive,
  isInserterOpened: () => isInserterOpened,
  isListViewOpened: () => isListViewOpened,
  isNavigationOpened: () => isNavigationOpened,
  isPage: () => isPage,
  isSaveViewOpened: () => isSaveViewOpened
});
module.exports = __toCommonJS(selectors_exports);
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_element = require("@wordpress/element");
var import_preferences = require("@wordpress/preferences");
var import_editor = require("@wordpress/editor");
var import_block_editor = require("@wordpress/block-editor");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_constants = require("../utils/constants.cjs");
var import_get_filtered_template_parts = __toESM(require("../utils/get-filtered-template-parts.cjs"));
var isFeatureActive = (0, import_data.createRegistrySelector)(
  (select) => (_, featureName) => {
    (0, import_deprecated.default)(`select( 'core/edit-site' ).isFeatureActive`, {
      since: "6.0",
      alternative: `select( 'core/preferences' ).get`
    });
    return !!select(import_preferences.store).get(
      "core/edit-site",
      featureName
    );
  }
);
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
var getCanUserCreateMedia = (0, import_data.createRegistrySelector)(
  (select) => () => {
    (0, import_deprecated.default)(
      `wp.data.select( 'core/edit-site' ).getCanUserCreateMedia()`,
      {
        since: "6.7",
        alternative: `wp.data.select( 'core' ).canUser( 'create', { kind: 'postType', type: 'attachment' } )`
      }
    );
    return select(import_core_data.store).canUser("create", "media");
  }
);
var getReusableBlocks = (0, import_data.createRegistrySelector)((select) => () => {
  (0, import_deprecated.default)(`select( 'core/edit-site' ).getReusableBlocks()`, {
    since: "6.5",
    version: "6.8",
    alternative: `select( 'core/core' ).getEntityRecords( 'postType', 'wp_block' )`
  });
  const isWeb = import_element.Platform.OS === "web";
  return isWeb ? select(import_core_data.store).getEntityRecords("postType", "wp_block", {
    per_page: -1
  }) : [];
});
function getSettings(state) {
  return state.settings;
}
function getHomeTemplateId() {
  (0, import_deprecated.default)("select( 'core/edit-site' ).getHomeTemplateId", {
    since: "6.2",
    version: "6.4"
  });
}
function getEditedPostType(state) {
  (0, import_deprecated.default)("select( 'core/edit-site' ).getEditedPostType", {
    since: "6.8",
    alternative: "select( 'core/editor' ).getCurrentPostType"
  });
  return state.editedPost.postType;
}
function getEditedPostId(state) {
  (0, import_deprecated.default)("select( 'core/edit-site' ).getEditedPostId", {
    since: "6.8",
    alternative: "select( 'core/editor' ).getCurrentPostId"
  });
  return state.editedPost.id;
}
function getEditedPostContext(state) {
  (0, import_deprecated.default)("select( 'core/edit-site' ).getEditedPostContext", {
    since: "6.8"
  });
  return state.editedPost.context;
}
function getPage(state) {
  (0, import_deprecated.default)("select( 'core/edit-site' ).getPage", {
    since: "6.8"
  });
  return { context: state.editedPost.context };
}
var isInserterOpened = (0, import_data.createRegistrySelector)((select) => () => {
  (0, import_deprecated.default)(`select( 'core/edit-site' ).isInserterOpened`, {
    since: "6.5",
    alternative: `select( 'core/editor' ).isInserterOpened`
  });
  return select(import_editor.store).isInserterOpened();
});
var __experimentalGetInsertionPoint = (0, import_data.createRegistrySelector)(
  (select) => () => {
    (0, import_deprecated.default)(
      `select( 'core/edit-site' ).__experimentalGetInsertionPoint`,
      {
        since: "6.5",
        version: "6.7"
      }
    );
    return (0, import_lock_unlock.unlock)(select(import_editor.store)).getInserter();
  }
);
var isListViewOpened = (0, import_data.createRegistrySelector)((select) => () => {
  (0, import_deprecated.default)(`select( 'core/edit-site' ).isListViewOpened`, {
    since: "6.5",
    alternative: `select( 'core/editor' ).isListViewOpened`
  });
  return select(import_editor.store).isListViewOpened();
});
function isSaveViewOpened(state) {
  return state.saveViewPanel;
}
function getBlocksAndTemplateParts(select) {
  const templateParts = select(import_core_data.store).getEntityRecords(
    "postType",
    import_constants.TEMPLATE_PART_POST_TYPE,
    { per_page: -1 }
  );
  const { getBlocksByName, getBlocksByClientId } = select(import_block_editor.store);
  const clientIds = getBlocksByName("core/template-part");
  const blocks = getBlocksByClientId(clientIds);
  return [blocks, templateParts];
}
var getCurrentTemplateTemplateParts = (0, import_data.createRegistrySelector)(
  (select) => (0, import_data.createSelector)(
    () => {
      (0, import_deprecated.default)(
        `select( 'core/edit-site' ).getCurrentTemplateTemplateParts()`,
        {
          since: "6.7",
          version: "6.9",
          alternative: `select( 'core/block-editor' ).getBlocksByName( 'core/template-part' )`
        }
      );
      return (0, import_get_filtered_template_parts.default)(
        ...getBlocksAndTemplateParts(select)
      );
    },
    () => getBlocksAndTemplateParts(select)
  )
);
var getEditorMode = (0, import_data.createRegistrySelector)((select) => () => {
  return select(import_preferences.store).get("core", "editorMode");
});
function getCurrentTemplateNavigationPanelSubMenu() {
  (0, import_deprecated.default)(
    "dispatch( 'core/edit-site' ).getCurrentTemplateNavigationPanelSubMenu",
    {
      since: "6.2",
      version: "6.4"
    }
  );
}
function getNavigationPanelActiveMenu() {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).getNavigationPanelActiveMenu", {
    since: "6.2",
    version: "6.4"
  });
}
function isNavigationOpened() {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).isNavigationOpened", {
    since: "6.2",
    version: "6.4"
  });
}
function isPage(state) {
  (0, import_deprecated.default)("select( 'core/edit-site' ).isPage", {
    since: "6.8",
    alternative: "select( 'core/editor' ).getCurrentPostType"
  });
  return !!state.editedPost.context?.postId;
}
function hasPageContentFocus() {
  (0, import_deprecated.default)(`select( 'core/edit-site' ).hasPageContentFocus`, {
    since: "6.5"
  });
  return false;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=selectors.cjs.map
