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

// packages/edit-site/src/store/actions.js
var actions_exports = {};
__export(actions_exports, {
  __experimentalSetPreviewDeviceType: () => __experimentalSetPreviewDeviceType,
  addTemplate: () => addTemplate,
  closeGeneralSidebar: () => closeGeneralSidebar,
  openGeneralSidebar: () => openGeneralSidebar,
  openNavigationPanelToMenu: () => openNavigationPanelToMenu,
  removeTemplate: () => removeTemplate,
  revertTemplate: () => revertTemplate,
  setEditedEntity: () => setEditedEntity,
  setEditedPostContext: () => setEditedPostContext,
  setHasPageContentFocus: () => setHasPageContentFocus,
  setHomeTemplateId: () => setHomeTemplateId,
  setIsInserterOpened: () => setIsInserterOpened,
  setIsListViewOpened: () => setIsListViewOpened,
  setIsNavigationPanelOpened: () => setIsNavigationPanelOpened,
  setIsSaveViewOpened: () => setIsSaveViewOpened,
  setNavigationMenu: () => setNavigationMenu,
  setNavigationPanelActiveMenu: () => setNavigationPanelActiveMenu,
  setPage: () => setPage,
  setTemplate: () => setTemplate,
  setTemplatePart: () => setTemplatePart,
  switchEditorMode: () => switchEditorMode,
  toggleDistractionFree: () => toggleDistractionFree,
  toggleFeature: () => toggleFeature,
  updateSettings: () => updateSettings
});
module.exports = __toCommonJS(actions_exports);
var import_blocks = require("@wordpress/blocks");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var import_editor = require("@wordpress/editor");
var import_preferences = require("@wordpress/preferences");
var import_constants = require("../utils/constants.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var { interfaceStore } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
function toggleFeature(featureName) {
  return function({ registry }) {
    (0, import_deprecated.default)(
      "dispatch( 'core/edit-site' ).toggleFeature( featureName )",
      {
        since: "6.0",
        alternative: "dispatch( 'core/preferences').toggle( 'core/edit-site', featureName )"
      }
    );
    registry.dispatch(import_preferences.store).toggle("core/edit-site", featureName);
  };
}
var __experimentalSetPreviewDeviceType = (deviceType) => ({ registry }) => {
  (0, import_deprecated.default)(
    "dispatch( 'core/edit-site' ).__experimentalSetPreviewDeviceType",
    {
      since: "6.5",
      version: "6.7",
      hint: "registry.dispatch( editorStore ).setDeviceType"
    }
  );
  registry.dispatch(import_editor.store).setDeviceType(deviceType);
};
function setTemplate() {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).setTemplate", {
    since: "6.5",
    version: "6.8",
    hint: "The setTemplate is not needed anymore, the correct entity is resolved from the URL automatically."
  });
  return {
    type: "NOTHING"
  };
}
var addTemplate = (template) => async ({ dispatch, registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).addTemplate", {
    since: "6.5",
    version: "6.8",
    hint: "use saveEntityRecord directly"
  });
  const newTemplate = await registry.dispatch(import_core_data.store).saveEntityRecord("postType", import_constants.TEMPLATE_POST_TYPE, template);
  if (template.content) {
    registry.dispatch(import_core_data.store).editEntityRecord(
      "postType",
      import_constants.TEMPLATE_POST_TYPE,
      newTemplate.id,
      { blocks: (0, import_blocks.parse)(template.content) },
      { undoIgnore: true }
    );
  }
  dispatch({
    type: "SET_EDITED_POST",
    postType: import_constants.TEMPLATE_POST_TYPE,
    id: newTemplate.id
  });
};
var removeTemplate = (template) => ({ registry }) => {
  return (0, import_lock_unlock.unlock)(registry.dispatch(import_editor.store)).removeTemplates([
    template
  ]);
};
function setTemplatePart(templatePartId) {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).setTemplatePart", {
    since: "6.8"
  });
  return {
    type: "SET_EDITED_POST",
    postType: import_constants.TEMPLATE_PART_POST_TYPE,
    id: templatePartId
  };
}
function setNavigationMenu(navigationMenuId) {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).setNavigationMenu", {
    since: "6.8"
  });
  return {
    type: "SET_EDITED_POST",
    postType: import_constants.NAVIGATION_POST_TYPE,
    id: navigationMenuId
  };
}
function setEditedEntity(postType, postId, context) {
  return {
    type: "SET_EDITED_POST",
    postType,
    id: postId,
    context
  };
}
function setHomeTemplateId() {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).setHomeTemplateId", {
    since: "6.2",
    version: "6.4"
  });
  return {
    type: "NOTHING"
  };
}
function setEditedPostContext(context) {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).setEditedPostContext", {
    since: "6.8"
  });
  return {
    type: "SET_EDITED_POST_CONTEXT",
    context
  };
}
function setPage() {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).setPage", {
    since: "6.5",
    version: "6.8",
    hint: "The setPage is not needed anymore, the correct entity is resolved from the URL automatically."
  });
  return { type: "NOTHING" };
}
function setNavigationPanelActiveMenu() {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).setNavigationPanelActiveMenu", {
    since: "6.2",
    version: "6.4"
  });
  return { type: "NOTHING" };
}
function openNavigationPanelToMenu() {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).openNavigationPanelToMenu", {
    since: "6.2",
    version: "6.4"
  });
  return { type: "NOTHING" };
}
function setIsNavigationPanelOpened() {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).setIsNavigationPanelOpened", {
    since: "6.2",
    version: "6.4"
  });
  return { type: "NOTHING" };
}
var setIsInserterOpened = (value) => ({ registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).setIsInserterOpened", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').setIsInserterOpened"
  });
  registry.dispatch(import_editor.store).setIsInserterOpened(value);
};
var setIsListViewOpened = (isOpen) => ({ registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).setIsListViewOpened", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').setIsListViewOpened"
  });
  registry.dispatch(import_editor.store).setIsListViewOpened(isOpen);
};
function updateSettings(settings) {
  return {
    type: "UPDATE_SETTINGS",
    settings
  };
}
function setIsSaveViewOpened(isOpen) {
  return {
    type: "SET_IS_SAVE_VIEW_OPENED",
    isOpen
  };
}
var revertTemplate = (template, options) => ({ registry }) => {
  return (0, import_lock_unlock.unlock)(registry.dispatch(import_editor.store)).revertTemplate(
    template,
    options
  );
};
var openGeneralSidebar = (name) => ({ registry }) => {
  registry.dispatch(interfaceStore).enableComplementaryArea("core", name);
};
var closeGeneralSidebar = () => ({ registry }) => {
  registry.dispatch(interfaceStore).disableComplementaryArea("core");
};
var switchEditorMode = (mode) => ({ registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).switchEditorMode", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').switchEditorMode"
  });
  registry.dispatch(import_editor.store).switchEditorMode(mode);
};
var setHasPageContentFocus = (hasPageContentFocus) => ({ dispatch, registry }) => {
  (0, import_deprecated.default)(`dispatch( 'core/edit-site' ).setHasPageContentFocus`, {
    since: "6.5"
  });
  if (hasPageContentFocus) {
    registry.dispatch(import_block_editor.store).clearSelectedBlock();
  }
  dispatch({
    type: "SET_HAS_PAGE_CONTENT_FOCUS",
    hasPageContentFocus
  });
};
var toggleDistractionFree = () => ({ registry }) => {
  (0, import_deprecated.default)("dispatch( 'core/edit-site' ).toggleDistractionFree", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').toggleDistractionFree"
  });
  registry.dispatch(import_editor.store).toggleDistractionFree();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __experimentalSetPreviewDeviceType,
  addTemplate,
  closeGeneralSidebar,
  openGeneralSidebar,
  openNavigationPanelToMenu,
  removeTemplate,
  revertTemplate,
  setEditedEntity,
  setEditedPostContext,
  setHasPageContentFocus,
  setHomeTemplateId,
  setIsInserterOpened,
  setIsListViewOpened,
  setIsNavigationPanelOpened,
  setIsSaveViewOpened,
  setNavigationMenu,
  setNavigationPanelActiveMenu,
  setPage,
  setTemplate,
  setTemplatePart,
  switchEditorMode,
  toggleDistractionFree,
  toggleFeature,
  updateSettings
});
//# sourceMappingURL=actions.cjs.map
