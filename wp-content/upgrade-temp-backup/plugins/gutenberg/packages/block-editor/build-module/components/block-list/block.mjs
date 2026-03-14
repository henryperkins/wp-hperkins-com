// packages/block-editor/src/components/block-list/block.js
import clsx from "clsx";
import { memo, RawHTML, useContext, useMemo } from "@wordpress/element";
import {
  getBlockType,
  getSaveContent,
  isUnmodifiedDefaultBlock,
  serializeRawBlock,
  switchToBlockType,
  getDefaultBlockName,
  isUnmodifiedBlock,
  isReusableBlock,
  getBlockDefaultClassName,
  hasBlockSupport,
  createBlock,
  store as blocksStore
} from "@wordpress/blocks";
import { withFilters } from "@wordpress/components";
import { withDispatch, useSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { safeHTML } from "@wordpress/dom";
import BlockEdit from "../block-edit/index.mjs";
import BlockInvalidWarning from "./block-invalid-warning.mjs";
import BlockCrashWarning from "./block-crash-warning.mjs";
import BlockCrashBoundary from "./block-crash-boundary.mjs";
import BlockHtml from "./block-html.mjs";
import { useBlockProps } from "./use-block-props/index.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { useLayout } from "./layout.mjs";
import { PrivateBlockContext } from "./private-block-context.mjs";
import { useBlockVisibility } from "../block-visibility/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { deviceTypeKey } from "../../store/private-keys.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function mergeWrapperProps(propsA, propsB) {
  const newProps = {
    ...propsA,
    ...propsB
  };
  if (propsA?.hasOwnProperty("className") && propsB?.hasOwnProperty("className")) {
    newProps.className = clsx(propsA.className, propsB.className);
  }
  if (propsA?.hasOwnProperty("style") && propsB?.hasOwnProperty("style")) {
    newProps.style = { ...propsA.style, ...propsB.style };
  }
  return newProps;
}
function Block({ children, isHtml, ...props }) {
  return /* @__PURE__ */ jsx("div", { ...useBlockProps(props, { __unstableIsHtml: isHtml }), children });
}
function BlockListBlock({
  block: { __unstableBlockSource },
  mode,
  isLocked,
  canRemove,
  clientId,
  isSelected,
  isSelectionEnabled,
  className,
  __unstableLayoutClassNames: layoutClassNames,
  name,
  isValid,
  attributes,
  wrapperProps,
  setAttributes,
  onReplace,
  onRemove,
  onInsertBlocksAfter,
  onMerge,
  toggleSelection
}) {
  const {
    mayDisplayControls,
    mayDisplayParentControls,
    isSelectionWithinCurrentSection,
    themeSupportsLayout,
    ...context
  } = useContext(PrivateBlockContext);
  const parentLayout = useLayout() || {};
  let blockEdit = /* @__PURE__ */ jsx(
    BlockEdit,
    {
      name,
      isSelected,
      attributes,
      setAttributes,
      insertBlocksAfter: isLocked ? void 0 : onInsertBlocksAfter,
      onReplace: canRemove ? onReplace : void 0,
      onRemove: canRemove ? onRemove : void 0,
      mergeBlocks: canRemove ? onMerge : void 0,
      clientId,
      isSelectionEnabled,
      toggleSelection,
      __unstableLayoutClassNames: layoutClassNames,
      __unstableParentLayout: Object.keys(parentLayout).length ? parentLayout : void 0,
      mayDisplayControls,
      mayDisplayParentControls,
      mayDisplayPatternEditingControls: isSelectionWithinCurrentSection,
      blockEditingMode: context.blockEditingMode,
      isPreviewMode: context.isPreviewMode
    }
  );
  const blockType = getBlockType(name);
  if (blockType?.getEditWrapperProps) {
    wrapperProps = mergeWrapperProps(
      wrapperProps,
      blockType.getEditWrapperProps(attributes)
    );
  }
  const isAligned = wrapperProps && !!wrapperProps["data-align"] && !themeSupportsLayout;
  const isSticky = className?.includes("is-position-sticky");
  if (isAligned) {
    blockEdit = /* @__PURE__ */ jsx(
      "div",
      {
        className: clsx("wp-block", isSticky && className),
        "data-align": wrapperProps["data-align"],
        children: blockEdit
      }
    );
  }
  let block;
  if (!isValid) {
    const saveContent = __unstableBlockSource ? serializeRawBlock(__unstableBlockSource) : getSaveContent(blockType, attributes);
    block = /* @__PURE__ */ jsxs(Block, { className: "has-warning", children: [
      /* @__PURE__ */ jsx(BlockInvalidWarning, { clientId }),
      /* @__PURE__ */ jsx(RawHTML, { children: safeHTML(saveContent) })
    ] });
  } else if (mode === "html") {
    block = /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { style: { display: "none" }, children: blockEdit }),
      /* @__PURE__ */ jsx(Block, { isHtml: true, children: /* @__PURE__ */ jsx(BlockHtml, { clientId }) })
    ] });
  } else if (blockType?.apiVersion > 1) {
    block = blockEdit;
  } else {
    block = /* @__PURE__ */ jsx(Block, { children: blockEdit });
  }
  const { "data-align": dataAlign, ...restWrapperProps } = wrapperProps ?? {};
  const updatedWrapperProps = {
    ...restWrapperProps,
    className: clsx(
      restWrapperProps.className,
      dataAlign && themeSupportsLayout && `align${dataAlign}`,
      !(dataAlign && isSticky) && className
    )
  };
  return /* @__PURE__ */ jsx(
    PrivateBlockContext.Provider,
    {
      value: {
        wrapperProps: updatedWrapperProps,
        isAligned,
        isSelectionWithinCurrentSection,
        ...context
      },
      children: /* @__PURE__ */ jsx(
        BlockCrashBoundary,
        {
          fallback: /* @__PURE__ */ jsx(Block, { className: "has-warning", children: /* @__PURE__ */ jsx(BlockCrashWarning, {}) }),
          children: block
        }
      )
    }
  );
}
var applyWithDispatch = withDispatch((dispatch, ownProps, registry) => {
  const {
    updateBlockAttributes,
    insertBlocks,
    mergeBlocks,
    replaceBlocks,
    toggleSelection,
    __unstableMarkLastChangeAsPersistent,
    moveBlocksToPosition,
    removeBlock,
    selectBlock
  } = dispatch(blockEditorStore);
  return {
    setAttributes(nextAttributes) {
      const { getMultiSelectedBlockClientIds } = registry.select(blockEditorStore);
      const multiSelectedBlockClientIds = getMultiSelectedBlockClientIds();
      const { clientId, attributes } = ownProps;
      const clientIds = multiSelectedBlockClientIds.length ? multiSelectedBlockClientIds : [clientId];
      const newAttributes = typeof nextAttributes === "function" ? nextAttributes(attributes) : nextAttributes;
      updateBlockAttributes(clientIds, newAttributes);
    },
    onInsertBlocks(blocks, index) {
      const { rootClientId } = ownProps;
      insertBlocks(blocks, index, rootClientId);
    },
    onInsertBlocksAfter(blocks) {
      const { clientId, rootClientId } = ownProps;
      const { getBlockIndex } = registry.select(blockEditorStore);
      const index = getBlockIndex(clientId);
      insertBlocks(blocks, index + 1, rootClientId);
    },
    onMerge(forward) {
      const { clientId, rootClientId } = ownProps;
      const {
        getPreviousBlockClientId,
        getNextBlockClientId,
        getBlock,
        getBlockAttributes,
        getBlockName,
        getBlockOrder,
        getBlockIndex,
        getBlockRootClientId,
        canInsertBlockType
      } = registry.select(blockEditorStore);
      function switchToDefaultOrRemove() {
        const block = getBlock(clientId);
        const defaultBlockName = getDefaultBlockName();
        const defaultBlockType = getBlockType(defaultBlockName);
        if (getBlockName(clientId) !== defaultBlockName) {
          const replacement = switchToBlockType(
            block,
            defaultBlockName
          );
          if (replacement && replacement.length) {
            replaceBlocks(clientId, replacement);
          }
        } else if (isUnmodifiedDefaultBlock(block)) {
          const nextBlockClientId = getNextBlockClientId(clientId);
          if (nextBlockClientId) {
            registry.batch(() => {
              removeBlock(clientId);
              selectBlock(nextBlockClientId);
            });
          }
        } else if (defaultBlockType.merge) {
          const attributes = defaultBlockType.merge(
            {},
            block.attributes
          );
          replaceBlocks(
            [clientId],
            [createBlock(defaultBlockName, attributes)]
          );
        }
      }
      function moveFirstItemUp(_clientId, changeSelection = true) {
        const wrapperBlockName = getBlockName(_clientId);
        const wrapperBlockType = getBlockType(wrapperBlockName);
        const isTextualWrapper = wrapperBlockType.category === "text";
        const targetRootClientId = getBlockRootClientId(_clientId);
        const blockOrder = getBlockOrder(_clientId);
        const [firstClientId] = blockOrder;
        if (blockOrder.length === 1 && isUnmodifiedBlock(getBlock(firstClientId))) {
          removeBlock(_clientId);
        } else if (isTextualWrapper) {
          registry.batch(() => {
            if (canInsertBlockType(
              getBlockName(firstClientId),
              targetRootClientId
            )) {
              moveBlocksToPosition(
                [firstClientId],
                _clientId,
                targetRootClientId,
                getBlockIndex(_clientId)
              );
            } else {
              const replacement = switchToBlockType(
                getBlock(firstClientId),
                getDefaultBlockName()
              );
              if (replacement && replacement.length && replacement.every(
                (block) => canInsertBlockType(
                  block.name,
                  targetRootClientId
                )
              )) {
                insertBlocks(
                  replacement,
                  getBlockIndex(_clientId),
                  targetRootClientId,
                  changeSelection
                );
                removeBlock(firstClientId, false);
              } else {
                switchToDefaultOrRemove();
              }
            }
            if (!getBlockOrder(_clientId).length && isUnmodifiedBlock(getBlock(_clientId))) {
              removeBlock(_clientId, false);
            }
          });
        } else {
          switchToDefaultOrRemove();
        }
      }
      if (forward) {
        if (rootClientId) {
          const nextRootClientId = getNextBlockClientId(rootClientId);
          if (nextRootClientId) {
            if (getBlockName(rootClientId) === getBlockName(nextRootClientId)) {
              const rootAttributes = getBlockAttributes(rootClientId);
              const previousRootAttributes = getBlockAttributes(nextRootClientId);
              if (Object.keys(rootAttributes).every(
                (key) => rootAttributes[key] === previousRootAttributes[key]
              )) {
                registry.batch(() => {
                  moveBlocksToPosition(
                    getBlockOrder(nextRootClientId),
                    nextRootClientId,
                    rootClientId
                  );
                  removeBlock(nextRootClientId, false);
                });
                return;
              }
            } else {
              mergeBlocks(rootClientId, nextRootClientId);
              return;
            }
          }
        }
        const nextBlockClientId = getNextBlockClientId(clientId);
        if (!nextBlockClientId) {
          return;
        }
        if (getBlockOrder(nextBlockClientId).length) {
          moveFirstItemUp(nextBlockClientId, false);
        } else {
          mergeBlocks(clientId, nextBlockClientId);
        }
      } else {
        const previousBlockClientId = getPreviousBlockClientId(clientId);
        if (previousBlockClientId) {
          mergeBlocks(previousBlockClientId, clientId);
        } else if (rootClientId) {
          const previousRootClientId = getPreviousBlockClientId(rootClientId);
          if (previousRootClientId && getBlockName(rootClientId) === getBlockName(previousRootClientId)) {
            const rootAttributes = getBlockAttributes(rootClientId);
            const previousRootAttributes = getBlockAttributes(previousRootClientId);
            if (Object.keys(rootAttributes).every(
              (key) => rootAttributes[key] === previousRootAttributes[key]
            )) {
              registry.batch(() => {
                moveBlocksToPosition(
                  getBlockOrder(rootClientId),
                  rootClientId,
                  previousRootClientId
                );
                removeBlock(rootClientId, false);
              });
              return;
            }
          }
          moveFirstItemUp(rootClientId);
        } else {
          switchToDefaultOrRemove();
        }
      }
    },
    onReplace(blocks, indexToSelect, initialPosition) {
      if (blocks.length && !isUnmodifiedDefaultBlock(blocks[blocks.length - 1])) {
        __unstableMarkLastChangeAsPersistent();
      }
      const replacementBlocks = blocks?.length === 1 && Array.isArray(blocks[0]) ? blocks[0] : blocks;
      replaceBlocks(
        [ownProps.clientId],
        replacementBlocks,
        indexToSelect,
        initialPosition
      );
    },
    onRemove() {
      removeBlock(ownProps.clientId);
    },
    toggleSelection(selectionEnabled) {
      toggleSelection(selectionEnabled);
    }
  };
});
BlockListBlock = compose(
  applyWithDispatch,
  withFilters("editor.BlockListBlock")
)(BlockListBlock);
function BlockListBlockProvider(props) {
  const { clientId, rootClientId } = props;
  const selectedProps = useSelect(
    (select) => {
      const {
        isBlockSelected,
        getBlockMode,
        isSelectionEnabled: isSelectionEnabled2,
        getTemplateLock,
        isSectionBlock: _isSectionBlock,
        getParentSectionBlock,
        getBlockWithoutAttributes,
        getBlockAttributes,
        canRemoveBlock,
        canMoveBlock,
        getSettings,
        getEditedContentOnlySection,
        getBlockEditingMode,
        getBlockName,
        isFirstMultiSelectedBlock,
        getMultiSelectedBlockClientIds,
        hasSelectedInnerBlock,
        getBlocksByName,
        getBlockIndex,
        isBlockMultiSelected,
        isBlockSubtreeDisabled,
        isBlockHighlighted,
        __unstableIsFullySelected,
        __unstableSelectionHasUnmergeableBlock,
        isBlockBeingDragged,
        isDragging: isDragging2,
        __unstableHasActiveBlockOverlayActive,
        getSelectedBlocksInitialCaretPosition
      } = unlock(select(blockEditorStore));
      const blockWithoutAttributes = getBlockWithoutAttributes(clientId);
      if (!blockWithoutAttributes) {
        return;
      }
      const {
        hasBlockSupport: _hasBlockSupport,
        getActiveBlockVariation
      } = select(blocksStore);
      const attributes2 = getBlockAttributes(clientId);
      const { name: blockName, isValid: isValid2 } = blockWithoutAttributes;
      const blockType2 = getBlockType(blockName);
      const settings = getSettings();
      const {
        supportsLayout,
        isPreviewMode: isPreviewMode2,
        __experimentalBlockBindingsSupportedAttributes
      } = settings;
      const bindableAttributes2 = __experimentalBlockBindingsSupportedAttributes?.[blockName];
      const blockVisibility2 = attributes2?.metadata?.blockVisibility;
      const deviceType2 = settings?.[deviceTypeKey]?.toLowerCase() || "desktop";
      const hasLightBlockWrapper = blockType2?.apiVersion > 1;
      const isMultiSelected2 = isBlockMultiSelected(clientId);
      const blockEditingMode2 = getBlockEditingMode(clientId);
      const previewContext = {
        isPreviewMode: isPreviewMode2,
        blockWithoutAttributes,
        name: blockName,
        attributes: attributes2,
        isValid: isValid2,
        themeSupportsLayout: supportsLayout,
        index: getBlockIndex(clientId),
        isReusable: isReusableBlock(blockType2),
        className: hasLightBlockWrapper ? attributes2.className : void 0,
        defaultClassName: hasLightBlockWrapper ? getBlockDefaultClassName(blockName) : void 0,
        blockTitle: blockType2?.title,
        bindableAttributes: bindableAttributes2,
        blockVisibility: blockVisibility2,
        deviceType: deviceType2,
        isMultiSelected: isMultiSelected2,
        blockEditingMode: blockEditingMode2,
        isEditingDisabled: blockEditingMode2 === "disabled"
      };
      if (isPreviewMode2) {
        return previewContext;
      }
      const _isSelected = isBlockSelected(clientId);
      const canRemove2 = canRemoveBlock(clientId);
      const canMove2 = canMoveBlock(clientId);
      const match = getActiveBlockVariation(blockName, attributes2);
      const checkDeep = true;
      const isAncestorOfSelectedBlock = hasSelectedInnerBlock(
        clientId,
        checkDeep
      );
      const sectionBlockClientId = _isSectionBlock(clientId) ? clientId : getParentSectionBlock(clientId);
      const multiple = hasBlockSupport(blockName, "multiple", true);
      const blocksWithSameName = multiple ? [] : getBlocksByName(blockName);
      const isInvalid = blocksWithSameName.length && blocksWithSameName[0] !== clientId;
      return {
        ...previewContext,
        mode: getBlockMode(clientId),
        isSelectionEnabled: isSelectionEnabled2(),
        isLocked: !!getTemplateLock(rootClientId),
        isSectionBlock: _isSectionBlock(clientId),
        isWithinSectionBlock: !!sectionBlockClientId,
        isSelectionWithinCurrentSection: isBlockSelected(sectionBlockClientId) || hasSelectedInnerBlock(sectionBlockClientId, checkDeep),
        blockType: blockType2,
        canRemove: canRemove2,
        canMove: canMove2,
        isSelected: _isSelected,
        isEditingContentOnlySection: getEditedContentOnlySection() === clientId,
        blockEditingMode: blockEditingMode2,
        mayDisplayControls: _isSelected || isFirstMultiSelectedBlock(clientId) && getMultiSelectedBlockClientIds().every(
          (id) => getBlockName(id) === blockName
        ),
        mayDisplayParentControls: _hasBlockSupport(
          getBlockName(clientId),
          "__experimentalExposeControlsToChildren",
          false
        ) && hasSelectedInnerBlock(clientId),
        blockApiVersion: blockType2?.apiVersion || 1,
        blockTitle: match?.title || blockType2?.title,
        isSubtreeDisabled: blockEditingMode2 === "disabled" && isBlockSubtreeDisabled(clientId),
        hasOverlay: __unstableHasActiveBlockOverlayActive(clientId) && !isDragging2(),
        initialPosition: _isSelected ? getSelectedBlocksInitialCaretPosition() : void 0,
        isHighlighted: isBlockHighlighted(clientId),
        isMultiSelected: isMultiSelected2,
        isPartiallySelected: isMultiSelected2 && !__unstableIsFullySelected() && !__unstableSelectionHasUnmergeableBlock(),
        isDragging: isBlockBeingDragged(clientId),
        hasChildSelected: isAncestorOfSelectedBlock,
        isEditingDisabled: blockEditingMode2 === "disabled",
        hasEditableOutline: blockEditingMode2 !== "disabled" && getBlockEditingMode(rootClientId) === "disabled",
        originalBlockClientId: isInvalid ? blocksWithSameName[0] : false,
        blockVisibility: blockVisibility2,
        deviceType: deviceType2
      };
    },
    [clientId, rootClientId]
  );
  const { isBlockCurrentlyHidden } = useBlockVisibility({
    blockVisibility: selectedProps?.blockVisibility,
    deviceType: selectedProps?.deviceType
  });
  const block = useMemo(
    () => ({
      ...selectedProps?.blockWithoutAttributes,
      attributes: selectedProps?.attributes
    }),
    [selectedProps?.blockWithoutAttributes, selectedProps?.attributes]
  );
  if (!selectedProps) {
    return null;
  }
  const {
    isPreviewMode,
    // Fill values that end up as a public API and may not be defined in
    // preview mode.
    mode = "visual",
    isSelectionEnabled = false,
    isLocked = false,
    canRemove = false,
    canMove = false,
    name,
    attributes,
    isValid,
    isSelected = false,
    themeSupportsLayout,
    isEditingContentOnlySection,
    blockEditingMode,
    mayDisplayControls,
    mayDisplayParentControls,
    index,
    blockApiVersion,
    blockType,
    blockTitle,
    isSubtreeDisabled,
    hasOverlay,
    initialPosition,
    isHighlighted,
    isMultiSelected,
    isPartiallySelected,
    isReusable,
    isDragging,
    hasChildSelected,
    isSectionBlock,
    isWithinSectionBlock,
    isSelectionWithinCurrentSection,
    isEditingDisabled,
    hasEditableOutline,
    className,
    defaultClassName,
    originalBlockClientId,
    bindableAttributes,
    blockVisibility,
    deviceType
  } = selectedProps;
  const privateContext = {
    isPreviewMode,
    clientId,
    className,
    index,
    mode,
    name,
    blockApiVersion,
    blockType,
    blockTitle,
    isSelected,
    isSubtreeDisabled,
    hasOverlay,
    initialPosition,
    blockEditingMode,
    isHighlighted,
    isMultiSelected,
    isPartiallySelected,
    isReusable,
    isDragging,
    hasChildSelected,
    isSectionBlock,
    isWithinSectionBlock,
    isSelectionWithinCurrentSection,
    isEditingDisabled,
    hasEditableOutline,
    isEditingContentOnlySection,
    defaultClassName,
    mayDisplayControls,
    mayDisplayParentControls,
    originalBlockClientId,
    themeSupportsLayout,
    canMove,
    isBlockCurrentlyHidden,
    bindableAttributes,
    blockVisibility,
    deviceType
  };
  if (isBlockCurrentlyHidden && !isSelected && !isMultiSelected && !hasChildSelected) {
    return null;
  }
  return /* @__PURE__ */ jsx(PrivateBlockContext.Provider, { value: privateContext, children: /* @__PURE__ */ jsx(
    BlockListBlock,
    {
      ...props,
      ...{
        mode,
        isSelectionEnabled,
        isLocked,
        canRemove,
        canMove,
        // Users of the editor.BlockListBlock filter used to be able
        // to access the block prop. Ideally these blocks would rely
        // on the clientId prop only. This is kept for backward
        // compatibility reasons.
        block,
        name,
        attributes,
        isValid,
        isSelected
      }
    }
  ) });
}
var block_default = memo(BlockListBlockProvider);
export {
  block_default as default
};
//# sourceMappingURL=block.mjs.map
