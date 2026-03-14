"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/block-list/index.js
var block_list_exports = {};
__export(block_list_exports, {
  BlockListItems: () => BlockListItems,
  IntersectionObserver: () => IntersectionObserver,
  default: () => BlockList
});
module.exports = __toCommonJS(block_list_exports);
var import_clsx = __toESM(require("clsx"));
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_blocks = require("@wordpress/blocks");
var import_block = __toESM(require("./block.cjs"));
var import_block_list_appender = __toESM(require("../block-list-appender/index.cjs"));
var import_use_in_between_inserter = require("./use-in-between-inserter.cjs");
var import_store = require("../../store/index.cjs");
var import_layout = require("./layout.cjs");
var import_block_selection_clearer = require("../block-selection-clearer/index.cjs");
var import_inner_blocks = require("../inner-blocks/index.cjs");
var import_context = require("../block-edit/context.cjs");
var import_observe_typing = require("../observe-typing/index.cjs");
var import_zoom_out_separator = require("./zoom-out-separator.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var IntersectionObserver = (0, import_element.createContext)();
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
  } = (0, import_data.useSelect)((select) => {
    const {
      getSettings,
      isTyping,
      hasBlockSpotlight,
      getEditedContentOnlySection
    } = (0, import_lock_unlock.unlock)(select(import_store.store));
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
  const registry = (0, import_data.useRegistry)();
  const { setBlockVisibility } = (0, import_data.useDispatch)(import_store.store);
  const delayedBlockVisibilityUpdates = (0, import_compose.useDebounce)(
    (0, import_element.useCallback)(() => {
      const updates = {};
      pendingBlockVisibilityUpdatesPerRegistry.get(registry).forEach(([id, isIntersecting]) => {
        updates[id] = isIntersecting;
      });
      setBlockVisibility(updates);
    }, [registry]),
    300,
    delayedBlockVisibilityDebounceOptions
  );
  const intersectionObserver = (0, import_element.useMemo)(() => {
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
  const innerBlocksProps = (0, import_inner_blocks.useInnerBlocksProps)(
    {
      ref: (0, import_compose.useMergeRefs)([
        (0, import_block_selection_clearer.useBlockSelectionClearer)(),
        (0, import_use_in_between_inserter.useInBetweenInserter)(),
        (0, import_observe_typing.useTypingObserver)()
      ]),
      className: (0, import_clsx.default)("is-root-container", className, {
        "is-outline-mode": isOutlineMode,
        "is-focus-mode": isFocusMode,
        "is-preview-mode": isPreviewMode
      })
    },
    settings
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IntersectionObserver.Provider, { value: intersectionObserver, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ...innerBlocksProps }),
    !!editedContentOnlySection && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      StopEditingContentOnlySectionOnOutsideSelect,
      {
        clientId: editedContentOnlySection
      }
    )
  ] });
}
function StopEditingContentOnlySectionOnOutsideSelect({ clientId }) {
  const { stopEditingContentOnlySection } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_store.store)
  );
  const isBlockOrDescendantSelected = (0, import_data.useSelect)(
    (select) => {
      const {
        isBlockSelected,
        hasSelectedInnerBlock,
        getBlockSelectionStart
      } = select(import_store.store);
      return !getBlockSelectionStart() || isBlockSelected(clientId) || hasSelectedInnerBlock(clientId, true);
    },
    [clientId]
  );
  (0, import_element.useEffect)(() => {
    if (!isBlockOrDescendantSelected) {
      stopEditingContentOnlySection();
    }
  }, [isBlockOrDescendantSelected, stopEditingContentOnlySection]);
  return null;
}
function BlockList(settings) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_context.BlockEditContextProvider, { value: import_context.DEFAULT_BLOCK_EDIT_CONTEXT, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, { ...settings }) });
}
var EMPTY_ARRAY = [];
var EMPTY_SET = /* @__PURE__ */ new Set();
function Items({
  placeholder,
  rootClientId,
  renderAppender: CustomAppender,
  __experimentalAppenderTagName,
  layout = import_layout.defaultLayout
}) {
  const hasAppender = CustomAppender !== false;
  const hasCustomAppender = !!CustomAppender;
  const {
    order,
    isZoomOut,
    selectedBlocks,
    visibleBlocks,
    shouldRenderAppender
  } = (0, import_data.useSelect)(
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
      } = (0, import_lock_unlock.unlock)(select(import_store.store));
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
        (0, import_blocks.getDefaultBlockName)(),
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_layout.LayoutProvider, { value: layout, children: [
    order.map((clientId) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_data.AsyncModeProvider,
      {
        value: (
          // Only provide data asynchronously if the block is
          // not visible and not selected.
          !visibleBlocks.has(clientId) && !selectedBlocks.includes(clientId)
        ),
        children: [
          isZoomOut && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_zoom_out_separator.ZoomOutSeparator,
            {
              clientId,
              rootClientId,
              position: "top"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_block.default,
            {
              rootClientId,
              clientId
            }
          ),
          isZoomOut && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_zoom_out_separator.ZoomOutSeparator,
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
    shouldRenderAppender && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_list_appender.default,
      {
        tagName: __experimentalAppenderTagName,
        rootClientId,
        CustomAppender
      }
    )
  ] });
}
function BlockListItems(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_data.AsyncModeProvider, { value: false, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Items, { ...props }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockListItems,
  IntersectionObserver
});
//# sourceMappingURL=index.cjs.map
