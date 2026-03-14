// packages/edit-site/src/components/post-list/use-notes-count.js
import { useMemo } from "@wordpress/element";
import { useEntityRecords } from "@wordpress/core-data";
function useNotesCount(postIds) {
  const { records: notes, isResolving } = useEntityRecords(
    "root",
    "comment",
    {
      post: postIds,
      type: "note",
      status: "all",
      per_page: -1,
      _fields: "id,post"
    },
    {
      enabled: postIds?.length > 0
    }
  );
  const notesCount = useMemo(() => {
    if (!notes || notes.length === 0) {
      return {};
    }
    const counts = {};
    notes.forEach((note) => {
      const postId = note.post;
      counts[postId] = (counts[postId] || 0) + 1;
    });
    return counts;
  }, [notes]);
  return { notesCount, isResolving };
}
export {
  useNotesCount as default
};
//# sourceMappingURL=use-notes-count.mjs.map
