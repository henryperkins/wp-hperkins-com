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

// packages/block-library/src/navigation/edit/leaf-more-menu.js
var leaf_more_menu_exports = {};
__export(leaf_more_menu_exports, {
  default: () => LeafMoreMenu
});
module.exports = __toCommonJS(leaf_more_menu_exports);
var import_blocks = require("@wordpress/blocks");
var import_icons = require("@wordpress/icons");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_constants = require("../constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var POPOVER_PROPS = {
  className: "block-editor-block-settings-menu__popover",
  placement: "bottom-start"
};
var BLOCKS_THAT_CAN_BE_CONVERTED_TO_SUBMENU = [
  "core/navigation-link",
  "core/navigation-submenu"
];
function AddSubmenuItem({
  block,
  onClose,
  expandedState,
  expand,
  setInsertedBlock
}) {
  const { insertBlock, replaceBlock, replaceInnerBlocks } = (0, import_data.useDispatch)(import_block_editor.store);
  const clientId = block.clientId;
  const isDisabled = !BLOCKS_THAT_CAN_BE_CONVERTED_TO_SUBMENU.includes(
    block.name
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.MenuItem,
    {
      icon: import_icons.addSubmenu,
      disabled: isDisabled,
      onClick: () => {
        const updateSelectionOnInsert = false;
        const newLink = (0, import_blocks.createBlock)(
          import_constants.DEFAULT_BLOCK.name,
          import_constants.DEFAULT_BLOCK.attributes
        );
        if (block.name === "core/navigation-submenu") {
          insertBlock(
            newLink,
            block.innerBlocks.length,
            clientId,
            updateSelectionOnInsert
          );
        } else {
          const newSubmenu = (0, import_blocks.createBlock)(
            "core/navigation-submenu",
            block.attributes,
            block.innerBlocks
          );
          replaceBlock(clientId, newSubmenu);
          replaceInnerBlocks(
            newSubmenu.clientId,
            [newLink],
            updateSelectionOnInsert
          );
        }
        setInsertedBlock(newLink);
        if (!expandedState[block.clientId]) {
          expand(block.clientId);
        }
        onClose();
      },
      children: (0, import_i18n.__)("Add submenu link")
    }
  );
}
function LeafMoreMenu(props) {
  const { block } = props;
  const { clientId } = block;
  const {
    moveBlocksDown,
    moveBlocksUp,
    removeBlocks,
    duplicateBlocks,
    insertBeforeBlock,
    insertAfterBlock
  } = (0, import_data.useDispatch)(import_block_editor.store);
  const removeLabel = (0, import_i18n.sprintf)(
    /* translators: %s: block name */
    (0, import_i18n.__)("Remove %s"),
    (0, import_block_editor.BlockTitle)({ clientId, maximumLength: 25 })
  );
  const { rootClientId, canDuplicate, canInsertBlock, isFirst, isLast } = (0, import_data.useSelect)(
    (select) => {
      const {
        getBlockRootClientId,
        canInsertBlockType,
        getDirectInsertBlock,
        getBlockIndex,
        getBlockCount
      } = select(import_block_editor.store);
      const { getDefaultBlockName } = select(import_blocks.store);
      const _rootClientId = getBlockRootClientId(clientId);
      const canInsertDefaultBlock = canInsertBlockType(
        getDefaultBlockName(),
        _rootClientId
      );
      const directInsertBlock = _rootClientId ? getDirectInsertBlock(_rootClientId) : null;
      return {
        rootClientId: _rootClientId,
        canDuplicate: !!block && (0, import_blocks.hasBlockSupport)(block.name, "multiple", true) && canInsertBlockType(block.name, _rootClientId),
        canInsertBlock: (canInsertDefaultBlock || !!directInsertBlock) && !!block && canInsertBlockType(block.name, _rootClientId),
        isFirst: getBlockIndex(clientId) === 0,
        isLast: getBlockIndex(clientId) === getBlockCount(_rootClientId) - 1
      };
    },
    [clientId, block]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.DropdownMenu,
    {
      icon: import_icons.moreVertical,
      label: (0, import_i18n.__)("Options"),
      className: "block-editor-block-settings-menu",
      popoverProps: POPOVER_PROPS,
      noIcons: true,
      ...props,
      children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.MenuGroup, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.MenuItem,
            {
              icon: import_icons.chevronUp,
              disabled: isFirst,
              accessibleWhenDisabled: true,
              onClick: () => {
                moveBlocksUp([clientId], rootClientId);
                onClose();
              },
              children: (0, import_i18n.__)("Move up")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.MenuItem,
            {
              icon: import_icons.chevronDown,
              disabled: isLast,
              accessibleWhenDisabled: true,
              onClick: () => {
                moveBlocksDown([clientId], rootClientId);
                onClose();
              },
              children: (0, import_i18n.__)("Move down")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            AddSubmenuItem,
            {
              block,
              onClose,
              expandedState: props.expandedState,
              expand: props.expand,
              setInsertedBlock: props.setInsertedBlock
            }
          ),
          canDuplicate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.MenuItem,
            {
              onClick: () => {
                duplicateBlocks([clientId]);
                onClose();
              },
              children: (0, import_i18n.__)("Duplicate")
            }
          ),
          canInsertBlock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.MenuItem,
              {
                onClick: () => {
                  insertBeforeBlock(clientId);
                  onClose();
                },
                children: (0, import_i18n.__)("Add before")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.MenuItem,
              {
                onClick: () => {
                  insertAfterBlock(clientId);
                  onClose();
                },
                children: (0, import_i18n.__)("Add after")
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.MenuItem,
          {
            onClick: () => {
              removeBlocks([clientId], false);
              onClose();
            },
            children: removeLabel
          }
        ) })
      ] })
    }
  );
}
//# sourceMappingURL=leaf-more-menu.cjs.map
