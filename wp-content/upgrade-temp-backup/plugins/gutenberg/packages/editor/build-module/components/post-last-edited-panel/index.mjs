// packages/editor/src/components/post-last-edited-panel/index.js
import { __experimentalText as Text } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { humanTimeDiff } from "@wordpress/date";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function PostLastEditedPanel() {
  const modified = useSelect(
    (select) => select(editorStore).getEditedPostAttribute("modified"),
    []
  );
  if (!modified) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "editor-post-last-edited-panel", children: /* @__PURE__ */ jsx(Text, { children: sprintf(
    // translators: %s: Human-readable time difference, e.g. "2 days ago".
    __("Last edited %s."),
    humanTimeDiff(modified)
  ) }) });
}
export {
  PostLastEditedPanel as default
};
//# sourceMappingURL=index.mjs.map
