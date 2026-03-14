// packages/editor/src/components/revision-created-panel/index.js
import { __experimentalText as Text } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { humanTimeDiff } from "@wordpress/date";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
function RevisionCreatedPanel() {
  const date = useSelect((select) => {
    const { getCurrentRevision } = unlock(select(editorStore));
    return getCurrentRevision()?.date;
  }, []);
  if (!date) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "editor-post-last-edited-panel", children: /* @__PURE__ */ jsx(Text, { children: sprintf(
    // translators: %s: Human-readable time difference, e.g. "2 days ago".
    __("Created %s."),
    humanTimeDiff(date)
  ) }) });
}
export {
  RevisionCreatedPanel as default
};
//# sourceMappingURL=index.mjs.map
