// packages/dataviews/src/utils/get-footer-message.ts
import { _n, sprintf } from "@wordpress/i18n";
function getFooterMessage(selectionCount, itemsCount, totalItems) {
  if (selectionCount > 0) {
    return sprintf(
      /* translators: %d: number of items. */
      _n("%d Item selected", "%d Items selected", selectionCount),
      selectionCount
    );
  }
  if (totalItems > itemsCount) {
    return sprintf(
      /* translators: %1$d: number of items. %2$d: total number of items. */
      _n("%1$d of %2$d Item", "%1$d of %2$d Items", totalItems),
      itemsCount,
      totalItems
    );
  }
  return sprintf(
    /* translators: %d: number of items. */
    _n("%d Item", "%d Items", itemsCount),
    itemsCount
  );
}
export {
  getFooterMessage as default
};
//# sourceMappingURL=get-footer-message.mjs.map
