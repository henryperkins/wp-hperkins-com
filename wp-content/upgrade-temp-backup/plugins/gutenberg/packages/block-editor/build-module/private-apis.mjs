// packages/block-editor/src/private-apis.js
import * as globalStyles from "./components/global-styles/index.mjs";
import { ExperimentalBlockEditorProvider } from "./components/provider/index.mjs";
import { lock } from "./lock-unlock.mjs";
import { getRichTextValues } from "./components/rich-text/get-rich-text-values.mjs";
import ResizableBoxPopover from "./components/resizable-box-popover/index.mjs";
import { default as PrivateQuickInserter } from "./components/inserter/quick-inserter.mjs";
import {
  extractWords,
  getNormalizedSearchTerms,
  normalizeString
} from "./components/inserter/search-items.mjs";
import { PrivateListView } from "./components/list-view/index.mjs";
import InspectorControlsLastItem from "./components/inspector-controls/last-item.mjs";
import { useHasBlockToolbar } from "./components/block-toolbar/use-has-block-toolbar.mjs";
import { cleanEmptyObject, usePrivateStyleOverride } from "./hooks/utils.mjs";
import BlockQuickNavigation from "./components/block-quick-navigation/index.mjs";
import { LayoutStyle } from "./components/block-list/layout.mjs";
import BlockManager from "./components/block-manager/index.mjs";
import { BlockRemovalWarningModal } from "./components/block-removal-warning-modal/index.mjs";
import {
  setBackgroundStyleDefaults,
  useLayoutClasses,
  useLayoutStyles,
  __unstableBlockStyleVariationOverridesWithConfig,
  useZoomOut
} from "./hooks/index.mjs";
import DimensionsTool from "./components/dimensions-tool/index.mjs";
import ResolutionTool from "./components/resolution-tool/index.mjs";
import TextAlignmentControl from "./components/text-alignment-control/index.mjs";
import { usesContextKey } from "./components/rich-text/format-edit.mjs";
import {
  ExperimentalBlockCanvas,
  BlockCanvasCover
} from "./components/block-canvas/index.mjs";
import { getDuotoneFilter } from "./components/duotone/utils.mjs";
import { useFlashEditableBlocks } from "./components/use-flash-editable-blocks/index.mjs";
import {
  selectBlockPatternsKey,
  reusableBlocksSelectKey,
  globalStylesDataKey,
  globalStylesLinksDataKey,
  sectionRootClientIdKey,
  mediaEditKey,
  getMediaSelectKey,
  deviceTypeKey,
  isIsolatedEditorKey,
  isNavigationOverlayContextKey,
  mediaUploadOnSuccessKey
} from "./store/private-keys.mjs";
import { requiresWrapperOnCopy } from "./components/writing-flow/utils.mjs";
import { PrivateRichText } from "./components/rich-text/index.mjs";
import { PrivateBlockPopover } from "./components/block-popover/index.mjs";
import { PrivateInserterLibrary } from "./components/inserter/library.mjs";
import { PrivatePublishDateTimePicker } from "./components/publish-date-time-picker/index.mjs";
import useSpacingSizes from "./components/spacing-sizes-control/hooks/use-spacing-sizes.mjs";
import useBlockDisplayTitle from "./components/block-title/use-block-display-title.mjs";
import TabbedSidebar from "./components/tabbed-sidebar/index.mjs";
import CommentIconSlotFill from "./components/collab/block-comment-icon-slot.mjs";
import CommentIconToolbarSlotFill from "./components/collab/block-comment-icon-toolbar-slot.mjs";
import HTMLElementControl from "./components/html-element-control/index.mjs";
import {
  useBlockElementRef,
  useBlockElement
} from "./components/block-list/use-block-props/use-block-refs.mjs";
import { LinkPicker } from "./components/link-picker/index.mjs";
import useRemoteUrlData from "./components/link-control/use-rich-url-data.mjs";
import { PrivateBlockContext } from "./components/block-list/private-block-context.mjs";
import useListViewPanelState from "./components/use-list-view-panel-state/index.mjs";
import {
  isHashLink,
  isRelativePath
} from "./components/link-control/is-url-like.mjs";
var privateApis = {};
lock(privateApis, {
  ...globalStyles,
  ExperimentalBlockCanvas,
  BlockCanvasCover,
  ExperimentalBlockEditorProvider,
  getDuotoneFilter,
  getRichTextValues,
  PrivateQuickInserter,
  extractWords,
  getNormalizedSearchTerms,
  normalizeString,
  PrivateListView,
  ResizableBoxPopover,
  InspectorControlsLastItem,
  useHasBlockToolbar,
  cleanEmptyObject,
  usePrivateStyleOverride,
  BlockQuickNavigation,
  LayoutStyle,
  BlockManager,
  BlockRemovalWarningModal,
  useLayoutClasses,
  useLayoutStyles,
  DimensionsTool,
  ResolutionTool,
  TabbedSidebar,
  TextAlignmentControl,
  usesContextKey,
  useFlashEditableBlocks,
  HTMLElementControl,
  useZoomOut,
  globalStylesDataKey,
  globalStylesLinksDataKey,
  selectBlockPatternsKey,
  requiresWrapperOnCopy,
  PrivateRichText,
  PrivateInserterLibrary,
  reusableBlocksSelectKey,
  PrivateBlockPopover,
  PrivatePublishDateTimePicker,
  useSpacingSizes,
  useBlockDisplayTitle,
  __unstableBlockStyleVariationOverridesWithConfig,
  setBackgroundStyleDefaults,
  sectionRootClientIdKey,
  CommentIconSlotFill,
  CommentIconToolbarSlotFill,
  mediaEditKey,
  getMediaSelectKey,
  deviceTypeKey,
  isIsolatedEditorKey,
  isNavigationOverlayContextKey,
  mediaUploadOnSuccessKey,
  useBlockElement,
  useBlockElementRef,
  LinkPicker,
  useRemoteUrlData,
  PrivateBlockContext,
  useListViewPanelState,
  isHashLink,
  isRelativePath
});
export {
  privateApis
};
//# sourceMappingURL=private-apis.mjs.map
