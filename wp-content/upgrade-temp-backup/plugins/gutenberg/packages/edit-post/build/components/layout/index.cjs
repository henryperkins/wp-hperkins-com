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

// packages/edit-post/src/components/layout/index.js
var layout_exports = {};
__export(layout_exports, {
  default: () => layout_default
});
module.exports = __toCommonJS(layout_exports);
var import_clsx = __toESM(require("clsx"));
var import_admin_ui = require("@wordpress/admin-ui");
var import_editor = require("@wordpress/editor");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_plugins = require("@wordpress/plugins");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_icons = require("@wordpress/icons");
var import_notices = require("@wordpress/notices");
var import_preferences = require("@wordpress/preferences");
var import_commands = require("@wordpress/commands");
var import_block_library = require("@wordpress/block-library");
var import_url = require("@wordpress/url");
var import_html_entities = require("@wordpress/html-entities");
var import_core_data = require("@wordpress/core-data");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_back_button = __toESM(require("../back-button/index.cjs"));
var import_editor_initialization = __toESM(require("../editor-initialization/index.cjs"));
var import_keyboard_shortcuts = __toESM(require("../keyboard-shortcuts/index.cjs"));
var import_init_pattern_modal = __toESM(require("../init-pattern-modal/index.cjs"));
var import_browser_url = __toESM(require("../browser-url/index.cjs"));
var import_meta_boxes = __toESM(require("../meta-boxes/index.cjs"));
var import_more_menu = __toESM(require("../more-menu/index.cjs"));
var import_welcome_guide = __toESM(require("../welcome-guide/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_use_commands = __toESM(require("../../commands/use-commands.cjs"));
var import_use_should_iframe = require("./use-should-iframe.cjs");
var import_use_navigate_to_entity_record = __toESM(require("../../hooks/use-navigate-to-entity-record.cjs"));
var import_use_meta_box_initialization = require("../meta-boxes/use-meta-box-initialization.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useCommandContext } = (0, import_lock_unlock.unlock)(import_commands.privateApis);
var { useDrag } = (0, import_lock_unlock.unlock)(import_components.privateApis);
var { Editor, FullscreenMode } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var { BlockKeyboardShortcuts } = (0, import_lock_unlock.unlock)(import_block_library.privateApis);
var DESIGN_POST_TYPES = [
  "wp_template",
  "wp_template_part",
  "wp_block",
  "wp_navigation"
];
function useEditorStyles(settings) {
  const { hasThemeStyleSupport } = (0, import_data.useSelect)((select) => {
    return {
      hasThemeStyleSupport: select(import_store.store).isFeatureActive("themeStyles")
    };
  }, []);
  return (0, import_element.useMemo)(() => {
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
        css: (0, import_global_styles_engine.getLayoutStyles)({
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
  const [isOpen, openHeight, hasAnyVisible] = (0, import_data.useSelect)((select) => {
    const { get } = select(import_preferences.store);
    const { isMetaBoxLocationVisible } = select(import_store.store);
    return [
      !!get("core/edit-post", "metaBoxesMainIsOpen"),
      get("core/edit-post", "metaBoxesMainOpenHeight"),
      isMetaBoxLocationVisible("normal") || isMetaBoxLocationVisible("advanced") || isMetaBoxLocationVisible("side")
    ];
  }, []);
  const { set: setPreference } = (0, import_data.useDispatch)(import_preferences.store);
  const isShort = (0, import_compose.useMediaQuery)("(max-height: 549px)");
  const [{ min = 0, max }, setHeightConstraints] = (0, import_element.useState)(() => ({}));
  const effectSizeConstraints = (0, import_compose.useRefEffect)((node) => {
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
  const metaBoxesMainRef = (0, import_element.useRef)();
  const setMainRefs = (0, import_compose.useMergeRefs)([
    metaBoxesMainRef,
    effectSizeConstraints
  ]);
  const separatorRef = (0, import_element.useRef)();
  const separatorHelpId = (0, import_element.useId)();
  const heightRef = (0, import_element.useRef)();
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
  const contents = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: "edit-post-layout__metaboxes edit-post-meta-boxes-main__liner",
      hidden: !isLegacy && !isOpen,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_meta_boxes.default, { location: "normal" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_meta_boxes.default, { location: "advanced" })
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
  const paneLabel = (0, import_i18n.__)("Meta Boxes");
  const toggle = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon: isOpen ? import_icons.chevronUp : import_icons.chevronDown })
      ]
    }
  );
  const separator = !isShort && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Tooltip, { text: (0, import_i18n.__)("Drag to resize"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        ref: separatorRef,
        role: "separator",
        "aria-valuenow": usedAriaValueNow,
        "aria-label": (0, import_i18n.__)("Drag to resize"),
        "aria-describedby": separatorHelpId,
        ...bindDragGesture()
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.VisuallyHidden, { id: separatorHelpId, children: (0, import_i18n.__)(
      "Use up and down arrow keys to resize the meta box pane."
    ) })
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_admin_ui.NavigableRegion,
    {
      ariaLabel: paneLabel,
      ref: setMainRefs,
      className: (0, import_clsx.default)(
        "edit-post-meta-boxes-main",
        !isShort && "is-resizable"
      ),
      style: { height: usedHeight },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "edit-post-meta-boxes-main__presenter", children: [
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
  (0, import_use_commands.default)();
  const shouldIframe = (0, import_use_should_iframe.useShouldIframe)();
  const { createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  const {
    currentPost: { postId: currentPostId, postType: currentPostType },
    onNavigateToEntityRecord,
    onNavigateToPreviousEntityRecord
  } = (0, import_use_navigate_to_entity_record.default)(
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
  } = (0, import_data.useSelect)(
    (select) => {
      const { get } = select(import_preferences.store);
      const { isFeatureActive, hasMetaBoxes } = select(import_store.store);
      const { canUser, getPostType, getTemplateId } = (0, import_lock_unlock.unlock)(
        select(import_core_data.store)
      );
      const supportsTemplateMode = settings.supportsTemplateMode;
      const isViewable = getPostType(currentPostType)?.viewable ?? false;
      const canViewTemplate = canUser("read", {
        kind: "postType",
        name: "wp_template"
      });
      const { getBlockSelectionStart, isZoomOut } = (0, import_lock_unlock.unlock)(
        select(import_block_editor.store)
      );
      const { getEditorMode, getDefaultRenderingMode, getDeviceType } = (0, import_lock_unlock.unlock)(select(import_editor.store));
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
  (0, import_use_meta_box_initialization.useMetaBoxInitialization)(hasActiveMetaboxes && hasResolvedMode);
  const commandContext = hasBlockSelected ? "block-selection-edit" : "entity-edit";
  useCommandContext(commandContext);
  const styles = useEditorStyles(settings);
  const editorSettings = (0, import_element.useMemo)(
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
  const navigateRegionsProps = (0, import_components.__unstableUseNavigateRegions)();
  const className = (0, import_clsx.default)("edit-post-layout", "is-mode-" + mode, {
    "has-metaboxes": hasActiveMetaboxes
  });
  function onPluginAreaError(name) {
    createErrorNotice(
      (0, import_i18n.sprintf)(
        /* translators: %s: plugin name */
        (0, import_i18n.__)(
          'The "%s" plugin has encountered an error and cannot be rendered.'
        ),
        name
      )
    );
  }
  const { createSuccessNotice } = (0, import_data.useDispatch)(import_notices.store);
  const onActionPerformed = (0, import_element.useCallback)(
    (actionId, items) => {
      switch (actionId) {
        case "move-to-trash":
          {
            document.location.href = (0, import_url.addQueryArgs)("edit.php", {
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
              (0, import_i18n.sprintf)(
                // translators: %s: Title of the created post or template, e.g: "Hello world".
                (0, import_i18n.__)('"%s" successfully created.'),
                (0, import_html_entities.decodeEntities)(title) || (0, import_i18n.__)("(no title)")
              ),
              {
                type: "snackbar",
                id: "duplicate-post-action",
                actions: [
                  {
                    label: (0, import_i18n.__)("Edit"),
                    onClick: () => {
                      const postId = newItem.id;
                      document.location.href = (0, import_url.addQueryArgs)("post.php", {
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
  const initialPost = (0, import_element.useMemo)(() => {
    return {
      type: initialPostType,
      id: initialPostId
    };
  }, [initialPostType, initialPostId]);
  const backButton = (0, import_compose.useViewportMatch)("medium") && isFullscreenActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_back_button.default, { initialPost }) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.SlotFillProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_editor.ErrorBoundary, { canCopyContent: true, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_welcome_guide.default, { postType: currentPostType }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: navigateRegionsProps.className,
        ...navigateRegionsProps,
        ref: navigateRegionsProps.ref,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
            extraSidebarPanels: showMetaBoxes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_meta_boxes.default, { location: "side" }),
            extraContent: !isDistractionFree && showMetaBoxes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaBoxesMain, { isLegacy: isDevicePreview }),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.PostLockedModal, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor_initialization.default, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullscreenMode, { isActive: isFullscreenActive }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_browser_url.default, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.UnsavedChangesWarning, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.AutosaveMonitor, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.LocalAutosaveMonitor, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_keyboard_shortcuts.default, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.EditorKeyboardShortcutsRegister, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockKeyboardShortcuts, {}),
              currentPostType === "wp_block" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_init_pattern_modal.default, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_plugins.PluginArea, { onError: onPluginAreaError }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_more_menu.default, {}),
              backButton,
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_notices.SnackbarNotices, { className: "edit-post-layout__snackbar" })
            ]
          }
        )
      }
    )
  ] }) });
}
var layout_default = Layout;
//# sourceMappingURL=index.cjs.map
