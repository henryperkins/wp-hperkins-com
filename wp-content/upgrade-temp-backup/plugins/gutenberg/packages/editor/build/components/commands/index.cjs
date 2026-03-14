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

// packages/editor/src/components/commands/index.js
var commands_exports = {};
__export(commands_exports, {
  default: () => useCommands
});
module.exports = __toCommonJS(commands_exports);
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_commands = require("@wordpress/commands");
var import_preferences = require("@wordpress/preferences");
var import_notices = require("@wordpress/notices");
var import_block_editor = require("@wordpress/block-editor");
var import_core_data = require("@wordpress/core-data");
var import_interface = require("@wordpress/interface");
var import_html_entities = require("@wordpress/html-entities");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_constants = require("../../store/constants.cjs");
var import_pattern_rename_modal = require("../pattern-rename-modal/index.cjs");
var import_pattern_duplicate_modal = require("../pattern-duplicate-modal/index.cjs");
var import_is_template_revertable = __toESM(require("../../store/utils/is-template-revertable.cjs"));
var getEditorCommandLoader = () => function useEditorCommandLoader() {
  const {
    editorMode,
    isListViewOpen,
    showBlockBreadcrumbs,
    isDistractionFree,
    isFocusMode,
    isPreviewMode,
    isViewable,
    isCodeEditingEnabled,
    isRichEditingEnabled,
    isPublishSidebarEnabled
  } = (0, import_data.useSelect)((select) => {
    const { get } = select(import_preferences.store);
    const { isListViewOpened, getCurrentPostType, getEditorSettings } = select(import_store.store);
    const { getSettings } = select(import_block_editor.store);
    const { getPostType } = select(import_core_data.store);
    return {
      editorMode: get("core", "editorMode") ?? "visual",
      isListViewOpen: isListViewOpened(),
      showBlockBreadcrumbs: get("core", "showBlockBreadcrumbs"),
      isDistractionFree: get("core", "distractionFree"),
      isFocusMode: get("core", "focusMode"),
      isPreviewMode: getSettings().isPreviewMode,
      isViewable: getPostType(getCurrentPostType())?.viewable ?? false,
      isCodeEditingEnabled: getEditorSettings().codeEditingEnabled,
      isRichEditingEnabled: getEditorSettings().richEditingEnabled,
      isPublishSidebarEnabled: select(import_store.store).isPublishSidebarEnabled()
    };
  }, []);
  const { getActiveComplementaryArea } = (0, import_data.useSelect)(import_interface.store);
  const { toggle } = (0, import_data.useDispatch)(import_preferences.store);
  const { createInfoNotice } = (0, import_data.useDispatch)(import_notices.store);
  const {
    __unstableSaveForPreview,
    setIsListViewOpened,
    switchEditorMode,
    toggleDistractionFree,
    toggleSpotlightMode,
    toggleTopToolbar
  } = (0, import_data.useDispatch)(import_store.store);
  const { openModal, enableComplementaryArea, disableComplementaryArea } = (0, import_data.useDispatch)(import_interface.store);
  const { getCurrentPostId } = (0, import_data.useSelect)(import_store.store);
  const allowSwitchEditorMode = isCodeEditingEnabled && isRichEditingEnabled;
  if (isPreviewMode) {
    return { commands: [], isLoading: false };
  }
  const commands = [];
  commands.push({
    name: "core/open-shortcut-help",
    label: (0, import_i18n.__)("Keyboard shortcuts"),
    icon: import_icons.keyboard,
    category: "view",
    callback: ({ close }) => {
      close();
      openModal("editor/keyboard-shortcut-help");
    }
  });
  commands.push({
    name: "core/toggle-distraction-free",
    label: isDistractionFree ? (0, import_i18n.__)("Exit Distraction free") : (0, import_i18n.__)("Enter Distraction free"),
    category: "command",
    callback: ({ close }) => {
      toggleDistractionFree();
      close();
    }
  });
  commands.push({
    name: "core/open-preferences",
    label: (0, import_i18n.__)("Editor preferences"),
    category: "view",
    callback: ({ close }) => {
      close();
      openModal("editor/preferences");
    }
  });
  commands.push({
    name: "core/toggle-spotlight-mode",
    label: isFocusMode ? (0, import_i18n.__)("Exit Spotlight mode") : (0, import_i18n.__)("Enter Spotlight mode"),
    category: "command",
    callback: ({ close }) => {
      toggleSpotlightMode();
      close();
    }
  });
  commands.push({
    name: "core/toggle-list-view",
    label: isListViewOpen ? (0, import_i18n.__)("Close List View") : (0, import_i18n.__)("Open List View"),
    icon: import_icons.listView,
    category: "command",
    callback: ({ close }) => {
      setIsListViewOpened(!isListViewOpen);
      close();
      createInfoNotice(
        isListViewOpen ? (0, import_i18n.__)("List View off.") : (0, import_i18n.__)("List View on."),
        {
          id: "core/editor/toggle-list-view/notice",
          type: "snackbar"
        }
      );
    }
  });
  commands.push({
    name: "core/toggle-top-toolbar",
    label: (0, import_i18n.__)("Top toolbar"),
    category: "command",
    callback: ({ close }) => {
      toggleTopToolbar();
      close();
    }
  });
  if (allowSwitchEditorMode) {
    commands.push({
      name: "core/toggle-code-editor",
      label: editorMode === "visual" ? (0, import_i18n.__)("Open code editor") : (0, import_i18n.__)("Exit code editor"),
      icon: import_icons.code,
      category: "command",
      callback: ({ close }) => {
        switchEditorMode(
          editorMode === "visual" ? "text" : "visual"
        );
        close();
      }
    });
  }
  commands.push({
    name: "core/toggle-breadcrumbs",
    label: showBlockBreadcrumbs ? (0, import_i18n.__)("Hide block breadcrumbs") : (0, import_i18n.__)("Show block breadcrumbs"),
    category: "command",
    callback: ({ close }) => {
      toggle("core", "showBlockBreadcrumbs");
      close();
      createInfoNotice(
        showBlockBreadcrumbs ? (0, import_i18n.__)("Breadcrumbs hidden.") : (0, import_i18n.__)("Breadcrumbs visible."),
        {
          id: "core/editor/toggle-breadcrumbs/notice",
          type: "snackbar"
        }
      );
    }
  });
  commands.push({
    name: "core/open-settings-sidebar",
    label: (0, import_i18n.__)("Show or hide the Settings panel"),
    icon: (0, import_i18n.isRTL)() ? import_icons.drawerLeft : import_icons.drawerRight,
    category: "command",
    callback: ({ close }) => {
      const activeSidebar = getActiveComplementaryArea("core");
      close();
      if (activeSidebar === "edit-post/document") {
        disableComplementaryArea("core");
      } else {
        enableComplementaryArea("core", "edit-post/document");
      }
    }
  });
  commands.push({
    name: "core/open-block-inspector",
    label: (0, import_i18n.__)("Show or hide the Block settings panel"),
    icon: import_icons.blockDefault,
    category: "command",
    callback: ({ close }) => {
      const activeSidebar = getActiveComplementaryArea("core");
      close();
      if (activeSidebar === "edit-post/block") {
        disableComplementaryArea("core");
      } else {
        enableComplementaryArea("core", "edit-post/block");
      }
    }
  });
  commands.push({
    name: "core/toggle-publish-sidebar",
    label: isPublishSidebarEnabled ? (0, import_i18n.__)("Disable pre-publish checks") : (0, import_i18n.__)("Enable pre-publish checks"),
    icon: import_icons.formatListBullets,
    category: "command",
    callback: ({ close }) => {
      close();
      toggle("core", "isPublishSidebarEnabled");
      createInfoNotice(
        isPublishSidebarEnabled ? (0, import_i18n.__)("Pre-publish checks disabled.") : (0, import_i18n.__)("Pre-publish checks enabled."),
        {
          id: "core/editor/publish-sidebar/notice",
          type: "snackbar"
        }
      );
    }
  });
  if (isViewable) {
    commands.push({
      name: "core/preview-link",
      label: (0, import_i18n.__)("Preview in a new tab"),
      icon: import_icons.external,
      category: "view",
      callback: async ({ close }) => {
        close();
        const postId = getCurrentPostId();
        const link = await __unstableSaveForPreview();
        window.open(link, `wp-preview-${postId}`);
      }
    });
  }
  return {
    commands,
    isLoading: false
  };
};
var getEditedEntityContextualCommands = () => function useEditedEntityContextualCommands() {
  const { postType } = (0, import_data.useSelect)((select) => {
    const { getCurrentPostType } = select(import_store.store);
    return {
      postType: getCurrentPostType()
    };
  }, []);
  const { openModal } = (0, import_data.useDispatch)(import_interface.store);
  const commands = [];
  if (postType === import_constants.PATTERN_POST_TYPE) {
    commands.push({
      name: "core/rename-pattern",
      label: (0, import_i18n.__)("Rename pattern"),
      icon: import_icons.pencil,
      category: "edit",
      callback: ({ close }) => {
        openModal(import_pattern_rename_modal.modalName);
        close();
      }
    });
    commands.push({
      name: "core/duplicate-pattern",
      label: (0, import_i18n.__)("Duplicate pattern"),
      icon: import_icons.symbol,
      category: "command",
      callback: ({ close }) => {
        openModal(import_pattern_duplicate_modal.modalName);
        close();
      }
    });
  }
  return { isLoading: false, commands };
};
var getPageContentFocusCommands = () => function usePageContentFocusCommands() {
  const {
    onNavigateToEntityRecord,
    goBack,
    templateId,
    isPreviewMode,
    canEditTemplate
  } = (0, import_data.useSelect)((select) => {
    const {
      getRenderingMode,
      getEditorSettings: _getEditorSettings,
      getCurrentTemplateId
    } = (0, import_lock_unlock.unlock)(select(import_store.store));
    const editorSettings = _getEditorSettings();
    const _templateId = getCurrentTemplateId();
    return {
      isTemplateHidden: getRenderingMode() === "post-only",
      onNavigateToEntityRecord: editorSettings.onNavigateToEntityRecord,
      getEditorSettings: _getEditorSettings,
      goBack: editorSettings.onNavigateToPreviousEntityRecord,
      templateId: _templateId,
      isPreviewMode: editorSettings.isPreviewMode,
      canEditTemplate: !!_templateId && select(import_core_data.store).canUser("update", {
        kind: "postType",
        name: "wp_template",
        id: _templateId
      })
    };
  }, []);
  const { editedRecord: template, hasResolved } = (0, import_core_data.useEntityRecord)(
    "postType",
    "wp_template",
    templateId
  );
  if (isPreviewMode) {
    return { isLoading: false, commands: [] };
  }
  const commands = [];
  if (templateId && hasResolved && canEditTemplate) {
    commands.push({
      name: "core/switch-to-template-focus",
      label: (0, import_i18n.sprintf)(
        /* translators: %s: template title */
        (0, import_i18n.__)("Edit template: %s"),
        (0, import_html_entities.decodeEntities)(template.title)
      ),
      icon: import_icons.layout,
      category: "edit",
      callback: ({ close }) => {
        onNavigateToEntityRecord({
          postId: templateId,
          postType: "wp_template"
        });
        close();
      }
    });
  }
  if (!!goBack) {
    commands.push({
      name: "core/switch-to-previous-entity",
      label: (0, import_i18n.__)("Go back"),
      icon: import_icons.page,
      category: "view",
      callback: ({ close }) => {
        goBack();
        close();
      }
    });
  }
  return { isLoading: false, commands };
};
var getManipulateDocumentCommands = () => function useManipulateDocumentCommands() {
  const { postType, postId } = (0, import_data.useSelect)((select) => {
    const { getCurrentPostId, getCurrentPostType } = select(import_store.store);
    return {
      postType: getCurrentPostType(),
      postId: getCurrentPostId()
    };
  }, []);
  const { editedRecord: template, hasResolved } = (0, import_core_data.useEntityRecord)(
    "postType",
    postType,
    postId
  );
  const { revertTemplate } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  if (!hasResolved || ![import_constants.TEMPLATE_PART_POST_TYPE, import_constants.TEMPLATE_POST_TYPE].includes(
    postType
  )) {
    return { isLoading: true, commands: [] };
  }
  const commands = [];
  if ((0, import_is_template_revertable.default)(template)) {
    const label = template.type === import_constants.TEMPLATE_POST_TYPE ? (0, import_i18n.sprintf)(
      /* translators: %s: template title */
      (0, import_i18n.__)("Reset template: %s"),
      (0, import_html_entities.decodeEntities)(template.title)
    ) : (0, import_i18n.sprintf)(
      /* translators: %s: template part title */
      (0, import_i18n.__)("Reset template part: %s"),
      (0, import_html_entities.decodeEntities)(template.title)
    );
    commands.push({
      name: "core/reset-template",
      label,
      icon: (0, import_i18n.isRTL)() ? import_icons.rotateRight : import_icons.rotateLeft,
      category: "command",
      callback: ({ close }) => {
        revertTemplate(template);
        close();
      }
    });
  }
  return {
    isLoading: !hasResolved,
    commands
  };
};
function useCommands() {
  (0, import_commands.useCommandLoader)({
    name: "core/editor/edit-ui",
    hook: getEditorCommandLoader()
  });
  (0, import_commands.useCommandLoader)({
    name: "core/editor/contextual-commands",
    hook: getEditedEntityContextualCommands(),
    context: "entity-edit"
  });
  (0, import_commands.useCommandLoader)({
    name: "core/editor/page-content-focus",
    hook: getPageContentFocusCommands(),
    context: "entity-edit"
  });
  (0, import_commands.useCommandLoader)({
    name: "core/edit-site/manipulate-document",
    hook: getManipulateDocumentCommands()
  });
}
//# sourceMappingURL=index.cjs.map
