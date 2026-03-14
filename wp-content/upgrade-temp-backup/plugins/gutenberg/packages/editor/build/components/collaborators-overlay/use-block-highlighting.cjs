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

// packages/editor/src/components/collaborators-overlay/use-block-highlighting.ts
var use_block_highlighting_exports = {};
__export(use_block_highlighting_exports, {
  useBlockHighlighting: () => useBlockHighlighting
});
module.exports = __toCommonJS(use_block_highlighting_exports);
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_utils = require("../collab-sidebar/utils.cjs");
var { useActiveCollaborators, useResolvedSelection } = (0, import_lock_unlock.unlock)(import_core_data.privateApis);
function useBlockHighlighting(blockEditorDocument, postId, postType) {
  const highlightedBlockIds = (0, import_element.useRef)(/* @__PURE__ */ new Set());
  const userStates = useActiveCollaborators(
    postId ?? null,
    postType ?? null
  );
  const resolveSelection = useResolvedSelection(
    postId ?? null,
    postType ?? null
  );
  (0, import_element.useEffect)(() => {
    if (blockEditorDocument === null) {
      return;
    }
    const unhighlightBlocks = (blockIds) => {
      blockIds.forEach((blockId) => {
        const blockElement = getBlockElementById(
          blockEditorDocument,
          blockId
        );
        if (blockElement) {
          blockElement.classList.remove("is-collaborator-selected");
          blockElement.style.removeProperty(
            "--collaborator-outline-color"
          );
        }
        highlightedBlockIds.current.delete(blockId);
      });
    };
    const blocksToHighlight = userStates.map((userState) => {
      const isWholeBlockSelected = userState.editorState?.selection?.type === import_core_data.SelectionType.WholeBlock;
      const shouldDrawUser = !userState.isMe;
      if (isWholeBlockSelected && shouldDrawUser) {
        const { localClientId } = resolveSelection(
          userState.editorState?.selection
        );
        if (!localClientId) {
          return null;
        }
        return {
          blockId: localClientId,
          color: (0, import_utils.getAvatarBorderColor)(
            userState.collaboratorInfo.id
          )
        };
      }
      return null;
    }).filter((block) => block !== null);
    const selectedBlockIds = blocksToHighlight.map(
      (block) => block.blockId
    );
    const blocksIdsToUnhighlight = Array.from(
      highlightedBlockIds.current
    ).filter((blockId) => !selectedBlockIds.includes(blockId));
    unhighlightBlocks(blocksIdsToUnhighlight);
    blocksToHighlight.forEach((blockColorPair) => {
      const { color, blockId } = blockColorPair;
      const blockElement = getBlockElementById(
        blockEditorDocument,
        blockId
      );
      if (!blockElement) {
        return;
      }
      if (blockElement) {
        blockElement.classList.add("is-collaborator-selected");
        blockElement.style.setProperty(
          "--collaborator-outline-color",
          color
        );
        highlightedBlockIds.current.add(blockId);
      }
    });
  }, [userStates, blockEditorDocument, resolveSelection]);
}
var getBlockElementById = (blockEditorDocument, blockId) => {
  return blockEditorDocument.querySelector(`[data-block="${blockId}"]`);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useBlockHighlighting
});
//# sourceMappingURL=use-block-highlighting.cjs.map
