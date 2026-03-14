// packages/block-editor/src/components/block-visibility/use-block-visibility.js
import { useViewportMatch } from "@wordpress/compose";
import { BLOCK_VISIBILITY_VIEWPORTS } from "./constants.mjs";
function useBlockVisibility(options = {}) {
  const {
    blockVisibility = void 0,
    deviceType = BLOCK_VISIBILITY_VIEWPORTS.desktop.key
  } = options;
  const isLargerThanMobile = useViewportMatch("mobile", ">=");
  const isLargerThanTablet = useViewportMatch("medium", ">=");
  let currentViewport;
  if (deviceType === BLOCK_VISIBILITY_VIEWPORTS.mobile.key) {
    currentViewport = BLOCK_VISIBILITY_VIEWPORTS.mobile.key;
  } else if (deviceType === BLOCK_VISIBILITY_VIEWPORTS.tablet.key) {
    currentViewport = BLOCK_VISIBILITY_VIEWPORTS.tablet.key;
  } else if (!isLargerThanMobile) {
    currentViewport = BLOCK_VISIBILITY_VIEWPORTS.mobile.key;
  } else if (isLargerThanMobile && !isLargerThanTablet) {
    currentViewport = BLOCK_VISIBILITY_VIEWPORTS.tablet.key;
  } else {
    currentViewport = BLOCK_VISIBILITY_VIEWPORTS.desktop.key;
  }
  const isBlockCurrentlyHidden = blockVisibility === false || blockVisibility?.viewport?.[currentViewport] === false;
  return { isBlockCurrentlyHidden, currentViewport };
}
export {
  useBlockVisibility as default
};
//# sourceMappingURL=use-block-visibility.mjs.map
