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

// packages/block-library/src/navigation/edit/navigation-link-ui.js
var navigation_link_ui_exports = {};
__export(navigation_link_ui_exports, {
  NavigationLinkUI: () => NavigationLinkUI
});
module.exports = __toCommonJS(navigation_link_ui_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_shared = require("../../navigation-link/shared/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var BLOCKS_WITH_LINK_UI_SUPPORT = [
  "core/navigation-link",
  "core/navigation-submenu"
];
function NavigationLinkUI({ block, insertedBlock, setInsertedBlock }) {
  const { updateBlockAttributes, removeBlock } = (0, import_data.useDispatch)(import_block_editor.store);
  const supportsLinkControls = BLOCKS_WITH_LINK_UI_SUPPORT?.includes(
    insertedBlock?.name
  );
  const blockWasJustInserted = insertedBlock?.clientId === block.clientId;
  const showLinkControls = supportsLinkControls && blockWasJustInserted;
  const { createBinding, clearBinding } = (0, import_shared.useEntityBinding)({
    clientId: insertedBlock?.clientId,
    attributes: insertedBlock?.attributes || {}
  });
  if (!showLinkControls) {
    return null;
  }
  const cleanupInsertedBlock = () => {
    const shouldAutoSelectBlock = false;
    if (!insertedBlock?.attributes?.url && insertedBlock?.clientId) {
      removeBlock(insertedBlock.clientId, shouldAutoSelectBlock);
    }
    setInsertedBlock(null);
  };
  const setInsertedBlockAttributes = (_insertedBlockClientId) => (_updatedAttributes) => {
    if (!_insertedBlockClientId) {
      return;
    }
    updateBlockAttributes(_insertedBlockClientId, _updatedAttributes);
  };
  const handleSetInsertedBlock = (newBlock) => {
    const shouldAutoSelectBlock = false;
    if (insertedBlock?.clientId && newBlock) {
      removeBlock(insertedBlock.clientId, shouldAutoSelectBlock);
    }
    setInsertedBlock(newBlock);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_shared.LinkUI,
    {
      clientId: insertedBlock?.clientId,
      link: insertedBlock?.attributes,
      onBlockInsert: handleSetInsertedBlock,
      onClose: () => {
        cleanupInsertedBlock();
      },
      onChange: (updatedValue) => {
        const { isEntityLink, attributes: updatedAttributes } = (0, import_shared.updateAttributes)(
          updatedValue,
          setInsertedBlockAttributes(insertedBlock?.clientId),
          insertedBlock?.attributes
        );
        if (isEntityLink) {
          createBinding(updatedAttributes);
        } else {
          clearBinding();
        }
        setInsertedBlock(null);
      }
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NavigationLinkUI
});
//# sourceMappingURL=navigation-link-ui.cjs.map
