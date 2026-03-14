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

// packages/editor/src/components/editor-interface/index.js
var editor_interface_exports = {};
__export(editor_interface_exports, {
  default: () => EditorInterface
});
module.exports = __toCommonJS(editor_interface_exports);
var import_clsx = __toESM(require("clsx"));
var import_interface = require("@wordpress/interface");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_preferences = require("@wordpress/preferences");
var import_block_editor = require("@wordpress/block-editor");
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_html_entities = require("@wordpress/html-entities");
var import_notices = require("@wordpress/notices");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_template_validation_notice = __toESM(require("../template-validation-notice/index.cjs"));
var import_header = __toESM(require("../header/index.cjs"));
var import_inserter_sidebar = __toESM(require("../inserter-sidebar/index.cjs"));
var import_list_view_sidebar = __toESM(require("../list-view-sidebar/index.cjs"));
var import_post_revisions_preview = require("../post-revisions-preview/index.cjs");
var import_collaborators_overlay = require("../collaborators-overlay/index.cjs");
var import_use_collaborator_notifications = require("../collaborators-presence/use-collaborator-notifications.cjs");
var import_save_publish_panels = __toESM(require("../save-publish-panels/index.cjs"));
var import_text_editor = __toESM(require("../text-editor/index.cjs"));
var import_visual_editor = __toESM(require("../visual-editor/index.cjs"));
var import_styles_canvas = __toESM(require("../styles-canvas/index.cjs"));
var import_media = require("../media/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var interfaceLabels = {
  /* translators: accessibility text for the editor top bar landmark region. */
  header: (0, import_i18n.__)("Editor top bar"),
  /* translators: accessibility text for the editor content landmark region. */
  body: (0, import_i18n.__)("Editor content"),
  /* translators: accessibility text for the editor settings landmark region. */
  sidebar: (0, import_i18n.__)("Editor settings"),
  /* translators: accessibility text for the editor publish landmark region. */
  actions: (0, import_i18n.__)("Editor publish"),
  /* translators: accessibility text for the editor footer landmark region. */
  footer: (0, import_i18n.__)("Editor footer")
};
var Notices = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
  import_notices.InlineNotices,
  {
    pinnedNoticesClassName: "editor-notices__pinned",
    dismissibleNoticesClassName: "editor-notices__dismissible",
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_template_validation_notice.default, {})
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
  } = (0, import_data.useSelect)((select) => {
    const { get } = select(import_preferences.store);
    const {
      getEditorSettings,
      getPostTypeLabel,
      getCurrentPostType,
      getCurrentPostId
    } = select(import_store.store);
    const {
      getStylesPath,
      getShowStylebook,
      isRevisionsMode: _isRevisionsMode
    } = (0, import_lock_unlock.unlock)(select(import_store.store));
    const editorSettings = getEditorSettings();
    let _mode = select(import_store.store).getEditorMode();
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
      isInserterOpened: select(import_store.store).isInserterOpened(),
      isListViewOpened: select(import_store.store).isListViewOpened(),
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
  (0, import_use_collaborator_notifications.useCollaboratorNotifications)(postId, postType);
  const isLargeViewport = (0, import_compose.useViewportMatch)("medium");
  const secondarySidebarLabel = isListViewOpened ? (0, import_i18n.__)("Document Overview") : (0, import_i18n.__)("Block Library");
  const shouldShowMediaEditor = !!isAttachment;
  const shouldShowStylesCanvas = !isAttachment && (showStylebook || stylesPath?.startsWith("/revisions"));
  const shouldShowBlockEditor = !shouldShowMediaEditor && !shouldShowStylesCanvas;
  const [entitiesSavedStatesCallback, setEntitiesSavedStatesCallback] = (0, import_element.useState)(false);
  const closeEntitiesSavedStates = (0, import_element.useCallback)(
    (arg) => {
      if (typeof entitiesSavedStatesCallback === "function") {
        entitiesSavedStatesCallback(arg);
      }
      setEntitiesSavedStatesCallback(false);
    },
    [entitiesSavedStatesCallback]
  );
  const [showDiff, setShowDiff] = (0, import_element.useState)(true);
  if (isRevisionsMode) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_interface.InterfaceSkeleton,
      {
        className: (0, import_clsx.default)("editor-editor-interface", className),
        labels: interfaceLabels,
        header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_post_revisions_preview.RevisionsHeader,
          {
            showDiff,
            onToggleDiff: () => setShowDiff(!showDiff)
          }
        ),
        content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_revisions_preview.RevisionsCanvas, { showDiff }),
        sidebar: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_interface.ComplementaryArea.Slot, { scope: "core" })
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_interface.InterfaceSkeleton,
    {
      isDistractionFree,
      className: (0, import_clsx.default)("editor-editor-interface", className, {
        "is-entity-save-view-open": !!entitiesSavedStatesCallback,
        "is-distraction-free": isDistractionFree && !isPreviewMode
      }),
      labels: {
        ...interfaceLabels,
        secondarySidebar: secondarySidebarLabel
      },
      header: !isPreviewMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_header.default,
        {
          forceIsDirty,
          setEntitiesSavedStatesCallback,
          customSaveButton,
          forceDisableBlockTools
        }
      ),
      editorNotices: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notices, {}),
      secondarySidebar: !isAttachment && !isPreviewMode && mode === "visual" && (isInserterOpened && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inserter_sidebar.default, {}) || isListViewOpened && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_list_view_sidebar.default, {})),
      sidebar: !isPreviewMode && !isDistractionFree && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_interface.ComplementaryArea.Slot, { scope: "core" }),
      content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        !isDistractionFree && !isPreviewMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notices, {}),
        shouldShowMediaEditor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_media.MediaPreview, { ...iframeProps }),
        shouldShowStylesCanvas && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_styles_canvas.default, {}),
        shouldShowBlockEditor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          !isPreviewMode && mode === "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_text_editor.default,
            {
              autoFocus
            }
          ),
          !isPreviewMode && !isLargeViewport && mode === "visual" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockToolbar, { hideDragHandle: true }),
          (isPreviewMode || mode === "visual") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_visual_editor.default,
            {
              contentRef,
              disableIframe,
              autoFocus,
              iframeProps
            }
          ),
          children,
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_collaborators_overlay.CollaboratorsOverlay,
            {
              postId,
              postType
            }
          )
        ] })
      ] }),
      footer: !isPreviewMode && !isDistractionFree && isLargeViewport && showBlockBreadcrumbs && mode === "visual" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.BlockBreadcrumb,
        {
          rootLabelText: postTypeLabel ? (0, import_html_entities.decodeEntities)(postTypeLabel) : void 0
        }
      ),
      actions: !isPreviewMode ? customSavePanel || /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_save_publish_panels.default,
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
//# sourceMappingURL=index.cjs.map
