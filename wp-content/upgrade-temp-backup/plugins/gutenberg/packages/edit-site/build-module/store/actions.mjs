// packages/edit-site/src/store/actions.js
import { parse } from "@wordpress/blocks";
import deprecated from "@wordpress/deprecated";
import { store as coreStore } from "@wordpress/core-data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import {
  store as editorStore,
  privateApis as editorPrivateApis
} from "@wordpress/editor";
import { store as preferencesStore } from "@wordpress/preferences";
import {
  TEMPLATE_POST_TYPE,
  TEMPLATE_PART_POST_TYPE,
  NAVIGATION_POST_TYPE
} from "../utils/constants.mjs";
import { unlock } from "../lock-unlock.mjs";
var { interfaceStore } = unlock(editorPrivateApis);
function toggleFeature(featureName) {
  return function({ registry }) {
    deprecated(
      "dispatch( 'core/edit-site' ).toggleFeature( featureName )",
      {
        since: "6.0",
        alternative: "dispatch( 'core/preferences').toggle( 'core/edit-site', featureName )"
      }
    );
    registry.dispatch(preferencesStore).toggle("core/edit-site", featureName);
  };
}
var __experimentalSetPreviewDeviceType = (deviceType) => ({ registry }) => {
  deprecated(
    "dispatch( 'core/edit-site' ).__experimentalSetPreviewDeviceType",
    {
      since: "6.5",
      version: "6.7",
      hint: "registry.dispatch( editorStore ).setDeviceType"
    }
  );
  registry.dispatch(editorStore).setDeviceType(deviceType);
};
function setTemplate() {
  deprecated("dispatch( 'core/edit-site' ).setTemplate", {
    since: "6.5",
    version: "6.8",
    hint: "The setTemplate is not needed anymore, the correct entity is resolved from the URL automatically."
  });
  return {
    type: "NOTHING"
  };
}
var addTemplate = (template) => async ({ dispatch, registry }) => {
  deprecated("dispatch( 'core/edit-site' ).addTemplate", {
    since: "6.5",
    version: "6.8",
    hint: "use saveEntityRecord directly"
  });
  const newTemplate = await registry.dispatch(coreStore).saveEntityRecord("postType", TEMPLATE_POST_TYPE, template);
  if (template.content) {
    registry.dispatch(coreStore).editEntityRecord(
      "postType",
      TEMPLATE_POST_TYPE,
      newTemplate.id,
      { blocks: parse(template.content) },
      { undoIgnore: true }
    );
  }
  dispatch({
    type: "SET_EDITED_POST",
    postType: TEMPLATE_POST_TYPE,
    id: newTemplate.id
  });
};
var removeTemplate = (template) => ({ registry }) => {
  return unlock(registry.dispatch(editorStore)).removeTemplates([
    template
  ]);
};
function setTemplatePart(templatePartId) {
  deprecated("dispatch( 'core/edit-site' ).setTemplatePart", {
    since: "6.8"
  });
  return {
    type: "SET_EDITED_POST",
    postType: TEMPLATE_PART_POST_TYPE,
    id: templatePartId
  };
}
function setNavigationMenu(navigationMenuId) {
  deprecated("dispatch( 'core/edit-site' ).setNavigationMenu", {
    since: "6.8"
  });
  return {
    type: "SET_EDITED_POST",
    postType: NAVIGATION_POST_TYPE,
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
  deprecated("dispatch( 'core/edit-site' ).setHomeTemplateId", {
    since: "6.2",
    version: "6.4"
  });
  return {
    type: "NOTHING"
  };
}
function setEditedPostContext(context) {
  deprecated("dispatch( 'core/edit-site' ).setEditedPostContext", {
    since: "6.8"
  });
  return {
    type: "SET_EDITED_POST_CONTEXT",
    context
  };
}
function setPage() {
  deprecated("dispatch( 'core/edit-site' ).setPage", {
    since: "6.5",
    version: "6.8",
    hint: "The setPage is not needed anymore, the correct entity is resolved from the URL automatically."
  });
  return { type: "NOTHING" };
}
function setNavigationPanelActiveMenu() {
  deprecated("dispatch( 'core/edit-site' ).setNavigationPanelActiveMenu", {
    since: "6.2",
    version: "6.4"
  });
  return { type: "NOTHING" };
}
function openNavigationPanelToMenu() {
  deprecated("dispatch( 'core/edit-site' ).openNavigationPanelToMenu", {
    since: "6.2",
    version: "6.4"
  });
  return { type: "NOTHING" };
}
function setIsNavigationPanelOpened() {
  deprecated("dispatch( 'core/edit-site' ).setIsNavigationPanelOpened", {
    since: "6.2",
    version: "6.4"
  });
  return { type: "NOTHING" };
}
var setIsInserterOpened = (value) => ({ registry }) => {
  deprecated("dispatch( 'core/edit-site' ).setIsInserterOpened", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').setIsInserterOpened"
  });
  registry.dispatch(editorStore).setIsInserterOpened(value);
};
var setIsListViewOpened = (isOpen) => ({ registry }) => {
  deprecated("dispatch( 'core/edit-site' ).setIsListViewOpened", {
    since: "6.5",
    alternative: "dispatch( 'core/editor').setIsListViewOpened"
  });
  registry.dispatch(editorStore).setIsListViewOpened(isOpen);
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
  return unlock(registry.dispatch(editorStore)).revertTemplate(
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
  deprecated("dispatch( 'core/edit-site' ).switchEditorMode", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').switchEditorMode"
  });
  registry.dispatch(editorStore).switchEditorMode(mode);
};
var setHasPageContentFocus = (hasPageContentFocus) => ({ dispatch, registry }) => {
  deprecated(`dispatch( 'core/edit-site' ).setHasPageContentFocus`, {
    since: "6.5"
  });
  if (hasPageContentFocus) {
    registry.dispatch(blockEditorStore).clearSelectedBlock();
  }
  dispatch({
    type: "SET_HAS_PAGE_CONTENT_FOCUS",
    hasPageContentFocus
  });
};
var toggleDistractionFree = () => ({ registry }) => {
  deprecated("dispatch( 'core/edit-site' ).toggleDistractionFree", {
    since: "6.6",
    alternative: "dispatch( 'core/editor').toggleDistractionFree"
  });
  registry.dispatch(editorStore).toggleDistractionFree();
};
export {
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
};
//# sourceMappingURL=actions.mjs.map
