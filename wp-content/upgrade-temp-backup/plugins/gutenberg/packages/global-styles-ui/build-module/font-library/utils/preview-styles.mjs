// packages/global-styles-ui/src/font-library/utils/preview-styles.ts
function findNearest(input, numbers) {
  if (numbers.length === 0) {
    return null;
  }
  numbers.sort((a, b) => Math.abs(input - a) - Math.abs(input - b));
  return numbers[0];
}
function extractFontWeights(fontFaces) {
  const result = [];
  fontFaces.forEach((face) => {
    const weights = String(face.fontWeight).split(" ");
    if (weights.length === 2) {
      const start = parseInt(weights[0]);
      const end = parseInt(weights[1]);
      for (let i = start; i <= end; i += 100) {
        result.push(i);
      }
    } else if (weights.length === 1) {
      result.push(parseInt(weights[0]));
    }
  });
  return result;
}
function formatFontFamily(input) {
  const regex = /^(?!generic\([ a-zA-Z\-]+\)$)(?!^[a-zA-Z\-]+$).+/;
  const output = input.trim();
  const formatItem = (item) => {
    item = item.trim();
    if (item.match(regex)) {
      item = item.replace(/^["']|["']$/g, "");
      return `"${item}"`;
    }
    return item;
  };
  if (output.includes(",")) {
    return output.split(",").map(formatItem).filter((item) => item !== "").join(", ");
  }
  return formatItem(output);
}
function formatFontFaceName(input) {
  if (!input) {
    return "";
  }
  let output = input.trim();
  if (output.includes(",")) {
    output = (output.split(",").find((item) => item.trim() !== "") ?? "").trim();
  }
  output = output.replace(/^["']|["']$/g, "");
  if (window.navigator.userAgent.toLowerCase().includes("firefox")) {
    output = `"${output}"`;
  }
  return output;
}
function getFamilyPreviewStyle(family) {
  const style = {
    fontFamily: formatFontFamily(family.fontFamily)
  };
  if (!("fontFace" in family) || !Array.isArray(family.fontFace)) {
    style.fontWeight = "400";
    style.fontStyle = "normal";
    return style;
  }
  if (family.fontFace) {
    const normalFaces = family.fontFace.filter(
      (face) => face?.fontStyle && face.fontStyle.toLowerCase() === "normal"
    );
    if (normalFaces.length > 0) {
      style.fontStyle = "normal";
      const normalWeights = extractFontWeights(normalFaces);
      const nearestWeight = findNearest(400, normalWeights);
      style.fontWeight = String(nearestWeight) || "400";
    } else {
      style.fontStyle = family.fontFace.length && family.fontFace[0].fontStyle || "normal";
      style.fontWeight = family.fontFace.length && String(family.fontFace[0].fontWeight) || "400";
    }
  }
  return style;
}
function getFacePreviewStyle(face) {
  return {
    fontFamily: formatFontFamily(face.fontFamily),
    fontStyle: face.fontStyle || "normal",
    fontWeight: face.fontWeight || "400"
  };
}
export {
  formatFontFaceName,
  formatFontFamily,
  getFacePreviewStyle,
  getFamilyPreviewStyle
};
//# sourceMappingURL=preview-styles.mjs.map
