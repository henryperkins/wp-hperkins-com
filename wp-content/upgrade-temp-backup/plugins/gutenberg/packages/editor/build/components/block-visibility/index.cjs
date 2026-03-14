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

// packages/editor/src/components/block-visibility/index.js
var block_visibility_exports = {};
__export(block_visibility_exports, {
  default: () => BlockVisibility
});
module.exports = __toCommonJS(block_visibility_exports);
var import_data = require("@wordpress/data");
var import_preferences = require("@wordpress/preferences");
var import_blocks = require("@wordpress/blocks");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { BlockManager } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var EMPTY_ARRAY = [];
function BlockVisibility() {
  const { showBlockTypes, hideBlockTypes } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_store.store)
  );
  const {
    blockTypes,
    allowedBlockTypes: _allowedBlockTypes,
    hiddenBlockTypes: _hiddenBlockTypes
  } = (0, import_data.useSelect)((select) => {
    return {
      blockTypes: select(import_blocks.store).getBlockTypes(),
      allowedBlockTypes: select(import_store.store).getEditorSettings().allowedBlockTypes,
      hiddenBlockTypes: select(import_preferences.store).get("core", "hiddenBlockTypes") ?? EMPTY_ARRAY
    };
  }, []);
  const allowedBlockTypes = (0, import_element.useMemo)(() => {
    if (_allowedBlockTypes === true) {
      return blockTypes;
    }
    return blockTypes.filter(({ name }) => {
      return _allowedBlockTypes?.includes(name);
    });
  }, [_allowedBlockTypes, blockTypes]);
  const filteredBlockTypes = allowedBlockTypes.filter(
    (blockType) => (0, import_blocks.hasBlockSupport)(blockType, "inserter", true) && (!blockType.parent || blockType.parent.includes("core/post-content"))
  );
  const hiddenBlockTypes = _hiddenBlockTypes.filter((hiddenBlock) => {
    return filteredBlockTypes.some(
      (registeredBlock) => registeredBlock.name === hiddenBlock
    );
  });
  const selectedBlockTypes = filteredBlockTypes.filter(
    (blockType) => !hiddenBlockTypes.includes(blockType.name)
  );
  const numberOfHiddenBlocks = filteredBlockTypes.length - selectedBlockTypes.length;
  function enableAllBlockTypes() {
    onChangeSelectedBlockTypes(filteredBlockTypes);
  }
  const onChangeSelectedBlockTypes = (newSelectedBlockTypes) => {
    if (selectedBlockTypes.length > newSelectedBlockTypes.length) {
      const blockTypesToHide = selectedBlockTypes.filter(
        (blockType) => !newSelectedBlockTypes.find(
          ({ name }) => name === blockType.name
        )
      );
      hideBlockTypes(blockTypesToHide.map(({ name }) => name));
    } else if (selectedBlockTypes.length < newSelectedBlockTypes.length) {
      const blockTypesToShow = newSelectedBlockTypes.filter(
        (blockType) => !selectedBlockTypes.find(
          ({ name }) => name === blockType.name
        )
      );
      showBlockTypes(blockTypesToShow.map(({ name }) => name));
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-block-visibility", children: [
    !!numberOfHiddenBlocks && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-block-visibility__disabled-blocks-count", children: [
      (0, import_i18n.sprintf)(
        /* translators: %d: number of blocks. */
        (0, import_i18n._n)(
          "%d block is hidden.",
          "%d blocks are hidden.",
          numberOfHiddenBlocks
        ),
        numberOfHiddenBlocks
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          variant: "link",
          onClick: enableAllBlockTypes,
          children: (0, import_i18n.__)("Reset")
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      BlockManager,
      {
        blockTypes: filteredBlockTypes,
        selectedBlockTypes,
        onChange: onChangeSelectedBlockTypes,
        showSelectAll: false
      }
    )
  ] });
}
//# sourceMappingURL=index.cjs.map
