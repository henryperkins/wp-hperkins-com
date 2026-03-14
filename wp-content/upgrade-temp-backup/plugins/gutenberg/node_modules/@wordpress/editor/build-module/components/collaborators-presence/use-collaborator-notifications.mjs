// packages/editor/src/components/collaborators-presence/use-collaborator-notifications.ts
import { usePrevious } from "@wordpress/compose";
import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { store as noticesStore } from "@wordpress/notices";
import {
  privateApis
} from "@wordpress/core-data";
import { unlock } from "../../lock-unlock.mjs";
import { store as editorStore } from "../../store/index.mjs";
var { useActiveCollaborators, useLastPostSave } = unlock(privateApis);
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
    return sprintf(__("Post published by %s."), name);
  }
  if (PUBLISHED_STATUSES.includes(status)) {
    return sprintf(__("Post updated by %s."), name);
  }
  return sprintf(__("Draft saved by %s."), name);
}
function useCollaboratorNotifications(postId, postType) {
  const activeCollaborators = useActiveCollaborators(
    postId,
    postType
  );
  const lastPostSave = useLastPostSave(postId, postType);
  const { postStatus, isCollaborationEnabled } = useSelect((select) => {
    const editorSel = select(editorStore);
    return {
      postStatus: editorSel.getCurrentPostAttribute("status"),
      isCollaborationEnabled: editorSel.isCollaborationEnabledForCurrentPost()
    };
  }, []);
  const { createNotice } = useDispatch(noticesStore);
  const prevCollaborators = usePrevious(activeCollaborators);
  const prevPostSave = usePrevious(lastPostSave);
  useEffect(() => {
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
          sprintf(
            /* translators: %s: collaborator display name */
            __("%s has joined the post."),
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
          sprintf(
            /* translators: %s: collaborator display name */
            __("%s has left the post."),
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
  useEffect(() => {
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
export {
  useCollaboratorNotifications
};
//# sourceMappingURL=use-collaborator-notifications.mjs.map
