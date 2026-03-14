// packages/editor/src/components/revision-author-panel/index.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { decodeEntities } from "@wordpress/html-entities";
import { __ } from "@wordpress/i18n";
import PostPanelRow from "../post-panel-row/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
function RevisionAuthorPanel() {
  const authorName = useSelect((select) => {
    const { getCurrentRevision } = unlock(select(editorStore));
    const revision = getCurrentRevision();
    if (!revision?.author) {
      return null;
    }
    const author = select(coreStore).getUser(revision.author);
    return author?.name;
  }, []);
  if (!authorName) {
    return null;
  }
  return /* @__PURE__ */ jsx(PostPanelRow, { label: __("Author"), children: decodeEntities(authorName) });
}
export {
  RevisionAuthorPanel as default
};
//# sourceMappingURL=index.mjs.map
