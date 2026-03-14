// packages/core-data/src/hooks/use-entity-block-editor.js
import { useCallback, useMemo } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { parse, __unstableSerializeAndClean } from "@wordpress/blocks";
import { STORE_NAME } from "../name.mjs";
import useEntityId from "./use-entity-id.mjs";
import { updateFootnotesFromMeta } from "../footnotes/index.mjs";
var EMPTY_ARRAY = [];
var parsedBlocksCache = /* @__PURE__ */ new Map();
function useEntityBlockEditor(kind, name, { id: _id } = {}) {
  const providerId = useEntityId(kind, name);
  const id = _id ?? providerId;
  const { content, editedBlocks, meta } = useSelect(
    (select) => {
      if (!id) {
        return {};
      }
      const { getEditedEntityRecord } = select(STORE_NAME);
      const editedRecord = getEditedEntityRecord(kind, name, id);
      return {
        editedBlocks: editedRecord.blocks,
        content: editedRecord.content,
        meta: editedRecord.meta
      };
    },
    [kind, name, id]
  );
  const { __unstableCreateUndoLevel, editEntityRecord } = useDispatch(STORE_NAME);
  const blocks = useMemo(() => {
    if (!id) {
      return void 0;
    }
    if (editedBlocks) {
      return editedBlocks;
    }
    if (!content || typeof content !== "string") {
      return EMPTY_ARRAY;
    }
    const cacheKey = `${kind}:${name}:${id}`;
    const cached = parsedBlocksCache.get(cacheKey);
    let _blocks;
    if (cached && cached.content === content) {
      _blocks = cached.blocks;
    } else {
      _blocks = parse(content);
      parsedBlocksCache.set(cacheKey, { content, blocks: _blocks });
    }
    return _blocks;
  }, [kind, name, id, editedBlocks, content]);
  const onChange = useCallback(
    (newBlocks, options) => {
      const noChange = blocks === newBlocks;
      if (noChange) {
        return __unstableCreateUndoLevel(kind, name, id);
      }
      const { selection, ...rest } = options;
      const edits = {
        selection,
        content: ({ blocks: blocksForSerialization = [] }) => __unstableSerializeAndClean(blocksForSerialization),
        ...updateFootnotesFromMeta(newBlocks, meta)
      };
      editEntityRecord(kind, name, id, edits, {
        isCached: false,
        ...rest
      });
    },
    [
      kind,
      name,
      id,
      blocks,
      meta,
      __unstableCreateUndoLevel,
      editEntityRecord
    ]
  );
  const onInput = useCallback(
    (newBlocks, options) => {
      const { selection, ...rest } = options;
      const edits = {
        selection,
        ...updateFootnotesFromMeta(newBlocks, meta)
      };
      editEntityRecord(kind, name, id, edits, {
        isCached: true,
        ...rest
      });
    },
    [kind, name, id, meta, editEntityRecord]
  );
  return [blocks, onInput, onChange];
}
export {
  useEntityBlockEditor as default
};
//# sourceMappingURL=use-entity-block-editor.mjs.map
