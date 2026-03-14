// packages/editor/src/components/header/index.js
import { store as blockEditorStore } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { useMediaQuery, useViewportMatch } from "@wordpress/compose";
import { store as preferencesStore } from "@wordpress/preferences";
import { useState } from "@wordpress/element";
import { PinnedItems } from "@wordpress/interface";
import CollapsibleBlockToolbar from "../collapsible-block-toolbar/index.mjs";
import DocumentBar from "../document-bar/index.mjs";
import DocumentTools from "../document-tools/index.mjs";
import HeaderSkeleton from "./header-skeleton.mjs";
import MoreMenu from "../more-menu/index.mjs";
import PostPreviewButton from "../post-preview-button/index.mjs";
import PostPublishButtonOrToggle from "../post-publish-button/post-publish-button-or-toggle.mjs";
import PostSavedState from "../post-saved-state/index.mjs";
import PostViewLink from "../post-view-link/index.mjs";
import PreviewDropdown from "../preview-dropdown/index.mjs";
import ZoomOutToggle from "../zoom-out-toggle/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import {
  ATTACHMENT_POST_TYPE,
  TEMPLATE_PART_POST_TYPE,
  PATTERN_POST_TYPE,
  NAVIGATION_POST_TYPE
} from "../../store/constants.mjs";
import { CollaboratorsPresence } from "../collaborators-presence/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Header({
  customSaveButton,
  forceIsDirty,
  setEntitiesSavedStatesCallback
}) {
  const isWideViewport = useViewportMatch("large");
  const isLargeViewport = useViewportMatch("medium");
  const isTooNarrowForDocumentBar = useMediaQuery("(max-width: 403px)");
  const {
    postId,
    postType,
    isTextEditor,
    isPublishSidebarOpened,
    showIconLabels,
    hasFixedToolbar,
    hasBlockSelection,
    hasSectionRootClientId,
    isStylesCanvasActive,
    isAttachment
  } = useSelect((select) => {
    const { get: getPreference } = select(preferencesStore);
    const {
      getEditorMode,
      getCurrentPostType,
      getCurrentPostId,
      isPublishSidebarOpened: _isPublishSidebarOpened
    } = select(editorStore);
    const { getStylesPath, getShowStylebook } = unlock(
      select(editorStore)
    );
    const { getBlockSelectionStart, getSectionRootClientId } = unlock(
      select(blockEditorStore)
    );
    return {
      postId: getCurrentPostId(),
      postType: getCurrentPostType(),
      isTextEditor: getEditorMode() === "text",
      isPublishSidebarOpened: _isPublishSidebarOpened(),
      showIconLabels: getPreference("core", "showIconLabels"),
      hasFixedToolbar: getPreference("core", "fixedToolbar"),
      hasBlockSelection: !!getBlockSelectionStart(),
      hasSectionRootClientId: !!getSectionRootClientId(),
      isStylesCanvasActive: !!getStylesPath()?.startsWith("/revisions") || getShowStylebook(),
      isAttachment: getCurrentPostType() === ATTACHMENT_POST_TYPE && window?.__experimentalMediaEditor
    };
  }, []);
  const canBeZoomedOut = ["post", "page", "wp_template"].includes(postType) && hasSectionRootClientId;
  const disablePreviewOption = [
    ATTACHMENT_POST_TYPE,
    NAVIGATION_POST_TYPE,
    TEMPLATE_PART_POST_TYPE,
    PATTERN_POST_TYPE
  ].includes(postType) || isStylesCanvasActive;
  const [isBlockToolsCollapsed, setIsBlockToolsCollapsed] = useState(true);
  const hasCenter = !isTooNarrowForDocumentBar && (!hasFixedToolbar || hasFixedToolbar && (!hasBlockSelection || isBlockToolsCollapsed));
  return /* @__PURE__ */ jsx(
    HeaderSkeleton,
    {
      toolbar: /* @__PURE__ */ jsxs(Fragment, { children: [
        !isAttachment && /* @__PURE__ */ jsx(
          DocumentTools,
          {
            disableBlockTools: isStylesCanvasActive || isTextEditor
          }
        ),
        hasFixedToolbar && isLargeViewport && /* @__PURE__ */ jsx(
          CollapsibleBlockToolbar,
          {
            isCollapsed: isBlockToolsCollapsed,
            onToggle: setIsBlockToolsCollapsed
          }
        )
      ] }),
      center: hasCenter ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          CollaboratorsPresence,
          {
            postType,
            postId
          }
        ),
        /* @__PURE__ */ jsx(DocumentBar, {})
      ] }) : void 0,
      settings: /* @__PURE__ */ jsxs(Fragment, { children: [
        !customSaveButton && !isPublishSidebarOpened && /*
         * This button isn't completely hidden by the publish sidebar.
         * We can't hide the whole toolbar when the publish sidebar is open because
         * we want to prevent mounting/unmounting the PostPublishButtonOrToggle DOM node.
         * We track that DOM node to return focus to the PostPublishButtonOrToggle
         * when the publish sidebar has been closed.
         */
        /* @__PURE__ */ jsx(PostSavedState, { forceIsDirty }),
        /* @__PURE__ */ jsx(PostViewLink, {}),
        /* @__PURE__ */ jsx(
          PreviewDropdown,
          {
            forceIsAutosaveable: forceIsDirty,
            disabled: disablePreviewOption
          }
        ),
        /* @__PURE__ */ jsx(
          PostPreviewButton,
          {
            className: "editor-header__post-preview-button",
            forceIsAutosaveable: forceIsDirty
          }
        ),
        isWideViewport && canBeZoomedOut && /* @__PURE__ */ jsx(ZoomOutToggle, { disabled: isStylesCanvasActive }),
        (isWideViewport || !showIconLabels) && /* @__PURE__ */ jsx(PinnedItems.Slot, { scope: "core" }),
        !customSaveButton && /* @__PURE__ */ jsx(
          PostPublishButtonOrToggle,
          {
            forceIsDirty,
            setEntitiesSavedStatesCallback
          }
        ),
        customSaveButton,
        !isAttachment && /* @__PURE__ */ jsx(MoreMenu, {})
      ] })
    }
  );
}
var header_default = Header;
export {
  header_default as default
};
//# sourceMappingURL=index.mjs.map
