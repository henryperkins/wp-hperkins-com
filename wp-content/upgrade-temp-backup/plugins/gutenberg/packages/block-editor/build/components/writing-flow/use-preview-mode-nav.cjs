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

// packages/block-editor/src/components/writing-flow/use-preview-mode-nav.js
var use_preview_mode_nav_exports = {};
__export(use_preview_mode_nav_exports, {
  usePreviewModeNav: () => usePreviewModeNav
});
module.exports = __toCommonJS(use_preview_mode_nav_exports);
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_keycodes = require("@wordpress/keycodes");
var import_store = require("../../store/index.cjs");
function usePreviewModeNav() {
  const isPreviewMode = (0, import_data.useSelect)(
    (select) => select(import_store.store).getSettings().isPreviewMode,
    []
  );
  return (0, import_compose.useRefEffect)(
    (node) => {
      if (!isPreviewMode) {
        return;
      }
      function onKeyDown(event) {
        const { keyCode, shiftKey, target } = event;
        const isTab = keyCode === import_keycodes.TAB;
        const isUp = keyCode === import_keycodes.UP;
        const isDown = keyCode === import_keycodes.DOWN;
        const isLeft = keyCode === import_keycodes.LEFT;
        const isRight = keyCode === import_keycodes.RIGHT;
        const isArrow = isUp || isDown || isLeft || isRight;
        if (!isTab && !isArrow) {
          return;
        }
        const isReverse = isTab ? shiftKey : isUp || isLeft;
        const blocks = Array.from(
          node.querySelectorAll("[data-block]")
        );
        if (!blocks.length) {
          return;
        }
        const currentBlock = target.closest("[data-block]");
        const currentIndex = currentBlock ? blocks.indexOf(currentBlock) : -1;
        if (currentIndex === -1) {
          return;
        }
        if (isTab) {
          if (isReverse && currentIndex === 0) {
            return;
          }
          if (!isReverse && currentIndex === blocks.length - 1) {
            return;
          }
        }
        let nextIndex;
        if (isReverse) {
          nextIndex = currentIndex <= 0 ? blocks.length - 1 : currentIndex - 1;
        } else {
          nextIndex = currentIndex === -1 || currentIndex >= blocks.length - 1 ? 0 : currentIndex + 1;
        }
        event.preventDefault();
        blocks[nextIndex].focus();
      }
      node.addEventListener("keydown", onKeyDown);
      return () => {
        node.removeEventListener("keydown", onKeyDown);
      };
    },
    [isPreviewMode]
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usePreviewModeNav
});
//# sourceMappingURL=use-preview-mode-nav.cjs.map
