// packages/editor/src/store/utils/notice-builder.js
import { __ } from "@wordpress/i18n";
import { ATTACHMENT_POST_TYPE } from "../constants.mjs";
function getNotificationArgumentsForSaveSuccess(data) {
  const { previousPost, post, postType } = data;
  if (data.options?.isAutosave) {
    return [];
  }
  const publishStatus = ["publish", "private", "future"];
  const isPublished = publishStatus.includes(previousPost.status);
  const willPublish = publishStatus.includes(post.status);
  const willTrash = post.status === "trash" && previousPost.status !== "trash";
  let noticeMessage;
  let shouldShowLink = postType?.viewable ?? false;
  let isDraft;
  if (willTrash) {
    noticeMessage = postType.labels.item_trashed;
    shouldShowLink = false;
  } else if (post.type === ATTACHMENT_POST_TYPE) {
    noticeMessage = __("Media updated.");
    shouldShowLink = false;
  } else if (!isPublished && !willPublish) {
    noticeMessage = __("Draft saved.");
    isDraft = true;
  } else if (isPublished && !willPublish) {
    noticeMessage = postType.labels.item_reverted_to_draft;
    shouldShowLink = false;
  } else if (!isPublished && willPublish) {
    noticeMessage = {
      publish: postType.labels.item_published,
      private: postType.labels.item_published_privately,
      future: postType.labels.item_scheduled
    }[post.status];
  } else {
    noticeMessage = postType.labels.item_updated;
  }
  const actions = [];
  if (shouldShowLink) {
    actions.push({
      label: isDraft ? __("View Preview") : postType.labels.view_item,
      url: post.link,
      openInNewTab: true
    });
  }
  return [
    noticeMessage,
    {
      id: "editor-save",
      type: "snackbar",
      actions
    }
  ];
}
function getNotificationArgumentsForSaveFail(data) {
  const { post, edits, error } = data;
  if (error && "rest_autosave_no_changes" === error.code) {
    return [];
  }
  const publishStatus = ["publish", "private", "future"];
  const isPublished = publishStatus.indexOf(post.status) !== -1;
  if (error.code === "offline_error") {
    const messages2 = {
      publish: __(
        "Publishing failed because you were offline. Please verify your connection and try again."
      ),
      private: __(
        "Publishing failed because you were offline. Please verify your connection and try again."
      ),
      future: __(
        "Scheduling failed because you were offline. Please verify your connection and try again."
      ),
      default: __(
        "Updating failed because you were offline. Please verify your connection and try again."
      )
    };
    const noticeMessage2 = !isPublished && edits.status in messages2 ? messages2[edits.status] : messages2.default;
    return [noticeMessage2, { id: "editor-save" }];
  }
  const messages = {
    publish: __("Publishing failed."),
    private: __("Publishing failed."),
    future: __("Scheduling failed."),
    default: __("Updating failed.")
  };
  let noticeMessage = !isPublished && edits.status in messages ? messages[edits.status] : messages.default;
  if (error.message && !/<\/?[^>]*>/.test(error.message)) {
    noticeMessage = [noticeMessage, error.message].join(" ");
  }
  return [
    noticeMessage,
    {
      id: "editor-save"
    }
  ];
}
function getNotificationArgumentsForTrashFail(data) {
  return [
    data.error.message && data.error.code !== "unknown_error" ? data.error.message : __("Trashing failed"),
    {
      id: "editor-trash-fail"
    }
  ];
}
export {
  getNotificationArgumentsForSaveFail,
  getNotificationArgumentsForSaveSuccess,
  getNotificationArgumentsForTrashFail
};
//# sourceMappingURL=notice-builder.mjs.map
