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

// packages/editor/src/components/global-styles/block-link.js
var block_link_exports = {};
__export(block_link_exports, {
  GlobalStylesBlockLink: () => GlobalStylesBlockLink
});
module.exports = __toCommonJS(block_link_exports);
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_compose = require("@wordpress/compose");
function GlobalStylesBlockLink({ path, onPathChange }) {
  const { selectedBlockName, selectedBlockClientId } = (0, import_data.useSelect)(
    (select) => {
      const { getSelectedBlockClientId, getBlockName } = select(import_block_editor.store);
      const clientId = getSelectedBlockClientId();
      return {
        selectedBlockName: getBlockName(clientId),
        selectedBlockClientId: clientId
      };
    },
    []
  );
  const blockHasGlobalStyles = true;
  const previousBlockClientId = (0, import_compose.usePrevious)(selectedBlockClientId);
  (0, import_element.useEffect)(() => {
    if (selectedBlockClientId === previousBlockClientId) {
      return;
    }
    if (!selectedBlockClientId || !blockHasGlobalStyles) {
      return;
    }
    if (!path || path !== "/blocks" && !path.startsWith("/blocks/")) {
      return;
    }
    const newPath = "/blocks/" + encodeURIComponent(selectedBlockName);
    if (newPath !== path) {
      onPathChange?.(newPath);
    }
  }, [
    selectedBlockClientId,
    previousBlockClientId,
    selectedBlockName,
    blockHasGlobalStyles,
    path,
    onPathChange
  ]);
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GlobalStylesBlockLink
});
//# sourceMappingURL=block-link.cjs.map
