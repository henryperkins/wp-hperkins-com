"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/global-styles-ui/src/font-library/font-demo.tsx
var font_demo_exports = {};
__export(font_demo_exports, {
  default: () => font_demo_default
});
module.exports = __toCommonJS(font_demo_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_context = require("./context.cjs");
var import_preview_styles = require("./utils/preview-styles.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function getPreviewUrl(fontFace) {
  if (fontFace.preview) {
    return fontFace.preview;
  }
  if (fontFace.src) {
    return Array.isArray(fontFace.src) ? fontFace.src[0] : fontFace.src;
  }
  return void 0;
}
function getDisplayFontFace(font) {
  if ("fontStyle" in font && font.fontStyle || "fontWeight" in font && font.fontWeight) {
    return font;
  }
  if ("fontFace" in font && font.fontFace && font.fontFace.length) {
    return font.fontFace.find(
      (face) => face.fontStyle === "normal" && face.fontWeight === "400"
    ) || font.fontFace[0];
  }
  return {
    fontStyle: "normal",
    fontWeight: "400",
    fontFamily: font.fontFamily
  };
}
function FontDemo({ font, text }) {
  const ref = (0, import_element.useRef)(null);
  const fontFace = getDisplayFontFace(font);
  const style = (0, import_preview_styles.getFamilyPreviewStyle)(font);
  text = text || ("name" in font ? font.name : "");
  const customPreviewUrl = font.preview;
  const [isIntersecting, setIsIntersecting] = (0, import_element.useState)(false);
  const [isAssetLoaded, setIsAssetLoaded] = (0, import_element.useState)(false);
  const { loadFontFaceAsset } = (0, import_element.useContext)(import_context.FontLibraryContext);
  const previewUrl = customPreviewUrl ?? getPreviewUrl(fontFace);
  const isPreviewImage = previewUrl && previewUrl.match(/\.(png|jpg|jpeg|gif|svg)$/i);
  const faceStyles = (0, import_preview_styles.getFacePreviewStyle)(fontFace);
  const textDemoStyle = {
    fontSize: "18px",
    lineHeight: 1,
    opacity: isAssetLoaded ? "1" : "0",
    ...style,
    ...faceStyles
  };
  (0, import_element.useEffect)(() => {
    const observer = new window.IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {});
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [ref]);
  (0, import_element.useEffect)(() => {
    const loadAsset = async () => {
      if (isIntersecting) {
        if (!isPreviewImage && fontFace.src) {
          await loadFontFaceAsset(fontFace);
        }
        setIsAssetLoaded(true);
      }
    };
    loadAsset();
  }, [fontFace, isIntersecting, loadFontFaceAsset, isPreviewImage]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref, children: isPreviewImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "img",
    {
      src: previewUrl,
      loading: "lazy",
      alt: text,
      className: "font-library__font-variant_demo-image"
    }
  ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalText,
    {
      style: textDemoStyle,
      className: "font-library__font-variant_demo-text",
      children: text
    }
  ) });
}
var font_demo_default = FontDemo;
//# sourceMappingURL=font-demo.cjs.map
