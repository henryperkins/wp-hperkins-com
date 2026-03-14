// packages/block-library/src/video/deprecated.js
import { RichText, useBlockProps } from "@wordpress/block-editor";
import metadata from "./block.json";
import Tracks from "./tracks.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { attributes: blockAttributes } = metadata;
var v1 = {
  attributes: blockAttributes,
  save({ attributes }) {
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
      !RichText.isEmpty(caption) && /* @__PURE__ */ jsx(RichText.Content, { tagName: "figcaption", value: caption })
    ] });
  }
};
var deprecated = [v1];
var deprecated_default = deprecated;
export {
  deprecated_default as default
};
//# sourceMappingURL=deprecated.mjs.map
