// packages/editor/src/components/word-count/index.js
import { useSelect } from "@wordpress/data";
import { _x } from "@wordpress/i18n";
import { count as wordCount } from "@wordpress/wordcount";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function WordCount() {
  const content = useSelect(
    (select) => select(editorStore).getEditedPostAttribute("content"),
    []
  );
  const wordCountType = _x("words", "Word count type. Do not translate!");
  return /* @__PURE__ */ jsx("span", { className: "word-count", children: wordCount(content, wordCountType) });
}
export {
  WordCount as default
};
//# sourceMappingURL=index.mjs.map
