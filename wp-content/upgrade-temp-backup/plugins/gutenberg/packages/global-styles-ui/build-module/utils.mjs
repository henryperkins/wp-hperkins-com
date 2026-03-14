// packages/global-styles-ui/src/utils.ts
import { areGlobalStylesEqual } from "@wordpress/global-styles-engine";
function removePropertiesFromObject(object, properties) {
  if (!properties?.length) {
    return object;
  }
  if (typeof object !== "object" || !object || !Object.keys(object).length) {
    return object;
  }
  for (const key in object) {
    if (properties.includes(key)) {
      delete object[key];
    } else if (typeof object[key] === "object") {
      removePropertiesFromObject(object[key], properties);
    }
  }
  return object;
}
var filterObjectByProperties = (object, properties) => {
  if (!object || !properties?.length) {
    return {};
  }
  const newObject = {};
  Object.keys(object).forEach((key) => {
    if (properties.includes(key)) {
      newObject[key] = object[key];
    } else if (typeof object[key] === "object") {
      const newFilter = filterObjectByProperties(
        object[key],
        properties
      );
      if (Object.keys(newFilter).length) {
        newObject[key] = newFilter;
      }
    }
  });
  return newObject;
};
function isVariationWithProperties(variation, properties) {
  const variationWithProperties = filterObjectByProperties(
    structuredClone(variation),
    properties
  );
  return areGlobalStylesEqual(variationWithProperties, variation);
}
function getFontFamilyFromSetting(fontFamilies, setting) {
  if (!Array.isArray(fontFamilies) || !setting) {
    return null;
  }
  const fontFamilyVariable = setting.replace("var(", "").replace(")", "");
  const fontFamilySlug = fontFamilyVariable?.split("--").slice(-1)[0];
  return fontFamilies.find(
    (fontFamily) => fontFamily.slug === fontFamilySlug
  );
}
function getFontFamilies(themeJson) {
  const themeFontFamilies = themeJson?.settings?.typography?.fontFamilies?.theme;
  const customFontFamilies = themeJson?.settings?.typography?.fontFamilies?.custom;
  let fontFamilies = [];
  if (themeFontFamilies && customFontFamilies) {
    fontFamilies = [...themeFontFamilies, ...customFontFamilies];
  } else if (themeFontFamilies) {
    fontFamilies = themeFontFamilies;
  } else if (customFontFamilies) {
    fontFamilies = customFontFamilies;
  }
  const bodyFontFamilySetting = themeJson?.styles?.typography?.fontFamily;
  const bodyFontFamily = getFontFamilyFromSetting(
    fontFamilies,
    bodyFontFamilySetting
  );
  const headingFontFamilySetting = themeJson?.styles?.elements?.heading?.typography?.fontFamily;
  let headingFontFamily;
  if (!headingFontFamilySetting) {
    headingFontFamily = bodyFontFamily;
  } else {
    headingFontFamily = getFontFamilyFromSetting(
      fontFamilies,
      themeJson?.styles?.elements?.heading?.typography?.fontFamily
    );
  }
  return [bodyFontFamily, headingFontFamily];
}
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
function getFamilyPreviewStyle(family) {
  const style = {
    fontFamily: formatFontFamily(family.fontFamily)
  };
  if (!Array.isArray(family.fontFace)) {
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
function getVariationClassName(variation) {
  if (!variation) {
    return "";
  }
  return `is-style-${variation}`;
}
function getNewIndexFromPresets(presets, slugPrefix) {
  const nameRegex = new RegExp(`^${slugPrefix}([\\d]+)$`);
  const highestPresetValue = presets.reduce((currentHighest, preset) => {
    if (typeof preset?.slug === "string") {
      const matches = preset?.slug.match(nameRegex);
      if (matches) {
        const id = parseInt(matches[1], 10);
        if (id > currentHighest) {
          return id;
        }
      }
    }
    return currentHighest;
  }, 0);
  return highestPresetValue + 1;
}
export {
  filterObjectByProperties,
  formatFontFamily,
  getFamilyPreviewStyle,
  getFontFamilies,
  getNewIndexFromPresets,
  getVariationClassName,
  isVariationWithProperties,
  removePropertiesFromObject
};
//# sourceMappingURL=utils.mjs.map
