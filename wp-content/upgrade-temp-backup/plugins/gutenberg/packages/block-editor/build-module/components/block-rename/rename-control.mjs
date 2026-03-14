// packages/block-editor/src/components/block-rename/rename-control.js
import { MenuItem } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as keyboardShortcutsStore } from "@wordpress/keyboard-shortcuts";
import BlockRenameModal from "./modal.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function BlockRenameControl({ clientId }) {
  const [renamingBlock, setRenamingBlock] = useState(false);
  const shortcut = useSelect(
    (select) => select(keyboardShortcutsStore).getShortcutRepresentation(
      "core/block-editor/rename"
    ),
    []
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      MenuItem,
      {
        onClick: () => {
          setRenamingBlock(true);
        },
        "aria-expanded": renamingBlock,
        "aria-haspopup": "dialog",
        shortcut,
        children: __("Rename")
      }
    ),
    renamingBlock && /* @__PURE__ */ jsx(
      BlockRenameModal,
      {
        clientId,
        onClose: () => setRenamingBlock(false)
      }
    )
  ] });
}
export {
  BlockRenameControl as default
};
//# sourceMappingURL=rename-control.mjs.map
