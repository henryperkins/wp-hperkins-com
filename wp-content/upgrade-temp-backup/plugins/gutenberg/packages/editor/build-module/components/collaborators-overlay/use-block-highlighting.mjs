// packages/editor/src/components/collaborators-overlay/use-block-highlighting.ts
import {
  privateApis as coreDataPrivateApis,
  SelectionType
} from "@wordpress/core-data";
import { useEffect, useRef } from "@wordpress/element";
import { unlock } from "../../lock-unlock.mjs";
import { getAvatarBorderColor } from "../collab-sidebar/utils.mjs";
var { useActiveCollaborators, useResolvedSelection } = unlock(coreDataPrivateApis);
function useBlockHighlighting(blockEditorDocument, postId, postType) {
  const highlightedBlockIds = useRef(/* @__PURE__ */ new Set());
  const userStates = useActiveCollaborators(
    postId ?? null,
    postType ?? null
  );
  const resolveSelection = useResolvedSelection(
    postId ?? null,
    postType ?? null
  );
  useEffect(() => {
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
      const isWholeBlockSelected = userState.editorState?.selection?.type === SelectionType.WholeBlock;
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
          color: getAvatarBorderColor(
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
export {
  useBlockHighlighting
};
//# sourceMappingURL=use-block-highlighting.mjs.map
