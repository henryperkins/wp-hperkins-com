// packages/block-editor/src/components/block-visibility/viewport-menu-item.js
import { __ } from "@wordpress/i18n";
import { MenuItem } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as keyboardShortcutsStore } from "@wordpress/keyboard-shortcuts";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
function BlockVisibilityViewportMenuItem({ clientIds }) {
  const { areBlocksHiddenAnywhere, shortcut } = useSelect(
    (select) => {
      const { isBlockHiddenAnywhere } = unlock(
        select(blockEditorStore)
      );
      return {
        areBlocksHiddenAnywhere: clientIds?.every(
          (clientId) => isBlockHiddenAnywhere(clientId)
        ),
        shortcut: select(
          keyboardShortcutsStore
        ).getShortcutRepresentation(
          "core/block-editor/toggle-block-visibility"
        )
      };
    },
    [clientIds]
  );
  const { showViewportModal } = unlock(useDispatch(blockEditorStore));
  return /* @__PURE__ */ jsx(
    MenuItem,
    {
      onClick: () => showViewportModal(clientIds),
      shortcut,
      children: areBlocksHiddenAnywhere ? __("Show") : __("Hide")
    }
  );
}
export {
  BlockVisibilityViewportMenuItem as default
};
//# sourceMappingURL=viewport-menu-item.mjs.map
