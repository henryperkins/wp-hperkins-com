// packages/editor/src/utils/get-template-part-icon.js
import {
  header as headerIcon,
  footer as footerIcon,
  sidebar as sidebarIcon,
  navigationOverlay as navigationOverlayIcon,
  symbolFilled as symbolFilledIcon
} from "@wordpress/icons";
function getTemplatePartIcon(areaOrIconName) {
  if ("header" === areaOrIconName) {
    return headerIcon;
  } else if ("footer" === areaOrIconName) {
    return footerIcon;
  } else if ("sidebar" === areaOrIconName) {
    return sidebarIcon;
  } else if ("navigation-overlay" === areaOrIconName) {
    return navigationOverlayIcon;
  }
  return symbolFilledIcon;
}
export {
  getTemplatePartIcon
};
//# sourceMappingURL=get-template-part-icon.mjs.map
