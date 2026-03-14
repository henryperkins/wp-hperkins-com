// packages/editor/src/components/sidebar/post-summary.js
import {
  __experimentalVStack as VStack,
  ExternalLink
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import DataFormPostSummary from "./dataform-post-summary.mjs";
import PluginPostStatusInfo from "../plugin-post-status-info/index.mjs";
import PostAuthorPanel from "../post-author/panel.mjs";
import PostCardPanel from "../post-card-panel/index.mjs";
import PostContentInformation from "../post-content-information/index.mjs";
import PageAttributesPanel from "../page-attributes/panel.mjs";
import PostDiscussionPanel from "../post-discussion/panel.mjs";
import { PrivatePostExcerptPanel as PostExcerptPanel } from "../post-excerpt/panel.mjs";
import PostFeaturedImagePanel from "../post-featured-image/panel.mjs";
import PostFormatPanel from "../post-format/panel.mjs";
import PostLastEditedPanel from "../post-last-edited-panel/index.mjs";
import RevisionCreatedPanel from "../revision-created-panel/index.mjs";
import PostPanelSection from "../post-panel-section/index.mjs";
import PostSchedulePanel from "../post-schedule/panel.mjs";
import PostStatusPanel from "../post-status/index.mjs";
import PostSyncStatus from "../post-sync-status/index.mjs";
import PostTemplatePanel from "../post-template/panel.mjs";
import PostURLPanel from "../post-url/panel.mjs";
import BlogTitle from "../blog-title/index.mjs";
import PostsPerPage from "../posts-per-page/index.mjs";
import SiteDiscussion from "../site-discussion/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { PrivatePostLastRevision } from "../post-last-revision/index.mjs";
import PostTrash from "../post-trash/index.mjs";
import RevisionAuthorPanel from "../revision-author-panel/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var PANEL_NAME = "post-status";
function PostSummary({ onActionPerformed }) {
  const postType = useSelect(
    (select) => select(editorStore).getCurrentPostType(),
    []
  );
  if (window?.__experimentalDataFormInspector && ["page", "post"].includes(postType)) {
    return /* @__PURE__ */ jsx(DataFormPostSummary, { onActionPerformed });
  }
  return /* @__PURE__ */ jsx(ClassicPostSummary, { onActionPerformed });
}
function ClassicPostSummary({ onActionPerformed }) {
  const { isRemovedPostStatusPanel, postType, postId, revisionId } = useSelect((select) => {
    const {
      isEditorPanelRemoved,
      getCurrentPostType,
      getCurrentPostId,
      getCurrentRevisionId
    } = unlock(select(editorStore));
    return {
      isRemovedPostStatusPanel: isEditorPanelRemoved(PANEL_NAME),
      postType: getCurrentPostType(),
      postId: getCurrentPostId(),
      revisionId: getCurrentRevisionId()
    };
  }, []);
  const isRevisionsMode = !!revisionId;
  const shouldShowPostStatusPanel = !isRemovedPostStatusPanel && !isRevisionsMode;
  return /* @__PURE__ */ jsx(PostPanelSection, { className: "editor-post-summary", children: /* @__PURE__ */ jsx(PluginPostStatusInfo.Slot, { children: (fills) => /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
    /* @__PURE__ */ jsx(
      PostCardPanel,
      {
        postType,
        postId,
        onActionPerformed
      }
    ),
    !isRevisionsMode && /* @__PURE__ */ jsx(
      PostFeaturedImagePanel,
      {
        withPanelBody: false
      }
    ),
    !isRevisionsMode && /* @__PURE__ */ jsx(PostExcerptPanel, {}),
    /* @__PURE__ */ jsxs(VStack, { spacing: 1, children: [
      /* @__PURE__ */ jsx(PostContentInformation, {}),
      isRevisionsMode ? /* @__PURE__ */ jsx(RevisionCreatedPanel, {}) : /* @__PURE__ */ jsx(PostLastEditedPanel, {})
    ] }),
    isRevisionsMode && revisionId && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        ExternalLink,
        {
          href: addQueryArgs("revision.php", {
            revision: revisionId
          }),
          children: __(
            "Open classic revisions screen"
          )
        }
      ),
      /* @__PURE__ */ jsx(RevisionAuthorPanel, {})
    ] }),
    shouldShowPostStatusPanel && /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
      /* @__PURE__ */ jsxs(VStack, { spacing: 1, children: [
        /* @__PURE__ */ jsx(PostStatusPanel, {}),
        /* @__PURE__ */ jsx(PostSchedulePanel, {}),
        /* @__PURE__ */ jsx(PostURLPanel, {}),
        /* @__PURE__ */ jsx(PostAuthorPanel, {}),
        /* @__PURE__ */ jsx(PostTemplatePanel, {}),
        /* @__PURE__ */ jsx(PostDiscussionPanel, {}),
        /* @__PURE__ */ jsx(PrivatePostLastRevision, {}),
        /* @__PURE__ */ jsx(PageAttributesPanel, {}),
        /* @__PURE__ */ jsx(PostSyncStatus, {}),
        /* @__PURE__ */ jsx(BlogTitle, {}),
        /* @__PURE__ */ jsx(PostsPerPage, {}),
        /* @__PURE__ */ jsx(SiteDiscussion, {}),
        /* @__PURE__ */ jsx(PostFormatPanel, {}),
        fills
      ] }),
      /* @__PURE__ */ jsx(
        PostTrash,
        {
          onActionPerformed
        }
      )
    ] })
  ] }) }) }) });
}
export {
  PostSummary as default
};
//# sourceMappingURL=post-summary.mjs.map
