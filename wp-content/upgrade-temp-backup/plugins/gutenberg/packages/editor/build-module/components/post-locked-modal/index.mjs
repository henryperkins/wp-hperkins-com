// packages/editor/src/components/post-locked-modal/index.js
import { __, sprintf } from "@wordpress/i18n";
import {
  Modal,
  Button,
  ExternalLink,
  __experimentalHStack as HStack,
  withFilters
} from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { addQueryArgs } from "@wordpress/url";
import { useEffect, createInterpolateElement } from "@wordpress/element";
import { addAction, removeAction } from "@wordpress/hooks";
import { useInstanceId } from "@wordpress/compose";
import { store as coreStore } from "@wordpress/core-data";
import { unlock } from "../../lock-unlock.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function CollaborationContext() {
  const isCollaborationSupported = useSelect((select) => {
    return unlock(select(coreStore)).isCollaborationSupported();
  }, []);
  if (isCollaborationSupported) {
    return null;
  }
  return /* @__PURE__ */ jsx("p", { children: __(
    "Because this post uses plugins that aren\u2019t compatible with real-time collaboration, only one person can edit at a time."
  ) });
}
function PostLockedModal() {
  const instanceId = useInstanceId(PostLockedModal);
  const hookName = "core/editor/post-locked-modal-" + instanceId;
  const { autosave, updatePostLock } = useDispatch(editorStore);
  const {
    isCollaborationEnabled,
    isLocked,
    isTakeover,
    user,
    postId,
    postLockUtils,
    activePostLock,
    postType,
    previewLink
  } = useSelect((select) => {
    const {
      isCollaborationEnabledForCurrentPost,
      isPostLocked,
      isPostLockTakeover,
      getPostLockUser,
      getCurrentPostId,
      getActivePostLock,
      getEditedPostAttribute,
      getEditedPostPreviewLink,
      getEditorSettings
    } = select(editorStore);
    const { getPostType } = select(coreStore);
    return {
      isCollaborationEnabled: isCollaborationEnabledForCurrentPost(),
      isLocked: isPostLocked(),
      isTakeover: isPostLockTakeover(),
      user: getPostLockUser(),
      postId: getCurrentPostId(),
      postLockUtils: getEditorSettings().postLockUtils,
      activePostLock: getActivePostLock(),
      postType: getPostType(getEditedPostAttribute("type")),
      previewLink: getEditedPostPreviewLink()
    };
  }, []);
  useEffect(() => {
    function sendPostLock(data) {
      if (isLocked) {
        return;
      }
      data["wp-refresh-post-lock"] = {
        lock: activePostLock,
        post_id: postId
      };
    }
    function receivePostLock(data) {
      if (!data["wp-refresh-post-lock"]) {
        return;
      }
      const received = data["wp-refresh-post-lock"];
      if (received.lock_error) {
        autosave();
        updatePostLock({
          isLocked: true,
          isTakeover: true,
          user: {
            name: received.lock_error.name,
            avatar: received.lock_error.avatar_src_2x
          }
        });
      } else if (received.new_lock) {
        updatePostLock({
          isLocked: false,
          activePostLock: received.new_lock
        });
      }
    }
    function releasePostLock() {
      if (isLocked || !activePostLock) {
        return;
      }
      const data = new window.FormData();
      data.append("action", "wp-remove-post-lock");
      data.append("_wpnonce", postLockUtils.unlockNonce);
      data.append("post_ID", postId);
      data.append("active_post_lock", activePostLock);
      if (window.navigator.sendBeacon) {
        window.navigator.sendBeacon(postLockUtils.ajaxUrl, data);
      } else {
        const xhr = new window.XMLHttpRequest();
        xhr.open("POST", postLockUtils.ajaxUrl, false);
        xhr.send(data);
      }
    }
    addAction("heartbeat.send", hookName, sendPostLock);
    addAction("heartbeat.tick", hookName, receivePostLock);
    window.addEventListener("beforeunload", releasePostLock);
    return () => {
      removeAction("heartbeat.send", hookName);
      removeAction("heartbeat.tick", hookName);
      window.removeEventListener("beforeunload", releasePostLock);
    };
  }, []);
  if (!isLocked) {
    return null;
  }
  if (isCollaborationEnabled) {
    return null;
  }
  const userDisplayName = user.name;
  const userAvatar = user.avatar;
  const unlockUrl = addQueryArgs("post.php", {
    "get-post-lock": "1",
    lockKey: true,
    post: postId,
    action: "edit",
    _wpnonce: postLockUtils.nonce
  });
  const allPostsUrl = addQueryArgs("edit.php", {
    post_type: postType?.slug
  });
  const allPostsLabel = __("Exit editor");
  return /* @__PURE__ */ jsx(
    Modal,
    {
      title: isTakeover ? __("Someone else has taken over this post") : __("This post is already being edited"),
      focusOnMount: true,
      shouldCloseOnClickOutside: false,
      shouldCloseOnEsc: false,
      isDismissible: false,
      className: "editor-post-locked-modal",
      size: "medium",
      children: /* @__PURE__ */ jsxs(HStack, { alignment: "top", spacing: 6, children: [
        !!userAvatar && /* @__PURE__ */ jsx(
          "img",
          {
            src: userAvatar,
            alt: __("Avatar"),
            className: "editor-post-locked-modal__avatar",
            width: 64,
            height: 64
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          !!isTakeover && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("p", { children: createInterpolateElement(
              userDisplayName ? sprintf(
                /* translators: %s: user's display name */
                __(
                  "<strong>%s</strong> now has editing control of this post (<PreviewLink />). Don\u2019t worry, your changes up to this moment have been saved."
                ),
                userDisplayName
              ) : __(
                "Another user now has editing control of this post (<PreviewLink />). Don\u2019t worry, your changes up to this moment have been saved."
              ),
              {
                strong: /* @__PURE__ */ jsx("strong", {}),
                PreviewLink: /* @__PURE__ */ jsx(ExternalLink, { href: previewLink, children: __("preview") })
              }
            ) }),
            /* @__PURE__ */ jsx(CollaborationContext, {})
          ] }),
          !isTakeover && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("p", { children: createInterpolateElement(
              userDisplayName ? sprintf(
                /* translators: %s: user's display name */
                __(
                  "<strong>%s</strong> is currently working on this post (<PreviewLink />), which means you cannot make changes, unless you take over."
                ),
                userDisplayName
              ) : __(
                "Another user is currently working on this post (<PreviewLink />), which means you cannot make changes, unless you take over."
              ),
              {
                strong: /* @__PURE__ */ jsx("strong", {}),
                PreviewLink: /* @__PURE__ */ jsx(ExternalLink, { href: previewLink, children: __("preview") })
              }
            ) }),
            /* @__PURE__ */ jsx(CollaborationContext, {}),
            /* @__PURE__ */ jsx("p", { children: __(
              "If you take over, the other user will lose editing control to the post, but their changes will be saved."
            ) })
          ] }),
          /* @__PURE__ */ jsxs(
            HStack,
            {
              className: "editor-post-locked-modal__buttons",
              justify: "flex-end",
              children: [
                !isTakeover && /* @__PURE__ */ jsx(
                  Button,
                  {
                    __next40pxDefaultSize: true,
                    variant: "tertiary",
                    href: unlockUrl,
                    children: __("Take over")
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    __next40pxDefaultSize: true,
                    variant: "primary",
                    href: allPostsUrl,
                    children: allPostsLabel
                  }
                )
              ]
            }
          )
        ] })
      ] })
    }
  );
}
var post_locked_modal_default = globalThis.IS_GUTENBERG_PLUGIN ? withFilters("editor.PostLockedModal")(PostLockedModal) : PostLockedModal;
export {
  post_locked_modal_default as default
};
//# sourceMappingURL=index.mjs.map
