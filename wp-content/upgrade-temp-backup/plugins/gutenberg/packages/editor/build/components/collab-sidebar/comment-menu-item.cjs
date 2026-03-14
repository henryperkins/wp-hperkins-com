"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/collab-sidebar/comment-menu-item.js
var comment_menu_item_exports = {};
__export(comment_menu_item_exports, {
  default: () => comment_menu_item_default
});
module.exports = __toCommonJS(comment_menu_item_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { CommentIconSlotFill } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var AddCommentMenuItem = ({ clientId, onClick, isDistractionFree }) => {
  const block = (0, import_data.useSelect)(
    (select) => {
      return select(import_block_editor.store).getBlock(clientId);
    },
    [clientId]
  );
  const shortcut = (0, import_data.useSelect)(
    (select) => select(import_keyboard_shortcuts.store).getShortcutRepresentation(
      "core/editor/new-note"
    ),
    []
  );
  if (!block?.isValid || block?.name === (0, import_blocks.getUnregisteredTypeHandlerName)()) {
    return null;
  }
  const isDisabled = isDistractionFree || block?.name === "core/freeform";
  let infoText;
  if (isDistractionFree) {
    infoText = (0, import_i18n.__)("Notes are disabled in distraction free mode.");
  } else if (block?.name === "core/freeform") {
    infoText = (0, import_i18n.__)("Convert to blocks to add notes.");
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.MenuItem,
    {
      onClick,
      "aria-haspopup": "dialog",
      disabled: isDisabled,
      info: infoText,
      shortcut,
      children: (0, import_i18n.__)("Add note")
    }
  );
};
var AddCommentMenuItemFill = ({ onClick, isDistractionFree }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentIconSlotFill.Fill, { children: ({ clientId, onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
//# sourceMappingURL=comment-menu-item.cjs.map
