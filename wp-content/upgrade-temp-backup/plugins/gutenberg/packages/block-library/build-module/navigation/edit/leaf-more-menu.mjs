// packages/block-library/src/navigation/edit/leaf-more-menu.js
import {
  createBlock,
  hasBlockSupport,
  store as blocksStore
} from "@wordpress/blocks";
import {
  addSubmenu,
  chevronUp,
  chevronDown,
  moreVertical
} from "@wordpress/icons";
import { DropdownMenu, MenuItem, MenuGroup } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { BlockTitle, store as blockEditorStore } from "@wordpress/block-editor";
import { DEFAULT_BLOCK } from "../constants.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
  const { insertBlock, replaceBlock, replaceInnerBlocks } = useDispatch(blockEditorStore);
  const clientId = block.clientId;
  const isDisabled = !BLOCKS_THAT_CAN_BE_CONVERTED_TO_SUBMENU.includes(
    block.name
  );
  return /* @__PURE__ */ jsx(
    MenuItem,
    {
      icon: addSubmenu,
      disabled: isDisabled,
      onClick: () => {
        const updateSelectionOnInsert = false;
        const newLink = createBlock(
          DEFAULT_BLOCK.name,
          DEFAULT_BLOCK.attributes
        );
        if (block.name === "core/navigation-submenu") {
          insertBlock(
            newLink,
            block.innerBlocks.length,
            clientId,
            updateSelectionOnInsert
          );
        } else {
          const newSubmenu = createBlock(
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
      children: __("Add submenu link")
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
  } = useDispatch(blockEditorStore);
  const removeLabel = sprintf(
    /* translators: %s: block name */
    __("Remove %s"),
    BlockTitle({ clientId, maximumLength: 25 })
  );
  const { rootClientId, canDuplicate, canInsertBlock, isFirst, isLast } = useSelect(
    (select) => {
      const {
        getBlockRootClientId,
        canInsertBlockType,
        getDirectInsertBlock,
        getBlockIndex,
        getBlockCount
      } = select(blockEditorStore);
      const { getDefaultBlockName } = select(blocksStore);
      const _rootClientId = getBlockRootClientId(clientId);
      const canInsertDefaultBlock = canInsertBlockType(
        getDefaultBlockName(),
        _rootClientId
      );
      const directInsertBlock = _rootClientId ? getDirectInsertBlock(_rootClientId) : null;
      return {
        rootClientId: _rootClientId,
        canDuplicate: !!block && hasBlockSupport(block.name, "multiple", true) && canInsertBlockType(block.name, _rootClientId),
        canInsertBlock: (canInsertDefaultBlock || !!directInsertBlock) && !!block && canInsertBlockType(block.name, _rootClientId),
        isFirst: getBlockIndex(clientId) === 0,
        isLast: getBlockIndex(clientId) === getBlockCount(_rootClientId) - 1
      };
    },
    [clientId, block]
  );
  return /* @__PURE__ */ jsx(
    DropdownMenu,
    {
      icon: moreVertical,
      label: __("Options"),
      className: "block-editor-block-settings-menu",
      popoverProps: POPOVER_PROPS,
      noIcons: true,
      ...props,
      children: ({ onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(MenuGroup, { children: [
          /* @__PURE__ */ jsx(
            MenuItem,
            {
              icon: chevronUp,
              disabled: isFirst,
              accessibleWhenDisabled: true,
              onClick: () => {
                moveBlocksUp([clientId], rootClientId);
                onClose();
              },
              children: __("Move up")
            }
          ),
          /* @__PURE__ */ jsx(
            MenuItem,
            {
              icon: chevronDown,
              disabled: isLast,
              accessibleWhenDisabled: true,
              onClick: () => {
                moveBlocksDown([clientId], rootClientId);
                onClose();
              },
              children: __("Move down")
            }
          ),
          /* @__PURE__ */ jsx(
            AddSubmenuItem,
            {
              block,
              onClose,
              expandedState: props.expandedState,
              expand: props.expand,
              setInsertedBlock: props.setInsertedBlock
            }
          ),
          canDuplicate && /* @__PURE__ */ jsx(
            MenuItem,
            {
              onClick: () => {
                duplicateBlocks([clientId]);
                onClose();
              },
              children: __("Duplicate")
            }
          ),
          canInsertBlock && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              MenuItem,
              {
                onClick: () => {
                  insertBeforeBlock(clientId);
                  onClose();
                },
                children: __("Add before")
              }
            ),
            /* @__PURE__ */ jsx(
              MenuItem,
              {
                onClick: () => {
                  insertAfterBlock(clientId);
                  onClose();
                },
                children: __("Add after")
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(MenuGroup, { children: /* @__PURE__ */ jsx(
          MenuItem,
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
export {
  LeafMoreMenu as default
};
//# sourceMappingURL=leaf-more-menu.mjs.map
