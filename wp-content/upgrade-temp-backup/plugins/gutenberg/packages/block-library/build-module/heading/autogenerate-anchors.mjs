// packages/block-library/src/heading/autogenerate-anchors.js
import removeAccents from "remove-accents";
var anchors = {};
var getTextWithoutMarkup = (text) => {
  const dummyElement = document.createElement("div");
  dummyElement.innerHTML = text;
  return dummyElement.innerText;
};
var getSlug = (content) => {
  return removeAccents(getTextWithoutMarkup(content)).replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase().replace(/(^-+)|(-+$)/g, "");
};
var generateAnchor = (clientId, content) => {
  const slug = getSlug(content);
  if ("" === slug) {
    return null;
  }
  delete anchors[clientId];
  let anchor = slug;
  let i = 0;
  while (Object.values(anchors).includes(anchor)) {
    i += 1;
    anchor = slug + "-" + i;
  }
  return anchor;
};
var setAnchor = (clientId, anchor) => {
  anchors[clientId] = anchor;
};
export {
  generateAnchor,
  setAnchor
};
//# sourceMappingURL=autogenerate-anchors.mjs.map
