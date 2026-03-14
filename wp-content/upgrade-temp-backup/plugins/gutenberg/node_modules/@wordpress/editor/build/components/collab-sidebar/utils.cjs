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

// packages/editor/src/components/collab-sidebar/utils.js
var utils_exports = {};
__export(utils_exports, {
  focusCommentThread: () => focusCommentThread,
  getAvatarBorderColor: () => getAvatarBorderColor,
  getCommentExcerpt: () => getCommentExcerpt,
  noop: () => noop,
  sanitizeCommentString: () => sanitizeCommentString
});
module.exports = __toCommonJS(utils_exports);
var import_i18n = require("@wordpress/i18n");
function sanitizeCommentString(str) {
  return str.trim();
}
function noop() {
}
var AVATAR_BORDER_COLORS = [
  "#3858E9",
  // Blueberry
  "#9fB1FF",
  // Blueberry 2
  "#1D35B4",
  // Dark Blueberry
  "#1A1919",
  // Charcoal 0
  "#E26F56",
  // Pomegranate
  "#33F078",
  // Acid Green
  "#FFF972",
  // Lemon
  "#7A00DF"
  // Purple
];
function getAvatarBorderColor(userId) {
  return AVATAR_BORDER_COLORS[userId % AVATAR_BORDER_COLORS.length];
}
function getCommentExcerpt(text, excerptLength = 10) {
  if (!text) {
    return "";
  }
  const wordCountType = (0, import_i18n._x)("words", "Word count type. Do not translate!");
  const rawText = text.trim();
  let trimmedExcerpt = "";
  if (wordCountType === "words") {
    trimmedExcerpt = rawText.split(" ", excerptLength).join(" ");
  } else if (wordCountType === "characters_excluding_spaces") {
    const textWithSpaces = rawText.split("", excerptLength).join("");
    const numberOfSpaces = textWithSpaces.length - textWithSpaces.replaceAll(" ", "").length;
    trimmedExcerpt = rawText.split("", excerptLength + numberOfSpaces).join("");
  } else if (wordCountType === "characters_including_spaces") {
    trimmedExcerpt = rawText.split("", excerptLength).join("");
  }
  const isTrimmed = trimmedExcerpt !== rawText;
  return isTrimmed ? trimmedExcerpt + "\u2026" : trimmedExcerpt;
}
function focusCommentThread(commentId, container, additionalSelector) {
  if (!container) {
    return;
  }
  const threadSelector = commentId && commentId !== "new" ? `[role=treeitem][id="comment-thread-${commentId}"]` : "[role=treeitem]:not([id])";
  const selector = additionalSelector ? `${threadSelector} ${additionalSelector}` : threadSelector;
  return new Promise((resolve) => {
    if (container.querySelector(selector)) {
      return resolve(container.querySelector(selector));
    }
    let timer = null;
    const observer = new window.MutationObserver(() => {
      if (container.querySelector(selector)) {
        clearTimeout(timer);
        observer.disconnect();
        resolve(container.querySelector(selector));
      }
    });
    observer.observe(container, {
      childList: true,
      subtree: true
    });
    timer = setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, 3e3);
  }).then((element) => element?.focus());
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  focusCommentThread,
  getAvatarBorderColor,
  getCommentExcerpt,
  noop,
  sanitizeCommentString
});
//# sourceMappingURL=utils.cjs.map
