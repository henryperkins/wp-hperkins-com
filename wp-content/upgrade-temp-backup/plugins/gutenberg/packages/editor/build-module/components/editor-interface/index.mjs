// packages/editor/src/components/editor-interface/index.js
import clsx from "clsx";
import { InterfaceSkeleton, ComplementaryArea } from "@wordpress/interface";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { store as preferencesStore } from "@wordpress/preferences";
import { BlockBreadcrumb, BlockToolbar } from "@wordpress/block-editor";
import { useViewportMatch } from "@wordpress/compose";
import { useState, useCallback } from "@wordpress/element";
import { decodeEntities } from "@wordpress/html-entities";
import { InlineNotices } from "@wordpress/notices";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import TemplateValidationNotice from "../template-validation-notice/index.mjs";
import Header from "../header/index.mjs";
import InserterSidebar from "../inserter-sidebar/index.mjs";
import ListViewSidebar from "../list-view-sidebar/index.mjs";
import { RevisionsHeader, RevisionsCanvas } from "../post-revisions-preview/index.mjs";
import { CollaboratorsOverlay } from "../collaborators-overlay/index.mjs";
import { useCollaboratorNotifications } from "../collaborators-presence/use-collaborator-notifications.mjs";
import SavePublishPanels from "../save-publish-panels/index.mjs";
import TextEditor from "../text-editor/index.mjs";
import VisualEditor from "../visual-editor/index.mjs";
import StylesCanvas from "../styles-canvas/index.mjs";
import { MediaPreview } from "../media/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var interfaceLabels = {
  /* translators: accessibility text for the editor top bar landmark region. */
  header: __("Editor top bar"),
  /* translators: accessibility text for the editor content landmark region. */
  body: __("Editor content"),
  /* translators: accessibility text for the editor settings landmark region. */
  sidebar: __("Editor settings"),
  /* translators: accessibility text for the editor publish landmark region. */
  actions: __("Editor publish"),
  /* translators: accessibility text for the editor footer landmark region. */
  footer: __("Editor footer")
};
var Notices = () => /* @__PURE__ */ jsx(
  InlineNotices,
  {
    pinnedNoticesClassName: "editor-notices__pinned",
    dismissibleNoticesClassName: "editor-notices__dismissible",
    children: /* @__PURE__ */ jsx(TemplateValidationNotice, {})
  }
);
function EditorInterface({
  className,
  children,
  forceIsDirty,
  contentRef,
  disableIframe,
  autoFocus,
  customSaveButton,
  customSavePanel,
  forceDisableBlockTools,
  iframeProps
}) {
  const {
    mode,
    postId,
    postType,
    isAttachment,
    isInserterOpened,
    isListViewOpened,
    isDistractionFree,
    isPreviewMode,
    showBlockBreadcrumbs,
    postTypeLabel,
    stylesPath,
    showStylebook,
    isRevisionsMode
  } = useSelect((select) => {
    const { get } = select(preferencesStore);
    const {
      getEditorSettings,
      getPostTypeLabel,
      getCurrentPostType,
      getCurrentPostId
    } = select(editorStore);
    const {
      getStylesPath,
      getShowStylebook,
      isRevisionsMode: _isRevisionsMode
    } = unlock(select(editorStore));
    const editorSettings = getEditorSettings();
    let _mode = select(editorStore).getEditorMode();
    if (!editorSettings.richEditingEnabled && _mode === "visual") {
      _mode = "text";
    }
    if (!editorSettings.codeEditingEnabled && _mode === "text") {
      _mode = "visual";
    }
    return {
      mode: _mode,
      postId: getCurrentPostId(),
      postType: getCurrentPostType(),
      isInserterOpened: select(editorStore).isInserterOpened(),
      isListViewOpened: select(editorStore).isListViewOpened(),
      isDistractionFree: get("core", "distractionFree"),
      isPreviewMode: editorSettings.isPreviewMode,
      showBlockBreadcrumbs: get("core", "showBlockBreadcrumbs"),
      postTypeLabel: getPostTypeLabel(),
      stylesPath: getStylesPath(),
      showStylebook: getShowStylebook(),
      isAttachment: getCurrentPostType() === "attachment" && window?.__experimentalMediaEditor,
      isRevisionsMode: _isRevisionsMode()
    };
  }, []);
  useCollaboratorNotifications(postId, postType);
  const isLargeViewport = useViewportMatch("medium");
  const secondarySidebarLabel = isListViewOpened ? __("Document Overview") : __("Block Library");
  const shouldShowMediaEditor = !!isAttachment;
  const shouldShowStylesCanvas = !isAttachment && (showStylebook || stylesPath?.startsWith("/revisions"));
  const shouldShowBlockEditor = !shouldShowMediaEditor && !shouldShowStylesCanvas;
  const [entitiesSavedStatesCallback, setEntitiesSavedStatesCallback] = useState(false);
  const closeEntitiesSavedStates = useCallback(
    (arg) => {
      if (typeof entitiesSavedStatesCallback === "function") {
        entitiesSavedStatesCallback(arg);
      }
      setEntitiesSavedStatesCallback(false);
    },
    [entitiesSavedStatesCallback]
  );
  const [showDiff, setShowDiff] = useState(true);
  if (isRevisionsMode) {
    return /* @__PURE__ */ jsx(
      InterfaceSkeleton,
      {
        className: clsx("editor-editor-interface", className),
        labels: interfaceLabels,
        header: /* @__PURE__ */ jsx(
          RevisionsHeader,
          {
            showDiff,
            onToggleDiff: () => setShowDiff(!showDiff)
          }
        ),
        content: /* @__PURE__ */ jsx(RevisionsCanvas, { showDiff }),
        sidebar: /* @__PURE__ */ jsx(ComplementaryArea.Slot, { scope: "core" })
      }
    );
  }
  return /* @__PURE__ */ jsx(
    InterfaceSkeleton,
    {
      isDistractionFree,
      className: clsx("editor-editor-interface", className, {
        "is-entity-save-view-open": !!entitiesSavedStatesCallback,
        "is-distraction-free": isDistractionFree && !isPreviewMode
      }),
      labels: {
        ...interfaceLabels,
        secondarySidebar: secondarySidebarLabel
      },
      header: !isPreviewMode && /* @__PURE__ */ jsx(
        Header,
        {
          forceIsDirty,
          setEntitiesSavedStatesCallback,
          customSaveButton,
          forceDisableBlockTools
        }
      ),
      editorNotices: /* @__PURE__ */ jsx(Notices, {}),
      secondarySidebar: !isAttachment && !isPreviewMode && mode === "visual" && (isInserterOpened && /* @__PURE__ */ jsx(InserterSidebar, {}) || isListViewOpened && /* @__PURE__ */ jsx(ListViewSidebar, {})),
      sidebar: !isPreviewMode && !isDistractionFree && /* @__PURE__ */ jsx(ComplementaryArea.Slot, { scope: "core" }),
      content: /* @__PURE__ */ jsxs(Fragment, { children: [
        !isDistractionFree && !isPreviewMode && /* @__PURE__ */ jsx(Notices, {}),
        shouldShowMediaEditor && /* @__PURE__ */ jsx(MediaPreview, { ...iframeProps }),
        shouldShowStylesCanvas && /* @__PURE__ */ jsx(StylesCanvas, {}),
        shouldShowBlockEditor && /* @__PURE__ */ jsxs(Fragment, { children: [
          !isPreviewMode && mode === "text" && /* @__PURE__ */ jsx(
            TextEditor,
            {
              autoFocus
            }
          ),
          !isPreviewMode && !isLargeViewport && mode === "visual" && /* @__PURE__ */ jsx(BlockToolbar, { hideDragHandle: true }),
          (isPreviewMode || mode === "visual") && /* @__PURE__ */ jsx(
            VisualEditor,
            {
              contentRef,
              disableIframe,
              autoFocus,
              iframeProps
            }
          ),
          children,
          /* @__PURE__ */ jsx(
            CollaboratorsOverlay,
            {
              postId,
              postType
            }
          )
        ] })
      ] }),
      footer: !isPreviewMode && !isDistractionFree && isLargeViewport && showBlockBreadcrumbs && mode === "visual" && /* @__PURE__ */ jsx(
        BlockBreadcrumb,
        {
          rootLabelText: postTypeLabel ? decodeEntities(postTypeLabel) : void 0
        }
      ),
      actions: !isPreviewMode ? customSavePanel || /* @__PURE__ */ jsx(
        SavePublishPanels,
        {
          closeEntitiesSavedStates,
          isEntitiesSavedStatesOpen: entitiesSavedStatesCallback,
          setEntitiesSavedStatesCallback,
          forceIsDirtyPublishPanel: forceIsDirty
        }
      ) : void 0
    }
  );
}
export {
  EditorInterface as default
};
//# sourceMappingURL=index.mjs.map
