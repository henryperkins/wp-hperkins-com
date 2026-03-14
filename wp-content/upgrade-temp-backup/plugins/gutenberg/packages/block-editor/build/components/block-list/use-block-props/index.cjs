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

// packages/block-editor/src/components/block-list/use-block-props/index.js
var use_block_props_exports = {};
__export(use_block_props_exports, {
  useBlockProps: () => useBlockProps
});
module.exports = __toCommonJS(use_block_props_exports);
var import_clsx = __toESM(require("clsx"));
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_blocks = require("@wordpress/blocks");
var import_compose = require("@wordpress/compose");
var import_warning = __toESM(require("@wordpress/warning"));
var import_use_moving_animation = __toESM(require("../../use-moving-animation/index.cjs"));
var import_private_block_context = require("../private-block-context.cjs");
var import_use_focus_first_element = require("./use-focus-first-element.cjs");
var import_use_is_hovered = require("./use-is-hovered.cjs");
var import_context = require("../../block-edit/context.cjs");
var import_use_focus_handler = require("./use-focus-handler.cjs");
var import_use_selected_block_event_handlers = require("./use-selected-block-event-handlers.cjs");
var import_use_block_refs = require("./use-block-refs.cjs");
var import_use_intersection_observer = require("./use-intersection-observer.cjs");
var import_use_scroll_into_view = require("./use-scroll-into-view.cjs");
var import_use_flash_editable_blocks = require("../../use-flash-editable-blocks/index.cjs");
var import_use_firefox_draggable_compatibility = require("./use-firefox-draggable-compatibility.cjs");
var import_block_visibility = require("../../block-visibility/index.cjs");
function useBlockProps(props = {}, { __unstableIsHtml } = {}) {
  const {
    clientId,
    className,
    wrapperProps = {},
    isAligned,
    index,
    mode,
    name,
    blockApiVersion,
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
    isEditingDisabled,
    hasEditableOutline,
    isEditingContentOnlySection,
    defaultClassName,
    isSectionBlock,
    isWithinSectionBlock,
    canMove,
    blockVisibility,
    deviceType
  } = (0, import_element.useContext)(import_private_block_context.PrivateBlockContext);
  const blockLabel = (0, import_i18n.sprintf)((0, import_i18n.__)("Block: %s"), blockTitle);
  const htmlSuffix = mode === "html" && !__unstableIsHtml ? "-visual" : "";
  const ffDragRef = (0, import_use_firefox_draggable_compatibility.useFirefoxDraggableCompatibility)();
  const isHoverEnabled = !isWithinSectionBlock;
  const mergedRefs = (0, import_compose.useMergeRefs)([
    props.ref,
    (0, import_use_focus_first_element.useFocusFirstElement)({ clientId, initialPosition }),
    (0, import_use_block_refs.useBlockRefProvider)(clientId),
    (0, import_use_focus_handler.useFocusHandler)(clientId),
    (0, import_use_selected_block_event_handlers.useEventHandlers)({ clientId, isSelected }),
    (0, import_use_is_hovered.useIsHovered)({ isEnabled: isHoverEnabled }),
    (0, import_use_intersection_observer.useIntersectionObserver)(),
    (0, import_use_moving_animation.default)({ triggerAnimationOnChange: index, clientId }),
    (0, import_compose.useDisabled)({ isDisabled: !hasOverlay }),
    (0, import_use_flash_editable_blocks.useFlashEditableBlocks)({
      clientId,
      isEnabled: isSectionBlock
    }),
    (0, import_use_scroll_into_view.useScrollIntoView)({ isSelected }),
    canMove ? ffDragRef : void 0
  ]);
  const blockEditContext = (0, import_context.useBlockEditContext)();
  const hasBlockBindings = !!blockEditContext[import_context.blockBindingsKey];
  const bindingsStyle = hasBlockBindings ? {
    "--wp-admin-theme-color": "var(--wp-block-synced-color)",
    "--wp-admin-theme-color--rgb": "var(--wp-block-synced-color--rgb)"
  } : {};
  const { isBlockCurrentlyHidden } = (0, import_block_visibility.useBlockVisibility)({
    blockVisibility,
    deviceType
  });
  if (blockApiVersion < 2 && clientId === blockEditContext.clientId) {
    (0, import_warning.default)(
      `Block type "${name}" must support API version 2 or higher to work correctly with "useBlockProps" method.`
    );
  }
  let hasNegativeMargin = false;
  if (wrapperProps?.style?.marginTop?.charAt(0) === "-" || wrapperProps?.style?.marginBottom?.charAt(0) === "-" || wrapperProps?.style?.marginLeft?.charAt(0) === "-" || wrapperProps?.style?.marginRight?.charAt(0) === "-") {
    hasNegativeMargin = true;
  }
  return {
    tabIndex: blockEditingMode === "disabled" ? -1 : 0,
    draggable: canMove && !hasChildSelected ? true : void 0,
    ...wrapperProps,
    ...props,
    ref: mergedRefs,
    id: `block-${clientId}${htmlSuffix}`,
    role: "document",
    "aria-label": blockLabel,
    "data-block": clientId,
    "data-type": name,
    "data-title": blockTitle,
    inert: isSubtreeDisabled ? "true" : void 0,
    className: (0, import_clsx.default)(
      "block-editor-block-list__block",
      {
        // The wp-block className is important for editor styles.
        "wp-block": !isAligned,
        "has-block-overlay": hasOverlay,
        "is-selected": isSelected,
        "is-highlighted": isHighlighted,
        "is-multi-selected": isMultiSelected,
        "is-partially-selected": isPartiallySelected,
        "is-reusable": isReusable,
        "is-dragging": isDragging,
        "has-child-selected": hasChildSelected,
        "is-editing-disabled": isEditingDisabled,
        "has-editable-outline": hasEditableOutline,
        "has-negative-margin": hasNegativeMargin,
        "is-editing-content-only-section": isEditingContentOnlySection,
        "is-block-hidden": isBlockCurrentlyHidden
      },
      className,
      props.className,
      wrapperProps.className,
      defaultClassName
    ),
    style: { ...wrapperProps.style, ...props.style, ...bindingsStyle }
  };
}
useBlockProps.save = import_blocks.__unstableGetBlockProps;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useBlockProps
});
//# sourceMappingURL=index.cjs.map
