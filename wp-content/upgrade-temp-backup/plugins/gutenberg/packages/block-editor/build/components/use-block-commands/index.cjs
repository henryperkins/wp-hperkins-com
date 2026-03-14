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

// packages/block-editor/src/components/use-block-commands/index.js
var use_block_commands_exports = {};
__export(use_block_commands_exports, {
  useBlockCommands: () => useBlockCommands
});
module.exports = __toCommonJS(use_block_commands_exports);
var import_i18n = require("@wordpress/i18n");
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_commands = require("@wordpress/commands");
var import_icons = require("@wordpress/icons");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var getTransformCommands = () => function useTransformCommands() {
  const { replaceBlocks, multiSelect } = (0, import_data.useDispatch)(import_store.store);
  const {
    blocks,
    clientIds,
    canRemove,
    possibleBlockTransformations,
    invalidSelection
  } = (0, import_data.useSelect)((select) => {
    const {
      getBlockRootClientId,
      getBlockTransformItems,
      getSelectedBlockClientIds,
      getBlocksByClientId,
      canRemoveBlocks
    } = select(import_store.store);
    const selectedBlockClientIds = getSelectedBlockClientIds();
    const selectedBlocks = getBlocksByClientId(
      selectedBlockClientIds
    );
    if (selectedBlocks.filter((block) => !block).length > 0) {
      return {
        invalidSelection: true
      };
    }
    const rootClientId = getBlockRootClientId(
      selectedBlockClientIds[0]
    );
    return {
      blocks: selectedBlocks,
      clientIds: selectedBlockClientIds,
      possibleBlockTransformations: getBlockTransformItems(
        selectedBlocks,
        rootClientId
      ),
      canRemove: canRemoveBlocks(selectedBlockClientIds),
      invalidSelection: false
    };
  }, []);
  if (invalidSelection) {
    return {
      isLoading: false,
      commands: []
    };
  }
  const isTemplate = blocks.length === 1 && (0, import_blocks.isTemplatePart)(blocks[0]);
  function selectForMultipleBlocks(insertedBlocks) {
    if (insertedBlocks.length > 1) {
      multiSelect(
        insertedBlocks[0].clientId,
        insertedBlocks[insertedBlocks.length - 1].clientId
      );
    }
  }
  function onBlockTransform(name) {
    const newBlocks = (0, import_blocks.switchToBlockType)(blocks, name);
    replaceBlocks(clientIds, newBlocks);
    selectForMultipleBlocks(newBlocks);
  }
  const hasPossibleBlockTransformations = !!possibleBlockTransformations.length && canRemove && !isTemplate;
  if (!clientIds || clientIds.length < 1 || !hasPossibleBlockTransformations) {
    return { isLoading: false, commands: [] };
  }
  const commands = possibleBlockTransformations.map(
    (transformation) => {
      const { name, title, icon } = transformation;
      const blockIcon = !icon?.src || icon?.src === "block-default" ? {
        src: import_icons.blockDefault
      } : icon;
      return {
        name: "core/block-editor/transform-to-" + name.replace("/", "-"),
        /* translators: %s: Block or block variation name. */
        label: (0, import_i18n.sprintf)((0, import_i18n.__)("Transform to %s"), title),
        icon: blockIcon?.src,
        category: "command",
        callback: ({ close }) => {
          onBlockTransform(name);
          close();
        }
      };
    }
  );
  return { isLoading: false, commands };
};
var getQuickActionsCommands = () => function useQuickActionsCommands() {
  const { clientIds, isUngroupable, isGroupable } = (0, import_data.useSelect)(
    (select) => {
      const {
        getSelectedBlockClientIds,
        isUngroupable: _isUngroupable,
        isGroupable: _isGroupable
      } = select(import_store.store);
      const selectedBlockClientIds = getSelectedBlockClientIds();
      return {
        clientIds: selectedBlockClientIds,
        isUngroupable: _isUngroupable(),
        isGroupable: _isGroupable()
      };
    },
    []
  );
  const {
    canInsertBlockType,
    getBlockRootClientId,
    getBlocksByClientId,
    canRemoveBlocks,
    isBlockHiddenAnywhere
  } = (0, import_lock_unlock.unlock)((0, import_data.useSelect)(import_store.store));
  const { getBlockEditingMode } = (0, import_data.useSelect)(import_store.store);
  const { getDefaultBlockName, getGroupingBlockName } = (0, import_data.useSelect)(import_blocks.store);
  const blocks = getBlocksByClientId(clientIds);
  const blockEditorDispatch = (0, import_data.useDispatch)(import_store.store);
  const {
    removeBlocks,
    replaceBlocks,
    duplicateBlocks,
    insertAfterBlock,
    insertBeforeBlock
  } = blockEditorDispatch;
  const onGroup = () => {
    if (!blocks.length) {
      return;
    }
    const groupingBlockName = getGroupingBlockName();
    const newBlocks = (0, import_blocks.switchToBlockType)(blocks, groupingBlockName);
    if (!newBlocks) {
      return;
    }
    replaceBlocks(clientIds, newBlocks);
  };
  const onUngroup = () => {
    if (!blocks.length) {
      return;
    }
    const innerBlocks = blocks[0].innerBlocks;
    if (!innerBlocks.length) {
      return;
    }
    replaceBlocks(clientIds, innerBlocks);
  };
  if (!clientIds || clientIds.length < 1) {
    return { isLoading: false, commands: [] };
  }
  const { showViewportModal } = (0, import_lock_unlock.unlock)(blockEditorDispatch);
  const rootClientId = getBlockRootClientId(clientIds[0]);
  const canInsertDefaultBlock = canInsertBlockType(
    getDefaultBlockName(),
    rootClientId
  );
  const canDuplicate = blocks.every((block) => {
    return !!block && (0, import_blocks.hasBlockSupport)(block.name, "multiple", true) && canInsertBlockType(block.name, rootClientId);
  });
  const canRemove = canRemoveBlocks(clientIds);
  const commands = [];
  if (canDuplicate) {
    commands.push({
      name: "duplicate",
      label: (0, import_i18n.__)("Duplicate"),
      callback: () => duplicateBlocks(clientIds, true),
      icon: import_icons.copy
    });
  }
  if (canInsertDefaultBlock) {
    commands.push(
      {
        name: "add-before",
        label: (0, import_i18n.__)("Add before"),
        callback: () => {
          const clientId = Array.isArray(clientIds) ? clientIds[0] : clientId;
          insertBeforeBlock(clientId);
        },
        icon: import_icons.plus
      },
      {
        name: "add-after",
        label: (0, import_i18n.__)("Add after"),
        callback: () => {
          const clientId = Array.isArray(clientIds) ? clientIds[clientIds.length - 1] : clientId;
          insertAfterBlock(clientId);
        },
        icon: import_icons.plus
      }
    );
  }
  if (isGroupable) {
    commands.push({
      name: "Group",
      label: (0, import_i18n.__)("Group"),
      callback: onGroup,
      icon: import_icons.group
    });
  }
  if (isUngroupable) {
    commands.push({
      name: "ungroup",
      label: (0, import_i18n.__)("Ungroup"),
      callback: onUngroup,
      icon: import_icons.ungroup
    });
  }
  if (canRemove) {
    commands.push({
      name: "remove",
      label: (0, import_i18n.__)("Delete"),
      callback: () => removeBlocks(clientIds, true),
      icon: import_icons.trash
    });
  }
  const supportsVisibility = blocks.every(
    (block) => !!block && (0, import_blocks.hasBlockSupport)(block.name, "visibility", true)
  );
  const allBlocksDefaultMode = clientIds.every(
    (id) => getBlockEditingMode(id) === "default"
  );
  if (supportsVisibility && allBlocksDefaultMode) {
    const hasHiddenBlock = clientIds.some(
      (id) => isBlockHiddenAnywhere(id)
    );
    commands.push({
      name: "toggle-visibility",
      label: hasHiddenBlock ? (0, import_i18n.__)("Show") : (0, import_i18n.__)("Hide"),
      callback: () => showViewportModal(clientIds),
      icon: hasHiddenBlock ? import_icons.seen : import_icons.unseen
    });
  }
  return {
    isLoading: false,
    commands: commands.map((command) => ({
      ...command,
      name: "core/block-editor/action-" + command.name,
      category: "command",
      callback: ({ close }) => {
        command.callback();
        close();
      }
    }))
  };
};
var useBlockCommands = () => {
  (0, import_commands.useCommandLoader)({
    name: "core/block-editor/blockTransforms",
    hook: getTransformCommands()
  });
  (0, import_commands.useCommandLoader)({
    name: "core/block-editor/blockQuickActions",
    hook: getQuickActionsCommands(),
    context: "block-selection-edit"
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useBlockCommands
});
//# sourceMappingURL=index.cjs.map
