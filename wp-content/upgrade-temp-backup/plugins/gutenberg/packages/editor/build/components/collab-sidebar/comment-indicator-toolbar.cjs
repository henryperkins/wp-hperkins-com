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

// packages/editor/src/components/collab-sidebar/comment-indicator-toolbar.js
var comment_indicator_toolbar_exports = {};
__export(comment_indicator_toolbar_exports, {
  default: () => comment_indicator_toolbar_default
});
module.exports = __toCommonJS(comment_indicator_toolbar_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { CommentIconToolbarSlotFill } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var CommentAvatarIndicator = ({ onClick, thread }) => {
  const threadParticipants = (0, import_element.useMemo)(() => {
    if (!thread) {
      return [];
    }
    const participantsMap = /* @__PURE__ */ new Map();
    const allComments = [thread, ...thread.reply];
    allComments.sort((a, b) => new Date(a.date) - new Date(b.date));
    allComments.forEach((comment) => {
      if (comment.author_name && comment.author_avatar_urls) {
        if (!participantsMap.has(comment.author)) {
          participantsMap.set(comment.author, {
            name: comment.author_name,
            avatar: comment.author_avatar_urls?.["48"] || comment.author_avatar_urls?.["96"],
            id: comment.author,
            date: comment.date
          });
        }
      }
    });
    return Array.from(participantsMap.values());
  }, [thread]);
  if (!threadParticipants.length) {
    return null;
  }
  const maxAvatars = 3;
  const isOverflow = threadParticipants.length > maxAvatars;
  const visibleParticipants = isOverflow ? threadParticipants.slice(0, maxAvatars - 1) : threadParticipants;
  const overflowCount = Math.max(
    0,
    threadParticipants.length - visibleParticipants.length
  );
  const threadHasMoreParticipants = threadParticipants.length > 100;
  const overflowText = threadHasMoreParticipants && overflowCount > 0 ? (0, import_i18n.__)("100+") : (0, import_i18n.sprintf)(
    // translators: %s: Number of participants.
    (0, import_i18n.__)("+%s"),
    overflowCount
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentIconToolbarSlotFill.Fill, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ToolbarButton,
    {
      className: "comment-avatar-indicator",
      label: (0, import_i18n.__)("View notes"),
      onClick: () => onClick(),
      showTooltip: true,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { spacing: "1", children: [
        visibleParticipants.map((participant) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "img",
          {
            src: participant.avatar,
            alt: participant.name,
            className: "comment-avatar",
            style: {
              borderColor: (0, import_utils.getAvatarBorderColor)(
                participant.id
              )
            }
          },
          participant.id
        )),
        overflowCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { weight: 500, children: overflowText })
      ] })
    }
  ) });
};
var comment_indicator_toolbar_default = CommentAvatarIndicator;
//# sourceMappingURL=comment-indicator-toolbar.cjs.map
