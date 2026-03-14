// packages/editor/src/components/visual-editor/use-edit-content-only-section-exit.js
import { useSelect, useDispatch } from "@wordpress/data";
import { useRefEffect } from "@wordpress/compose";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { unlock } from "../../lock-unlock.mjs";
function useEditContentOnlySectionExit() {
  const { getEditedContentOnlySection } = unlock(
    useSelect(blockEditorStore)
  );
  const { stopEditingContentOnlySection } = unlock(
    useDispatch(blockEditorStore)
  );
  return useRefEffect(
    (node) => {
      function onClick(event) {
        const editedContentOnlySection = getEditedContentOnlySection();
        if (!editedContentOnlySection) {
          return;
        }
        const isClickOutside = !event.target.closest(
          `[data-block="${editedContentOnlySection}"]`
        );
        if (isClickOutside && !event.defaultPrevented) {
          event.preventDefault();
          stopEditingContentOnlySection();
        }
      }
      node.addEventListener("click", onClick);
      return () => {
        node.removeEventListener("click", onClick);
      };
    },
    [getEditedContentOnlySection, stopEditingContentOnlySection]
  );
}
export {
  useEditContentOnlySectionExit
};
//# sourceMappingURL=use-edit-content-only-section-exit.mjs.map
