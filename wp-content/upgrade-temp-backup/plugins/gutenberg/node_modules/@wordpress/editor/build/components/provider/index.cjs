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

// packages/editor/src/components/provider/index.js
var provider_exports = {};
__export(provider_exports, {
  EditorProvider: () => EditorProvider,
  ExperimentalEditorProvider: () => ExperimentalEditorProvider,
  default: () => provider_default
});
module.exports = __toCommonJS(provider_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var import_notices = require("@wordpress/notices");
var import_patterns = require("@wordpress/patterns");
var import_blocks = require("@wordpress/blocks");
var import_with_registry_provider = __toESM(require("./with-registry-provider.cjs"));
var import_store = require("../../store/index.cjs");
var import_constants = require("../../store/constants.cjs");
var import_use_block_editor_settings = __toESM(require("./use-block-editor-settings.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_disable_non_page_content_blocks = __toESM(require("./disable-non-page-content-blocks.cjs"));
var import_navigation_block_editing_mode = __toESM(require("./navigation-block-editing-mode.cjs"));
var import_use_hide_blocks_from_inserter = require("./use-hide-blocks-from-inserter.cjs");
var import_commands = __toESM(require("../commands/index.cjs"));
var import_use_upload_save_lock = __toESM(require("./use-upload-save-lock.cjs"));
var import_block_removal_warnings = __toESM(require("../block-removal-warnings/index.cjs"));
var import_start_page_options = __toESM(require("../start-page-options/index.cjs"));
var import_keyboard_shortcut_help_modal = __toESM(require("../keyboard-shortcut-help-modal/index.cjs"));
var import_start_template_options = __toESM(require("../start-template-options/index.cjs"));
var import_global_keyboard_shortcuts = __toESM(require("../global-keyboard-shortcuts/index.cjs"));
var import_pattern_rename_modal = __toESM(require("../pattern-rename-modal/index.cjs"));
var import_pattern_duplicate_modal = __toESM(require("../pattern-duplicate-modal/index.cjs"));
var import_template_part_menu_items = __toESM(require("../template-part-menu-items/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var { ExperimentalBlockEditorProvider } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var { PatternsMenuItems } = (0, import_lock_unlock.unlock)(import_patterns.privateApis);
var noop = () => {
};
var NON_CONTEXTUAL_POST_TYPES = [
  "wp_block",
  "wp_navigation",
  "wp_template_part"
];
function useBlockEditorProps(post, template, mode) {
  const rootLevelPost = mode === "template-locked" ? "template" : "post";
  const [postBlocks, onInput, onChange] = (0, import_core_data.useEntityBlockEditor)(
    "postType",
    post.type,
    { id: post.id }
  );
  const [templateBlocks, onInputTemplate, onChangeTemplate] = (0, import_core_data.useEntityBlockEditor)("postType", template?.type, {
    id: template?.id
  });
  const maybeNavigationBlocks = (0, import_element.useMemo)(() => {
    if (post.type === "wp_navigation") {
      return [
        (0, import_blocks.createBlock)("core/navigation", {
          ref: post.id,
          // As the parent editor is locked with `templateLock`, the template locking
          // must be explicitly "unset" on the block itself to allow the user to modify
          // the block's content.
          templateLock: false
        })
      ];
    }
  }, [post.type, post.id]);
  const blocks = (0, import_element.useMemo)(() => {
    if (maybeNavigationBlocks) {
      return maybeNavigationBlocks;
    }
    if (rootLevelPost === "template") {
      return templateBlocks;
    }
    return postBlocks;
  }, [maybeNavigationBlocks, rootLevelPost, templateBlocks, postBlocks]);
  const disableRootLevelChanges = !!template && mode === "template-locked" || post.type === "wp_navigation";
  if (disableRootLevelChanges) {
    return [blocks, noop, noop];
  }
  return [
    blocks,
    rootLevelPost === "post" ? onInput : onInputTemplate,
    rootLevelPost === "post" ? onChange : onChangeTemplate
  ];
}
var ExperimentalEditorProvider = (0, import_with_registry_provider.default)(
  ({
    post,
    settings,
    recovery,
    initialEdits,
    children,
    BlockEditorProviderComponent = ExperimentalBlockEditorProvider,
    __unstableTemplate: template
  }) => {
    const hasTemplate = !!template;
    const {
      editorSettings,
      selection,
      isReady,
      mode,
      defaultMode,
      postTypeEntities
    } = (0, import_data.useSelect)(
      (select) => {
        const {
          getEditorSettings,
          getRenderingMode,
          __unstableIsEditorReady,
          getDefaultRenderingMode
        } = (0, import_lock_unlock.unlock)(select(import_store.store));
        const { getEntitiesConfig, getEntityRecordEdits } = select(import_core_data.store);
        const _mode = getRenderingMode();
        const _defaultMode = getDefaultRenderingMode(post.type);
        const hasResolvedDefaultMode = _defaultMode === "template-locked" ? hasTemplate : _defaultMode !== void 0;
        const isRenderingModeReady = _defaultMode !== void 0;
        const entityEdits = getEntityRecordEdits(
          "postType",
          post.type,
          post.id
        );
        return {
          editorSettings: getEditorSettings(),
          isReady: __unstableIsEditorReady(),
          mode: isRenderingModeReady ? _mode : void 0,
          defaultMode: hasResolvedDefaultMode ? _defaultMode : void 0,
          selection: entityEdits?.selection,
          postTypeEntities: post.type === "wp_template" ? getEntitiesConfig("postType") : null
        };
      },
      [post.type, post.id, hasTemplate]
    );
    const shouldRenderTemplate = hasTemplate && mode !== "post-only";
    const rootLevelPost = shouldRenderTemplate ? template : post;
    const defaultBlockContext = (0, import_element.useMemo)(() => {
      const postContext = {};
      if (post.type === "wp_template") {
        if (post.slug === "page") {
          postContext.postType = "page";
        } else if (post.slug === "single") {
          postContext.postType = "post";
        } else if (post.slug.split("-")[0] === "single") {
          const postTypeNames = postTypeEntities?.map((entity) => entity.name) || [];
          const match = post.slug.match(
            `^single-(${postTypeNames.join("|")})(?:-.+)?$`
          );
          if (match) {
            postContext.postType = match[1];
          }
        }
      } else if (!NON_CONTEXTUAL_POST_TYPES.includes(rootLevelPost.type) || shouldRenderTemplate) {
        postContext.postId = post.id;
        postContext.postType = post.type;
      }
      return {
        ...postContext,
        templateSlug: rootLevelPost.type === "wp_template" ? rootLevelPost.slug : void 0
      };
    }, [
      shouldRenderTemplate,
      post.id,
      post.type,
      post.slug,
      rootLevelPost.type,
      rootLevelPost.slug,
      postTypeEntities
    ]);
    const { id, type } = rootLevelPost;
    const blockEditorSettings = (0, import_use_block_editor_settings.default)(
      editorSettings,
      type,
      id,
      mode
    );
    const [blocks, onInput, onChange] = useBlockEditorProps(
      post,
      template,
      mode
    );
    const {
      updatePostLock,
      setupEditor,
      updateEditorSettings,
      setCurrentTemplateId,
      setEditedPost,
      setRenderingMode
    } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
    const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
    const onChangeSelection = (0, import_element.useCallback)(
      (newSelection) => {
        editEntityRecord(
          "postType",
          post.type,
          post.id,
          { selection: newSelection },
          { undoIgnore: true }
        );
      },
      [editEntityRecord, post.type, post.id]
    );
    const { createWarningNotice, removeNotice } = (0, import_data.useDispatch)(import_notices.store);
    (0, import_element.useLayoutEffect)(() => {
      if (recovery) {
        return;
      }
      updatePostLock(settings.postLock);
      setupEditor(post, initialEdits, settings.template);
      if (settings.autosave) {
        createWarningNotice(
          (0, import_i18n.__)(
            "There is an autosave of this post that is more recent than the version below."
          ),
          {
            id: "autosave-exists",
            actions: [
              {
                label: (0, import_i18n.__)("View the autosave"),
                url: settings.autosave.editLink
              }
            ]
          }
        );
      }
    }, []);
    (0, import_element.useEffect)(() => {
      setEditedPost(post.type, post.id);
      if (typeof window !== "undefined" && window.__experimentalTemplateActivate) {
        removeNotice("template-activate-notice");
      }
      return () => setEditedPost(null, null);
    }, [post.type, post.id, setEditedPost, removeNotice]);
    (0, import_element.useEffect)(() => {
      updateEditorSettings(settings);
    }, [settings, updateEditorSettings]);
    (0, import_element.useEffect)(() => {
      setCurrentTemplateId(template?.id);
    }, [template?.id, setCurrentTemplateId]);
    (0, import_element.useEffect)(() => {
      if (defaultMode) {
        setRenderingMode(defaultMode);
      }
    }, [defaultMode, setRenderingMode]);
    (0, import_use_hide_blocks_from_inserter.useHideBlocksFromInserter)(post.type, mode);
    (0, import_commands.default)();
    (0, import_use_upload_save_lock.default)();
    if (!isReady || !mode) {
      return null;
    }
    const isAttachment = post.type === import_constants.ATTACHMENT_POST_TYPE && window?.__experimentalMediaEditor;
    if (isAttachment) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_core_data.EntityProvider, { kind: "root", type: "site", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_core_data.EntityProvider,
        {
          kind: "postType",
          type: post.type,
          id: post.id,
          children: [
            children,
            !settings.isPreviewMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_global_keyboard_shortcuts.default, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_keyboard_shortcut_help_modal.default, {})
            ] })
          ]
        }
      ) });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_core_data.EntityProvider, { kind: "root", type: "site", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_core_data.EntityProvider,
      {
        kind: "postType",
        type: post.type,
        id: post.id,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockContextProvider, { value: defaultBlockContext, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          BlockEditorProviderComponent,
          {
            value: blocks,
            onChange,
            onInput,
            selection,
            onChangeSelection,
            settings: blockEditorSettings,
            useSubRegistry: false,
            children: [
              children,
              !settings.isPreviewMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatternsMenuItems, {}),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_template_part_menu_items.default, {}),
                mode === "template-locked" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_disable_non_page_content_blocks.default, {}),
                type === "wp_navigation" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_navigation_block_editing_mode.default, {}),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_global_keyboard_shortcuts.default, {}),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_keyboard_shortcut_help_modal.default, {}),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_removal_warnings.default, {}),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_start_page_options.default, {}),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_start_template_options.default, {}),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_pattern_rename_modal.default, {}),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_pattern_duplicate_modal.default, {})
              ] })
            ]
          }
        ) })
      }
    ) });
  }
);
function EditorProvider(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    ExperimentalEditorProvider,
    {
      ...props,
      BlockEditorProviderComponent: import_block_editor.BlockEditorProvider,
      children: props.children
    }
  );
}
var provider_default = EditorProvider;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EditorProvider,
  ExperimentalEditorProvider
});
//# sourceMappingURL=index.cjs.map
