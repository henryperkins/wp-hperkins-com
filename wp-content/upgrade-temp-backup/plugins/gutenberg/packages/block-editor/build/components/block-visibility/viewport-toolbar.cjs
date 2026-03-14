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

// packages/block-editor/src/components/block-visibility/viewport-toolbar.js
var viewport_toolbar_exports = {};
__export(viewport_toolbar_exports, {
  default: () => BlockVisibilityViewportToolbar
});
module.exports = __toCommonJS(viewport_toolbar_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_icons = require("@wordpress/icons");
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function BlockVisibilityViewportToolbar({ clientIds }) {
  const hasBlockVisibilityButtonShownRef = (0, import_element.useRef)(false);
  const { canToggleBlockVisibility, areBlocksHiddenAnywhere } = (0, import_data.useSelect)(
    (select) => {
      const { getBlocksByClientId, getBlockName, isBlockHiddenAnywhere } = (0, import_lock_unlock.unlock)(select(import_store.store));
      const _blocks = getBlocksByClientId(clientIds);
      return {
        canToggleBlockVisibility: _blocks.every(
          ({ clientId }) => (0, import_blocks.hasBlockSupport)(
            getBlockName(clientId),
            "visibility",
            true
          )
        ),
        areBlocksHiddenAnywhere: clientIds?.every(
          (clientId) => isBlockHiddenAnywhere(clientId)
        )
      };
    },
    [clientIds]
  );
  const blockEditorDispatch = (0, import_data.useDispatch)(import_store.store);
  (0, import_element.useEffect)(() => {
    if (areBlocksHiddenAnywhere) {
      hasBlockVisibilityButtonShownRef.current = true;
    }
  }, [areBlocksHiddenAnywhere]);
  if (!areBlocksHiddenAnywhere && !hasBlockVisibilityButtonShownRef.current) {
    return null;
  }
  const { showViewportModal } = (0, import_lock_unlock.unlock)(blockEditorDispatch);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarGroup, { className: "block-editor-block-visibility-toolbar", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ToolbarButton,
    {
      disabled: !canToggleBlockVisibility,
      icon: areBlocksHiddenAnywhere ? import_icons.unseen : import_icons.seen,
      label: areBlocksHiddenAnywhere ? (0, import_i18n.__)("Hidden") : (0, import_i18n.__)("Visible"),
      onClick: () => showViewportModal(clientIds),
      "aria-haspopup": "dialog"
    }
  ) });
}
//# sourceMappingURL=viewport-toolbar.cjs.map
