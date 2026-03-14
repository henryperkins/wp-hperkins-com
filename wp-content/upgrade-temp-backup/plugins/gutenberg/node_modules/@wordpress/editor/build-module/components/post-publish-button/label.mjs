// packages/editor/src/components/post-publish-button/label.js
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { useViewportMatch } from "@wordpress/compose";
import { store as editorStore } from "../../store/index.mjs";
import { ATTACHMENT_POST_TYPE } from "../../store/constants.mjs";
function PublishButtonLabel() {
  const isSmallerThanMediumViewport = useViewportMatch("medium", "<");
  const {
    isPublished,
    isBeingScheduled,
    isSaving,
    isPublishing,
    hasPublishAction,
    isAutosaving,
    hasNonPostEntityChanges,
    postStatusHasChanged,
    postStatus,
    postType
  } = useSelect((select) => {
    const {
      isCurrentPostPublished,
      isEditedPostBeingScheduled,
      isSavingPost,
      isPublishingPost,
      getCurrentPost,
      getCurrentPostType,
      isAutosavingPost,
      getPostEdits,
      getEditedPostAttribute
    } = select(editorStore);
    return {
      isPublished: isCurrentPostPublished(),
      isBeingScheduled: isEditedPostBeingScheduled(),
      isSaving: isSavingPost(),
      isPublishing: isPublishingPost(),
      hasPublishAction: getCurrentPost()._links?.["wp:action-publish"] ?? false,
      postType: getCurrentPostType(),
      isAutosaving: isAutosavingPost(),
      hasNonPostEntityChanges: select(editorStore).hasNonPostEntityChanges(),
      postStatusHasChanged: !!getPostEdits()?.status,
      postStatus: getEditedPostAttribute("status")
    };
  }, []);
  if (isPublishing) {
    return __("Publishing\u2026");
  } else if ((isPublished || isBeingScheduled) && isSaving && !isAutosaving) {
    return __("Saving\u2026");
  }
  if (!hasPublishAction) {
    if (postType === ATTACHMENT_POST_TYPE && window?.__experimentalMediaEditor) {
      return __("Save");
    }
    return isSmallerThanMediumViewport ? __("Publish") : __("Submit for Review");
  }
  if (hasNonPostEntityChanges || isPublished || postStatusHasChanged && !["future", "publish"].includes(postStatus) || !postStatusHasChanged && postStatus === "future") {
    return __("Save");
  }
  if (isBeingScheduled) {
    return __("Schedule");
  }
  return __("Publish");
}
export {
  PublishButtonLabel as default
};
//# sourceMappingURL=label.mjs.map
