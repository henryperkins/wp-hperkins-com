// packages/widgets/src/utils.js
function getWidgetIdFromBlock(block) {
  return block.attributes.__internalWidgetId;
}
function addWidgetIdToBlock(block, widgetId) {
  return {
    ...block,
    attributes: {
      ...block.attributes || {},
      __internalWidgetId: widgetId
    }
  };
}
export {
  addWidgetIdToBlock,
  getWidgetIdFromBlock
};
//# sourceMappingURL=utils.mjs.map
