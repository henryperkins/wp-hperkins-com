// packages/edit-post/src/components/layout/index.js
import clsx from "clsx";
import { NavigableRegion } from "@wordpress/admin-ui";
import {
  AutosaveMonitor,
  LocalAutosaveMonitor,
  UnsavedChangesWarning,
  EditorKeyboardShortcutsRegister,
  ErrorBoundary,
  PostLockedModal,
  store as editorStore,
  privateApis as editorPrivateApis
} from "@wordpress/editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { getLayoutStyles } from "@wordpress/global-styles-engine";
import { PluginArea } from "@wordpress/plugins";
import { __, sprintf } from "@wordpress/i18n";
import {
  useCallback,
  useMemo,
  useId,
  useRef,
  useState
} from "@wordpress/element";
import { chevronDown, chevronUp } from "@wordpress/icons";
import { SnackbarNotices, store as noticesStore } from "@wordpress/notices";
import { store as preferencesStore } from "@wordpress/preferences";
import { privateApis as commandsPrivateApis } from "@wordpress/commands";
import { privateApis as blockLibraryPrivateApis } from "@wordpress/block-library";
import { addQueryArgs } from "@wordpress/url";
import { decodeEntities } from "@wordpress/html-entities";
import { store as coreStore } from "@wordpress/core-data";
import {
  Icon,
  SlotFillProvider,
  Tooltip,
  VisuallyHidden,
  __unstableUseNavigateRegions as useNavigateRegions,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import {
  useMediaQuery,
  useMergeRefs,
  useRefEffect,
  useViewportMatch
} from "@wordpress/compose";
import BackButton from "../back-button/index.mjs";
import EditorInitialization from "../editor-initialization/index.mjs";
import EditPostKeyboardShortcuts from "../keyboard-shortcuts/index.mjs";
import InitPatternModal from "../init-pattern-modal/index.mjs";
import BrowserURL from "../browser-url/index.mjs";
import MetaBoxes from "../meta-boxes/index.mjs";
import PostEditorMoreMenu from "../more-menu/index.mjs";
import WelcomeGuide from "../welcome-guide/index.mjs";
import { store as editPostStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import useEditPostCommands from "../../commands/use-commands.mjs";
import { useShouldIframe } from "./use-should-iframe.mjs";
import useNavigateToEntityRecord from "../../hooks/use-navigate-to-entity-record.mjs";
import { useMetaBoxInitialization } from "../meta-boxes/use-meta-box-initialization.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useCommandContext } = unlock(commandsPrivateApis);
var { useDrag } = unlock(componentsPrivateApis);
var { Editor, FullscreenMode } = unlock(editorPrivateApis);
var { BlockKeyboardShortcuts } = unlock(blockLibraryPrivateApis);
var DESIGN_POST_TYPES = [
  "wp_template",
  "wp_template_part",
  "wp_block",
  "wp_navigation"
];
function useEditorStyles(settings) {
  const { hasThemeStyleSupport } = useSelect((select) => {
    return {
      hasThemeStyleSupport: select(editPostStore).isFeatureActive("themeStyles")
    };
  }, []);
  return useMemo(() => {
    const presetStyles = settings.styles?.filter(
      (style) => style.__unstableType && style.__unstableType !== "theme"
    ) ?? [];
    const defaultEditorStyles = [
      ...settings?.defaultEditorStyles ?? [],
      ...presetStyles
    ];
    const hasThemeStyles = hasThemeStyleSupport && presetStyles.length !== (settings.styles?.length ?? 0);
    if (!settings.disableLayoutStyles && !hasThemeStyles) {
      defaultEditorStyles.push({
        css: getLayoutStyles({
          style: {},
          selector: "body",
          hasBlockGapSupport: false,
          hasFallbackGapSupport: true,
          fallbackGapValue: "0.5em"
        })
      });
    }
    return hasThemeStyles ? settings.styles ?? [] : defaultEditorStyles;
  }, [
    settings.defaultEditorStyles,
    settings.disableLayoutStyles,
    settings.styles,
    hasThemeStyleSupport
  ]);
}
function MetaBoxesMain({ isLegacy }) {
  const [isOpen, openHeight, hasAnyVisible] = useSelect((select) => {
    const { get } = select(preferencesStore);
    const { isMetaBoxLocationVisible } = select(editPostStore);
    return [
      !!get("core/edit-post", "metaBoxesMainIsOpen"),
      get("core/edit-post", "metaBoxesMainOpenHeight"),
      isMetaBoxLocationVisible("normal") || isMetaBoxLocationVisible("advanced") || isMetaBoxLocationVisible("side")
    ];
  }, []);
  const { set: setPreference } = useDispatch(preferencesStore);
  const isShort = useMediaQuery("(max-height: 549px)");
  const [{ min = 0, max }, setHeightConstraints] = useState(() => ({}));
  const effectSizeConstraints = useRefEffect((node) => {
    const container = node.closest(
      ".interface-interface-skeleton__content"
    );
    if (!container) {
      return;
    }
    const noticeLists = container.querySelectorAll(
      ":scope > .components-notice-list"
    );
    const resizeHandle = container.querySelector(
      ".edit-post-meta-boxes-main__presenter"
    );
    const deriveConstraints = () => {
      const fullHeight = container.offsetHeight;
      let nextMax = fullHeight;
      for (const element of noticeLists) {
        nextMax -= element.offsetHeight;
      }
      const nextMin = resizeHandle.offsetHeight;
      setHeightConstraints({ min: nextMin, max: nextMax });
    };
    const observer = new window.ResizeObserver(deriveConstraints);
    observer.observe(container);
    for (const element of noticeLists) {
      observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);
  const metaBoxesMainRef = useRef();
  const setMainRefs = useMergeRefs([
    metaBoxesMainRef,
    effectSizeConstraints
  ]);
  const separatorRef = useRef();
  const separatorHelpId = useId();
  const heightRef = useRef();
  const applyHeight = (candidateHeight = "auto", isPersistent) => {
    let styleHeight;
    if (candidateHeight === "auto") {
      isPersistent = false;
      styleHeight = candidateHeight;
    } else {
      candidateHeight = Math.min(max, Math.max(min, candidateHeight));
      heightRef.current = candidateHeight;
      styleHeight = `${candidateHeight}px`;
    }
    if (isPersistent) {
      setPreference(
        "core/edit-post",
        "metaBoxesMainOpenHeight",
        candidateHeight
      );
    } else {
      metaBoxesMainRef.current.style.height = styleHeight;
      if (!isShort) {
        separatorRef.current.ariaValueNow = getAriaValueNow(candidateHeight);
      }
    }
  };
  const bindDragGesture = useDrag(
    ({ movement, first, last, memo, tap, args }) => {
      const pane = metaBoxesMainRef.current;
      const [, yMovement] = movement;
      if (first) {
        pane.classList.add("is-resizing");
        let fromHeight = heightRef.current ?? pane.offsetHeight;
        if (isOpen) {
          if (fromHeight > max) {
            fromHeight = max;
          }
        } else {
          fromHeight = min;
        }
        applyHeight(fromHeight - yMovement);
        return { fromHeight };
      }
      if (!first && !last && !tap) {
        applyHeight(memo.fromHeight - yMovement);
        return memo;
      }
      pane.classList.remove("is-resizing");
      if (tap) {
        const [onTap] = args;
        onTap?.();
        return;
      }
      const nextIsOpen = heightRef.current > min;
      persistIsOpen(nextIsOpen);
      applyHeight(heightRef.current, nextIsOpen);
    },
    { keyboardDisplacement: 20, filterTaps: true }
  );
  if (!hasAnyVisible) {
    return;
  }
  const contents = /* @__PURE__ */ jsxs(
    "div",
    {
      className: "edit-post-layout__metaboxes edit-post-meta-boxes-main__liner",
      hidden: !isLegacy && !isOpen,
      children: [
        /* @__PURE__ */ jsx(MetaBoxes, { location: "normal" }),
        /* @__PURE__ */ jsx(MetaBoxes, { location: "advanced" })
      ]
    }
  );
  if (isLegacy) {
    return contents;
  }
  const isAutoHeight = openHeight === void 0;
  const usedOpenHeight = isShort ? "auto" : openHeight;
  const usedHeight = isOpen ? usedOpenHeight : min;
  const getAriaValueNow = (height) => Math.round((height - min) / (max - min) * 100);
  const usedAriaValueNow = max === void 0 || isAutoHeight ? 50 : getAriaValueNow(usedHeight);
  const persistIsOpen = (to = !isOpen) => setPreference("core/edit-post", "metaBoxesMainIsOpen", to);
  const paneLabel = __("Meta Boxes");
  const toggle = /* @__PURE__ */ jsxs(
    "button",
    {
      "aria-expanded": isOpen,
      onClick: ({ detail }) => {
        if (isShort || !detail) {
          persistIsOpen();
        }
      },
      ...!isShort && bindDragGesture(persistIsOpen),
      children: [
        paneLabel,
        /* @__PURE__ */ jsx(Icon, { icon: isOpen ? chevronUp : chevronDown })
      ]
    }
  );
  const separator = !isShort && /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Tooltip, { text: __("Drag to resize"), children: /* @__PURE__ */ jsx(
      "button",
      {
        ref: separatorRef,
        role: "separator",
        "aria-valuenow": usedAriaValueNow,
        "aria-label": __("Drag to resize"),
        "aria-describedby": separatorHelpId,
        ...bindDragGesture()
      }
    ) }),
    /* @__PURE__ */ jsx(VisuallyHidden, { id: separatorHelpId, children: __(
      "Use up and down arrow keys to resize the meta box pane."
    ) })
  ] });
  return /* @__PURE__ */ jsxs(
    NavigableRegion,
    {
      ariaLabel: paneLabel,
      ref: setMainRefs,
      className: clsx(
        "edit-post-meta-boxes-main",
        !isShort && "is-resizable"
      ),
      style: { height: usedHeight },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "edit-post-meta-boxes-main__presenter", children: [
          toggle,
          separator
        ] }),
        contents
      ]
    }
  );
}
function Layout({
  postId: initialPostId,
  postType: initialPostType,
  settings,
  initialEdits
}) {
  useEditPostCommands();
  const shouldIframe = useShouldIframe();
  const { createErrorNotice } = useDispatch(noticesStore);
  const {
    currentPost: { postId: currentPostId, postType: currentPostType },
    onNavigateToEntityRecord,
    onNavigateToPreviousEntityRecord
  } = useNavigateToEntityRecord(
    initialPostId,
    initialPostType,
    "post-only"
  );
  const isEditingTemplate = currentPostType === "wp_template";
  const {
    mode,
    isFullscreenActive,
    hasResolvedMode,
    hasActiveMetaboxes,
    hasBlockSelected,
    showIconLabels,
    isDistractionFree,
    showMetaBoxes,
    isWelcomeGuideVisible,
    templateId,
    isDevicePreview
  } = useSelect(
    (select) => {
      const { get } = select(preferencesStore);
      const { isFeatureActive, hasMetaBoxes } = select(editPostStore);
      const { canUser, getPostType, getTemplateId } = unlock(
        select(coreStore)
      );
      const supportsTemplateMode = settings.supportsTemplateMode;
      const isViewable = getPostType(currentPostType)?.viewable ?? false;
      const canViewTemplate = canUser("read", {
        kind: "postType",
        name: "wp_template"
      });
      const { getBlockSelectionStart, isZoomOut } = unlock(
        select(blockEditorStore)
      );
      const { getEditorMode, getDefaultRenderingMode, getDeviceType } = unlock(select(editorStore));
      const isNotDesignPostType = !DESIGN_POST_TYPES.includes(currentPostType);
      const isDirectlyEditingPattern = currentPostType === "wp_block" && !onNavigateToPreviousEntityRecord;
      const _templateId = getTemplateId(currentPostType, currentPostId);
      const defaultMode = getDefaultRenderingMode(currentPostType);
      return {
        mode: getEditorMode(),
        isFullscreenActive: isFeatureActive("fullscreenMode"),
        hasActiveMetaboxes: hasMetaBoxes(),
        hasResolvedMode: defaultMode === "template-locked" ? !!_templateId : defaultMode !== void 0,
        hasBlockSelected: !!getBlockSelectionStart(),
        showIconLabels: get("core", "showIconLabels"),
        isDistractionFree: get("core", "distractionFree"),
        showMetaBoxes: isNotDesignPostType && !isZoomOut() || isDirectlyEditingPattern,
        isWelcomeGuideVisible: isFeatureActive("welcomeGuide"),
        templateId: supportsTemplateMode && isViewable && canViewTemplate && !isEditingTemplate ? _templateId : null,
        isDevicePreview: getDeviceType() !== "Desktop"
      };
    },
    [
      currentPostType,
      currentPostId,
      isEditingTemplate,
      settings.supportsTemplateMode,
      onNavigateToPreviousEntityRecord
    ]
  );
  useMetaBoxInitialization(hasActiveMetaboxes && hasResolvedMode);
  const commandContext = hasBlockSelected ? "block-selection-edit" : "entity-edit";
  useCommandContext(commandContext);
  const styles = useEditorStyles(settings);
  const editorSettings = useMemo(
    () => ({
      ...settings,
      styles,
      onNavigateToEntityRecord,
      onNavigateToPreviousEntityRecord,
      defaultRenderingMode: "post-only"
    }),
    [
      settings,
      styles,
      onNavigateToEntityRecord,
      onNavigateToPreviousEntityRecord
    ]
  );
  if (showIconLabels) {
    document.body.classList.add("show-icon-labels");
  } else {
    document.body.classList.remove("show-icon-labels");
  }
  const navigateRegionsProps = useNavigateRegions();
  const className = clsx("edit-post-layout", "is-mode-" + mode, {
    "has-metaboxes": hasActiveMetaboxes
  });
  function onPluginAreaError(name) {
    createErrorNotice(
      sprintf(
        /* translators: %s: plugin name */
        __(
          'The "%s" plugin has encountered an error and cannot be rendered.'
        ),
        name
      )
    );
  }
  const { createSuccessNotice } = useDispatch(noticesStore);
  const onActionPerformed = useCallback(
    (actionId, items) => {
      switch (actionId) {
        case "move-to-trash":
          {
            document.location.href = addQueryArgs("edit.php", {
              trashed: 1,
              post_type: items[0].type,
              ids: items[0].id
            });
          }
          break;
        case "duplicate-post":
          {
            const newItem = items[0];
            const title = typeof newItem.title === "string" ? newItem.title : newItem.title?.rendered;
            createSuccessNotice(
              sprintf(
                // translators: %s: Title of the created post or template, e.g: "Hello world".
                __('"%s" successfully created.'),
                decodeEntities(title) || __("(no title)")
              ),
              {
                type: "snackbar",
                id: "duplicate-post-action",
                actions: [
                  {
                    label: __("Edit"),
                    onClick: () => {
                      const postId = newItem.id;
                      document.location.href = addQueryArgs("post.php", {
                        post: postId,
                        action: "edit"
                      });
                    }
                  }
                ]
              }
            );
          }
          break;
      }
    },
    [createSuccessNotice]
  );
  const initialPost = useMemo(() => {
    return {
      type: initialPostType,
      id: initialPostId
    };
  }, [initialPostType, initialPostId]);
  const backButton = useViewportMatch("medium") && isFullscreenActive ? /* @__PURE__ */ jsx(BackButton, { initialPost }) : null;
  return /* @__PURE__ */ jsx(SlotFillProvider, { children: /* @__PURE__ */ jsxs(ErrorBoundary, { canCopyContent: true, children: [
    /* @__PURE__ */ jsx(WelcomeGuide, { postType: currentPostType }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: navigateRegionsProps.className,
        ...navigateRegionsProps,
        ref: navigateRegionsProps.ref,
        children: /* @__PURE__ */ jsxs(
          Editor,
          {
            settings: editorSettings,
            initialEdits,
            postType: currentPostType,
            postId: currentPostId,
            templateId,
            className,
            forceIsDirty: hasActiveMetaboxes,
            disableIframe: !shouldIframe,
            autoFocus: !isWelcomeGuideVisible,
            onActionPerformed,
            extraSidebarPanels: showMetaBoxes && /* @__PURE__ */ jsx(MetaBoxes, { location: "side" }),
            extraContent: !isDistractionFree && showMetaBoxes && /* @__PURE__ */ jsx(MetaBoxesMain, { isLegacy: isDevicePreview }),
            children: [
              /* @__PURE__ */ jsx(PostLockedModal, {}),
              /* @__PURE__ */ jsx(EditorInitialization, {}),
              /* @__PURE__ */ jsx(FullscreenMode, { isActive: isFullscreenActive }),
              /* @__PURE__ */ jsx(BrowserURL, {}),
              /* @__PURE__ */ jsx(UnsavedChangesWarning, {}),
              /* @__PURE__ */ jsx(AutosaveMonitor, {}),
              /* @__PURE__ */ jsx(LocalAutosaveMonitor, {}),
              /* @__PURE__ */ jsx(EditPostKeyboardShortcuts, {}),
              /* @__PURE__ */ jsx(EditorKeyboardShortcutsRegister, {}),
              /* @__PURE__ */ jsx(BlockKeyboardShortcuts, {}),
              currentPostType === "wp_block" && /* @__PURE__ */ jsx(InitPatternModal, {}),
              /* @__PURE__ */ jsx(PluginArea, { onError: onPluginAreaError }),
              /* @__PURE__ */ jsx(PostEditorMoreMenu, {}),
              backButton,
              /* @__PURE__ */ jsx(SnackbarNotices, { className: "edit-post-layout__snackbar" })
            ]
          }
        )
      }
    )
  ] }) });
}
var layout_default = Layout;
export {
  layout_default as default
};
//# sourceMappingURL=index.mjs.map
