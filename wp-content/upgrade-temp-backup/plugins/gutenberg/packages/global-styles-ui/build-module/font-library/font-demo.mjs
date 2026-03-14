// packages/global-styles-ui/src/font-library/font-demo.tsx
import { __experimentalText as Text } from "@wordpress/components";
import { useContext, useEffect, useState, useRef } from "@wordpress/element";
import { FontLibraryContext } from "./context.mjs";
import {
  getFacePreviewStyle,
  getFamilyPreviewStyle
} from "./utils/preview-styles.mjs";
import { jsx } from "react/jsx-runtime";
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
  const ref = useRef(null);
  const fontFace = getDisplayFontFace(font);
  const style = getFamilyPreviewStyle(font);
  text = text || ("name" in font ? font.name : "");
  const customPreviewUrl = font.preview;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isAssetLoaded, setIsAssetLoaded] = useState(false);
  const { loadFontFaceAsset } = useContext(FontLibraryContext);
  const previewUrl = customPreviewUrl ?? getPreviewUrl(fontFace);
  const isPreviewImage = previewUrl && previewUrl.match(/\.(png|jpg|jpeg|gif|svg)$/i);
  const faceStyles = getFacePreviewStyle(fontFace);
  const textDemoStyle = {
    fontSize: "18px",
    lineHeight: 1,
    opacity: isAssetLoaded ? "1" : "0",
    ...style,
    ...faceStyles
  };
  useEffect(() => {
    const observer = new window.IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {});
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [ref]);
  useEffect(() => {
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
  return /* @__PURE__ */ jsx("div", { ref, children: isPreviewImage ? /* @__PURE__ */ jsx(
    "img",
    {
      src: previewUrl,
      loading: "lazy",
      alt: text,
      className: "font-library__font-variant_demo-image"
    }
  ) : /* @__PURE__ */ jsx(
    Text,
    {
      style: textDemoStyle,
      className: "font-library__font-variant_demo-text",
      children: text
    }
  ) });
}
var font_demo_default = FontDemo;
export {
  font_demo_default as default
};
//# sourceMappingURL=font-demo.mjs.map
