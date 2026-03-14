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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/index.js
var components_exports = {};
__export(components_exports, {
  AutosaveMonitor: () => import_autosave_monitor.default,
  CharacterCount: () => import_character_count.default,
  DocumentBar: () => import_document_bar.default,
  DocumentOutline: () => import_document_outline.default,
  DocumentOutlineCheck: () => import_check.default,
  EditorHistoryRedo: () => import_redo.default,
  EditorHistoryUndo: () => import_undo.default,
  EditorKeyboardShortcuts: () => import_global_keyboard_shortcuts.default,
  EditorKeyboardShortcutsRegister: () => import_register_shortcuts.default,
  EditorNotices: () => import_editor_notices.default,
  EditorProvider: () => import_provider.default,
  EditorSnackbars: () => import_editor_snackbars.default,
  EntitiesSavedStates: () => import_entities_saved_states.default,
  ErrorBoundary: () => import_error_boundary.default,
  LocalAutosaveMonitor: () => import_local_autosave_monitor.default,
  PageAttributesCheck: () => import_check2.default,
  PageAttributesOrder: () => import_order.default,
  PageAttributesPanel: () => import_panel.default,
  PageAttributesParent: () => import_parent.default,
  PageTemplate: () => import_classic_theme.default,
  PluginBlockSettingsMenuItem: () => import_plugin_block_settings_menu_item.default,
  PluginDocumentSettingPanel: () => import_plugin_document_setting_panel.default,
  PluginMoreMenuItem: () => import_plugin_more_menu_item.default,
  PluginPostPublishPanel: () => import_plugin_post_publish_panel.default,
  PluginPostStatusInfo: () => import_plugin_post_status_info.default,
  PluginPrePublishPanel: () => import_plugin_pre_publish_panel.default,
  PluginPreviewMenuItem: () => import_plugin_preview_menu_item.default,
  PluginSidebar: () => import_plugin_sidebar.default,
  PluginSidebarMoreMenuItem: () => import_plugin_sidebar_more_menu_item.default,
  PostAuthor: () => import_post_author.default,
  PostAuthorCheck: () => import_check3.default,
  PostAuthorPanel: () => import_panel3.default,
  PostComments: () => import_post_comments.default,
  PostDiscussionPanel: () => import_panel4.default,
  PostExcerpt: () => import_post_excerpt.default,
  PostExcerptCheck: () => import_check4.default,
  PostExcerptPanel: () => import_panel5.default,
  PostFeaturedImage: () => import_post_featured_image.default,
  PostFeaturedImageCheck: () => import_check5.default,
  PostFeaturedImagePanel: () => import_panel6.default,
  PostFormat: () => import_post_format.default,
  PostFormatCheck: () => import_check6.default,
  PostLastRevision: () => import_post_last_revision.default,
  PostLastRevisionCheck: () => import_check7.default,
  PostLastRevisionPanel: () => import_panel7.default,
  PostLockedModal: () => import_post_locked_modal.default,
  PostPendingStatus: () => import_post_pending_status.default,
  PostPendingStatusCheck: () => import_check8.default,
  PostPingbacks: () => import_post_pingbacks.default,
  PostPreviewButton: () => import_post_preview_button.default,
  PostPublishButton: () => import_post_publish_button.default,
  PostPublishButtonLabel: () => import_label.default,
  PostPublishPanel: () => import_post_publish_panel.default,
  PostSavedState: () => import_post_saved_state.default,
  PostSchedule: () => import_post_schedule.default,
  PostScheduleCheck: () => import_check9.default,
  PostScheduleLabel: () => import_label2.default,
  PostSchedulePanel: () => import_panel8.default,
  PostSticky: () => import_post_sticky.default,
  PostStickyCheck: () => import_check10.default,
  PostSwitchToDraftButton: () => import_post_switch_to_draft_button.default,
  PostSyncStatus: () => import_post_sync_status.default,
  PostTaxonomies: () => import_post_taxonomies.default,
  PostTaxonomiesCheck: () => import_check11.default,
  PostTaxonomiesFlatTermSelector: () => import_flat_term_selector.FlatTermSelector,
  PostTaxonomiesHierarchicalTermSelector: () => import_hierarchical_term_selector.HierarchicalTermSelector,
  PostTaxonomiesPanel: () => import_panel9.default,
  PostTemplatePanel: () => import_panel2.default,
  PostTextEditor: () => import_post_text_editor.default,
  PostTitle: () => import_post_title.default,
  PostTitleRaw: () => import_post_title_raw.default,
  PostTrash: () => import_post_trash.default,
  PostTrashCheck: () => import_check12.default,
  PostTypeSupportCheck: () => import_post_type_support_check.default,
  PostURL: () => import_post_url.default,
  PostURLCheck: () => import_check13.default,
  PostURLLabel: () => import_label3.default,
  PostURLPanel: () => import_panel10.default,
  PostVisibility: () => import_post_visibility.default,
  PostVisibilityCheck: () => import_check14.default,
  PostVisibilityLabel: () => import_label4.default,
  TableOfContents: () => import_table_of_contents.default,
  TextEditorGlobalKeyboardShortcuts: () => TextEditorGlobalKeyboardShortcuts,
  ThemeSupportCheck: () => import_theme_support_check.default,
  TimeToRead: () => import_time_to_read.default,
  UnsavedChangesWarning: () => import_unsaved_changes_warning.default,
  VisualEditorGlobalKeyboardShortcuts: () => VisualEditorGlobalKeyboardShortcuts,
  WordCount: () => import_word_count.default,
  useEntitiesSavedStatesIsDirty: () => import_use_is_dirty.useIsDirty,
  usePostScheduleLabel: () => import_label2.usePostScheduleLabel,
  usePostURLLabel: () => import_label3.usePostURLLabel,
  usePostVisibilityLabel: () => import_label4.usePostVisibilityLabel
});
module.exports = __toCommonJS(components_exports);
var import_global_keyboard_shortcuts = __toESM(require("./global-keyboard-shortcuts/index.cjs"));
__reExport(components_exports, require("./autocompleters/index.cjs"), module.exports);
var import_autosave_monitor = __toESM(require("./autosave-monitor/index.cjs"));
var import_document_bar = __toESM(require("./document-bar/index.cjs"));
var import_document_outline = __toESM(require("./document-outline/index.cjs"));
var import_check = __toESM(require("./document-outline/check.cjs"));
var import_register_shortcuts = __toESM(require("./global-keyboard-shortcuts/register-shortcuts.cjs"));
var import_redo = __toESM(require("./editor-history/redo.cjs"));
var import_undo = __toESM(require("./editor-history/undo.cjs"));
var import_editor_notices = __toESM(require("./editor-notices/index.cjs"));
var import_editor_snackbars = __toESM(require("./editor-snackbars/index.cjs"));
var import_entities_saved_states = __toESM(require("./entities-saved-states/index.cjs"));
var import_use_is_dirty = require("./entities-saved-states/hooks/use-is-dirty.cjs");
var import_error_boundary = __toESM(require("./error-boundary/index.cjs"));
var import_local_autosave_monitor = __toESM(require("./local-autosave-monitor/index.cjs"));
var import_check2 = __toESM(require("./page-attributes/check.cjs"));
var import_order = __toESM(require("./page-attributes/order.cjs"));
var import_panel = __toESM(require("./page-attributes/panel.cjs"));
var import_parent = __toESM(require("./page-attributes/parent.cjs"));
var import_classic_theme = __toESM(require("./post-template/classic-theme.cjs"));
var import_plugin_document_setting_panel = __toESM(require("./plugin-document-setting-panel/index.cjs"));
var import_plugin_block_settings_menu_item = __toESM(require("./block-settings-menu/plugin-block-settings-menu-item.cjs"));
var import_plugin_more_menu_item = __toESM(require("./plugin-more-menu-item/index.cjs"));
var import_plugin_post_publish_panel = __toESM(require("./plugin-post-publish-panel/index.cjs"));
var import_plugin_post_status_info = __toESM(require("./plugin-post-status-info/index.cjs"));
var import_plugin_pre_publish_panel = __toESM(require("./plugin-pre-publish-panel/index.cjs"));
var import_plugin_preview_menu_item = __toESM(require("./plugin-preview-menu-item/index.cjs"));
var import_plugin_sidebar = __toESM(require("./plugin-sidebar/index.cjs"));
var import_plugin_sidebar_more_menu_item = __toESM(require("./plugin-sidebar-more-menu-item/index.cjs"));
var import_panel2 = __toESM(require("./post-template/panel.cjs"));
var import_post_author = __toESM(require("./post-author/index.cjs"));
var import_check3 = __toESM(require("./post-author/check.cjs"));
var import_panel3 = __toESM(require("./post-author/panel.cjs"));
var import_post_comments = __toESM(require("./post-comments/index.cjs"));
var import_panel4 = __toESM(require("./post-discussion/panel.cjs"));
var import_post_excerpt = __toESM(require("./post-excerpt/index.cjs"));
var import_check4 = __toESM(require("./post-excerpt/check.cjs"));
var import_panel5 = __toESM(require("./post-excerpt/panel.cjs"));
var import_post_featured_image = __toESM(require("./post-featured-image/index.cjs"));
var import_check5 = __toESM(require("./post-featured-image/check.cjs"));
var import_panel6 = __toESM(require("./post-featured-image/panel.cjs"));
var import_post_format = __toESM(require("./post-format/index.cjs"));
var import_check6 = __toESM(require("./post-format/check.cjs"));
var import_post_last_revision = __toESM(require("./post-last-revision/index.cjs"));
var import_check7 = __toESM(require("./post-last-revision/check.cjs"));
var import_panel7 = __toESM(require("./post-last-revision/panel.cjs"));
var import_post_locked_modal = __toESM(require("./post-locked-modal/index.cjs"));
var import_post_pending_status = __toESM(require("./post-pending-status/index.cjs"));
var import_check8 = __toESM(require("./post-pending-status/check.cjs"));
var import_post_pingbacks = __toESM(require("./post-pingbacks/index.cjs"));
var import_post_preview_button = __toESM(require("./post-preview-button/index.cjs"));
var import_post_publish_button = __toESM(require("./post-publish-button/index.cjs"));
var import_label = __toESM(require("./post-publish-button/label.cjs"));
var import_post_publish_panel = __toESM(require("./post-publish-panel/index.cjs"));
var import_post_saved_state = __toESM(require("./post-saved-state/index.cjs"));
var import_post_schedule = __toESM(require("./post-schedule/index.cjs"));
var import_check9 = __toESM(require("./post-schedule/check.cjs"));
var import_label2 = __toESM(require("./post-schedule/label.cjs"));
var import_panel8 = __toESM(require("./post-schedule/panel.cjs"));
var import_post_sticky = __toESM(require("./post-sticky/index.cjs"));
var import_check10 = __toESM(require("./post-sticky/check.cjs"));
var import_post_switch_to_draft_button = __toESM(require("./post-switch-to-draft-button/index.cjs"));
var import_post_sync_status = __toESM(require("./post-sync-status/index.cjs"));
var import_post_taxonomies = __toESM(require("./post-taxonomies/index.cjs"));
var import_flat_term_selector = require("./post-taxonomies/flat-term-selector.cjs");
var import_hierarchical_term_selector = require("./post-taxonomies/hierarchical-term-selector.cjs");
var import_check11 = __toESM(require("./post-taxonomies/check.cjs"));
var import_panel9 = __toESM(require("./post-taxonomies/panel.cjs"));
var import_post_text_editor = __toESM(require("./post-text-editor/index.cjs"));
var import_post_title = __toESM(require("./post-title/index.cjs"));
var import_post_title_raw = __toESM(require("./post-title/post-title-raw.cjs"));
var import_post_trash = __toESM(require("./post-trash/index.cjs"));
var import_check12 = __toESM(require("./post-trash/check.cjs"));
var import_post_type_support_check = __toESM(require("./post-type-support-check/index.cjs"));
var import_post_url = __toESM(require("./post-url/index.cjs"));
var import_check13 = __toESM(require("./post-url/check.cjs"));
var import_label3 = __toESM(require("./post-url/label.cjs"));
var import_panel10 = __toESM(require("./post-url/panel.cjs"));
var import_post_visibility = __toESM(require("./post-visibility/index.cjs"));
var import_label4 = __toESM(require("./post-visibility/label.cjs"));
var import_check14 = __toESM(require("./post-visibility/check.cjs"));
var import_table_of_contents = __toESM(require("./table-of-contents/index.cjs"));
var import_theme_support_check = __toESM(require("./theme-support-check/index.cjs"));
var import_unsaved_changes_warning = __toESM(require("./unsaved-changes-warning/index.cjs"));
var import_word_count = __toESM(require("./word-count/index.cjs"));
var import_time_to_read = __toESM(require("./time-to-read/index.cjs"));
var import_character_count = __toESM(require("./character-count/index.cjs"));
var import_provider = __toESM(require("./provider/index.cjs"));
__reExport(components_exports, require("./deprecated.cjs"), module.exports);
var VisualEditorGlobalKeyboardShortcuts = import_global_keyboard_shortcuts.default;
var TextEditorGlobalKeyboardShortcuts = import_global_keyboard_shortcuts.default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AutosaveMonitor,
  CharacterCount,
  DocumentBar,
  DocumentOutline,
  DocumentOutlineCheck,
  EditorHistoryRedo,
  EditorHistoryUndo,
  EditorKeyboardShortcuts,
  EditorKeyboardShortcutsRegister,
  EditorNotices,
  EditorProvider,
  EditorSnackbars,
  EntitiesSavedStates,
  ErrorBoundary,
  LocalAutosaveMonitor,
  PageAttributesCheck,
  PageAttributesOrder,
  PageAttributesPanel,
  PageAttributesParent,
  PageTemplate,
  PluginBlockSettingsMenuItem,
  PluginDocumentSettingPanel,
  PluginMoreMenuItem,
  PluginPostPublishPanel,
  PluginPostStatusInfo,
  PluginPrePublishPanel,
  PluginPreviewMenuItem,
  PluginSidebar,
  PluginSidebarMoreMenuItem,
  PostAuthor,
  PostAuthorCheck,
  PostAuthorPanel,
  PostComments,
  PostDiscussionPanel,
  PostExcerpt,
  PostExcerptCheck,
  PostExcerptPanel,
  PostFeaturedImage,
  PostFeaturedImageCheck,
  PostFeaturedImagePanel,
  PostFormat,
  PostFormatCheck,
  PostLastRevision,
  PostLastRevisionCheck,
  PostLastRevisionPanel,
  PostLockedModal,
  PostPendingStatus,
  PostPendingStatusCheck,
  PostPingbacks,
  PostPreviewButton,
  PostPublishButton,
  PostPublishButtonLabel,
  PostPublishPanel,
  PostSavedState,
  PostSchedule,
  PostScheduleCheck,
  PostScheduleLabel,
  PostSchedulePanel,
  PostSticky,
  PostStickyCheck,
  PostSwitchToDraftButton,
  PostSyncStatus,
  PostTaxonomies,
  PostTaxonomiesCheck,
  PostTaxonomiesFlatTermSelector,
  PostTaxonomiesHierarchicalTermSelector,
  PostTaxonomiesPanel,
  PostTemplatePanel,
  PostTextEditor,
  PostTitle,
  PostTitleRaw,
  PostTrash,
  PostTrashCheck,
  PostTypeSupportCheck,
  PostURL,
  PostURLCheck,
  PostURLLabel,
  PostURLPanel,
  PostVisibility,
  PostVisibilityCheck,
  PostVisibilityLabel,
  TableOfContents,
  TextEditorGlobalKeyboardShortcuts,
  ThemeSupportCheck,
  TimeToRead,
  UnsavedChangesWarning,
  VisualEditorGlobalKeyboardShortcuts,
  WordCount,
  useEntitiesSavedStatesIsDirty,
  usePostScheduleLabel,
  usePostURLLabel,
  usePostVisibilityLabel,
  ...require("./autocompleters/index.cjs"),
  ...require("./deprecated.cjs")
});
//# sourceMappingURL=index.cjs.map
