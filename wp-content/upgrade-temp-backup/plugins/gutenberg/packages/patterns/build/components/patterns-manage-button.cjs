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

// packages/patterns/src/components/patterns-manage-button.js
var patterns_manage_button_exports = {};
__export(patterns_manage_button_exports, {
  default: () => patterns_manage_button_default
});
module.exports = __toCommonJS(patterns_manage_button_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_url = require("@wordpress/url");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../store/index.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PatternsManageButton({ clientId, onClose }) {
  const {
    attributes,
    canDetach,
    isVisible,
    managePatternsUrl,
    isSyncedPattern,
    isUnsyncedPattern,
    canEdit
  } = (0, import_data.useSelect)(
    (select) => {
      const { canRemoveBlock, getBlock, canEditBlock } = select(import_block_editor.store);
      const { canUser } = select(import_core_data.store);
      const block = getBlock(clientId);
      const _isUnsyncedPattern = !!block?.attributes?.metadata?.patternName;
      const _isSyncedPattern = !!block && (0, import_blocks.isReusableBlock)(block) && !!canUser("update", {
        kind: "postType",
        name: "wp_block",
        id: block.attributes.ref
      });
      return {
        attributes: block.attributes,
        canEdit: canEditBlock(clientId),
        // For unsynced patterns, detaching is simply removing the `patternName` attribute.
        // For synced patterns, the `core:block` block is replaced with its inner blocks,
        // so checking whether `canRemoveBlock` is possible is required.
        canDetach: _isUnsyncedPattern || _isSyncedPattern && canRemoveBlock(clientId),
        isUnsyncedPattern: _isUnsyncedPattern,
        isSyncedPattern: _isSyncedPattern,
        isVisible: _isUnsyncedPattern || _isSyncedPattern,
        // The site editor and templates both check whether the user
        // has edit_theme_options capabilities. We can leverage that here
        // and omit the manage patterns link if the user can't access it.
        managePatternsUrl: canUser("create", {
          kind: "postType",
          name: "wp_template"
        }) ? (0, import_url.addQueryArgs)("site-editor.php", {
          p: "/pattern"
        }) : (0, import_url.addQueryArgs)("edit.php", {
          post_type: "wp_block"
        })
      };
    },
    [clientId]
  );
  const { updateBlockAttributes } = (0, import_data.useDispatch)(import_block_editor.store);
  const { convertSyncedPatternToStatic } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_store.store)
  );
  if (!isVisible || !canEdit) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    canDetach && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.MenuItem,
      {
        onClick: () => {
          if (isSyncedPattern) {
            convertSyncedPatternToStatic(clientId);
          }
          if (isUnsyncedPattern) {
            const {
              patternName,
              ...attributesWithoutPatternName
            } = attributes?.metadata ?? {};
            updateBlockAttributes(clientId, {
              metadata: attributesWithoutPatternName
            });
          }
          onClose?.();
        },
        children: isSyncedPattern ? (0, import_i18n.__)("Disconnect pattern") : (0, import_i18n.__)("Detach pattern")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuItem, { href: managePatternsUrl, children: (0, import_i18n.__)("Manage patterns") })
  ] });
}
var patterns_manage_button_default = PatternsManageButton;
//# sourceMappingURL=patterns-manage-button.cjs.map
