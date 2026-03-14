var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/customize-widgets/src/components/sidebar-block-editor/use-sidebar-block-editor.js
var use_sidebar_block_editor_exports = {};
__export(use_sidebar_block_editor_exports, {
  default: () => useSidebarBlockEditor
});
module.exports = __toCommonJS(use_sidebar_block_editor_exports);
var import_es6 = __toESM(require("fast-deep-equal/es6/index.js"));
var import_element = require("@wordpress/element");
var import_is_shallow_equal = require("@wordpress/is-shallow-equal");
var import_widgets = require("@wordpress/widgets");
var import_utils = require("../../utils.cjs");
function widgetsToBlocks(widgets) {
  return widgets.map((widget) => (0, import_utils.widgetToBlock)(widget));
}
function useSidebarBlockEditor(sidebar) {
  const [blocks, setBlocks] = (0, import_element.useState)(
    () => widgetsToBlocks(sidebar.getWidgets())
  );
  (0, import_element.useEffect)(() => {
    return sidebar.subscribe((prevWidgets, nextWidgets) => {
      setBlocks((prevBlocks) => {
        const prevWidgetsMap = new Map(
          prevWidgets.map((widget) => [widget.id, widget])
        );
        const prevBlocksMap = new Map(
          prevBlocks.map((block) => [
            (0, import_widgets.getWidgetIdFromBlock)(block),
            block
          ])
        );
        const nextBlocks = nextWidgets.map((nextWidget) => {
          const prevWidget = prevWidgetsMap.get(nextWidget.id);
          if (prevWidget && prevWidget === nextWidget) {
            return prevBlocksMap.get(nextWidget.id);
          }
          return (0, import_utils.widgetToBlock)(nextWidget);
        });
        if ((0, import_is_shallow_equal.isShallowEqual)(prevBlocks, nextBlocks)) {
          return prevBlocks;
        }
        return nextBlocks;
      });
    });
  }, [sidebar]);
  const onChangeBlocks = (0, import_element.useCallback)(
    (nextBlocks) => {
      setBlocks((prevBlocks) => {
        if ((0, import_is_shallow_equal.isShallowEqual)(prevBlocks, nextBlocks)) {
          return prevBlocks;
        }
        const prevBlocksMap = new Map(
          prevBlocks.map((block) => [
            (0, import_widgets.getWidgetIdFromBlock)(block),
            block
          ])
        );
        const nextWidgets = nextBlocks.map((nextBlock) => {
          const widgetId = (0, import_widgets.getWidgetIdFromBlock)(nextBlock);
          if (widgetId && prevBlocksMap.has(widgetId)) {
            const prevBlock = prevBlocksMap.get(widgetId);
            const prevWidget = sidebar.getWidget(widgetId);
            if ((0, import_es6.default)(nextBlock, prevBlock) && prevWidget) {
              return prevWidget;
            }
            return (0, import_utils.blockToWidget)(nextBlock, prevWidget);
          }
          return (0, import_utils.blockToWidget)(nextBlock);
        });
        if ((0, import_is_shallow_equal.isShallowEqual)(sidebar.getWidgets(), nextWidgets)) {
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
              updatedNextBlocks[index] = (0, import_widgets.addWidgetIdToBlock)(
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
//# sourceMappingURL=use-sidebar-block-editor.cjs.map
