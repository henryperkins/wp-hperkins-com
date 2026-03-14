// packages/edit-site/src/utils/is-previewing-theme.js
import { getQueryArg } from "@wordpress/url";
function isPreviewingTheme() {
  return !!getQueryArg(window.location.href, "wp_theme_preview");
}
function currentlyPreviewingTheme() {
  if (isPreviewingTheme()) {
    return getQueryArg(window.location.href, "wp_theme_preview");
  }
  return null;
}
export {
  currentlyPreviewingTheme,
  isPreviewingTheme
};
//# sourceMappingURL=is-previewing-theme.mjs.map
