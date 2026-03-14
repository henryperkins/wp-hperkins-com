// packages/editor/src/components/collaborators-overlay/use-render-cursors.ts
import {
  privateApis as coreDataPrivateApis,
  SelectionType
} from "@wordpress/core-data";
import { useEffect, useMemo, useState } from "@wordpress/element";
import { unlock } from "../../lock-unlock.mjs";
import { getAvatarUrl } from "./get-avatar-url.mjs";
import { getAvatarBorderColor } from "../collab-sidebar/utils.mjs";
var { useActiveCollaborators, useResolvedSelection } = unlock(coreDataPrivateApis);
function useRenderCursors(overlayElement, blockEditorDocument, postId, postType) {
  const sortedUsers = useActiveCollaborators(
    postId ?? null,
    postType ?? null
  );
  const resolveSelection = useResolvedSelection(
    postId ?? null,
    postType ?? null
  );
  const [cursorPositions, setCursorPositions] = useState(
    []
  );
  const computeCursors = useMemo(
    () => () => {
      if (!overlayElement || !blockEditorDocument) {
        setCursorPositions([]);
        return;
      }
      const results = [];
      sortedUsers.forEach((user) => {
        if (user.isMe) {
          return;
        }
        const selection = user.editorState?.selection ?? {
          type: SelectionType.None
        };
        const userName = user.collaboratorInfo.name;
        const clientId = user.clientId;
        const color = getAvatarBorderColor(user.collaboratorInfo.id);
        const avatarUrl = getAvatarUrl(
          user.collaboratorInfo.avatar_urls
        );
        let coords = null;
        if (selection.type === SelectionType.None) {
        } else if (selection.type === SelectionType.WholeBlock) {
        } else if (selection.type === SelectionType.Cursor) {
          const { textIndex, localClientId } = resolveSelection(selection);
          if (localClientId) {
            coords = getCursorPosition(
              textIndex,
              localClientId,
              blockEditorDocument,
              overlayElement
            );
          }
        } else if (selection.type === SelectionType.SelectionInOneBlock || selection.type === SelectionType.SelectionInMultipleBlocks) {
          const { textIndex, localClientId } = resolveSelection({
            type: SelectionType.Cursor,
            cursorPosition: selection.cursorStartPosition
          });
          if (localClientId) {
            coords = getCursorPosition(
              textIndex,
              localClientId,
              blockEditorDocument,
              overlayElement
            );
          }
        }
        if (coords) {
          results.push({
            userName,
            clientId,
            color,
            avatarUrl,
            ...coords
          });
        }
      });
      setCursorPositions(results);
    },
    [blockEditorDocument, resolveSelection, overlayElement, sortedUsers]
  );
  useEffect(computeCursors, [computeCursors]);
  const rerenderCursorsAfterDelay = useMemo(
    () => () => {
      const timeout = setTimeout(computeCursors, 500);
      return () => clearTimeout(timeout);
    },
    [computeCursors]
  );
  return { cursors: cursorPositions, rerenderCursorsAfterDelay };
}
var getCursorPosition = (absolutePositionIndex, blockId, editorDocument, overlay) => {
  if (absolutePositionIndex === null) {
    return null;
  }
  const blockElement = editorDocument.querySelector(
    `[data-block="${blockId}"]`
  );
  if (!blockElement) {
    return null;
  }
  return getOffsetPositionInBlock(
    blockElement,
    absolutePositionIndex,
    editorDocument,
    overlay
  ) ?? null;
};
var getOffsetPositionInBlock = (blockElement, charOffset, editorDocument, overlay) => {
  const { node, offset } = findInnerBlockOffset(
    blockElement,
    charOffset,
    editorDocument
  );
  const cursorRange = editorDocument.createRange();
  try {
    cursorRange.setStart(node, offset);
  } catch (error) {
    return null;
  }
  cursorRange.collapse(true);
  const cursorRect = cursorRange.getBoundingClientRect();
  const overlayRect = overlay.getBoundingClientRect();
  const blockRect = blockElement.getBoundingClientRect();
  let cursorX = 0;
  let cursorY = 0;
  if (cursorRect.x === 0 && cursorRect.y === 0 && cursorRect.width === 0 && cursorRect.height === 0) {
    cursorX = blockRect.left - overlayRect.left;
    cursorY = blockRect.top - overlayRect.top;
  } else {
    cursorX = cursorRect.left - overlayRect.left;
    cursorY = cursorRect.top - overlayRect.top;
  }
  let cursorHeight = cursorRect.height;
  if (cursorHeight === 0) {
    cursorHeight = parseInt(
      window.getComputedStyle(blockElement).lineHeight,
      10
    ) || blockRect.height;
  }
  return {
    x: cursorX,
    y: cursorY,
    height: cursorHeight
  };
};
var MAX_NODE_OFFSET_COUNT = 1e3;
var findInnerBlockOffset = (blockElement, offset, editorDocument) => {
  const treeWalker = editorDocument.createTreeWalker(
    blockElement,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
    // eslint-disable-line no-bitwise
  );
  let currentOffset = 0;
  let lastTextNode = null;
  let node = null;
  let nodeCount = 1;
  while (node = treeWalker.nextNode()) {
    nodeCount++;
    if (nodeCount > MAX_NODE_OFFSET_COUNT) {
      if (lastTextNode) {
        return { node: lastTextNode, offset: 0 };
      }
      return { node: blockElement, offset: 0 };
    }
    const nodeLength = node.nodeValue?.length ?? 0;
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.nodeName === "BR") {
        if (currentOffset + 1 >= offset) {
          const nodeAfterBr = treeWalker.nextNode();
          if (nodeAfterBr?.nodeType === Node.TEXT_NODE) {
            return { node: nodeAfterBr, offset: 0 };
          } else if (lastTextNode) {
            return {
              node: lastTextNode,
              offset: lastTextNode.nodeValue?.length ?? 0
            };
          }
          return { node: blockElement, offset: 0 };
        }
        currentOffset += 1;
        continue;
      } else {
        continue;
      }
    }
    if (nodeLength === 0) {
      continue;
    }
    if (currentOffset + nodeLength >= offset) {
      return { node, offset: offset - currentOffset };
    }
    currentOffset += nodeLength;
    if (node.nodeType === Node.TEXT_NODE) {
      lastTextNode = node;
    }
  }
  if (lastTextNode && lastTextNode.nodeValue?.length) {
    return { node: lastTextNode, offset: lastTextNode.nodeValue.length };
  }
  return { node: blockElement, offset: 0 };
};
export {
  useRenderCursors
};
//# sourceMappingURL=use-render-cursors.mjs.map
