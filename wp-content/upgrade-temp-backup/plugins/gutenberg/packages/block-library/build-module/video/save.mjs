// packages/block-library/src/video/save.js
import {
  RichText,
  useBlockProps,
  __experimentalGetElementClassName
} from "@wordpress/block-editor";
import Tracks from "./tracks.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function save({ attributes }) {
  const {
    autoplay,
    caption,
    controls,
    loop,
    muted,
    poster,
    preload,
    src,
    playsInline,
    tracks
  } = attributes;
  return /* @__PURE__ */ jsxs("figure", { ...useBlockProps.save(), children: [
    src && /* @__PURE__ */ jsx(
      "video",
      {
        autoPlay: autoplay,
        controls,
        loop,
        muted,
        poster,
        preload: preload !== "metadata" ? preload : void 0,
        src,
        playsInline,
        children: /* @__PURE__ */ jsx(Tracks, { tracks })
      }
    ),
    !RichText.isEmpty(caption) && /* @__PURE__ */ jsx(
      RichText.Content,
      {
        className: __experimentalGetElementClassName("caption"),
        tagName: "figcaption",
        value: caption
      }
    )
  ] });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
