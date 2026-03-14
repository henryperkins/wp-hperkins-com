// packages/media-fields/src/utils/get-raw-content.ts
function getRawContent(content) {
  if (!content) {
    return "";
  }
  if (typeof content === "string") {
    return content;
  }
  if (typeof content === "object" && "raw" in content) {
    return content.raw || "";
  }
  return "";
}
export {
  getRawContent
};
//# sourceMappingURL=get-raw-content.mjs.map
