// packages/block-editor/src/components/inserter/get-appender-label.js
var MAX_APPENDER_LABEL_LENGTH = 50;
function getAppenderLabel(defaultBlock, defaultBlockType) {
  if (!defaultBlock || !defaultBlock.attributes || !defaultBlockType?.__experimentalLabel) {
    return null;
  }
  const result = defaultBlockType.__experimentalLabel(
    defaultBlock.attributes,
    { context: "appender" }
  );
  if (typeof result === "string" && result.length < MAX_APPENDER_LABEL_LENGTH && result.length > 0) {
    return result;
  }
  return null;
}
export {
  getAppenderLabel
};
//# sourceMappingURL=get-appender-label.mjs.map
