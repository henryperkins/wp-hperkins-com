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

// packages/editor/src/components/collaborators-overlay/use-render-cursors.ts
var use_render_cursors_exports = {};
__export(use_render_cursors_exports, {
  useRenderCursors: () => useRenderCursors
});
module.exports = __toCommonJS(use_render_cursors_exports);
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_get_avatar_url = require("./get-avatar-url.cjs");
var import_utils = require("../collab-sidebar/utils.cjs");
var { useActiveCollaborators, useResolvedSelection } = (0, import_lock_unlock.unlock)(import_core_data.privateApis);
function useRenderCursors(overlayElement, blockEditorDocument, postId, postType) {
  const sortedUsers = useActiveCollaborators(
    postId ?? null,
    postType ?? null
  );
  const resolveSelection = useResolvedSelection(
    postId ?? null,
    postType ?? null
  );
  const [cursorPositions, setCursorPositions] = (0, import_element.useState)(
    []
  );
  const computeCursors = (0, import_element.useMemo)(
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
          type: import_core_data.SelectionType.None
        };
        const userName = user.collaboratorInfo.name;
        const clientId = user.clientId;
        const color = (0, import_utils.getAvatarBorderColor)(user.collaboratorInfo.id);
        const avatarUrl = (0, import_get_avatar_url.getAvatarUrl)(
          user.collaboratorInfo.avatar_urls
        );
        let coords = null;
        if (selection.type === import_core_data.SelectionType.None) {
        } else if (selection.type === import_core_data.SelectionType.WholeBlock) {
        } else if (selection.type === import_core_data.SelectionType.Cursor) {
          const { textIndex, localClientId } = resolveSelection(selection);
          if (localClientId) {
            coords = getCursorPosition(
              textIndex,
              localClientId,
              blockEditorDocument,
              overlayElement
            );
          }
        } else if (selection.type === import_core_data.SelectionType.SelectionInOneBlock || selection.type === import_core_data.SelectionType.SelectionInMultipleBlocks) {
          const { textIndex, localClientId } = resolveSelection({
            type: import_core_data.SelectionType.Cursor,
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
  (0, import_element.useEffect)(computeCursors, [computeCursors]);
  const rerenderCursorsAfterDelay = (0, import_element.useMemo)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useRenderCursors
});
//# sourceMappingURL=use-render-cursors.cjs.map
