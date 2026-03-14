// packages/edit-site/src/components/site-editor-routes/utils.js
function isClassicThemeWithStyleBookSupport(siteData) {
  const isBlockTheme = siteData.currentTheme?.is_block_theme;
  const supportsEditorStyles = siteData.currentTheme?.theme_supports["editor-styles"];
  const hasThemeJson = siteData.editorSettings?.supportsLayout;
  return !isBlockTheme && (supportsEditorStyles || hasThemeJson);
}
export {
  isClassicThemeWithStyleBookSupport
};
//# sourceMappingURL=utils.mjs.map
