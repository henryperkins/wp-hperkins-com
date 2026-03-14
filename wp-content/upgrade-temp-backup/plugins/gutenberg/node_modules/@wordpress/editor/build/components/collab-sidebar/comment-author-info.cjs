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

// packages/editor/src/components/collab-sidebar/comment-author-info.js
var comment_author_info_exports = {};
__export(comment_author_info_exports, {
  default: () => comment_author_info_default
});
module.exports = __toCommonJS(comment_author_info_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_date = require("@wordpress/date");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function CommentAuthorInfo({ avatar, name, date, userId }) {
  const hasAvatar = !!avatar;
  const dateSettings = (0, import_date.getSettings)();
  const {
    currentUserAvatar,
    currentUserName,
    currentUserId,
    dateFormat = dateSettings.formats.date
  } = (0, import_data.useSelect)(
    (select) => {
      const { canUser, getCurrentUser, getEntityRecord } = select(import_core_data.store);
      const siteSettings = canUser("read", {
        kind: "root",
        name: "site"
      }) ? getEntityRecord("root", "site") : void 0;
      if (hasAvatar) {
        return {
          dateFormat: siteSettings?.date_format
        };
      }
      const { getSettings } = select(import_block_editor.store);
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
  const commentDate = (0, import_date.getDate)(date);
  const commentDateTime = (0, import_date.dateI18n)("c", commentDate);
  const shouldShowHumanTimeDiff = Math.floor((/* @__PURE__ */ new Date() - commentDate) / (1e3 * 60 * 60 * 24)) < 30;
  const commentDateText = shouldShowHumanTimeDiff ? (0, import_date.humanTimeDiff)(commentDate) : (0, import_date.dateI18n)(dateFormat, commentDate);
  const tooltipText = (0, import_date.dateI18n)(
    // translators: Use a non-breaking space between 'g:i' and 'a' if appropriate.
    (0, import_i18n._x)("F j, Y g:i\xA0a", "Note date full date format"),
    date
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "img",
      {
        src: avatar || currentUserAvatar,
        className: "editor-collab-sidebar-panel__user-avatar",
        alt: (0, import_i18n.__)("User avatar"),
        width: 32,
        height: 32,
        style: {
          borderColor: (0, import_utils.getAvatarBorderColor)(
            userId ?? currentUserId
          )
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "0", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-collab-sidebar-panel__user-name", children: name ?? currentUserName }),
      date && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Tooltip, { text: tooltipText, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
//# sourceMappingURL=comment-author-info.cjs.map
