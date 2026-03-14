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

// packages/block-editor/src/private-apis.js
var private_apis_exports = {};
__export(private_apis_exports, {
  privateApis: () => privateApis
});
module.exports = __toCommonJS(private_apis_exports);
var globalStyles = __toESM(require("./components/global-styles/index.cjs"));
var import_provider = require("./components/provider/index.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_get_rich_text_values = require("./components/rich-text/get-rich-text-values.cjs");
var import_resizable_box_popover = __toESM(require("./components/resizable-box-popover/index.cjs"));
var import_quick_inserter = __toESM(require("./components/inserter/quick-inserter.cjs"));
var import_search_items = require("./components/inserter/search-items.cjs");
var import_list_view = require("./components/list-view/index.cjs");
var import_last_item = __toESM(require("./components/inspector-controls/last-item.cjs"));
var import_use_has_block_toolbar = require("./components/block-toolbar/use-has-block-toolbar.cjs");
var import_utils = require("./hooks/utils.cjs");
var import_block_quick_navigation = __toESM(require("./components/block-quick-navigation/index.cjs"));
var import_layout = require("./components/block-list/layout.cjs");
var import_block_manager = __toESM(require("./components/block-manager/index.cjs"));
var import_block_removal_warning_modal = require("./components/block-removal-warning-modal/index.cjs");
var import_hooks = require("./hooks/index.cjs");
var import_dimensions_tool = __toESM(require("./components/dimensions-tool/index.cjs"));
var import_resolution_tool = __toESM(require("./components/resolution-tool/index.cjs"));
var import_text_alignment_control = __toESM(require("./components/text-alignment-control/index.cjs"));
var import_format_edit = require("./components/rich-text/format-edit.cjs");
var import_block_canvas = require("./components/block-canvas/index.cjs");
var import_utils2 = require("./components/duotone/utils.cjs");
var import_use_flash_editable_blocks = require("./components/use-flash-editable-blocks/index.cjs");
var import_private_keys = require("./store/private-keys.cjs");
var import_utils3 = require("./components/writing-flow/utils.cjs");
var import_rich_text = require("./components/rich-text/index.cjs");
var import_block_popover = require("./components/block-popover/index.cjs");
var import_library = require("./components/inserter/library.cjs");
var import_publish_date_time_picker = require("./components/publish-date-time-picker/index.cjs");
var import_use_spacing_sizes = __toESM(require("./components/spacing-sizes-control/hooks/use-spacing-sizes.cjs"));
var import_use_block_display_title = __toESM(require("./components/block-title/use-block-display-title.cjs"));
var import_tabbed_sidebar = __toESM(require("./components/tabbed-sidebar/index.cjs"));
var import_block_comment_icon_slot = __toESM(require("./components/collab/block-comment-icon-slot.cjs"));
var import_block_comment_icon_toolbar_slot = __toESM(require("./components/collab/block-comment-icon-toolbar-slot.cjs"));
var import_html_element_control = __toESM(require("./components/html-element-control/index.cjs"));
var import_use_block_refs = require("./components/block-list/use-block-props/use-block-refs.cjs");
var import_link_picker = require("./components/link-picker/index.cjs");
var import_use_rich_url_data = __toESM(require("./components/link-control/use-rich-url-data.cjs"));
var import_private_block_context = require("./components/block-list/private-block-context.cjs");
var import_use_list_view_panel_state = __toESM(require("./components/use-list-view-panel-state/index.cjs"));
var import_is_url_like = require("./components/link-control/is-url-like.cjs");
var privateApis = {};
(0, import_lock_unlock.lock)(privateApis, {
  ...globalStyles,
  ExperimentalBlockCanvas: import_block_canvas.ExperimentalBlockCanvas,
  BlockCanvasCover: import_block_canvas.BlockCanvasCover,
  ExperimentalBlockEditorProvider: import_provider.ExperimentalBlockEditorProvider,
  getDuotoneFilter: import_utils2.getDuotoneFilter,
  getRichTextValues: import_get_rich_text_values.getRichTextValues,
  PrivateQuickInserter: import_quick_inserter.default,
  extractWords: import_search_items.extractWords,
  getNormalizedSearchTerms: import_search_items.getNormalizedSearchTerms,
  normalizeString: import_search_items.normalizeString,
  PrivateListView: import_list_view.PrivateListView,
  ResizableBoxPopover: import_resizable_box_popover.default,
  InspectorControlsLastItem: import_last_item.default,
  useHasBlockToolbar: import_use_has_block_toolbar.useHasBlockToolbar,
  cleanEmptyObject: import_utils.cleanEmptyObject,
  usePrivateStyleOverride: import_utils.usePrivateStyleOverride,
  BlockQuickNavigation: import_block_quick_navigation.default,
  LayoutStyle: import_layout.LayoutStyle,
  BlockManager: import_block_manager.default,
  BlockRemovalWarningModal: import_block_removal_warning_modal.BlockRemovalWarningModal,
  useLayoutClasses: import_hooks.useLayoutClasses,
  useLayoutStyles: import_hooks.useLayoutStyles,
  DimensionsTool: import_dimensions_tool.default,
  ResolutionTool: import_resolution_tool.default,
  TabbedSidebar: import_tabbed_sidebar.default,
  TextAlignmentControl: import_text_alignment_control.default,
  usesContextKey: import_format_edit.usesContextKey,
  useFlashEditableBlocks: import_use_flash_editable_blocks.useFlashEditableBlocks,
  HTMLElementControl: import_html_element_control.default,
  useZoomOut: import_hooks.useZoomOut,
  globalStylesDataKey: import_private_keys.globalStylesDataKey,
  globalStylesLinksDataKey: import_private_keys.globalStylesLinksDataKey,
  selectBlockPatternsKey: import_private_keys.selectBlockPatternsKey,
  requiresWrapperOnCopy: import_utils3.requiresWrapperOnCopy,
  PrivateRichText: import_rich_text.PrivateRichText,
  PrivateInserterLibrary: import_library.PrivateInserterLibrary,
  reusableBlocksSelectKey: import_private_keys.reusableBlocksSelectKey,
  PrivateBlockPopover: import_block_popover.PrivateBlockPopover,
  PrivatePublishDateTimePicker: import_publish_date_time_picker.PrivatePublishDateTimePicker,
  useSpacingSizes: import_use_spacing_sizes.default,
  useBlockDisplayTitle: import_use_block_display_title.default,
  __unstableBlockStyleVariationOverridesWithConfig: import_hooks.__unstableBlockStyleVariationOverridesWithConfig,
  setBackgroundStyleDefaults: import_hooks.setBackgroundStyleDefaults,
  sectionRootClientIdKey: import_private_keys.sectionRootClientIdKey,
  CommentIconSlotFill: import_block_comment_icon_slot.default,
  CommentIconToolbarSlotFill: import_block_comment_icon_toolbar_slot.default,
  mediaEditKey: import_private_keys.mediaEditKey,
  getMediaSelectKey: import_private_keys.getMediaSelectKey,
  deviceTypeKey: import_private_keys.deviceTypeKey,
  isIsolatedEditorKey: import_private_keys.isIsolatedEditorKey,
  isNavigationOverlayContextKey: import_private_keys.isNavigationOverlayContextKey,
  mediaUploadOnSuccessKey: import_private_keys.mediaUploadOnSuccessKey,
  useBlockElement: import_use_block_refs.useBlockElement,
  useBlockElementRef: import_use_block_refs.useBlockElementRef,
  LinkPicker: import_link_picker.LinkPicker,
  useRemoteUrlData: import_use_rich_url_data.default,
  PrivateBlockContext: import_private_block_context.PrivateBlockContext,
  useListViewPanelState: import_use_list_view_panel_state.default,
  isHashLink: import_is_url_like.isHashLink,
  isRelativePath: import_is_url_like.isRelativePath
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  privateApis
});
//# sourceMappingURL=private-apis.cjs.map
