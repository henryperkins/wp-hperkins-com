// packages/fields/src/fields/discussion/index.tsx
import { __ } from "@wordpress/i18n";
var discussionField = {
  id: "discussion",
  label: __("Discussion"),
  type: "text",
  render: ({ item }) => {
    const commentsOpen = item.comment_status === "open";
    const pingsOpen = item.ping_status === "open";
    if (commentsOpen && pingsOpen) {
      return __("Open");
    }
    if (commentsOpen && !pingsOpen) {
      return __("Comments only");
    }
    if (!commentsOpen && pingsOpen) {
      return __("Pings only");
    }
    return __("Closed");
  },
  filterBy: false
};
var discussion_default = discussionField;
export {
  discussion_default as default
};
//# sourceMappingURL=index.mjs.map
