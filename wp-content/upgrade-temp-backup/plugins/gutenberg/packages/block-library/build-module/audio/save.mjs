// packages/block-library/src/audio/save.js
import {
  RichText,
  useBlockProps,
  __experimentalGetElementClassName
} from "@wordpress/block-editor";
import { jsx, jsxs } from "react/jsx-runtime";
function save({ attributes }) {
  const { autoplay, caption, loop, preload, src } = attributes;
  return src && /* @__PURE__ */ jsxs("figure", { ...useBlockProps.save(), children: [
    /* @__PURE__ */ jsx(
      "audio",
      {
        controls: "controls",
        src,
        autoPlay: autoplay,
        loop,
        preload
      }
    ),
    !RichText.isEmpty(caption) && /* @__PURE__ */ jsx(
      RichText.Content,
      {
        tagName: "figcaption",
        value: caption,
        className: __experimentalGetElementClassName(
          "caption"
        )
      }
    )
  ] });
}
export {
  save as default
};
//# sourceMappingURL=save.mjs.map
