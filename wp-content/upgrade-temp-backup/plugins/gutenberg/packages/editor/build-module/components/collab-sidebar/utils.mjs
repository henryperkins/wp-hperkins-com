// packages/editor/src/components/collab-sidebar/utils.js
import { _x } from "@wordpress/i18n";
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
  const wordCountType = _x("words", "Word count type. Do not translate!");
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
export {
  focusCommentThread,
  getAvatarBorderColor,
  getCommentExcerpt,
  noop,
  sanitizeCommentString
};
//# sourceMappingURL=utils.mjs.map
