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

// packages/editor/src/components/visual-editor/use-zoom-out-mode-exit.js
var use_zoom_out_mode_exit_exports = {};
__export(use_zoom_out_mode_exit_exports, {
  useZoomOutModeExit: () => useZoomOutModeExit
});
module.exports = __toCommonJS(use_zoom_out_mode_exit_exports);
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_block_editor = require("@wordpress/block-editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
function useZoomOutModeExit() {
  const { getSettings, isZoomOut } = (0, import_lock_unlock.unlock)((0, import_data.useSelect)(import_block_editor.store));
  const { resetZoomLevel } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_block_editor.store));
  return (0, import_compose.useRefEffect)(
    (node) => {
      function onDoubleClick(event) {
        if (!isZoomOut()) {
          return;
        }
        if (!event.defaultPrevented) {
          event.preventDefault();
          const { __experimentalSetIsInserterOpened } = getSettings();
          if (typeof __experimentalSetIsInserterOpened === "function") {
            __experimentalSetIsInserterOpened(false);
          }
          resetZoomLevel();
        }
      }
      node.addEventListener("dblclick", onDoubleClick);
      return () => {
        node.removeEventListener("dblclick", onDoubleClick);
      };
    },
    [getSettings, isZoomOut, resetZoomLevel]
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useZoomOutModeExit
});
//# sourceMappingURL=use-zoom-out-mode-exit.cjs.map
