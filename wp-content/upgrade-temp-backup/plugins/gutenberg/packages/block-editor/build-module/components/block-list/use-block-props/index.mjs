// packages/block-editor/src/components/block-list/use-block-props/index.js
import clsx from "clsx";
import { useContext } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { __unstableGetBlockProps as getBlockProps } from "@wordpress/blocks";
import { useMergeRefs, useDisabled } from "@wordpress/compose";
import warning from "@wordpress/warning";
import useMovingAnimation from "../../use-moving-animation/index.mjs";
import { PrivateBlockContext } from "../private-block-context.mjs";
import { useFocusFirstElement } from "./use-focus-first-element.mjs";
import { useIsHovered } from "./use-is-hovered.mjs";
import {
  blockBindingsKey,
  useBlockEditContext
} from "../../block-edit/context.mjs";
import { useFocusHandler } from "./use-focus-handler.mjs";
import { useEventHandlers } from "./use-selected-block-event-handlers.mjs";
import { useBlockRefProvider } from "./use-block-refs.mjs";
import { useIntersectionObserver } from "./use-intersection-observer.mjs";
import { useScrollIntoView } from "./use-scroll-into-view.mjs";
import { useFlashEditableBlocks } from "../../use-flash-editable-blocks/index.mjs";
import { useFirefoxDraggableCompatibility } from "./use-firefox-draggable-compatibility.mjs";
import { useBlockVisibility } from "../../block-visibility/index.mjs";
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
  } = useContext(PrivateBlockContext);
  const blockLabel = sprintf(__("Block: %s"), blockTitle);
  const htmlSuffix = mode === "html" && !__unstableIsHtml ? "-visual" : "";
  const ffDragRef = useFirefoxDraggableCompatibility();
  const isHoverEnabled = !isWithinSectionBlock;
  const mergedRefs = useMergeRefs([
    props.ref,
    useFocusFirstElement({ clientId, initialPosition }),
    useBlockRefProvider(clientId),
    useFocusHandler(clientId),
    useEventHandlers({ clientId, isSelected }),
    useIsHovered({ isEnabled: isHoverEnabled }),
    useIntersectionObserver(),
    useMovingAnimation({ triggerAnimationOnChange: index, clientId }),
    useDisabled({ isDisabled: !hasOverlay }),
    useFlashEditableBlocks({
      clientId,
      isEnabled: isSectionBlock
    }),
    useScrollIntoView({ isSelected }),
    canMove ? ffDragRef : void 0
  ]);
  const blockEditContext = useBlockEditContext();
  const hasBlockBindings = !!blockEditContext[blockBindingsKey];
  const bindingsStyle = hasBlockBindings ? {
    "--wp-admin-theme-color": "var(--wp-block-synced-color)",
    "--wp-admin-theme-color--rgb": "var(--wp-block-synced-color--rgb)"
  } : {};
  const { isBlockCurrentlyHidden } = useBlockVisibility({
    blockVisibility,
    deviceType
  });
  if (blockApiVersion < 2 && clientId === blockEditContext.clientId) {
    warning(
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
    className: clsx(
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
useBlockProps.save = getBlockProps;
export {
  useBlockProps
};
//# sourceMappingURL=index.mjs.map
