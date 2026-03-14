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

// packages/patterns/src/components/overrides-panel.js
var overrides_panel_exports = {};
__export(overrides_panel_exports, {
  default: () => OverridesPanel
});
module.exports = __toCommonJS(overrides_panel_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_api = require("../api/index.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { BlockQuickNavigation } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function OverridesPanel() {
  const { allClientIds, supportedBlockTypesRaw } = (0, import_data.useSelect)(
    (select) => ({
      allClientIds: select(import_block_editor.store).getClientIdsWithDescendants(),
      supportedBlockTypesRaw: select(import_block_editor.store).getSettings()?.__experimentalBlockBindingsSupportedAttributes
    }),
    []
  );
  const { getBlock } = (0, import_data.useSelect)(import_block_editor.store);
  const clientIdsWithOverrides = (0, import_element.useMemo)(() => {
    const supportedBlockTypes = Object.keys(supportedBlockTypesRaw ?? {});
    return allClientIds.filter((clientId) => {
      const block = getBlock(clientId);
      return supportedBlockTypes.includes(block.name) && (0, import_api.isOverridableBlock)(block);
    });
  }, [allClientIds, getBlock, supportedBlockTypesRaw]);
  if (!clientIdsWithOverrides?.length) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.PanelBody, { title: (0, import_i18n.__)("Overrides"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockQuickNavigation, { clientIds: clientIdsWithOverrides }) });
}
//# sourceMappingURL=overrides-panel.cjs.map
