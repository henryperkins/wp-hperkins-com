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

// packages/editor/src/components/template-content-panel/index.js
var template_content_panel_exports = {};
__export(template_content_panel_exports, {
  default: () => TemplateContentPanel
});
module.exports = __toCommonJS(template_content_panel_exports);
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_interface = require("@wordpress/interface");
var import_hooks = require("@wordpress/hooks");
var import_element = require("@wordpress/element");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_constants = require("../../store/constants.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { BlockQuickNavigation } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var POST_CONTENT_BLOCK_TYPES = [
  "core/post-title",
  "core/post-featured-image",
  "core/post-content"
];
var TEMPLATE_PART_BLOCK = "core/template-part";
function TemplateContentPanel() {
  const postContentBlockTypes = (0, import_element.useMemo)(
    () => (0, import_hooks.applyFilters)(
      "editor.postContentBlockTypes",
      POST_CONTENT_BLOCK_TYPES
    ),
    []
  );
  const { clientIds, postType, renderingMode } = (0, import_data.useSelect)(
    (select) => {
      const {
        getCurrentPostType,
        getPostBlocksByName,
        getRenderingMode
      } = (0, import_lock_unlock.unlock)(select(import_store.store));
      const _postType = getCurrentPostType();
      return {
        postType: _postType,
        clientIds: getPostBlocksByName(
          import_constants.TEMPLATE_POST_TYPE === _postType ? TEMPLATE_PART_BLOCK : postContentBlockTypes
        ),
        renderingMode: getRenderingMode()
      };
    },
    [postContentBlockTypes]
  );
  const { enableComplementaryArea } = (0, import_data.useDispatch)(import_interface.store);
  if (renderingMode === "post-only" && postType !== import_constants.TEMPLATE_POST_TYPE || clientIds.length === 0) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.PanelBody, { title: (0, import_i18n.__)("Content"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    BlockQuickNavigation,
    {
      clientIds,
      onSelect: () => {
        enableComplementaryArea("core", "edit-post/document");
      }
    }
  ) });
}
//# sourceMappingURL=index.cjs.map
