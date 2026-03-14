"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/store/utils/notice-builder.js
var notice_builder_exports = {};
__export(notice_builder_exports, {
  getNotificationArgumentsForSaveFail: () => getNotificationArgumentsForSaveFail,
  getNotificationArgumentsForSaveSuccess: () => getNotificationArgumentsForSaveSuccess,
  getNotificationArgumentsForTrashFail: () => getNotificationArgumentsForTrashFail
});
module.exports = __toCommonJS(notice_builder_exports);
var import_i18n = require("@wordpress/i18n");
var import_constants = require("../constants.cjs");
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
  } else if (post.type === import_constants.ATTACHMENT_POST_TYPE) {
    noticeMessage = (0, import_i18n.__)("Media updated.");
    shouldShowLink = false;
  } else if (!isPublished && !willPublish) {
    noticeMessage = (0, import_i18n.__)("Draft saved.");
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
      label: isDraft ? (0, import_i18n.__)("View Preview") : postType.labels.view_item,
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
      publish: (0, import_i18n.__)(
        "Publishing failed because you were offline. Please verify your connection and try again."
      ),
      private: (0, import_i18n.__)(
        "Publishing failed because you were offline. Please verify your connection and try again."
      ),
      future: (0, import_i18n.__)(
        "Scheduling failed because you were offline. Please verify your connection and try again."
      ),
      default: (0, import_i18n.__)(
        "Updating failed because you were offline. Please verify your connection and try again."
      )
    };
    const noticeMessage2 = !isPublished && edits.status in messages2 ? messages2[edits.status] : messages2.default;
    return [noticeMessage2, { id: "editor-save" }];
  }
  const messages = {
    publish: (0, import_i18n.__)("Publishing failed."),
    private: (0, import_i18n.__)("Publishing failed."),
    future: (0, import_i18n.__)("Scheduling failed."),
    default: (0, import_i18n.__)("Updating failed.")
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
    data.error.message && data.error.code !== "unknown_error" ? data.error.message : (0, import_i18n.__)("Trashing failed"),
    {
      id: "editor-trash-fail"
    }
  ];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getNotificationArgumentsForSaveFail,
  getNotificationArgumentsForSaveSuccess,
  getNotificationArgumentsForTrashFail
});
//# sourceMappingURL=notice-builder.cjs.map
