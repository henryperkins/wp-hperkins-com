// packages/editor/src/components/post-sync-status/index.js
import { useSelect } from "@wordpress/data";
import { __, _x } from "@wordpress/i18n";
import PostPanelRow from "../post-panel-row/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function PostSyncStatus() {
  const { syncStatus, postType } = useSelect((select) => {
    const { getEditedPostAttribute } = select(editorStore);
    const meta = getEditedPostAttribute("meta");
    const currentSyncStatus = meta?.wp_pattern_sync_status === "unsynced" ? "unsynced" : getEditedPostAttribute("wp_pattern_sync_status");
    return {
      syncStatus: currentSyncStatus,
      postType: getEditedPostAttribute("type")
    };
  });
  if (postType !== "wp_block") {
    return null;
  }
  return /* @__PURE__ */ jsx(PostPanelRow, { label: __("Sync status"), children: /* @__PURE__ */ jsx("div", { className: "editor-post-sync-status__value", children: syncStatus === "unsynced" ? _x("Not synced", "pattern (singular)") : _x("Synced", "pattern (singular)") }) });
}
export {
  PostSyncStatus as default
};
//# sourceMappingURL=index.mjs.map
