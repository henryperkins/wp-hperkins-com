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

// packages/editor/src/components/post-locked-modal/index.js
var post_locked_modal_exports = {};
__export(post_locked_modal_exports, {
  default: () => post_locked_modal_default
});
module.exports = __toCommonJS(post_locked_modal_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_url = require("@wordpress/url");
var import_element = require("@wordpress/element");
var import_hooks = require("@wordpress/hooks");
var import_compose = require("@wordpress/compose");
var import_core_data = require("@wordpress/core-data");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function CollaborationContext() {
  const isCollaborationSupported = (0, import_data.useSelect)((select) => {
    return (0, import_lock_unlock.unlock)(select(import_core_data.store)).isCollaborationSupported();
  }, []);
  if (isCollaborationSupported) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)(
    "Because this post uses plugins that aren\u2019t compatible with real-time collaboration, only one person can edit at a time."
  ) });
}
function PostLockedModal() {
  const instanceId = (0, import_compose.useInstanceId)(PostLockedModal);
  const hookName = "core/editor/post-locked-modal-" + instanceId;
  const { autosave, updatePostLock } = (0, import_data.useDispatch)(import_store.store);
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
  } = (0, import_data.useSelect)((select) => {
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
    } = select(import_store.store);
    const { getPostType } = select(import_core_data.store);
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
  (0, import_element.useEffect)(() => {
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
    (0, import_hooks.addAction)("heartbeat.send", hookName, sendPostLock);
    (0, import_hooks.addAction)("heartbeat.tick", hookName, receivePostLock);
    window.addEventListener("beforeunload", releasePostLock);
    return () => {
      (0, import_hooks.removeAction)("heartbeat.send", hookName);
      (0, import_hooks.removeAction)("heartbeat.tick", hookName);
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
  const unlockUrl = (0, import_url.addQueryArgs)("post.php", {
    "get-post-lock": "1",
    lockKey: true,
    post: postId,
    action: "edit",
    _wpnonce: postLockUtils.nonce
  });
  const allPostsUrl = (0, import_url.addQueryArgs)("edit.php", {
    post_type: postType?.slug
  });
  const allPostsLabel = (0, import_i18n.__)("Exit editor");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Modal,
    {
      title: isTakeover ? (0, import_i18n.__)("Someone else has taken over this post") : (0, import_i18n.__)("This post is already being edited"),
      focusOnMount: true,
      shouldCloseOnClickOutside: false,
      shouldCloseOnEsc: false,
      isDismissible: false,
      className: "editor-post-locked-modal",
      size: "medium",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { alignment: "top", spacing: 6, children: [
        !!userAvatar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "img",
          {
            src: userAvatar,
            alt: (0, import_i18n.__)("Avatar"),
            className: "editor-post-locked-modal__avatar",
            width: 64,
            height: 64
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          !!isTakeover && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_element.createInterpolateElement)(
              userDisplayName ? (0, import_i18n.sprintf)(
                /* translators: %s: user's display name */
                (0, import_i18n.__)(
                  "<strong>%s</strong> now has editing control of this post (<PreviewLink />). Don\u2019t worry, your changes up to this moment have been saved."
                ),
                userDisplayName
              ) : (0, import_i18n.__)(
                "Another user now has editing control of this post (<PreviewLink />). Don\u2019t worry, your changes up to this moment have been saved."
              ),
              {
                strong: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {}),
                PreviewLink: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ExternalLink, { href: previewLink, children: (0, import_i18n.__)("preview") })
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollaborationContext, {})
          ] }),
          !isTakeover && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_element.createInterpolateElement)(
              userDisplayName ? (0, import_i18n.sprintf)(
                /* translators: %s: user's display name */
                (0, import_i18n.__)(
                  "<strong>%s</strong> is currently working on this post (<PreviewLink />), which means you cannot make changes, unless you take over."
                ),
                userDisplayName
              ) : (0, import_i18n.__)(
                "Another user is currently working on this post (<PreviewLink />), which means you cannot make changes, unless you take over."
              ),
              {
                strong: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {}),
                PreviewLink: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ExternalLink, { href: previewLink, children: (0, import_i18n.__)("preview") })
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollaborationContext, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)(
              "If you take over, the other user will lose editing control to the post, but their changes will be saved."
            ) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            import_components.__experimentalHStack,
            {
              className: "editor-post-locked-modal__buttons",
              justify: "flex-end",
              children: [
                !isTakeover && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.Button,
                  {
                    __next40pxDefaultSize: true,
                    variant: "tertiary",
                    href: unlockUrl,
                    children: (0, import_i18n.__)("Take over")
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.Button,
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
var post_locked_modal_default = globalThis.IS_GUTENBERG_PLUGIN ? (0, import_components.withFilters)("editor.PostLockedModal")(PostLockedModal) : PostLockedModal;
//# sourceMappingURL=index.cjs.map
