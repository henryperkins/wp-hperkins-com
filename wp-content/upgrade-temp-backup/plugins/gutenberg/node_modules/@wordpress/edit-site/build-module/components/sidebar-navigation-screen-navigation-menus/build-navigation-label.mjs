// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menus/build-navigation-label.js
import { __, _x, sprintf } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";
function buildNavigationLabel(title, id, status) {
  if (!title?.rendered) {
    return sprintf(__("(no title %s)"), id);
  }
  if (status === "publish") {
    return decodeEntities(title?.rendered);
  }
  return sprintf(
    // translators: 1: title of the menu. 2: status of the menu (draft, pending, etc.).
    _x("%1$s (%2$s)", "menu label"),
    decodeEntities(title?.rendered),
    status
  );
}
export {
  buildNavigationLabel as default
};
//# sourceMappingURL=build-navigation-label.mjs.map
