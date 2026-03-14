// packages/block-library/src/private-apis.js
import { default as BlockKeyboardShortcuts } from "./block-keyboard-shortcuts/index.mjs";
import { NAVIGATION_OVERLAY_TEMPLATE_PART_AREA } from "./navigation/constants.mjs";
import { NavigationLinkUI } from "./navigation/edit/navigation-link-ui.mjs";
import { lock } from "./lock-unlock.mjs";
var privateApis = {};
lock(privateApis, {
  BlockKeyboardShortcuts,
  NAVIGATION_OVERLAY_TEMPLATE_PART_AREA,
  NavigationLinkUI
});
export {
  privateApis
};
//# sourceMappingURL=private-apis.mjs.map
