// packages/block-editor/src/components/provider/use-block-sync.js
import { useContext, useEffect, useRef } from "@wordpress/element";
import { useRegistry } from "@wordpress/data";
import { cloneBlock } from "@wordpress/blocks";
import { store as blockEditorStore } from "../../store/index.mjs";
import { SelectionContext } from "./selection-context.mjs";
var noop = () => {
};
function cloneBlockWithMapping(block, mapping) {
  const clonedBlock = cloneBlock(block);
  mapping.externalToInternal.set(block.clientId, clonedBlock.clientId);
  mapping.internalToExternal.set(clonedBlock.clientId, block.clientId);
  if (block.innerBlocks?.length) {
    clonedBlock.innerBlocks = block.innerBlocks.map((innerBlock) => {
      const clonedInner = cloneBlockWithMapping(innerBlock, mapping);
      return clonedInner;
    });
  }
  return clonedBlock;
}
function restoreExternalIds(blocks, mapping) {
  return blocks.map((block) => {
    const externalId = mapping.internalToExternal.get(block.clientId);
    return {
      ...block,
      // Use external ID if available, otherwise keep internal ID (for new blocks)
      clientId: externalId ?? block.clientId,
      innerBlocks: restoreExternalIds(block.innerBlocks, mapping)
    };
  });
}
function restoreSelectionIds(selectionState, mapping) {
  const { selectionStart, selectionEnd, initialPosition } = selectionState;
  const restoreClientId = (sel) => {
    if (!sel?.clientId) {
      return sel;
    }
    const externalId = mapping.internalToExternal.get(sel.clientId);
    return {
      ...sel,
      clientId: externalId ?? sel.clientId
    };
  };
  return {
    selectionStart: restoreClientId(selectionStart),
    selectionEnd: restoreClientId(selectionEnd),
    initialPosition
  };
}
function useBlockSync({
  clientId = null,
  value: controlledBlocks,
  onChange = noop,
  onInput = noop
}) {
  const registry = useRegistry();
  const { getSelection, onChangeSelection } = useContext(SelectionContext);
  const {
    resetBlocks,
    resetSelection,
    replaceInnerBlocks,
    setHasControlledInnerBlocks,
    __unstableMarkNextChangeAsNotPersistent
  } = registry.dispatch(blockEditorStore);
  const { getBlockName, getBlocks, getSelectionStart, getSelectionEnd } = registry.select(blockEditorStore);
  const pendingChangesRef = useRef({ incoming: null, outgoing: [] });
  const subscribedRef = useRef(false);
  const idMappingRef = useRef({
    externalToInternal: /* @__PURE__ */ new Map(),
    internalToExternal: /* @__PURE__ */ new Map()
  });
  const appliedSelectionRef = useRef(null);
  const isRestoringSelectionRef = useRef(false);
  const restoreSelection = () => {
    const selection = getSelection();
    if (!selection?.selectionStart?.clientId || selection === appliedSelectionRef.current) {
      return;
    }
    const startClientId = selection.selectionStart.clientId;
    const isOurs = clientId ? idMappingRef.current.externalToInternal.has(startClientId) : !!getBlockName(startClientId);
    if (isOurs) {
      appliedSelectionRef.current = selection;
      const convert = (sel) => {
        if (!sel?.clientId || !clientId) {
          return sel;
        }
        return {
          ...sel,
          clientId: idMappingRef.current.externalToInternal.get(
            sel.clientId
          ) ?? sel.clientId
        };
      };
      isRestoringSelectionRef.current = true;
      resetSelection(
        convert(selection.selectionStart),
        convert(selection.selectionEnd),
        selection.initialPosition
      );
      isRestoringSelectionRef.current = false;
    }
  };
  const setControlledBlocks = () => {
    if (!controlledBlocks) {
      return;
    }
    if (clientId) {
      registry.batch(() => {
        idMappingRef.current.externalToInternal.clear();
        idMappingRef.current.internalToExternal.clear();
        const storeBlocks = controlledBlocks.map(
          (block) => cloneBlockWithMapping(block, idMappingRef.current)
        );
        setHasControlledInnerBlocks(clientId, true);
        if (subscribedRef.current) {
          pendingChangesRef.current.incoming = storeBlocks;
        }
        __unstableMarkNextChangeAsNotPersistent();
        replaceInnerBlocks(clientId, storeBlocks);
        appliedSelectionRef.current = null;
      });
    } else {
      if (subscribedRef.current) {
        pendingChangesRef.current.incoming = controlledBlocks;
      }
      __unstableMarkNextChangeAsNotPersistent();
      resetBlocks(controlledBlocks);
    }
  };
  const unsetControlledBlocks = () => {
    __unstableMarkNextChangeAsNotPersistent();
    if (clientId) {
      setHasControlledInnerBlocks(clientId, false);
      __unstableMarkNextChangeAsNotPersistent();
      replaceInnerBlocks(clientId, []);
    } else {
      resetBlocks([]);
    }
  };
  const onInputRef = useRef(onInput);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onInputRef.current = onInput;
    onChangeRef.current = onChange;
  }, [onInput, onChange]);
  useEffect(() => {
    const isOutgoing = pendingChangesRef.current.outgoing.includes(controlledBlocks);
    const storeMatch = getBlocks(clientId) === controlledBlocks;
    if (isOutgoing) {
      if (pendingChangesRef.current.outgoing[pendingChangesRef.current.outgoing.length - 1] === controlledBlocks) {
        pendingChangesRef.current.outgoing = [];
      }
    } else if (!storeMatch) {
      pendingChangesRef.current.outgoing = [];
      setControlledBlocks();
      restoreSelection();
    }
  }, [controlledBlocks, clientId]);
  useEffect(() => {
    const {
      getSelectedBlocksInitialCaretPosition,
      isLastBlockChangePersistent,
      __unstableIsLastBlockChangeIgnored,
      areInnerBlocksControlled,
      getBlockParents
    } = registry.select(blockEditorStore);
    let blocks = getBlocks(clientId);
    let isPersistent = isLastBlockChangePersistent();
    let previousAreBlocksDifferent = false;
    let prevSelectionStart = getSelectionStart();
    let prevSelectionEnd = getSelectionEnd();
    subscribedRef.current = true;
    const unsubscribe = registry.subscribe(() => {
      if (clientId !== null && getBlockName(clientId) === null) {
        return;
      }
      const newIsPersistent = isLastBlockChangePersistent();
      const newBlocks = getBlocks(clientId);
      const areBlocksDifferent = newBlocks !== blocks;
      blocks = newBlocks;
      if (areBlocksDifferent && (pendingChangesRef.current.incoming || __unstableIsLastBlockChangeIgnored())) {
        pendingChangesRef.current.incoming = null;
        isPersistent = newIsPersistent;
        return;
      }
      const didPersistenceChange = previousAreBlocksDifferent && !areBlocksDifferent && newIsPersistent && !isPersistent;
      const blocksChanged = areBlocksDifferent || didPersistenceChange;
      const newSelectionStart = getSelectionStart();
      const newSelectionEnd = getSelectionEnd();
      const selectionChanged = newSelectionStart !== prevSelectionStart || newSelectionEnd !== prevSelectionEnd;
      if (selectionChanged) {
        prevSelectionStart = newSelectionStart;
        prevSelectionEnd = newSelectionEnd;
      }
      if (blocksChanged || selectionChanged) {
        registry.batch(() => {
          if (blocksChanged) {
            isPersistent = newIsPersistent;
            const blocksForParent = clientId ? restoreExternalIds(blocks, idMappingRef.current) : blocks;
            const selectionInfo = {
              selectionStart: newSelectionStart,
              selectionEnd: newSelectionEnd,
              initialPosition: getSelectedBlocksInitialCaretPosition()
            };
            const selectionForParent = clientId ? restoreSelectionIds(
              selectionInfo,
              idMappingRef.current
            ) : selectionInfo;
            pendingChangesRef.current.outgoing.push(
              blocksForParent
            );
            const updateParent = isPersistent ? onChangeRef.current : onInputRef.current;
            updateParent(blocksForParent, {
              selection: selectionForParent
            });
          }
          if (selectionChanged && !blocksChanged && newSelectionStart?.clientId && !isRestoringSelectionRef.current) {
            const isOurs = clientId ? idMappingRef.current.internalToExternal.has(
              newSelectionStart.clientId
            ) : !getBlockParents(
              newSelectionStart.clientId
            ).some(
              (parentId) => areInnerBlocksControlled(parentId)
            );
            if (isOurs) {
              const selectionInfo = {
                selectionStart: newSelectionStart,
                selectionEnd: newSelectionEnd,
                initialPosition: getSelectedBlocksInitialCaretPosition()
              };
              onChangeSelection(
                clientId ? restoreSelectionIds(
                  selectionInfo,
                  idMappingRef.current
                ) : selectionInfo
              );
            }
          }
        });
      }
      previousAreBlocksDifferent = areBlocksDifferent;
    }, blockEditorStore);
    return () => {
      subscribedRef.current = false;
      unsubscribe();
    };
  }, [registry, clientId]);
  useEffect(() => {
    return () => {
      unsetControlledBlocks();
    };
  }, []);
}
export {
  useBlockSync as default
};
//# sourceMappingURL=use-block-sync.mjs.map
