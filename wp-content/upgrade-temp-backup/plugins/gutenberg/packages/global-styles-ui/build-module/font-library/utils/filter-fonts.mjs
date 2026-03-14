// packages/global-styles-ui/src/font-library/utils/filter-fonts.ts
function filterFonts(fonts, filters) {
  const { category, search } = filters;
  let filteredFonts = fonts || [];
  if (category && category !== "all") {
    filteredFonts = filteredFonts.filter(
      (font) => font.categories && font.categories.indexOf(category) !== -1
    );
  }
  if (search) {
    filteredFonts = filteredFonts.filter(
      (font) => font.font_family_settings && font.font_family_settings.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  return filteredFonts;
}
export {
  filterFonts as default
};
//# sourceMappingURL=filter-fonts.mjs.map
