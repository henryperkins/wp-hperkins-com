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

// packages/customize-widgets/src/components/focus-control/use-blocks-focus-control.js
var use_blocks_focus_control_exports = {};
__export(use_blocks_focus_control_exports, {
  default: () => useBlocksFocusControl
});
module.exports = __toCommonJS(use_blocks_focus_control_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_widgets = require("@wordpress/widgets");
var import__ = require("./index.cjs");
function useBlocksFocusControl(blocks) {
  const { selectBlock } = (0, import_data.useDispatch)(import_block_editor.store);
  const [focusedWidgetIdRef] = (0, import__.useFocusControl)();
  const blocksRef = (0, import_element.useRef)(blocks);
  (0, import_element.useEffect)(() => {
    blocksRef.current = blocks;
  }, [blocks]);
  (0, import_element.useEffect)(() => {
    if (focusedWidgetIdRef.current) {
      const focusedBlock = blocksRef.current.find(
        (block) => (0, import_widgets.getWidgetIdFromBlock)(block) === focusedWidgetIdRef.current
      );
      if (focusedBlock) {
        selectBlock(focusedBlock.clientId);
        const blockNode = document.querySelector(
          `[data-block="${focusedBlock.clientId}"]`
        );
        blockNode?.focus();
      }
    }
  }, [focusedWidgetIdRef, selectBlock]);
}
//# sourceMappingURL=use-blocks-focus-control.cjs.map
