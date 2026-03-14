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

// packages/edit-widgets/src/hooks/use-last-selected-widget-area.js
var use_last_selected_widget_area_exports = {};
__export(use_last_selected_widget_area_exports, {
  default: () => use_last_selected_widget_area_default
});
module.exports = __toCommonJS(use_last_selected_widget_area_exports);
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../store/index.cjs");
var import_utils = require("../store/utils.cjs");
var useLastSelectedWidgetArea = () => (0, import_data.useSelect)((select) => {
  const { getBlockSelectionEnd, getBlockName } = select(import_block_editor.store);
  const selectionEndClientId = getBlockSelectionEnd();
  if (getBlockName(selectionEndClientId) === "core/widget-area") {
    return selectionEndClientId;
  }
  const { getParentWidgetAreaBlock } = select(import_store.store);
  const widgetAreaBlock = getParentWidgetAreaBlock(selectionEndClientId);
  const widgetAreaBlockClientId = widgetAreaBlock?.clientId;
  if (widgetAreaBlockClientId) {
    return widgetAreaBlockClientId;
  }
  const { getEntityRecord } = select(import_core_data.store);
  const widgetAreasPost = getEntityRecord(
    import_utils.KIND,
    import_utils.POST_TYPE,
    (0, import_utils.buildWidgetAreasPostId)()
  );
  return widgetAreasPost?.blocks[0]?.clientId;
}, []);
var use_last_selected_widget_area_default = useLastSelectedWidgetArea;
//# sourceMappingURL=use-last-selected-widget-area.cjs.map
