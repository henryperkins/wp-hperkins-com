// packages/editor/src/components/post-last-revision/index.js
import { sprintf, __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { backup } from "@wordpress/icons";
import PostLastRevisionCheck from "./check.mjs";
import PostPanelRow from "../post-panel-row/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
function usePostLastRevisionInfo() {
  return useSelect((select) => {
    const { getCurrentPostLastRevisionId, getCurrentPostRevisionsCount } = select(editorStore);
    return {
      lastRevisionId: getCurrentPostLastRevisionId(),
      revisionsCount: getCurrentPostRevisionsCount()
    };
  }, []);
}
function PostLastRevision() {
  const { lastRevisionId, revisionsCount } = usePostLastRevisionInfo();
  const { setCurrentRevisionId } = unlock(useDispatch(editorStore));
  return /* @__PURE__ */ jsx(PostLastRevisionCheck, { children: /* @__PURE__ */ jsx(
    Button,
    {
      __next40pxDefaultSize: true,
      onClick: () => setCurrentRevisionId(lastRevisionId),
      className: "editor-post-last-revision__title",
      icon: backup,
      iconPosition: "right",
      text: sprintf(
        /* translators: %s: number of revisions. */
        __("Revisions (%s)"),
        revisionsCount
      )
    }
  ) });
}
function PrivatePostLastRevision() {
  const { lastRevisionId, revisionsCount } = usePostLastRevisionInfo();
  const { setCurrentRevisionId } = unlock(useDispatch(editorStore));
  return /* @__PURE__ */ jsx(PostLastRevisionCheck, { children: /* @__PURE__ */ jsx(PostPanelRow, { label: __("Revisions"), children: /* @__PURE__ */ jsx(
    Button,
    {
      onClick: () => setCurrentRevisionId(lastRevisionId),
      className: "editor-private-post-last-revision__button",
      text: revisionsCount,
      variant: "tertiary",
      size: "compact"
    }
  ) }) });
}
var post_last_revision_default = PostLastRevision;
export {
  PrivatePostLastRevision,
  post_last_revision_default as default
};
//# sourceMappingURL=index.mjs.map
