// packages/editor/src/components/editor/index.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { Notice } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { store as editorStore } from "../../store/index.mjs";
import { TEMPLATE_POST_TYPE } from "../../store/constants.mjs";
import EditorInterface from "../editor-interface/index.mjs";
import { ExperimentalEditorProvider } from "../provider/index.mjs";
import Sidebar from "../sidebar/index.mjs";
import NotesSidebar from "../collab-sidebar/index.mjs";
import GlobalStylesSidebar from "../global-styles-sidebar/index.mjs";
import { GlobalStylesRenderer } from "../global-styles-renderer/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Editor({
  postType,
  postId,
  templateId,
  settings,
  children,
  initialEdits,
  // This could be part of the settings.
  onActionPerformed,
  // The following abstractions are not ideal but necessary
  // to account for site editor and post editor differences for now.
  extraContent,
  extraSidebarPanels,
  ...props
}) {
  const {
    post,
    template,
    hasLoadedPost,
    error,
    isBlockTheme,
    showGlobalStyles
  } = useSelect(
    (select) => {
      const {
        getEntityRecord,
        getResolutionError,
        hasFinishedResolution,
        getCurrentTheme,
        __experimentalGetCurrentGlobalStylesId,
        canUser
      } = select(coreStore);
      const { getRenderingMode, getCurrentPostType } = select(editorStore);
      const postArgs = ["postType", postType, postId];
      const renderingMode = getRenderingMode();
      const currentPostType = getCurrentPostType();
      const _isBlockTheme = getCurrentTheme()?.is_block_theme;
      const globalStylesId = __experimentalGetCurrentGlobalStylesId();
      const userCanEditGlobalStyles = globalStylesId ? canUser("update", {
        kind: "root",
        name: "globalStyles",
        id: globalStylesId
      }) : false;
      return {
        post: getEntityRecord(...postArgs),
        template: templateId ? getEntityRecord(
          "postType",
          TEMPLATE_POST_TYPE,
          templateId
        ) : void 0,
        hasLoadedPost: hasFinishedResolution(
          "getEntityRecord",
          postArgs
        ),
        error: getResolutionError("getEntityRecord", postArgs)?.message,
        isBlockTheme: _isBlockTheme,
        showGlobalStyles: _isBlockTheme && userCanEditGlobalStyles && (currentPostType === "wp_template" || renderingMode === "template-locked")
      };
    },
    [postType, postId, templateId]
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    hasLoadedPost && !post && /* @__PURE__ */ jsx(
      Notice,
      {
        status: !!error ? "error" : "warning",
        isDismissible: false,
        children: !error ? __(
          "You attempted to edit an item that doesn't exist. Perhaps it was deleted?"
        ) : error
      }
    ),
    !!post && /* @__PURE__ */ jsxs(
      ExperimentalEditorProvider,
      {
        post,
        __unstableTemplate: template,
        settings,
        initialEdits,
        useSubRegistry: false,
        children: [
          /* @__PURE__ */ jsx(EditorInterface, { ...props, children: extraContent }),
          children,
          /* @__PURE__ */ jsx(
            Sidebar,
            {
              onActionPerformed,
              extraPanels: extraSidebarPanels
            }
          ),
          /* @__PURE__ */ jsx(NotesSidebar, {}),
          isBlockTheme && /* @__PURE__ */ jsx(GlobalStylesRenderer, {}),
          showGlobalStyles && /* @__PURE__ */ jsx(GlobalStylesSidebar, {})
        ]
      }
    )
  ] });
}
var editor_default = Editor;
export {
  editor_default as default
};
//# sourceMappingURL=index.mjs.map
