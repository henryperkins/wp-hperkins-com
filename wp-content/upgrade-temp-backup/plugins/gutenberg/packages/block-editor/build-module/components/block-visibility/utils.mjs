// packages/block-editor/src/components/block-visibility/utils.js
import { __, sprintf } from "@wordpress/i18n";
import { BLOCK_VISIBILITY_VIEWPORT_ENTRIES } from "./constants.mjs";
function isBlockHiddenForViewport(block, viewport) {
  if (!block) {
    return false;
  }
  const blockVisibility = block.attributes?.metadata?.blockVisibility;
  if (blockVisibility === true) {
    return false;
  }
  if ("object" !== typeof blockVisibility) {
    return false;
  }
  const viewportConfig = blockVisibility.viewport;
  if (!viewportConfig || "object" !== typeof viewportConfig) {
    return false;
  }
  if (!BLOCK_VISIBILITY_VIEWPORT_ENTRIES.some(
    ([, { key }]) => key === viewport
  )) {
    return false;
  }
  return viewportConfig[viewport] === false;
}
function getViewportCheckboxState(blocks, viewport) {
  if (!blocks?.length) {
    return false;
  }
  const hiddenCount = blocks.filter(
    (block) => isBlockHiddenForViewport(block, viewport)
  ).length;
  if (hiddenCount === 0) {
    return false;
  }
  if (hiddenCount === blocks.length) {
    return true;
  }
  return null;
}
function getHideEverywhereCheckboxState(blocks) {
  if (!blocks?.length) {
    return false;
  }
  const hiddenEverywhereCount = blocks.filter(
    (block) => block && block.attributes?.metadata?.blockVisibility === false
  ).length;
  if (hiddenEverywhereCount === 0) {
    return false;
  }
  if (hiddenEverywhereCount === blocks.length) {
    return true;
  }
  return null;
}
function getBlockVisibilityLabel(blockVisibility) {
  if (!blockVisibility && blockVisibility !== false) {
    return null;
  }
  if (blockVisibility === false) {
    return __("Block is hidden");
  }
  if (blockVisibility?.viewport) {
    const hiddenViewports = BLOCK_VISIBILITY_VIEWPORT_ENTRIES.filter(
      ([key]) => blockVisibility.viewport?.[key] === false
    ).map(([, viewport]) => viewport.label);
    if (hiddenViewports.length > 0) {
      return sprintf(
        /* translators: %s: comma-separated list of viewport names (Desktop, Tablet, Mobile) */
        __("Block is hidden on %s"),
        hiddenViewports.join(", ")
      );
    }
  }
  return null;
}
export {
  getBlockVisibilityLabel,
  getHideEverywhereCheckboxState,
  getViewportCheckboxState
};
//# sourceMappingURL=utils.mjs.map
