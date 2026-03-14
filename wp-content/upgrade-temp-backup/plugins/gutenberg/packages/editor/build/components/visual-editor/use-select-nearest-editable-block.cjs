"use strict";
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

// packages/editor/src/components/visual-editor/use-select-nearest-editable-block.js
var use_select_nearest_editable_block_exports = {};
__export(use_select_nearest_editable_block_exports, {
  default: () => useSelectNearestEditableBlock
});
module.exports = __toCommonJS(use_select_nearest_editable_block_exports);
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
var DISTANCE_THRESHOLD = 500;
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function distanceFromRect(x, y, rect) {
  const dx = x - clamp(x, rect.left, rect.right);
  const dy = y - clamp(y, rect.top, rect.bottom);
  return Math.sqrt(dx * dx + dy * dy);
}
function useSelectNearestEditableBlock({
  isEnabled = true
} = {}) {
  const { getEnabledClientIdsTree, getBlockName, getBlockOrder } = (0, import_lock_unlock.unlock)(
    (0, import_data.useSelect)(import_block_editor.store)
  );
  const { selectBlock } = (0, import_data.useDispatch)(import_block_editor.store);
  return (0, import_compose.useRefEffect)(
    (element) => {
      if (!isEnabled) {
        return;
      }
      const selectNearestEditableBlock = (x, y) => {
        const editableBlockClientIds = getEnabledClientIdsTree().flatMap(({ clientId }) => {
          const blockName = getBlockName(clientId);
          if (blockName === "core/template-part") {
            return [];
          }
          if (blockName === "core/post-content") {
            const innerBlocks = getBlockOrder(clientId);
            if (innerBlocks.length) {
              return innerBlocks;
            }
          }
          return [clientId];
        });
        let nearestDistance = Infinity, nearestClientId = null;
        for (const clientId of editableBlockClientIds) {
          const block = element.querySelector(
            `[data-block="${clientId}"]`
          );
          if (!block) {
            continue;
          }
          const rect = block.getBoundingClientRect();
          const distance = distanceFromRect(x, y, rect);
          if (distance < nearestDistance && distance < DISTANCE_THRESHOLD) {
            nearestDistance = distance;
            nearestClientId = clientId;
          }
        }
        if (nearestClientId) {
          selectBlock(nearestClientId);
        }
      };
      const handleClick = (event) => {
        const shouldSelect = event.target === element || event.target.classList.contains("is-root-container");
        if (shouldSelect) {
          selectNearestEditableBlock(event.clientX, event.clientY);
        }
      };
      element.addEventListener("click", handleClick);
      return () => element.removeEventListener("click", handleClick);
    },
    [isEnabled]
  );
}
//# sourceMappingURL=use-select-nearest-editable-block.cjs.map
