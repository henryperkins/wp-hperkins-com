"use strict";
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

// packages/block-editor/src/components/inserter-draggable-blocks/index.js
var inserter_draggable_blocks_exports = {};
__export(inserter_draggable_blocks_exports, {
  default: () => inserter_draggable_blocks_default
});
module.exports = __toCommonJS(inserter_draggable_blocks_exports);
var import_components = require("@wordpress/components");
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_draggable_chip = __toESM(require("../block-draggable/draggable-chip.cjs"));
var import_utils = require("../inserter/block-patterns-tab/utils.cjs");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var InserterDraggableBlocks = ({
  isEnabled,
  blocks,
  icon,
  children,
  pattern
}) => {
  const blockName = blocks.length === 1 ? blocks[0].name : void 0;
  const blockTypeIcon = (0, import_data.useSelect)(
    (select) => {
      return blockName && select(import_blocks.store).getBlockType(blockName)?.icon;
    },
    [blockName]
  );
  const { startDragging, stopDragging } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_store.store)
  );
  const patternBlock = (0, import_element.useMemo)(() => {
    return pattern?.type === import_utils.INSERTER_PATTERN_TYPES.user && pattern?.syncStatus !== "unsynced" ? [(0, import_blocks.createBlock)("core/block", { ref: pattern.id })] : void 0;
  }, [pattern?.type, pattern?.syncStatus, pattern?.id]);
  if (!isEnabled) {
    return children({
      draggable: false,
      onDragStart: void 0,
      onDragEnd: void 0
    });
  }
  const draggableBlocks = patternBlock ?? blocks;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Draggable,
    {
      __experimentalTransferDataType: "wp-blocks",
      transferData: { type: "inserter", blocks: draggableBlocks },
      onDragStart: (event) => {
        startDragging();
        const addedTypes = /* @__PURE__ */ new Set();
        for (const block of draggableBlocks) {
          const type = `wp-block:${block.name}`;
          if (!addedTypes.has(type)) {
            event.dataTransfer.items.add("", type);
            addedTypes.add(type);
          }
        }
      },
      onDragEnd: () => {
        stopDragging();
      },
      __experimentalDragComponent: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_draggable_chip.default,
        {
          count: blocks.length,
          icon: icon || !pattern && blockTypeIcon,
          isPattern: !!pattern
        }
      ),
      children: ({ onDraggableStart, onDraggableEnd }) => {
        return children({
          draggable: true,
          onDragStart: onDraggableStart,
          onDragEnd: onDraggableEnd
        });
      }
    }
  );
};
var inserter_draggable_blocks_default = InserterDraggableBlocks;
//# sourceMappingURL=index.cjs.map
