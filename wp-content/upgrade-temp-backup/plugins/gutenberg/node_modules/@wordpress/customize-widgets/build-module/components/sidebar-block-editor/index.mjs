// packages/customize-widgets/src/components/sidebar-block-editor/index.js
import { useViewportMatch } from "@wordpress/compose";
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { useMemo, createPortal } from "@wordpress/element";
import {
  BlockList,
  BlockToolbar,
  BlockInspector,
  privateApis as blockEditorPrivateApis,
  __unstableBlockSettingsMenuFirstItem
} from "@wordpress/block-editor";
import { uploadMedia } from "@wordpress/media-utils";
import { store as preferencesStore } from "@wordpress/preferences";
import { privateApis as blockLibraryPrivateApis } from "@wordpress/block-library";
import BlockInspectorButton from "../block-inspector-button/index.mjs";
import Header from "../header/index.mjs";
import useInserter from "../inserter/use-inserter.mjs";
import SidebarEditorProvider from "./sidebar-editor-provider.mjs";
import WelcomeGuide from "../welcome-guide/index.mjs";
import KeyboardShortcuts from "../keyboard-shortcuts/index.mjs";
import BlockAppender from "../block-appender/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { ExperimentalBlockCanvas: BlockCanvas } = unlock(
  blockEditorPrivateApis
);
var { BlockKeyboardShortcuts } = unlock(blockLibraryPrivateApis);
function SidebarBlockEditor({
  blockEditorSettings,
  sidebar,
  inserter,
  inspector
}) {
  const [isInserterOpened, setIsInserterOpened] = useInserter(inserter);
  const isMediumViewport = useViewportMatch("small");
  const {
    hasUploadPermissions,
    isFixedToolbarActive,
    keepCaretInsideBlock,
    isWelcomeGuideActive
  } = useSelect((select) => {
    const { get } = select(preferencesStore);
    return {
      hasUploadPermissions: select(coreStore).canUser("create", {
        kind: "postType",
        name: "attachment"
      }) ?? true,
      isFixedToolbarActive: !!get(
        "core/customize-widgets",
        "fixedToolbar"
      ),
      keepCaretInsideBlock: !!get(
        "core/customize-widgets",
        "keepCaretInsideBlock"
      ),
      isWelcomeGuideActive: !!get(
        "core/customize-widgets",
        "welcomeGuide"
      )
    };
  }, []);
  const settings = useMemo(() => {
    let mediaUploadBlockEditor;
    if (hasUploadPermissions) {
      mediaUploadBlockEditor = ({ onError, ...argumentsObject }) => {
        uploadMedia({
          wpAllowedMimeTypes: blockEditorSettings.allowedMimeTypes,
          onError: ({ message }) => onError(message),
          ...argumentsObject
        });
      };
    }
    return {
      ...blockEditorSettings,
      __experimentalSetIsInserterOpened: setIsInserterOpened,
      mediaUpload: mediaUploadBlockEditor,
      hasFixedToolbar: isFixedToolbarActive || !isMediumViewport,
      keepCaretInsideBlock,
      editorTool: "edit",
      __unstableHasCustomAppender: true
    };
  }, [
    hasUploadPermissions,
    blockEditorSettings,
    isFixedToolbarActive,
    isMediumViewport,
    keepCaretInsideBlock,
    setIsInserterOpened
  ]);
  if (isWelcomeGuideActive) {
    return /* @__PURE__ */ jsx(WelcomeGuide, { sidebar });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(KeyboardShortcuts.Register, {}),
    /* @__PURE__ */ jsx(BlockKeyboardShortcuts, {}),
    /* @__PURE__ */ jsxs(SidebarEditorProvider, { sidebar, settings, children: [
      /* @__PURE__ */ jsx(
        KeyboardShortcuts,
        {
          undo: sidebar.undo,
          redo: sidebar.redo,
          save: sidebar.save
        }
      ),
      /* @__PURE__ */ jsx(
        Header,
        {
          sidebar,
          inserter,
          isInserterOpened,
          setIsInserterOpened,
          isFixedToolbarActive: isFixedToolbarActive || !isMediumViewport
        }
      ),
      (isFixedToolbarActive || !isMediumViewport) && /* @__PURE__ */ jsx(BlockToolbar, { hideDragHandle: true }),
      /* @__PURE__ */ jsx(
        BlockCanvas,
        {
          shouldIframe: false,
          styles: settings.defaultEditorStyles,
          height: "100%",
          children: /* @__PURE__ */ jsx(BlockList, { renderAppender: BlockAppender })
        }
      ),
      createPortal(
        // This is a temporary hack to prevent button component inside <BlockInspector>
        // from submitting form when type="button" is not specified.
        /* @__PURE__ */ jsx("form", { onSubmit: (event) => event.preventDefault(), children: /* @__PURE__ */ jsx(BlockInspector, {}) }),
        inspector.contentContainer[0]
      )
    ] }),
    /* @__PURE__ */ jsx(__unstableBlockSettingsMenuFirstItem, { children: ({ onClose }) => /* @__PURE__ */ jsx(
      BlockInspectorButton,
      {
        inspector,
        closeMenu: onClose
      }
    ) })
  ] });
}
export {
  SidebarBlockEditor as default
};
//# sourceMappingURL=index.mjs.map
