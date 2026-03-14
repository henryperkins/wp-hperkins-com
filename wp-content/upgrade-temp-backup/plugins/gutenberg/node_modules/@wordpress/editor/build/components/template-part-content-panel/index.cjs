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

// packages/editor/src/components/template-part-content-panel/index.js
var template_part_content_panel_exports = {};
__export(template_part_content_panel_exports, {
  default: () => TemplatePartContentPanel
});
module.exports = __toCommonJS(template_part_content_panel_exports);
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_blocks = require("@wordpress/blocks");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_constants = require("../../store/constants.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { BlockQuickNavigation } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function TemplatePartContentPanelInner() {
  const blockTypes = (0, import_data.useSelect)((select) => {
    const { getBlockTypes } = select(import_blocks.store);
    return getBlockTypes();
  }, []);
  const themeBlockNames = (0, import_element.useMemo)(() => {
    return blockTypes.filter((blockType) => {
      return blockType.category === "theme";
    }).map(({ name }) => name);
  }, [blockTypes]);
  const themeBlocks = (0, import_data.useSelect)(
    (select) => {
      const { getBlocksByName } = select(import_block_editor.store);
      return getBlocksByName(themeBlockNames);
    },
    [themeBlockNames]
  );
  if (themeBlocks.length === 0) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.PanelBody, { title: (0, import_i18n.__)("Content"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockQuickNavigation, { clientIds: themeBlocks }) });
}
function TemplatePartContentPanel() {
  const postType = (0, import_data.useSelect)((select) => {
    const { getCurrentPostType } = select(import_store.store);
    return getCurrentPostType();
  }, []);
  if (postType !== import_constants.TEMPLATE_PART_POST_TYPE) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemplatePartContentPanelInner, {});
}
//# sourceMappingURL=index.cjs.map
