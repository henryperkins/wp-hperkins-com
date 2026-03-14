// packages/editor/src/components/provider/index.js
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo
} from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import {
  EntityProvider,
  useEntityBlockEditor,
  store as coreStore
} from "@wordpress/core-data";
import {
  BlockEditorProvider,
  BlockContextProvider,
  privateApis as blockEditorPrivateApis
} from "@wordpress/block-editor";
import { store as noticesStore } from "@wordpress/notices";
import { privateApis as editPatternsPrivateApis } from "@wordpress/patterns";
import { createBlock } from "@wordpress/blocks";
import withRegistryProvider from "./with-registry-provider.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { ATTACHMENT_POST_TYPE } from "../../store/constants.mjs";
import useBlockEditorSettings from "./use-block-editor-settings.mjs";
import { unlock } from "../../lock-unlock.mjs";
import DisableNonPageContentBlocks from "./disable-non-page-content-blocks.mjs";
import NavigationBlockEditingMode from "./navigation-block-editing-mode.mjs";
import { useHideBlocksFromInserter } from "./use-hide-blocks-from-inserter.mjs";
import useCommands from "../commands/index.mjs";
import useUploadSaveLock from "./use-upload-save-lock.mjs";
import BlockRemovalWarnings from "../block-removal-warnings/index.mjs";
import StartPageOptions from "../start-page-options/index.mjs";
import KeyboardShortcutHelpModal from "../keyboard-shortcut-help-modal/index.mjs";
import StartTemplateOptions from "../start-template-options/index.mjs";
import EditorKeyboardShortcuts from "../global-keyboard-shortcuts/index.mjs";
import PatternRenameModal from "../pattern-rename-modal/index.mjs";
import PatternDuplicateModal from "../pattern-duplicate-modal/index.mjs";
import TemplatePartMenuItems from "../template-part-menu-items/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { ExperimentalBlockEditorProvider } = unlock(blockEditorPrivateApis);
var { PatternsMenuItems } = unlock(editPatternsPrivateApis);
var noop = () => {
};
var NON_CONTEXTUAL_POST_TYPES = [
  "wp_block",
  "wp_navigation",
  "wp_template_part"
];
function useBlockEditorProps(post, template, mode) {
  const rootLevelPost = mode === "template-locked" ? "template" : "post";
  const [postBlocks, onInput, onChange] = useEntityBlockEditor(
    "postType",
    post.type,
    { id: post.id }
  );
  const [templateBlocks, onInputTemplate, onChangeTemplate] = useEntityBlockEditor("postType", template?.type, {
    id: template?.id
  });
  const maybeNavigationBlocks = useMemo(() => {
    if (post.type === "wp_navigation") {
      return [
        createBlock("core/navigation", {
          ref: post.id,
          // As the parent editor is locked with `templateLock`, the template locking
          // must be explicitly "unset" on the block itself to allow the user to modify
          // the block's content.
          templateLock: false
        })
      ];
    }
  }, [post.type, post.id]);
  const blocks = useMemo(() => {
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
var ExperimentalEditorProvider = withRegistryProvider(
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
    } = useSelect(
      (select) => {
        const {
          getEditorSettings,
          getRenderingMode,
          __unstableIsEditorReady,
          getDefaultRenderingMode
        } = unlock(select(editorStore));
        const { getEntitiesConfig, getEntityRecordEdits } = select(coreStore);
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
    const defaultBlockContext = useMemo(() => {
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
    const blockEditorSettings = useBlockEditorSettings(
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
    } = unlock(useDispatch(editorStore));
    const { editEntityRecord } = useDispatch(coreStore);
    const onChangeSelection = useCallback(
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
    const { createWarningNotice, removeNotice } = useDispatch(noticesStore);
    useLayoutEffect(() => {
      if (recovery) {
        return;
      }
      updatePostLock(settings.postLock);
      setupEditor(post, initialEdits, settings.template);
      if (settings.autosave) {
        createWarningNotice(
          __(
            "There is an autosave of this post that is more recent than the version below."
          ),
          {
            id: "autosave-exists",
            actions: [
              {
                label: __("View the autosave"),
                url: settings.autosave.editLink
              }
            ]
          }
        );
      }
    }, []);
    useEffect(() => {
      setEditedPost(post.type, post.id);
      if (typeof window !== "undefined" && window.__experimentalTemplateActivate) {
        removeNotice("template-activate-notice");
      }
      return () => setEditedPost(null, null);
    }, [post.type, post.id, setEditedPost, removeNotice]);
    useEffect(() => {
      updateEditorSettings(settings);
    }, [settings, updateEditorSettings]);
    useEffect(() => {
      setCurrentTemplateId(template?.id);
    }, [template?.id, setCurrentTemplateId]);
    useEffect(() => {
      if (defaultMode) {
        setRenderingMode(defaultMode);
      }
    }, [defaultMode, setRenderingMode]);
    useHideBlocksFromInserter(post.type, mode);
    useCommands();
    useUploadSaveLock();
    if (!isReady || !mode) {
      return null;
    }
    const isAttachment = post.type === ATTACHMENT_POST_TYPE && window?.__experimentalMediaEditor;
    if (isAttachment) {
      return /* @__PURE__ */ jsx(EntityProvider, { kind: "root", type: "site", children: /* @__PURE__ */ jsxs(
        EntityProvider,
        {
          kind: "postType",
          type: post.type,
          id: post.id,
          children: [
            children,
            !settings.isPreviewMode && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(EditorKeyboardShortcuts, {}),
              /* @__PURE__ */ jsx(KeyboardShortcutHelpModal, {})
            ] })
          ]
        }
      ) });
    }
    return /* @__PURE__ */ jsx(EntityProvider, { kind: "root", type: "site", children: /* @__PURE__ */ jsx(
      EntityProvider,
      {
        kind: "postType",
        type: post.type,
        id: post.id,
        children: /* @__PURE__ */ jsx(BlockContextProvider, { value: defaultBlockContext, children: /* @__PURE__ */ jsxs(
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
              !settings.isPreviewMode && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(PatternsMenuItems, {}),
                /* @__PURE__ */ jsx(TemplatePartMenuItems, {}),
                mode === "template-locked" && /* @__PURE__ */ jsx(DisableNonPageContentBlocks, {}),
                type === "wp_navigation" && /* @__PURE__ */ jsx(NavigationBlockEditingMode, {}),
                /* @__PURE__ */ jsx(EditorKeyboardShortcuts, {}),
                /* @__PURE__ */ jsx(KeyboardShortcutHelpModal, {}),
                /* @__PURE__ */ jsx(BlockRemovalWarnings, {}),
                /* @__PURE__ */ jsx(StartPageOptions, {}),
                /* @__PURE__ */ jsx(StartTemplateOptions, {}),
                /* @__PURE__ */ jsx(PatternRenameModal, {}),
                /* @__PURE__ */ jsx(PatternDuplicateModal, {})
              ] })
            ]
          }
        ) })
      }
    ) });
  }
);
function EditorProvider(props) {
  return /* @__PURE__ */ jsx(
    ExperimentalEditorProvider,
    {
      ...props,
      BlockEditorProviderComponent: BlockEditorProvider,
      children: props.children
    }
  );
}
var provider_default = EditorProvider;
export {
  EditorProvider,
  ExperimentalEditorProvider,
  provider_default as default
};
//# sourceMappingURL=index.mjs.map
