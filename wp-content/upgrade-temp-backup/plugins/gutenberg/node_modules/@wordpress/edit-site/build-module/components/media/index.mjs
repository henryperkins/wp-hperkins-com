// packages/edit-site/src/components/media/index.js
import { useEntityRecord } from "@wordpress/core-data";
import { jsx } from "react/jsx-runtime";
function Media({ id, size = ["large", "medium", "thumbnail"], ...props }) {
  const { record: media } = useEntityRecord("postType", "attachment", id);
  const currentSize = size.find(
    (s) => !!media?.media_details?.sizes?.[s]
  );
  const mediaUrl = media?.media_details?.sizes?.[currentSize]?.source_url || media?.source_url;
  if (!mediaUrl) {
    return null;
  }
  return /* @__PURE__ */ jsx("img", { ...props, src: mediaUrl, alt: media.alt_text });
}
var media_default = Media;
export {
  media_default as default
};
//# sourceMappingURL=index.mjs.map
