// packages/block-editor/src/components/block-list/index.js
import clsx from "clsx";
import {
  AsyncModeProvider,
  useSelect,
  useDispatch,
  useRegistry
} from "@wordpress/data";
import { useMergeRefs, useDebounce } from "@wordpress/compose";
import {
  createContext,
  useEffect,
  useMemo,
  useCallback
} from "@wordpress/element";
import { getDefaultBlockName } from "@wordpress/blocks";
import BlockListBlock from "./block.mjs";
import BlockListAppender from "../block-list-appender/index.mjs";
import { useInBetweenInserter } from "./use-in-between-inserter.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { LayoutProvider, defaultLayout } from "./layout.mjs";
import { useBlockSelectionClearer } from "../block-selection-clearer/index.mjs";
import { useInnerBlocksProps } from "../inner-blocks/index.mjs";
import {
  BlockEditContextProvider,
  DEFAULT_BLOCK_EDIT_CONTEXT
} from "../block-edit/context.mjs";
import { useTypingObserver } from "../observe-typing/index.mjs";
import { ZoomOutSeparator } from "./zoom-out-separator.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var IntersectionObserver = createContext();
IntersectionObserver.displayName = "IntersectionObserverContext";
var pendingBlockVisibilityUpdatesPerRegistry = /* @__PURE__ */ new WeakMap();
var delayedBlockVisibilityDebounceOptions = {
  trailing: true
};
function Root({ className, ...settings }) {
  const {
    isOutlineMode,
    isFocusMode,
    isPreviewMode,
    editedContentOnlySection
  } = useSelect((select) => {
    const {
      getSettings,
      isTyping,
      hasBlockSpotlight,
      getEditedContentOnlySection
    } = unlock(select(blockEditorStore));
    const {
      outlineMode,
      focusMode,
      isPreviewMode: _isPreviewMode
    } = getSettings();
    return {
      isOutlineMode: outlineMode && !isTyping(),
      isFocusMode: focusMode || hasBlockSpotlight(),
      isPreviewMode: _isPreviewMode,
      editedContentOnlySection: getEditedContentOnlySection()
    };
  }, []);
  const registry = useRegistry();
  const { setBlockVisibility } = useDispatch(blockEditorStore);
  const delayedBlockVisibilityUpdates = useDebounce(
    useCallback(() => {
      const updates = {};
      pendingBlockVisibilityUpdatesPerRegistry.get(registry).forEach(([id, isIntersecting]) => {
        updates[id] = isIntersecting;
      });
      setBlockVisibility(updates);
    }, [registry]),
    300,
    delayedBlockVisibilityDebounceOptions
  );
  const intersectionObserver = useMemo(() => {
    const { IntersectionObserver: Observer } = window;
    if (!Observer) {
      return;
    }
    return new Observer((entries) => {
      if (!pendingBlockVisibilityUpdatesPerRegistry.get(registry)) {
        pendingBlockVisibilityUpdatesPerRegistry.set(registry, []);
      }
      for (const entry of entries) {
        const clientId = entry.target.getAttribute("data-block");
        pendingBlockVisibilityUpdatesPerRegistry.get(registry).push([clientId, entry.isIntersecting]);
      }
      delayedBlockVisibilityUpdates();
    });
  }, []);
  const innerBlocksProps = useInnerBlocksProps(
    {
      ref: useMergeRefs([
        useBlockSelectionClearer(),
        useInBetweenInserter(),
        useTypingObserver()
      ]),
      className: clsx("is-root-container", className, {
        "is-outline-mode": isOutlineMode,
        "is-focus-mode": isFocusMode,
        "is-preview-mode": isPreviewMode
      })
    },
    settings
  );
  return /* @__PURE__ */ jsxs(IntersectionObserver.Provider, { value: intersectionObserver, children: [
    /* @__PURE__ */ jsx("div", { ...innerBlocksProps }),
    !!editedContentOnlySection && /* @__PURE__ */ jsx(
      StopEditingContentOnlySectionOnOutsideSelect,
      {
        clientId: editedContentOnlySection
      }
    )
  ] });
}
function StopEditingContentOnlySectionOnOutsideSelect({ clientId }) {
  const { stopEditingContentOnlySection } = unlock(
    useDispatch(blockEditorStore)
  );
  const isBlockOrDescendantSelected = useSelect(
    (select) => {
      const {
        isBlockSelected,
        hasSelectedInnerBlock,
        getBlockSelectionStart
      } = select(blockEditorStore);
      return !getBlockSelectionStart() || isBlockSelected(clientId) || hasSelectedInnerBlock(clientId, true);
    },
    [clientId]
  );
  useEffect(() => {
    if (!isBlockOrDescendantSelected) {
      stopEditingContentOnlySection();
    }
  }, [isBlockOrDescendantSelected, stopEditingContentOnlySection]);
  return null;
}
function BlockList(settings) {
  return /* @__PURE__ */ jsx(BlockEditContextProvider, { value: DEFAULT_BLOCK_EDIT_CONTEXT, children: /* @__PURE__ */ jsx(Root, { ...settings }) });
}
var EMPTY_ARRAY = [];
var EMPTY_SET = /* @__PURE__ */ new Set();
function Items({
  placeholder,
  rootClientId,
  renderAppender: CustomAppender,
  __experimentalAppenderTagName,
  layout = defaultLayout
}) {
  const hasAppender = CustomAppender !== false;
  const hasCustomAppender = !!CustomAppender;
  const {
    order,
    isZoomOut,
    selectedBlocks,
    visibleBlocks,
    shouldRenderAppender
  } = useSelect(
    (select) => {
      const {
        getSettings,
        getBlockOrder,
        getSelectedBlockClientIds,
        __unstableGetVisibleBlocks,
        getTemplateLock,
        getBlockEditingMode,
        isSectionBlock,
        isContainerInsertableToInContentOnlyMode,
        getBlockName,
        isZoomOut: _isZoomOut,
        canInsertBlockType
      } = unlock(select(blockEditorStore));
      const _order = getBlockOrder(rootClientId);
      if (getSettings().isPreviewMode) {
        return {
          order: _order,
          selectedBlocks: EMPTY_ARRAY,
          visibleBlocks: EMPTY_SET
        };
      }
      const selectedBlockClientIds = getSelectedBlockClientIds();
      const selectedBlockClientId = selectedBlockClientIds[0];
      const showRootAppender = !rootClientId && !selectedBlockClientId && (!_order.length || !canInsertBlockType(
        getDefaultBlockName(),
        rootClientId
      ));
      const hasSelectedRoot = !!(rootClientId && selectedBlockClientId && rootClientId === selectedBlockClientId);
      const templateLock = getTemplateLock(rootClientId);
      return {
        order: _order,
        selectedBlocks: selectedBlockClientIds,
        visibleBlocks: __unstableGetVisibleBlocks(),
        isZoomOut: _isZoomOut(),
        shouldRenderAppender: (!isSectionBlock(rootClientId) || isContainerInsertableToInContentOnlyMode(
          getBlockName(selectedBlockClientId),
          rootClientId
        )) && getBlockEditingMode(rootClientId) !== "disabled" && (!templateLock || templateLock === "contentOnly") && hasAppender && !_isZoomOut() && (hasCustomAppender || hasSelectedRoot || showRootAppender)
      };
    },
    [rootClientId, hasAppender, hasCustomAppender]
  );
  return /* @__PURE__ */ jsxs(LayoutProvider, { value: layout, children: [
    order.map((clientId) => /* @__PURE__ */ jsxs(
      AsyncModeProvider,
      {
        value: (
          // Only provide data asynchronously if the block is
          // not visible and not selected.
          !visibleBlocks.has(clientId) && !selectedBlocks.includes(clientId)
        ),
        children: [
          isZoomOut && /* @__PURE__ */ jsx(
            ZoomOutSeparator,
            {
              clientId,
              rootClientId,
              position: "top"
            }
          ),
          /* @__PURE__ */ jsx(
            BlockListBlock,
            {
              rootClientId,
              clientId
            }
          ),
          isZoomOut && /* @__PURE__ */ jsx(
            ZoomOutSeparator,
            {
              clientId,
              rootClientId,
              position: "bottom"
            }
          )
        ]
      },
      clientId
    )),
    order.length < 1 && placeholder,
    shouldRenderAppender && /* @__PURE__ */ jsx(
      BlockListAppender,
      {
        tagName: __experimentalAppenderTagName,
        rootClientId,
        CustomAppender
      }
    )
  ] });
}
function BlockListItems(props) {
  return /* @__PURE__ */ jsx(AsyncModeProvider, { value: false, children: /* @__PURE__ */ jsx(Items, { ...props }) });
}
export {
  BlockListItems,
  IntersectionObserver,
  BlockList as default
};
//# sourceMappingURL=index.mjs.map
