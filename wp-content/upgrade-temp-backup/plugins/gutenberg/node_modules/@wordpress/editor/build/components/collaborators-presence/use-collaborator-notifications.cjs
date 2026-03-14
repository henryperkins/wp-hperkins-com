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

// packages/editor/src/components/collaborators-presence/use-collaborator-notifications.ts
var use_collaborator_notifications_exports = {};
__export(use_collaborator_notifications_exports, {
  useCollaboratorNotifications: () => useCollaboratorNotifications
});
module.exports = __toCommonJS(use_collaborator_notifications_exports);
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_notices = require("@wordpress/notices");
var import_core_data = require("@wordpress/core-data");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var { useActiveCollaborators, useLastPostSave } = (0, import_lock_unlock.unlock)(import_core_data.privateApis);
var NOTIFICATION_TYPE = {
  COLLAB_POST_UPDATED: "collab-post-updated",
  COLLAB_USER_ENTERED: "collab-user-entered",
  COLLAB_USER_EXITED: "collab-user-exited"
};
var NOTIFICATIONS_CONFIG = {
  userEntered: true,
  userExited: true,
  postUpdated: true
};
var PUBLISHED_STATUSES = ["publish", "private", "future"];
function getPostUpdatedMessage(name, status, isFirstPublish) {
  if (isFirstPublish) {
    return (0, import_i18n.sprintf)((0, import_i18n.__)("Post published by %s."), name);
  }
  if (PUBLISHED_STATUSES.includes(status)) {
    return (0, import_i18n.sprintf)((0, import_i18n.__)("Post updated by %s."), name);
  }
  return (0, import_i18n.sprintf)((0, import_i18n.__)("Draft saved by %s."), name);
}
function useCollaboratorNotifications(postId, postType) {
  const activeCollaborators = useActiveCollaborators(
    postId,
    postType
  );
  const lastPostSave = useLastPostSave(postId, postType);
  const { postStatus, isCollaborationEnabled } = (0, import_data.useSelect)((select) => {
    const editorSel = select(import_store.store);
    return {
      postStatus: editorSel.getCurrentPostAttribute("status"),
      isCollaborationEnabled: editorSel.isCollaborationEnabledForCurrentPost()
    };
  }, []);
  const { createNotice } = (0, import_data.useDispatch)(import_notices.store);
  const prevCollaborators = (0, import_compose.usePrevious)(activeCollaborators);
  const prevPostSave = (0, import_compose.usePrevious)(lastPostSave);
  (0, import_element.useEffect)(() => {
    if (!isCollaborationEnabled) {
      return;
    }
    if (!prevCollaborators || prevCollaborators.length === 0) {
      return;
    }
    function notify(noticeId, message) {
      void createNotice("info", message, {
        id: noticeId,
        type: "snackbar",
        isDismissible: false
      });
    }
    const prevMap = new Map(
      prevCollaborators.map((c) => [c.clientId, c])
    );
    const newMap = new Map(
      activeCollaborators.map((c) => [c.clientId, c])
    );
    if (NOTIFICATIONS_CONFIG.userEntered) {
      const me = activeCollaborators.find((c) => c.isMe);
      for (const [clientId, collaborator] of newMap) {
        if (prevMap.has(clientId) || collaborator.isMe) {
          continue;
        }
        if (me && collaborator.collaboratorInfo.enteredAt < me.collaboratorInfo.enteredAt) {
          continue;
        }
        notify(
          `${NOTIFICATION_TYPE.COLLAB_USER_ENTERED}-${collaborator.collaboratorInfo.id}`,
          (0, import_i18n.sprintf)(
            /* translators: %s: collaborator display name */
            (0, import_i18n.__)("%s has joined the post."),
            collaborator.collaboratorInfo.name
          )
        );
      }
    }
    if (NOTIFICATIONS_CONFIG.userExited) {
      for (const [clientId, prevCollab] of prevMap) {
        if (prevCollab.isMe || !prevCollab.isConnected) {
          continue;
        }
        const newCollab = newMap.get(clientId);
        if (newCollab?.isConnected) {
          continue;
        }
        notify(
          `${NOTIFICATION_TYPE.COLLAB_USER_EXITED}-${prevCollab.collaboratorInfo.id}`,
          (0, import_i18n.sprintf)(
            /* translators: %s: collaborator display name */
            (0, import_i18n.__)("%s has left the post."),
            prevCollab.collaboratorInfo.name
          )
        );
      }
    }
  }, [
    activeCollaborators,
    prevCollaborators,
    isCollaborationEnabled,
    createNotice
  ]);
  (0, import_element.useEffect)(() => {
    if (!isCollaborationEnabled || !NOTIFICATIONS_CONFIG.postUpdated || !lastPostSave || !postStatus) {
      return;
    }
    if (prevPostSave && lastPostSave.savedAt === prevPostSave.savedAt) {
      return;
    }
    const saver = activeCollaborators.find(
      (c) => c.clientId === lastPostSave.savedByClientId && !c.isMe
    );
    if (!saver) {
      return;
    }
    const effectiveStatus = lastPostSave.postStatus ?? postStatus ?? "draft";
    const prevStatus = prevPostSave?.postStatus ?? postStatus;
    const isFirstPublish = !(prevStatus && PUBLISHED_STATUSES.includes(prevStatus)) && PUBLISHED_STATUSES.includes(effectiveStatus);
    const message = getPostUpdatedMessage(
      saver.collaboratorInfo.name,
      effectiveStatus,
      isFirstPublish
    );
    void createNotice("info", message, {
      id: `${NOTIFICATION_TYPE.COLLAB_POST_UPDATED}-${saver.collaboratorInfo.id}`,
      type: "snackbar",
      isDismissible: false
    });
  }, [
    lastPostSave,
    prevPostSave,
    activeCollaborators,
    isCollaborationEnabled,
    postStatus,
    createNotice
  ]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useCollaboratorNotifications
});
//# sourceMappingURL=use-collaborator-notifications.cjs.map
