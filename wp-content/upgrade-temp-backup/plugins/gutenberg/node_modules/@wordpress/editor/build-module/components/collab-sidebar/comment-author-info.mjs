// packages/editor/src/components/collab-sidebar/comment-author-info.js
import { Tooltip, __experimentalVStack as VStack } from "@wordpress/components";
import { __, _x } from "@wordpress/i18n";
import {
  dateI18n,
  getSettings as getDateSettings,
  humanTimeDiff,
  getDate
} from "@wordpress/date";
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { getAvatarBorderColor } from "./utils.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function CommentAuthorInfo({ avatar, name, date, userId }) {
  const hasAvatar = !!avatar;
  const dateSettings = getDateSettings();
  const {
    currentUserAvatar,
    currentUserName,
    currentUserId,
    dateFormat = dateSettings.formats.date
  } = useSelect(
    (select) => {
      const { canUser, getCurrentUser, getEntityRecord } = select(coreStore);
      const siteSettings = canUser("read", {
        kind: "root",
        name: "site"
      }) ? getEntityRecord("root", "site") : void 0;
      if (hasAvatar) {
        return {
          dateFormat: siteSettings?.date_format
        };
      }
      const { getSettings } = select(blockEditorStore);
      const { __experimentalDiscussionSettings } = getSettings();
      const defaultAvatar = __experimentalDiscussionSettings?.avatarURL;
      const userData = getCurrentUser();
      return {
        currentUserAvatar: userData?.avatar_urls?.[48] ?? defaultAvatar,
        currentUserName: userData?.name,
        currentUserId: userData?.id,
        dateFormat: siteSettings?.date_format
      };
    },
    [hasAvatar]
  );
  const commentDate = getDate(date);
  const commentDateTime = dateI18n("c", commentDate);
  const shouldShowHumanTimeDiff = Math.floor((/* @__PURE__ */ new Date() - commentDate) / (1e3 * 60 * 60 * 24)) < 30;
  const commentDateText = shouldShowHumanTimeDiff ? humanTimeDiff(commentDate) : dateI18n(dateFormat, commentDate);
  const tooltipText = dateI18n(
    // translators: Use a non-breaking space between 'g:i' and 'a' if appropriate.
    _x("F j, Y g:i\xA0a", "Note date full date format"),
    date
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: avatar || currentUserAvatar,
        className: "editor-collab-sidebar-panel__user-avatar",
        alt: __("User avatar"),
        width: 32,
        height: 32,
        style: {
          borderColor: getAvatarBorderColor(
            userId ?? currentUserId
          )
        }
      }
    ),
    /* @__PURE__ */ jsxs(VStack, { spacing: "0", children: [
      /* @__PURE__ */ jsx("span", { className: "editor-collab-sidebar-panel__user-name", children: name ?? currentUserName }),
      date && /* @__PURE__ */ jsx(Tooltip, { text: tooltipText, children: /* @__PURE__ */ jsx(
        "time",
        {
          dateTime: commentDateTime,
          className: "editor-collab-sidebar-panel__user-time",
          children: commentDateText
        }
      ) })
    ] })
  ] });
}
var comment_author_info_default = CommentAuthorInfo;
export {
  comment_author_info_default as default
};
//# sourceMappingURL=comment-author-info.mjs.map
