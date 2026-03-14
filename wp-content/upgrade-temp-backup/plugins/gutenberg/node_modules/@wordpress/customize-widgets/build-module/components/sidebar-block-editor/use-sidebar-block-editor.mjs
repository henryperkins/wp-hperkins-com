// packages/customize-widgets/src/components/sidebar-block-editor/use-sidebar-block-editor.js
import fastDeepEqual from "fast-deep-equal/es6/index.js";
import { useState, useEffect, useCallback } from "@wordpress/element";
import { isShallowEqual } from "@wordpress/is-shallow-equal";
import { getWidgetIdFromBlock, addWidgetIdToBlock } from "@wordpress/widgets";
import { blockToWidget, widgetToBlock } from "../../utils.mjs";
function widgetsToBlocks(widgets) {
  return widgets.map((widget) => widgetToBlock(widget));
}
function useSidebarBlockEditor(sidebar) {
  const [blocks, setBlocks] = useState(
    () => widgetsToBlocks(sidebar.getWidgets())
  );
  useEffect(() => {
    return sidebar.subscribe((prevWidgets, nextWidgets) => {
      setBlocks((prevBlocks) => {
        const prevWidgetsMap = new Map(
          prevWidgets.map((widget) => [widget.id, widget])
        );
        const prevBlocksMap = new Map(
          prevBlocks.map((block) => [
            getWidgetIdFromBlock(block),
            block
          ])
        );
        const nextBlocks = nextWidgets.map((nextWidget) => {
          const prevWidget = prevWidgetsMap.get(nextWidget.id);
          if (prevWidget && prevWidget === nextWidget) {
            return prevBlocksMap.get(nextWidget.id);
          }
          return widgetToBlock(nextWidget);
        });
        if (isShallowEqual(prevBlocks, nextBlocks)) {
          return prevBlocks;
        }
        return nextBlocks;
      });
    });
  }, [sidebar]);
  const onChangeBlocks = useCallback(
    (nextBlocks) => {
      setBlocks((prevBlocks) => {
        if (isShallowEqual(prevBlocks, nextBlocks)) {
          return prevBlocks;
        }
        const prevBlocksMap = new Map(
          prevBlocks.map((block) => [
            getWidgetIdFromBlock(block),
            block
          ])
        );
        const nextWidgets = nextBlocks.map((nextBlock) => {
          const widgetId = getWidgetIdFromBlock(nextBlock);
          if (widgetId && prevBlocksMap.has(widgetId)) {
            const prevBlock = prevBlocksMap.get(widgetId);
            const prevWidget = sidebar.getWidget(widgetId);
            if (fastDeepEqual(nextBlock, prevBlock) && prevWidget) {
              return prevWidget;
            }
            return blockToWidget(nextBlock, prevWidget);
          }
          return blockToWidget(nextBlock);
        });
        if (isShallowEqual(sidebar.getWidgets(), nextWidgets)) {
          return prevBlocks;
        }
        const addedWidgetIds = sidebar.setWidgets(nextWidgets);
        return nextBlocks.reduce(
          (updatedNextBlocks, nextBlock, index) => {
            const addedWidgetId = addedWidgetIds[index];
            if (addedWidgetId !== null) {
              if (updatedNextBlocks === nextBlocks) {
                updatedNextBlocks = nextBlocks.slice();
              }
              updatedNextBlocks[index] = addWidgetIdToBlock(
                nextBlock,
                addedWidgetId
              );
            }
            return updatedNextBlocks;
          },
          nextBlocks
        );
      });
    },
    [sidebar]
  );
  return [blocks, onChangeBlocks, onChangeBlocks];
}
export {
  useSidebarBlockEditor as default
};
//# sourceMappingURL=use-sidebar-block-editor.mjs.map
