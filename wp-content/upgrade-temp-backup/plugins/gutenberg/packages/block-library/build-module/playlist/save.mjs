// packages/block-library/src/playlist/save.js
import clsx from "clsx";
import {
  RichText,
  useBlockProps,
  useInnerBlocksProps,
  __experimentalGetElementClassName
} from "@wordpress/block-editor";
import { jsx, jsxs } from "react/jsx-runtime";
function saveWithInnerBlocks({ attributes }) {
  const { caption, showNumbers, showTracklist, showArtists } = attributes;
  const blockProps = useBlockProps.save();
  const innerBlocksProps = useInnerBlocksProps.save(blockProps);
  return /* @__PURE__ */ jsxs("figure", { ...innerBlocksProps, children: [
    /* @__PURE__ */ jsx(
      "ol",
      {
        className: clsx("wp-block-playlist__tracklist", {
          "wp-block-playlist__tracklist-is-hidden": !showTracklist,
          "wp-block-playlist__tracklist-artist-is-hidden": !showArtists,
          "wp-block-playlist__tracklist-show-numbers": showNumbers
        }),
        children: innerBlocksProps.children
      }
    ),
    !RichText.isEmpty(caption) && /* @__PURE__ */ jsx(
      RichText.Content,
      {
        tagName: "figcaption",
        className: __experimentalGetElementClassName("caption"),
        value: caption
      }
    )
  ] });
}
export {
  saveWithInnerBlocks as default
};
//# sourceMappingURL=save.mjs.map
