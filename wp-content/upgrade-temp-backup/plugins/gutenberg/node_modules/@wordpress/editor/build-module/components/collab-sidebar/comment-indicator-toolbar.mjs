// packages/editor/src/components/collab-sidebar/comment-indicator-toolbar.js
import {
  ToolbarButton,
  __experimentalText as Text,
  __experimentalHStack as HStack
} from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { useMemo } from "@wordpress/element";
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { unlock } from "../../lock-unlock.mjs";
import { getAvatarBorderColor } from "./utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { CommentIconToolbarSlotFill } = unlock(blockEditorPrivateApis);
var CommentAvatarIndicator = ({ onClick, thread }) => {
  const threadParticipants = useMemo(() => {
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
  const overflowText = threadHasMoreParticipants && overflowCount > 0 ? __("100+") : sprintf(
    // translators: %s: Number of participants.
    __("+%s"),
    overflowCount
  );
  return /* @__PURE__ */ jsx(CommentIconToolbarSlotFill.Fill, { children: /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      className: "comment-avatar-indicator",
      label: __("View notes"),
      onClick: () => onClick(),
      showTooltip: true,
      children: /* @__PURE__ */ jsxs(HStack, { spacing: "1", children: [
        visibleParticipants.map((participant) => /* @__PURE__ */ jsx(
          "img",
          {
            src: participant.avatar,
            alt: participant.name,
            className: "comment-avatar",
            style: {
              borderColor: getAvatarBorderColor(
                participant.id
              )
            }
          },
          participant.id
        )),
        overflowCount > 0 && /* @__PURE__ */ jsx(Text, { weight: 500, children: overflowText })
      ] })
    }
  ) });
};
var comment_indicator_toolbar_default = CommentAvatarIndicator;
export {
  comment_indicator_toolbar_default as default
};
//# sourceMappingURL=comment-indicator-toolbar.mjs.map
