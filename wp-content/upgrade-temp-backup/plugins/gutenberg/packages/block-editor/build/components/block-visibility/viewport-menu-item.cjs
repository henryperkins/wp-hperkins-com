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

// packages/block-editor/src/components/block-visibility/viewport-menu-item.js
var viewport_menu_item_exports = {};
__export(viewport_menu_item_exports, {
  default: () => BlockVisibilityViewportMenuItem
});
module.exports = __toCommonJS(viewport_menu_item_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function BlockVisibilityViewportMenuItem({ clientIds }) {
  const { areBlocksHiddenAnywhere, shortcut } = (0, import_data.useSelect)(
    (select) => {
      const { isBlockHiddenAnywhere } = (0, import_lock_unlock.unlock)(
        select(import_store.store)
      );
      return {
        areBlocksHiddenAnywhere: clientIds?.every(
          (clientId) => isBlockHiddenAnywhere(clientId)
        ),
        shortcut: select(
          import_keyboard_shortcuts.store
        ).getShortcutRepresentation(
          "core/block-editor/toggle-block-visibility"
        )
      };
    },
    [clientIds]
  );
  const { showViewportModal } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.MenuItem,
    {
      onClick: () => showViewportModal(clientIds),
      shortcut,
      children: areBlocksHiddenAnywhere ? (0, import_i18n.__)("Show") : (0, import_i18n.__)("Hide")
    }
  );
}
//# sourceMappingURL=viewport-menu-item.cjs.map
