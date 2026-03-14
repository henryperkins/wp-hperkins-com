// packages/editor/src/components/visual-editor/index.js
import clsx from "clsx";
import {
  BlockList,
  store as blockEditorStore,
  __unstableUseTypewriter as useTypewriter,
  __unstableUseTypingObserver as useTypingObserver,
  useSettings,
  RecursionProvider,
  privateApis as blockEditorPrivateApis,
  __experimentalUseResizeCanvas as useResizeCanvas
} from "@wordpress/block-editor";
import { useEffect, useRef, useMemo } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { parse } from "@wordpress/blocks";
import { store as coreStore } from "@wordpress/core-data";
import { useMergeRefs, useViewportMatch } from "@wordpress/compose";
import PostTitle from "../post-title/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import EditTemplateBlocksNotification from "./edit-template-blocks-notification.mjs";
import ResizableEditor from "../resizable-editor/index.mjs";
import useSelectNearestEditableBlock from "./use-select-nearest-editable-block.mjs";
import {
  NAVIGATION_POST_TYPE,
  PATTERN_POST_TYPE,
  TEMPLATE_PART_POST_TYPE,
  TEMPLATE_POST_TYPE,
  DESIGN_POST_TYPES
} from "../../store/constants.mjs";
import { useZoomOutModeExit } from "./use-zoom-out-mode-exit.mjs";
import { usePaddingAppender } from "./use-padding-appender.mjs";
import { useEditContentOnlySectionExit } from "./use-edit-content-only-section-exit.mjs";
import { SyncConnectionModal } from "../sync-connection-modal/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var {
  LayoutStyle,
  useLayoutClasses,
  useLayoutStyles,
  ExperimentalBlockCanvas: BlockCanvas,
  useFlashEditableBlocks
} = unlock(blockEditorPrivateApis);
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
  const isMobileViewport = useViewportMatch("small", "<");
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
  } = useSelect((select) => {
    const {
      getCurrentPostId,
      getCurrentPostType,
      getCurrentTemplateId,
      getEditorSettings,
      getRenderingMode,
      getDeviceType,
      getCanvasMinHeight
    } = unlock(select(editorStore));
    const { getPostType, getEditedEntityRecord } = select(coreStore);
    const postTypeSlug = getCurrentPostType();
    const _renderingMode = getRenderingMode();
    let _wrapperBlockName;
    if (postTypeSlug === PATTERN_POST_TYPE) {
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
      TEMPLATE_POST_TYPE,
      currentTemplateId
    ) : void 0;
    return {
      renderingMode: _renderingMode,
      postContentAttributes: editorSettings.postContentAttributes,
      isDesignPostType: DESIGN_POST_TYPES.includes(postTypeSlug),
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
  const { isCleanNewPost } = useSelect(editorStore);
  const {
    hasRootPaddingAwareAlignments,
    themeHasDisabledLayoutStyles,
    themeSupportsLayout,
    isZoomedOut
  } = useSelect((select) => {
    const { getSettings, isZoomOut: _isZoomOut } = unlock(
      select(blockEditorStore)
    );
    const _settings = getSettings();
    return {
      themeHasDisabledLayoutStyles: _settings.disableLayoutStyles,
      themeSupportsLayout: _settings.supportsLayout,
      hasRootPaddingAwareAlignments: _settings.__experimentalFeatures?.useRootPaddingAwareAlignments,
      isZoomedOut: _isZoomOut()
    };
  }, []);
  const localRef = useRef();
  const deviceStyles = useResizeCanvas(deviceType);
  const [globalLayoutSettings] = useSettings("layout");
  const fallbackLayout = useMemo(() => {
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
  const newestPostContentAttributes = useMemo(() => {
    if (!editedPostTemplate?.content && !editedPostTemplate?.blocks && postContentAttributes) {
      return postContentAttributes;
    }
    if (editedPostTemplate?.blocks) {
      return getPostContentAttributes(editedPostTemplate?.blocks);
    }
    const parseableContent = typeof editedPostTemplate?.content === "string" ? editedPostTemplate?.content : "";
    return getPostContentAttributes(parse(parseableContent)) || {};
  }, [
    editedPostTemplate?.content,
    editedPostTemplate?.blocks,
    postContentAttributes
  ]);
  const hasPostContentAtRootLevel = useMemo(() => {
    if (!editedPostTemplate?.content && !editedPostTemplate?.blocks) {
      return false;
    }
    if (editedPostTemplate?.blocks) {
      return checkForPostContentAtRootLevel(editedPostTemplate?.blocks);
    }
    const parseableContent = typeof editedPostTemplate?.content === "string" ? editedPostTemplate?.content : "";
    return checkForPostContentAtRootLevel(parse(parseableContent)) || false;
  }, [editedPostTemplate?.content, editedPostTemplate?.blocks]);
  const { layout = {}, align = "" } = newestPostContentAttributes || {};
  const postContentLayoutClasses = useLayoutClasses(
    newestPostContentAttributes,
    "core/post-content"
  );
  const blockListLayoutClass = clsx(
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
  const postContentLayout = useMemo(() => {
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
  const observeTypingRef = useTypingObserver();
  const titleRef = useRef();
  useEffect(() => {
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
    NAVIGATION_POST_TYPE,
    TEMPLATE_PART_POST_TYPE,
    PATTERN_POST_TYPE
  ].includes(postType) && // Disable in previews / view mode.
  !isPreview && // Disable resizing in mobile viewport.
  !isMobileViewport && // Disable resizing in zoomed-out mode.
  !isZoomedOut;
  const isNavigationPreview = postType === NAVIGATION_POST_TYPE && isPreview;
  const calculatedMinHeight = useMemo(() => {
    if (!localRef.current) {
      return canvasMinHeight;
    }
    const { ownerDocument } = localRef.current;
    const scrollTop = ownerDocument.documentElement.scrollTop || ownerDocument.body.scrollTop;
    return canvasMinHeight + scrollTop;
  }, [canvasMinHeight]);
  const [paddingAppenderRef, paddingStyle] = usePaddingAppender(
    !isPreview && renderingMode === "post-only" && !isDesignPostType
  );
  const centerContentCSS = `display:flex;align-items:center;justify-content:center;`;
  const iframeStyles = useMemo(() => {
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
  const typewriterRef = useTypewriter();
  contentRef = useMergeRefs([
    localRef,
    contentRef,
    renderingMode === "post-only" ? typewriterRef : null,
    useFlashEditableBlocks({
      isEnabled: renderingMode === "template-locked"
    }),
    useSelectNearestEditableBlock({
      isEnabled: renderingMode === "template-locked"
    }),
    useZoomOutModeExit(),
    paddingAppenderRef,
    useEditContentOnlySectionExit()
  ]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
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
        /* @__PURE__ */ jsx(SyncConnectionModal, {}),
        /* @__PURE__ */ jsx(ResizableEditor, { enableResizing, height: "100%", children: /* @__PURE__ */ jsxs(
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
              themeSupportsLayout && !themeHasDisabledLayoutStyles && renderingMode === "post-only" && !isDesignPostType && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  LayoutStyle,
                  {
                    selector: ".editor-visual-editor__post-title-wrapper",
                    layout: fallbackLayout
                  }
                ),
                /* @__PURE__ */ jsx(
                  LayoutStyle,
                  {
                    selector: ".block-editor-block-list__layout.is-root-container",
                    layout: postEditorLayout
                  }
                ),
                align && /* @__PURE__ */ jsx(LayoutStyle, { css: alignCSS }),
                postContentLayoutStyles && /* @__PURE__ */ jsx(
                  LayoutStyle,
                  {
                    layout: postContentLayout,
                    css: postContentLayoutStyles
                  }
                )
              ] }),
              renderingMode === "post-only" && !isDesignPostType && /* @__PURE__ */ jsx(
                "div",
                {
                  className: clsx(
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
                  children: /* @__PURE__ */ jsx(PostTitle, { ref: titleRef })
                }
              ),
              /* @__PURE__ */ jsxs(
                RecursionProvider,
                {
                  blockName: wrapperBlockName,
                  uniqueId: wrapperUniqueId,
                  children: [
                    /* @__PURE__ */ jsx(
                      BlockList,
                      {
                        className: clsx(
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
                    renderingMode === "template-locked" && /* @__PURE__ */ jsx(
                      EditTemplateBlocksNotification,
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
export {
  visual_editor_default as default
};
//# sourceMappingURL=index.mjs.map
