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

// packages/edit-site/src/components/editor/use-adapt-editor-to-canvas.js
var use_adapt_editor_to_canvas_exports = {};
__export(use_adapt_editor_to_canvas_exports, {
  useAdaptEditorToCanvas: () => useAdaptEditorToCanvas
});
module.exports = __toCommonJS(use_adapt_editor_to_canvas_exports);
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_editor = require("@wordpress/editor");
var import_element = require("@wordpress/element");
var import_preferences = require("@wordpress/preferences");
var import_use_viewport_sync = require("../block-editor/use-viewport-sync.cjs");
function useAdaptEditorToCanvas(canvas) {
  const { clearSelectedBlock } = (0, import_data.useDispatch)(import_block_editor.store);
  const {
    editPost,
    setDeviceType,
    closePublishSidebar,
    setIsListViewOpened,
    setIsInserterOpened
  } = (0, import_data.useDispatch)(import_editor.store);
  const { get: getPreference } = (0, import_data.useSelect)(import_preferences.store);
  const { getCurrentPost } = (0, import_data.useSelect)(import_editor.store);
  const registry = (0, import_data.useRegistry)();
  (0, import_element.useLayoutEffect)(() => {
    const isMediumOrBigger = window.matchMedia("(min-width: 782px)").matches;
    registry.batch(() => {
      clearSelectedBlock();
      if (getCurrentPost()?.type) {
        editPost({ selection: void 0 }, { undoIgnore: true });
      }
      setDeviceType(import_use_viewport_sync.DEFAULT_DEVICE_TYPE);
      closePublishSidebar();
      setIsInserterOpened(false);
      if (isMediumOrBigger && canvas === "edit" && getPreference("core", "showListViewByDefault") && !getPreference("core", "distractionFree")) {
        setIsListViewOpened(true);
      } else {
        setIsListViewOpened(false);
      }
    });
  }, [
    canvas,
    registry,
    clearSelectedBlock,
    editPost,
    setDeviceType,
    closePublishSidebar,
    setIsInserterOpened,
    setIsListViewOpened,
    getPreference,
    getCurrentPost
  ]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAdaptEditorToCanvas
});
//# sourceMappingURL=use-adapt-editor-to-canvas.cjs.map
