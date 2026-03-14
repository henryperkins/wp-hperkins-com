// packages/global-styles-ui/src/font-library/utils/toggleFont.ts
function toggleFont(font, face, initialfonts = []) {
  const isFontActivated = (f) => f.slug === font.slug;
  const getActivatedFont = (fonts) => fonts.find(isFontActivated);
  const toggleEntireFontFamily = (activatedFont2) => {
    if (!activatedFont2) {
      return [...initialfonts, font];
    }
    return initialfonts.filter(
      (f) => !isFontActivated(f)
    );
  };
  const toggleFontVariant = (activatedFont2) => {
    const isFaceActivated = (f) => f.fontWeight === face.fontWeight && f.fontStyle === face.fontStyle;
    if (!activatedFont2) {
      return [...initialfonts, { ...font, fontFace: [face] }];
    }
    let newFontFaces = activatedFont2.fontFace || [];
    if (newFontFaces.find(isFaceActivated)) {
      newFontFaces = newFontFaces.filter(
        (f) => !isFaceActivated(f)
      );
    } else {
      newFontFaces = [...newFontFaces, face];
    }
    if (newFontFaces.length === 0) {
      return initialfonts.filter(
        (f) => !isFontActivated(f)
      );
    }
    return initialfonts.map(
      (f) => isFontActivated(f) ? { ...f, fontFace: newFontFaces } : f
    );
  };
  const activatedFont = getActivatedFont(initialfonts);
  if (!face) {
    return toggleEntireFontFamily(activatedFont);
  }
  return toggleFontVariant(activatedFont);
}
export {
  toggleFont
};
//# sourceMappingURL=toggleFont.mjs.map
