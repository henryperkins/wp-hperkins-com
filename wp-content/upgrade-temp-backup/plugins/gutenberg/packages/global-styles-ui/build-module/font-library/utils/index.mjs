// packages/global-styles-ui/src/font-library/utils/index.ts
import { privateApis as componentsPrivateApis } from "@wordpress/components";
import { FONT_WEIGHTS, FONT_STYLES } from "./constants.mjs";
import { fetchInstallFontFace } from "../api.mjs";
import { formatFontFaceName } from "./preview-styles.mjs";
import { unlock } from "../../lock-unlock.mjs";
var { File } = window;
var { kebabCase } = unlock(componentsPrivateApis);
function setUIValuesNeeded(font, extraValues = {}) {
  if (!font.name && (font.fontFamily || font.slug)) {
    font.name = font.fontFamily || font.slug;
  }
  return {
    ...font,
    ...extraValues
  };
}
function isUrlEncoded(url) {
  if (typeof url !== "string") {
    return false;
  }
  return url !== decodeURIComponent(url);
}
function getFontFaceVariantName(face) {
  const weightName = FONT_WEIGHTS[face.fontWeight ?? ""] || face.fontWeight;
  const styleName = face.fontStyle === "normal" ? "" : FONT_STYLES[face.fontStyle ?? ""] || face.fontStyle;
  return `${weightName} ${styleName}`;
}
function mergeFontFaces(existing = [], incoming = []) {
  const map = /* @__PURE__ */ new Map();
  for (const face of existing) {
    map.set(`${face.fontWeight}${face.fontStyle}`, face);
  }
  for (const face of incoming) {
    map.set(`${face.fontWeight}${face.fontStyle}`, face);
  }
  return Array.from(map.values());
}
function mergeFontFamilies(existing = [], incoming = []) {
  const map = /* @__PURE__ */ new Map();
  for (const font of existing) {
    map.set(font.slug, { ...font });
  }
  for (const font of incoming) {
    if (map.has(font.slug)) {
      const { fontFace: incomingFontFaces, ...restIncoming } = font;
      const existingFont = map.get(font.slug);
      const mergedFontFaces = mergeFontFaces(
        existingFont.fontFace,
        incomingFontFaces
      );
      map.set(font.slug, {
        ...restIncoming,
        fontFace: mergedFontFaces
      });
    } else {
      map.set(font.slug, { ...font });
    }
  }
  return Array.from(map.values());
}
async function loadFontFaceInBrowser(fontFace, source, addTo = "all") {
  let dataSource;
  if (typeof source === "string") {
    dataSource = `url(${source})`;
  } else if (source instanceof File) {
    dataSource = await source.arrayBuffer();
  } else {
    return;
  }
  const newFont = new window.FontFace(
    formatFontFaceName(fontFace.fontFamily),
    dataSource,
    {
      style: fontFace.fontStyle,
      weight: String(fontFace.fontWeight)
    }
  );
  const loadedFace = await newFont.load();
  if (addTo === "document" || addTo === "all") {
    document.fonts.add(loadedFace);
  }
  if (addTo === "iframe" || addTo === "all") {
    const iframe = document.querySelector(
      'iframe[name="editor-canvas"]'
    );
    if (iframe?.contentDocument) {
      iframe.contentDocument.fonts.add(loadedFace);
    }
  }
}
function unloadFontFaceInBrowser(fontFace, removeFrom = "all") {
  const unloadFontFace = (fonts) => {
    fonts.forEach((f) => {
      if (f.family === formatFontFaceName(fontFace?.fontFamily) && f.weight === fontFace?.fontWeight && f.style === fontFace?.fontStyle) {
        fonts.delete(f);
      }
    });
  };
  if (removeFrom === "document" || removeFrom === "all") {
    unloadFontFace(document.fonts);
  }
  if (removeFrom === "iframe" || removeFrom === "all") {
    const iframe = document.querySelector(
      'iframe[name="editor-canvas"]'
    );
    if (iframe?.contentDocument) {
      unloadFontFace(iframe.contentDocument.fonts);
    }
  }
}
function getDisplaySrcFromFontFace(input) {
  if (!input) {
    return;
  }
  let src;
  if (Array.isArray(input)) {
    src = input[0];
  } else {
    src = input;
  }
  if (src.startsWith("file:.")) {
    return;
  }
  if (!isUrlEncoded(src)) {
    src = encodeURI(src);
  }
  return src;
}
function makeFontFamilyFormData(fontFamily) {
  const formData = new FormData();
  const { fontFace, category, ...familyWithValidParameters } = fontFamily;
  const fontFamilySettings = {
    ...familyWithValidParameters,
    slug: kebabCase(fontFamily.slug)
  };
  formData.append(
    "font_family_settings",
    JSON.stringify(fontFamilySettings)
  );
  return formData;
}
function makeFontFacesFormData(font) {
  const fontFacesFormData = (font?.fontFace ?? []).map(
    (item, faceIndex) => {
      const face = { ...item };
      const formData = new FormData();
      if (face.file) {
        const files = Array.isArray(face.file) ? face.file : [face.file];
        const src = [];
        files.forEach((file, key) => {
          const fileId = `file-${faceIndex}-${key}`;
          formData.append(fileId, file, file.name);
          src.push(fileId);
        });
        face.src = src.length === 1 ? src[0] : src;
        delete face.file;
        formData.append("font_face_settings", JSON.stringify(face));
      } else {
        formData.append("font_face_settings", JSON.stringify(face));
      }
      return formData;
    }
  );
  return fontFacesFormData;
}
async function batchInstallFontFaces(fontFamilyId, fontFacesData, registry) {
  const responses = [];
  for (const faceData of fontFacesData) {
    try {
      const response = await fetchInstallFontFace(
        fontFamilyId,
        faceData,
        registry
      );
      responses.push({ status: "fulfilled", value: response });
    } catch (error) {
      responses.push({ status: "rejected", reason: error });
    }
  }
  const results = {
    errors: [],
    successes: []
  };
  responses.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value) {
      const response = result.value;
      results.successes.push(response);
    } else if (result.reason) {
      results.errors.push({
        data: fontFacesData[index],
        message: result.reason.message
      });
    }
  });
  return results;
}
async function downloadFontFaceAssets(src) {
  src = Array.isArray(src) ? src : [src];
  const files = await Promise.all(
    src.map(async (url) => {
      return fetch(new Request(url)).then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error downloading font face asset from ${url}. Server responded with status: ${response.status}`
          );
        }
        return response.blob();
      }).then((blob) => {
        const filename = url.split("/").pop();
        const file = new File([blob], filename, {
          type: blob.type
        });
        return file;
      });
    })
  );
  return files.length === 1 ? files[0] : files;
}
function checkFontFaceInstalled(fontFace, collection) {
  return -1 !== collection.findIndex((collectionFontFace) => {
    return collectionFontFace.fontWeight === fontFace.fontWeight && collectionFontFace.fontStyle === fontFace.fontStyle;
  });
}
export {
  batchInstallFontFaces,
  checkFontFaceInstalled,
  downloadFontFaceAssets,
  getDisplaySrcFromFontFace,
  getFontFaceVariantName,
  isUrlEncoded,
  loadFontFaceInBrowser,
  makeFontFacesFormData,
  makeFontFamilyFormData,
  mergeFontFaces,
  mergeFontFamilies,
  setUIValuesNeeded,
  unloadFontFaceInBrowser
};
//# sourceMappingURL=index.mjs.map
