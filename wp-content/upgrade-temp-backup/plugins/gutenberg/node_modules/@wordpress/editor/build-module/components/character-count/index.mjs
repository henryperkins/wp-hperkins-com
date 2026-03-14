// packages/editor/src/components/character-count/index.js
import { useSelect } from "@wordpress/data";
import { count as characterCount } from "@wordpress/wordcount";
import { store as editorStore } from "../../store/index.mjs";
function CharacterCount() {
  const content = useSelect(
    (select) => select(editorStore).getEditedPostAttribute("content"),
    []
  );
  return characterCount(content, "characters_including_spaces");
}
export {
  CharacterCount as default
};
//# sourceMappingURL=index.mjs.map
