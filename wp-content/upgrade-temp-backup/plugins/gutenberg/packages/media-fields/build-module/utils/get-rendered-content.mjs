// packages/media-fields/src/utils/get-rendered-content.ts
function getRenderedContent(content) {
  if (!content) {
    return "";
  }
  if (typeof content === "string") {
    return content;
  }
  if (typeof content === "object") {
    return content.rendered || content.raw || "";
  }
  return "";
}
export {
  getRenderedContent
};
//# sourceMappingURL=get-rendered-content.mjs.map
