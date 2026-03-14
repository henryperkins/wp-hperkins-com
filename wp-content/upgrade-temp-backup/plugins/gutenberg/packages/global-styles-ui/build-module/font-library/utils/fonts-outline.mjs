// packages/global-styles-ui/src/font-library/utils/fonts-outline.ts
function getFontsOutline(fonts) {
  return fonts.reduce(
    (acc, font) => ({
      ...acc,
      [font.slug]: (font?.fontFace || []).reduce(
        (faces, face) => ({
          ...faces,
          [`${face.fontStyle}-${face.fontWeight}`]: true
        }),
        {}
      )
    }),
    {}
  );
}
function isFontFontFaceInOutline(slug, face, outline) {
  if (!face) {
    return !!outline[slug];
  }
  return !!outline[slug]?.[`${face.fontStyle}-${face.fontWeight}`];
}
export {
  getFontsOutline,
  isFontFontFaceInOutline
};
//# sourceMappingURL=fonts-outline.mjs.map
