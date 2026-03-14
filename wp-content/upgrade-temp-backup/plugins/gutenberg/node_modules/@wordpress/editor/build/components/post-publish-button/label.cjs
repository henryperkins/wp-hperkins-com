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

// packages/editor/src/components/post-publish-button/label.js
var label_exports = {};
__export(label_exports, {
  default: () => PublishButtonLabel
});
module.exports = __toCommonJS(label_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_store = require("../../store/index.cjs");
var import_constants = require("../../store/constants.cjs");
function PublishButtonLabel() {
  const isSmallerThanMediumViewport = (0, import_compose.useViewportMatch)("medium", "<");
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
  } = (0, import_data.useSelect)((select) => {
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
    } = select(import_store.store);
    return {
      isPublished: isCurrentPostPublished(),
      isBeingScheduled: isEditedPostBeingScheduled(),
      isSaving: isSavingPost(),
      isPublishing: isPublishingPost(),
      hasPublishAction: getCurrentPost()._links?.["wp:action-publish"] ?? false,
      postType: getCurrentPostType(),
      isAutosaving: isAutosavingPost(),
      hasNonPostEntityChanges: select(import_store.store).hasNonPostEntityChanges(),
      postStatusHasChanged: !!getPostEdits()?.status,
      postStatus: getEditedPostAttribute("status")
    };
  }, []);
  if (isPublishing) {
    return (0, import_i18n.__)("Publishing\u2026");
  } else if ((isPublished || isBeingScheduled) && isSaving && !isAutosaving) {
    return (0, import_i18n.__)("Saving\u2026");
  }
  if (!hasPublishAction) {
    if (postType === import_constants.ATTACHMENT_POST_TYPE && window?.__experimentalMediaEditor) {
      return (0, import_i18n.__)("Save");
    }
    return isSmallerThanMediumViewport ? (0, import_i18n.__)("Publish") : (0, import_i18n.__)("Submit for Review");
  }
  if (hasNonPostEntityChanges || isPublished || postStatusHasChanged && !["future", "publish"].includes(postStatus) || !postStatusHasChanged && postStatus === "future") {
    return (0, import_i18n.__)("Save");
  }
  if (isBeingScheduled) {
    return (0, import_i18n.__)("Schedule");
  }
  return (0, import_i18n.__)("Publish");
}
//# sourceMappingURL=label.cjs.map
