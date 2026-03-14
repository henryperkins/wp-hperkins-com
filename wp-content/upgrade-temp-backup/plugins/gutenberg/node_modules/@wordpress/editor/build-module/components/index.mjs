// packages/editor/src/components/index.js
import EditorKeyboardShortcuts from "./global-keyboard-shortcuts/index.mjs";
export * from "./autocompleters/index.mjs";
import { default as default2 } from "./autosave-monitor/index.mjs";
import { default as default3 } from "./document-bar/index.mjs";
import { default as default4 } from "./document-outline/index.mjs";
import { default as default5 } from "./document-outline/check.mjs";
import { default as default6 } from "./global-keyboard-shortcuts/register-shortcuts.mjs";
import { default as default7 } from "./editor-history/redo.mjs";
import { default as default8 } from "./editor-history/undo.mjs";
import { default as default9 } from "./editor-notices/index.mjs";
import { default as default10 } from "./editor-snackbars/index.mjs";
import { default as default11 } from "./entities-saved-states/index.mjs";
import { useIsDirty } from "./entities-saved-states/hooks/use-is-dirty.mjs";
import { default as default12 } from "./error-boundary/index.mjs";
import { default as default13 } from "./local-autosave-monitor/index.mjs";
import { default as default14 } from "./page-attributes/check.mjs";
import { default as default15 } from "./page-attributes/order.mjs";
import { default as default16 } from "./page-attributes/panel.mjs";
import { default as default17 } from "./page-attributes/parent.mjs";
import { default as default18 } from "./post-template/classic-theme.mjs";
import { default as default19 } from "./plugin-document-setting-panel/index.mjs";
import { default as default20 } from "./block-settings-menu/plugin-block-settings-menu-item.mjs";
import { default as default21 } from "./plugin-more-menu-item/index.mjs";
import { default as default22 } from "./plugin-post-publish-panel/index.mjs";
import { default as default23 } from "./plugin-post-status-info/index.mjs";
import { default as default24 } from "./plugin-pre-publish-panel/index.mjs";
import { default as default25 } from "./plugin-preview-menu-item/index.mjs";
import { default as default26 } from "./plugin-sidebar/index.mjs";
import { default as default27 } from "./plugin-sidebar-more-menu-item/index.mjs";
import { default as default28 } from "./post-template/panel.mjs";
import { default as default29 } from "./post-author/index.mjs";
import { default as default30 } from "./post-author/check.mjs";
import { default as default31 } from "./post-author/panel.mjs";
import { default as default32 } from "./post-comments/index.mjs";
import { default as default33 } from "./post-discussion/panel.mjs";
import { default as default34 } from "./post-excerpt/index.mjs";
import { default as default35 } from "./post-excerpt/check.mjs";
import { default as default36 } from "./post-excerpt/panel.mjs";
import { default as default37 } from "./post-featured-image/index.mjs";
import { default as default38 } from "./post-featured-image/check.mjs";
import { default as default39 } from "./post-featured-image/panel.mjs";
import { default as default40 } from "./post-format/index.mjs";
import { default as default41 } from "./post-format/check.mjs";
import { default as default42 } from "./post-last-revision/index.mjs";
import { default as default43 } from "./post-last-revision/check.mjs";
import { default as default44 } from "./post-last-revision/panel.mjs";
import { default as default45 } from "./post-locked-modal/index.mjs";
import { default as default46 } from "./post-pending-status/index.mjs";
import { default as default47 } from "./post-pending-status/check.mjs";
import { default as default48 } from "./post-pingbacks/index.mjs";
import { default as default49 } from "./post-preview-button/index.mjs";
import { default as default50 } from "./post-publish-button/index.mjs";
import { default as default51 } from "./post-publish-button/label.mjs";
import { default as default52 } from "./post-publish-panel/index.mjs";
import { default as default53 } from "./post-saved-state/index.mjs";
import { default as default54 } from "./post-schedule/index.mjs";
import { default as default55 } from "./post-schedule/check.mjs";
import {
  default as default56,
  usePostScheduleLabel
} from "./post-schedule/label.mjs";
import { default as default57 } from "./post-schedule/panel.mjs";
import { default as default58 } from "./post-sticky/index.mjs";
import { default as default59 } from "./post-sticky/check.mjs";
import { default as default60 } from "./post-switch-to-draft-button/index.mjs";
import { default as default61 } from "./post-sync-status/index.mjs";
import { default as default62 } from "./post-taxonomies/index.mjs";
import { FlatTermSelector } from "./post-taxonomies/flat-term-selector.mjs";
import { HierarchicalTermSelector } from "./post-taxonomies/hierarchical-term-selector.mjs";
import { default as default63 } from "./post-taxonomies/check.mjs";
import { default as default64 } from "./post-taxonomies/panel.mjs";
import { default as default65 } from "./post-text-editor/index.mjs";
import { default as default66 } from "./post-title/index.mjs";
import { default as default67 } from "./post-title/post-title-raw.mjs";
import { default as default68 } from "./post-trash/index.mjs";
import { default as default69 } from "./post-trash/check.mjs";
import { default as default70 } from "./post-type-support-check/index.mjs";
import { default as default71 } from "./post-url/index.mjs";
import { default as default72 } from "./post-url/check.mjs";
import { default as default73, usePostURLLabel } from "./post-url/label.mjs";
import { default as default74 } from "./post-url/panel.mjs";
import { default as default75 } from "./post-visibility/index.mjs";
import {
  default as default76,
  usePostVisibilityLabel
} from "./post-visibility/label.mjs";
import { default as default77 } from "./post-visibility/check.mjs";
import { default as default78 } from "./table-of-contents/index.mjs";
import { default as default79 } from "./theme-support-check/index.mjs";
import { default as default80 } from "./unsaved-changes-warning/index.mjs";
import { default as default81 } from "./word-count/index.mjs";
import { default as default82 } from "./time-to-read/index.mjs";
import { default as default83 } from "./character-count/index.mjs";
import { default as default84 } from "./provider/index.mjs";
export * from "./deprecated.mjs";
var VisualEditorGlobalKeyboardShortcuts = EditorKeyboardShortcuts;
var TextEditorGlobalKeyboardShortcuts = EditorKeyboardShortcuts;
export {
  default2 as AutosaveMonitor,
  default83 as CharacterCount,
  default3 as DocumentBar,
  default4 as DocumentOutline,
  default5 as DocumentOutlineCheck,
  default7 as EditorHistoryRedo,
  default8 as EditorHistoryUndo,
  EditorKeyboardShortcuts,
  default6 as EditorKeyboardShortcutsRegister,
  default9 as EditorNotices,
  default84 as EditorProvider,
  default10 as EditorSnackbars,
  default11 as EntitiesSavedStates,
  default12 as ErrorBoundary,
  default13 as LocalAutosaveMonitor,
  default14 as PageAttributesCheck,
  default15 as PageAttributesOrder,
  default16 as PageAttributesPanel,
  default17 as PageAttributesParent,
  default18 as PageTemplate,
  default20 as PluginBlockSettingsMenuItem,
  default19 as PluginDocumentSettingPanel,
  default21 as PluginMoreMenuItem,
  default22 as PluginPostPublishPanel,
  default23 as PluginPostStatusInfo,
  default24 as PluginPrePublishPanel,
  default25 as PluginPreviewMenuItem,
  default26 as PluginSidebar,
  default27 as PluginSidebarMoreMenuItem,
  default29 as PostAuthor,
  default30 as PostAuthorCheck,
  default31 as PostAuthorPanel,
  default32 as PostComments,
  default33 as PostDiscussionPanel,
  default34 as PostExcerpt,
  default35 as PostExcerptCheck,
  default36 as PostExcerptPanel,
  default37 as PostFeaturedImage,
  default38 as PostFeaturedImageCheck,
  default39 as PostFeaturedImagePanel,
  default40 as PostFormat,
  default41 as PostFormatCheck,
  default42 as PostLastRevision,
  default43 as PostLastRevisionCheck,
  default44 as PostLastRevisionPanel,
  default45 as PostLockedModal,
  default46 as PostPendingStatus,
  default47 as PostPendingStatusCheck,
  default48 as PostPingbacks,
  default49 as PostPreviewButton,
  default50 as PostPublishButton,
  default51 as PostPublishButtonLabel,
  default52 as PostPublishPanel,
  default53 as PostSavedState,
  default54 as PostSchedule,
  default55 as PostScheduleCheck,
  default56 as PostScheduleLabel,
  default57 as PostSchedulePanel,
  default58 as PostSticky,
  default59 as PostStickyCheck,
  default60 as PostSwitchToDraftButton,
  default61 as PostSyncStatus,
  default62 as PostTaxonomies,
  default63 as PostTaxonomiesCheck,
  FlatTermSelector as PostTaxonomiesFlatTermSelector,
  HierarchicalTermSelector as PostTaxonomiesHierarchicalTermSelector,
  default64 as PostTaxonomiesPanel,
  default28 as PostTemplatePanel,
  default65 as PostTextEditor,
  default66 as PostTitle,
  default67 as PostTitleRaw,
  default68 as PostTrash,
  default69 as PostTrashCheck,
  default70 as PostTypeSupportCheck,
  default71 as PostURL,
  default72 as PostURLCheck,
  default73 as PostURLLabel,
  default74 as PostURLPanel,
  default75 as PostVisibility,
  default77 as PostVisibilityCheck,
  default76 as PostVisibilityLabel,
  default78 as TableOfContents,
  TextEditorGlobalKeyboardShortcuts,
  default79 as ThemeSupportCheck,
  default82 as TimeToRead,
  default80 as UnsavedChangesWarning,
  VisualEditorGlobalKeyboardShortcuts,
  default81 as WordCount,
  useIsDirty as useEntitiesSavedStatesIsDirty,
  usePostScheduleLabel,
  usePostURLLabel,
  usePostVisibilityLabel
};
//# sourceMappingURL=index.mjs.map
