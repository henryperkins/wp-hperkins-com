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

// packages/editor/src/components/visual-editor/index.js
var visual_editor_exports = {};
__export(visual_editor_exports, {
  default: () => visual_editor_default
});
module.exports = __toCommonJS(visual_editor_exports);
var import_clsx = __toESM(require("clsx"));
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_core_data = require("@wordpress/core-data");
var import_compose = require("@wordpress/compose");
var import_post_title = __toESM(require("../post-title/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_edit_template_blocks_notification = __toESM(require("./edit-template-blocks-notification.cjs"));
var import_resizable_editor = __toESM(require("../resizable-editor/index.cjs"));
var import_use_select_nearest_editable_block = __toESM(require("./use-select-nearest-editable-block.cjs"));
var import_constants = require("../../store/constants.cjs");
var import_use_zoom_out_mode_exit = require("./use-zoom-out-mode-exit.cjs");
var import_use_padding_appender = require("./use-padding-appender.cjs");
var import_use_edit_content_only_section_exit = require("./use-edit-content-only-section-exit.cjs");
var import_sync_connection_modal = require("../sync-connection-modal/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var {
  LayoutStyle,
  useLayoutClasses,
  useLayoutStyles,
  ExperimentalBlockCanvas: BlockCanvas,
  useFlashEditableBlocks
} = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function getPostContentAttributes(blocks) {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].name === "core/post-content") {
      return blocks[i].attributes;
    }
    if (blocks[i].innerBlocks.length) {
      const nestedPostContent = getPostContentAttributes(
        blocks[i].innerBlocks
      );
      if (nestedPostContent) {
        return nestedPostContent;
      }
    }
  }
}
function checkForPostContentAtRootLevel(blocks) {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].name === "core/post-content") {
      return true;
    }
  }
  return false;
}
function VisualEditor({
  // Ideally as we unify post and site editors, we won't need these props.
  autoFocus,
  disableIframe = false,
  iframeProps,
  contentRef,
  className
}) {
  const isMobileViewport = (0, import_compose.useViewportMatch)("small", "<");
  const {
    renderingMode,
    postContentAttributes,
    editedPostTemplate = {},
    wrapperBlockName,
    wrapperUniqueId,
    deviceType,
    isFocusedEntity,
    isDesignPostType,
    postType,
    isPreview,
    styles,
    canvasMinHeight
  } = (0, import_data.useSelect)((select) => {
    const {
      getCurrentPostId,
      getCurrentPostType,
      getCurrentTemplateId,
      getEditorSettings,
      getRenderingMode,
      getDeviceType,
      getCanvasMinHeight
    } = (0, import_lock_unlock.unlock)(select(import_store.store));
    const { getPostType, getEditedEntityRecord } = select(import_core_data.store);
    const postTypeSlug = getCurrentPostType();
    const _renderingMode = getRenderingMode();
    let _wrapperBlockName;
    if (postTypeSlug === import_constants.PATTERN_POST_TYPE) {
      _wrapperBlockName = "core/block";
    } else if (_renderingMode === "post-only") {
      _wrapperBlockName = "core/post-content";
    }
    const editorSettings = getEditorSettings();
    const supportsTemplateMode = editorSettings.supportsTemplateMode;
    const postTypeObject = getPostType(postTypeSlug);
    const currentTemplateId = getCurrentTemplateId();
    const template = currentTemplateId ? getEditedEntityRecord(
      "postType",
      import_constants.TEMPLATE_POST_TYPE,
      currentTemplateId
    ) : void 0;
    return {
      renderingMode: _renderingMode,
      postContentAttributes: editorSettings.postContentAttributes,
      isDesignPostType: import_constants.DESIGN_POST_TYPES.includes(postTypeSlug),
      // Post template fetch returns a 404 on classic themes, which
      // messes with e2e tests, so check it's a block theme first.
      editedPostTemplate: postTypeObject?.viewable && supportsTemplateMode ? template : void 0,
      wrapperBlockName: _wrapperBlockName,
      wrapperUniqueId: getCurrentPostId(),
      deviceType: getDeviceType(),
      isFocusedEntity: !!editorSettings.onNavigateToPreviousEntityRecord,
      postType: postTypeSlug,
      isPreview: editorSettings.isPreviewMode,
      styles: editorSettings.styles,
      canvasMinHeight: getCanvasMinHeight()
    };
  }, []);
  const { isCleanNewPost } = (0, import_data.useSelect)(import_store.store);
  const {
    hasRootPaddingAwareAlignments,
    themeHasDisabledLayoutStyles,
    themeSupportsLayout,
    isZoomedOut
  } = (0, import_data.useSelect)((select) => {
    const { getSettings, isZoomOut: _isZoomOut } = (0, import_lock_unlock.unlock)(
      select(import_block_editor.store)
    );
    const _settings = getSettings();
    return {
      themeHasDisabledLayoutStyles: _settings.disableLayoutStyles,
      themeSupportsLayout: _settings.supportsLayout,
      hasRootPaddingAwareAlignments: _settings.__experimentalFeatures?.useRootPaddingAwareAlignments,
      isZoomedOut: _isZoomOut()
    };
  }, []);
  const localRef = (0, import_element.useRef)();
  const deviceStyles = (0, import_block_editor.__experimentalUseResizeCanvas)(deviceType);
  const [globalLayoutSettings] = (0, import_block_editor.useSettings)("layout");
  const fallbackLayout = (0, import_element.useMemo)(() => {
    if (renderingMode !== "post-only" || isDesignPostType) {
      return { type: "default" };
    }
    if (themeSupportsLayout) {
      return { ...globalLayoutSettings, type: "constrained" };
    }
    return { type: "default" };
  }, [
    renderingMode,
    themeSupportsLayout,
    globalLayoutSettings,
    isDesignPostType
  ]);
  const newestPostContentAttributes = (0, import_element.useMemo)(() => {
    if (!editedPostTemplate?.content && !editedPostTemplate?.blocks && postContentAttributes) {
      return postContentAttributes;
    }
    if (editedPostTemplate?.blocks) {
      return getPostContentAttributes(editedPostTemplate?.blocks);
    }
    const parseableContent = typeof editedPostTemplate?.content === "string" ? editedPostTemplate?.content : "";
    return getPostContentAttributes((0, import_blocks.parse)(parseableContent)) || {};
  }, [
    editedPostTemplate?.content,
    editedPostTemplate?.blocks,
    postContentAttributes
  ]);
  const hasPostContentAtRootLevel = (0, import_element.useMemo)(() => {
    if (!editedPostTemplate?.content && !editedPostTemplate?.blocks) {
      return false;
    }
    if (editedPostTemplate?.blocks) {
      return checkForPostContentAtRootLevel(editedPostTemplate?.blocks);
    }
    const parseableContent = typeof editedPostTemplate?.content === "string" ? editedPostTemplate?.content : "";
    return checkForPostContentAtRootLevel((0, import_blocks.parse)(parseableContent)) || false;
  }, [editedPostTemplate?.content, editedPostTemplate?.blocks]);
  const { layout = {}, align = "" } = newestPostContentAttributes || {};
  const postContentLayoutClasses = useLayoutClasses(
    newestPostContentAttributes,
    "core/post-content"
  );
  const blockListLayoutClass = (0, import_clsx.default)(
    {
      "is-layout-flow": !themeSupportsLayout
    },
    themeSupportsLayout && postContentLayoutClasses,
    align && `align${align}`
  );
  const postContentLayoutStyles = useLayoutStyles(
    newestPostContentAttributes,
    "core/post-content",
    ".block-editor-block-list__layout.is-root-container"
  );
  const postContentLayout = (0, import_element.useMemo)(() => {
    return layout && (layout?.type === "constrained" || layout?.inherit || layout?.contentSize || layout?.wideSize) ? { ...globalLayoutSettings, ...layout, type: "constrained" } : { ...globalLayoutSettings, ...layout, type: "default" };
  }, [
    layout?.type,
    layout?.inherit,
    layout?.contentSize,
    layout?.wideSize,
    globalLayoutSettings
  ]);
  const blockListLayout = postContentAttributes ? postContentLayout : fallbackLayout;
  const postEditorLayout = blockListLayout?.type === "default" && !hasPostContentAtRootLevel ? fallbackLayout : blockListLayout;
  const observeTypingRef = (0, import_block_editor.__unstableUseTypingObserver)();
  const titleRef = (0, import_element.useRef)();
  (0, import_element.useEffect)(() => {
    if (!autoFocus || !isCleanNewPost()) {
      return;
    }
    titleRef?.current?.focus();
  }, [autoFocus, isCleanNewPost]);
  const alignCSS = `.is-root-container.alignwide { max-width: var(--wp--style--global--wide-size); margin-left: auto; margin-right: auto;}
		.is-root-container.alignwide:where(.is-layout-flow) > :not(.alignleft):not(.alignright) { max-width: var(--wp--style--global--wide-size);}
		.is-root-container.alignfull { max-width: none; margin-left: auto; margin-right: auto;}
		.is-root-container.alignfull:where(.is-layout-flow) > :not(.alignleft):not(.alignright) { max-width: none;}`;
  const enableResizing = [
    import_constants.NAVIGATION_POST_TYPE,
    import_constants.TEMPLATE_PART_POST_TYPE,
    import_constants.PATTERN_POST_TYPE
  ].includes(postType) && // Disable in previews / view mode.
  !isPreview && // Disable resizing in mobile viewport.
  !isMobileViewport && // Disable resizing in zoomed-out mode.
  !isZoomedOut;
  const isNavigationPreview = postType === import_constants.NAVIGATION_POST_TYPE && isPreview;
  const calculatedMinHeight = (0, import_element.useMemo)(() => {
    if (!localRef.current) {
      return canvasMinHeight;
    }
    const { ownerDocument } = localRef.current;
    const scrollTop = ownerDocument.documentElement.scrollTop || ownerDocument.body.scrollTop;
    return canvasMinHeight + scrollTop;
  }, [canvasMinHeight]);
  const [paddingAppenderRef, paddingStyle] = (0, import_use_padding_appender.usePaddingAppender)(
    !isPreview && renderingMode === "post-only" && !isDesignPostType
  );
  const centerContentCSS = `display:flex;align-items:center;justify-content:center;`;
  const iframeStyles = (0, import_element.useMemo)(() => {
    return [
      ...styles ?? [],
      {
        // Ensures margins of children are contained so that the body background paints behind them.
        // Otherwise, the background of html (when zoomed out) would show there and appear broken. It's
        // important mostly for post-only views yet conceivably an issue in templated views too.
        css: `:where(.block-editor-iframe__body){display:flow-root;${calculatedMinHeight ? `min-height:${calculatedMinHeight}px;` : ""}}.is-root-container{display:flow-root;${// Some themes will have `min-height: 100vh` for the root container,
        // which isn't a requirement in auto resize mode.
        enableResizing || isNavigationPreview ? "min-height:0!important;" : ""}}
				${paddingStyle ? paddingStyle : ""}
				${enableResizing ? `.block-editor-iframe__html{background:var(--wp-editor-canvas-background);min-height:100vh;${centerContentCSS}}.block-editor-iframe__body{width:100%;}` : ""}${isNavigationPreview ? `.block-editor-iframe__body{${centerContentCSS}}` : ""}`
        // The CSS for enableResizing centers the body content vertically when resizing is enabled and applies a background
        // color to the iframe HTML element to match the background color of the editor canvas.
        // The CSS for isNavigationPreview centers the body content vertically and horizontally when the navigation is in preview mode.
      }
    ];
  }, [
    styles,
    enableResizing,
    isNavigationPreview,
    calculatedMinHeight,
    paddingStyle
  ]);
  const typewriterRef = (0, import_block_editor.__unstableUseTypewriter)();
  contentRef = (0, import_compose.useMergeRefs)([
    localRef,
    contentRef,
    renderingMode === "post-only" ? typewriterRef : null,
    useFlashEditableBlocks({
      isEnabled: renderingMode === "template-locked"
    }),
    (0, import_use_select_nearest_editable_block.default)({
      isEnabled: renderingMode === "template-locked"
    }),
    (0, import_use_zoom_out_mode_exit.useZoomOutModeExit)(),
    paddingAppenderRef,
    (0, import_use_edit_content_only_section_exit.useEditContentOnlySectionExit)()
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: (0, import_clsx.default)(
        "editor-visual-editor",
        // this class is here for backward compatibility reasons.
        "edit-post-visual-editor",
        className,
        {
          "has-padding": isFocusedEntity || enableResizing,
          "is-resizable": enableResizing,
          "is-iframed": !disableIframe
        }
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sync_connection_modal.SyncConnectionModal, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_resizable_editor.default, { enableResizing, height: "100%", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          BlockCanvas,
          {
            shouldIframe: !disableIframe,
            contentRef,
            styles: iframeStyles,
            height: "100%",
            iframeProps: {
              ...iframeProps,
              style: {
                ...iframeProps?.style,
                ...deviceStyles
              }
            },
            children: [
              themeSupportsLayout && !themeHasDisabledLayoutStyles && renderingMode === "post-only" && !isDesignPostType && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  LayoutStyle,
                  {
                    selector: ".editor-visual-editor__post-title-wrapper",
                    layout: fallbackLayout
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  LayoutStyle,
                  {
                    selector: ".block-editor-block-list__layout.is-root-container",
                    layout: postEditorLayout
                  }
                ),
                align && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutStyle, { css: alignCSS }),
                postContentLayoutStyles && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  LayoutStyle,
                  {
                    layout: postContentLayout,
                    css: postContentLayoutStyles
                  }
                )
              ] }),
              renderingMode === "post-only" && !isDesignPostType && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "div",
                {
                  className: (0, import_clsx.default)(
                    "editor-visual-editor__post-title-wrapper",
                    // The following class is only here for backward compatibility
                    // some themes might be using it to style the post title.
                    "edit-post-visual-editor__post-title-wrapper",
                    {
                      "has-global-padding": hasRootPaddingAwareAlignments
                    }
                  ),
                  contentEditable: false,
                  ref: observeTypingRef,
                  style: {
                    // This is using inline styles
                    // so it's applied for both iframed and non iframed editors.
                    marginTop: "4rem"
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_title.default, { ref: titleRef })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                import_block_editor.RecursionProvider,
                {
                  blockName: wrapperBlockName,
                  uniqueId: wrapperUniqueId,
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_block_editor.BlockList,
                      {
                        className: (0, import_clsx.default)(
                          "is-" + deviceType.toLowerCase() + "-preview",
                          renderingMode !== "post-only" || isDesignPostType ? "wp-site-blocks" : `${blockListLayoutClass} wp-block-post-content`,
                          // Ensure root level blocks receive default/flow blockGap styling rules.
                          {
                            "has-global-padding": renderingMode === "post-only" && !isDesignPostType && hasRootPaddingAwareAlignments
                          }
                        ),
                        layout: blockListLayout,
                        dropZoneElement: (
                          // When iframed, pass in the html element of the iframe to
                          // ensure the drop zone extends to the edges of the iframe.
                          disableIframe ? localRef.current : localRef.current?.parentNode
                        ),
                        __unstableDisableDropZone: (
                          // In template preview mode, disable drop zones at the root of the template.
                          renderingMode === "template-locked" ? true : false
                        )
                      }
                    ),
                    renderingMode === "template-locked" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      import_edit_template_blocks_notification.default,
                      {
                        contentRef: localRef
                      }
                    )
                  ]
                }
              )
            ]
          }
        ) })
      ]
    }
  );
}
var visual_editor_default = VisualEditor;
//# sourceMappingURL=index.cjs.map
