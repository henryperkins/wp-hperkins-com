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

// packages/customize-widgets/src/components/block-appender/index.js
var block_appender_exports = {};
__export(block_appender_exports, {
  default: () => BlockAppender
});
module.exports = __toCommonJS(block_appender_exports);
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_jsx_runtime = require("react/jsx-runtime");
function BlockAppender(props) {
  const ref = (0, import_element.useRef)();
  const isBlocksListEmpty = (0, import_data.useSelect)(
    (select) => select(import_block_editor.store).getBlockCount() === 0
  );
  (0, import_element.useEffect)(() => {
    if (isBlocksListEmpty && ref.current) {
      const { ownerDocument } = ref.current;
      if (!ownerDocument.activeElement || ownerDocument.activeElement === ownerDocument.body) {
        ref.current.focus();
      }
    }
  }, [isBlocksListEmpty]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.ButtonBlockAppender, { ...props, ref });
}
//# sourceMappingURL=index.cjs.map
