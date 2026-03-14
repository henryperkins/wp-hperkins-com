// packages/editor/src/components/provider/use-post-content-blocks.js
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { applyFilters } from "@wordpress/hooks";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
var POST_CONTENT_BLOCK_TYPES = [
  "core/post-title",
  "core/post-featured-image",
  "core/post-content"
];
function usePostContentBlocks() {
  const contentOnlyBlockTypes = useMemo(
    () => [
      ...applyFilters(
        "editor.postContentBlockTypes",
        POST_CONTENT_BLOCK_TYPES
      )
    ],
    []
  );
  const contentOnlyIds = useSelect(
    (select) => {
      const { getPostBlocksByName } = unlock(select(editorStore));
      return getPostBlocksByName(contentOnlyBlockTypes);
    },
    [contentOnlyBlockTypes]
  );
  return contentOnlyIds;
}
export {
  usePostContentBlocks as default
};
//# sourceMappingURL=use-post-content-blocks.mjs.map
