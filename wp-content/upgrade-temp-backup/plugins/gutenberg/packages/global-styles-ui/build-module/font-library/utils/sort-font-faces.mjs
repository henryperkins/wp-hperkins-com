// packages/global-styles-ui/src/font-library/utils/sort-font-faces.ts
function getNumericFontWeight(value) {
  switch (value) {
    case "normal":
      return 400;
    case "bold":
      return 700;
    case "bolder":
      return 500;
    case "lighter":
      return 300;
    default:
      return parseInt(value, 10);
  }
}
function sortFontFaces(faces) {
  return faces.sort((a, b) => {
    if (a.fontStyle === "normal" && b.fontStyle !== "normal") {
      return -1;
    }
    if (b.fontStyle === "normal" && a.fontStyle !== "normal") {
      return 1;
    }
    if (a.fontStyle === b.fontStyle) {
      return getNumericFontWeight(a.fontWeight?.toString() ?? "normal") - getNumericFontWeight(b.fontWeight?.toString() ?? "normal");
    }
    if (!a.fontStyle || !b.fontStyle) {
      return !a.fontStyle ? 1 : -1;
    }
    return a.fontStyle.localeCompare(b.fontStyle);
  });
}
export {
  sortFontFaces
};
//# sourceMappingURL=sort-font-faces.mjs.map
