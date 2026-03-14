// packages/block-editor/src/components/inserter/media-tab/media-list.js
import { Composite } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { MediaPreview } from "./media-preview.mjs";
import { jsx } from "react/jsx-runtime";
function MediaList({
  mediaList,
  category,
  onClick,
  label = __("Media List")
}) {
  return /* @__PURE__ */ jsx(
    Composite,
    {
      role: "listbox",
      className: "block-editor-inserter__media-list",
      "aria-label": label,
      children: mediaList.map((media, index) => /* @__PURE__ */ jsx(
        MediaPreview,
        {
          media,
          category,
          onClick
        },
        media.id || media.sourceId || index
      ))
    }
  );
}
var media_list_default = MediaList;
export {
  media_list_default as default
};
//# sourceMappingURL=media-list.mjs.map
