// packages/editor/src/components/collab-sidebar/comment-menu-item.js
import { MenuItem } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
  privateApis as blockEditorPrivateApis,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { getUnregisteredTypeHandlerName } from "@wordpress/blocks";
import { store as keyboardShortcutsStore } from "@wordpress/keyboard-shortcuts";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { CommentIconSlotFill } = unlock(blockEditorPrivateApis);
var AddCommentMenuItem = ({ clientId, onClick, isDistractionFree }) => {
  const block = useSelect(
    (select) => {
      return select(blockEditorStore).getBlock(clientId);
    },
    [clientId]
  );
  const shortcut = useSelect(
    (select) => select(keyboardShortcutsStore).getShortcutRepresentation(
      "core/editor/new-note"
    ),
    []
  );
  if (!block?.isValid || block?.name === getUnregisteredTypeHandlerName()) {
    return null;
  }
  const isDisabled = isDistractionFree || block?.name === "core/freeform";
  let infoText;
  if (isDistractionFree) {
    infoText = __("Notes are disabled in distraction free mode.");
  } else if (block?.name === "core/freeform") {
    infoText = __("Convert to blocks to add notes.");
  }
  return /* @__PURE__ */ jsx(
    MenuItem,
    {
      onClick,
      "aria-haspopup": "dialog",
      disabled: isDisabled,
      info: infoText,
      shortcut,
      children: __("Add note")
    }
  );
};
var AddCommentMenuItemFill = ({ onClick, isDistractionFree }) => {
  return /* @__PURE__ */ jsx(CommentIconSlotFill.Fill, { children: ({ clientId, onClose }) => /* @__PURE__ */ jsx(
    AddCommentMenuItem,
    {
      clientId,
      isDistractionFree,
      onClick: () => {
        onClick(clientId);
        onClose();
      }
    }
  ) });
};
var comment_menu_item_default = AddCommentMenuItemFill;
export {
  comment_menu_item_default as default
};
//# sourceMappingURL=comment-menu-item.mjs.map
