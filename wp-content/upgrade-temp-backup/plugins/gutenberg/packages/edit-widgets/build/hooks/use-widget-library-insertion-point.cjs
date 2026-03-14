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

// packages/edit-widgets/src/hooks/use-widget-library-insertion-point.js
var use_widget_library_insertion_point_exports = {};
__export(use_widget_library_insertion_point_exports, {
  default: () => use_widget_library_insertion_point_default
});
module.exports = __toCommonJS(use_widget_library_insertion_point_exports);
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../store/index.cjs");
var import_utils = require("../store/utils.cjs");
var useWidgetLibraryInsertionPoint = () => {
  const firstRootId = (0, import_data.useSelect)((select) => {
    const { getEntityRecord } = select(import_core_data.store);
    const widgetAreasPost = getEntityRecord(
      import_utils.KIND,
      import_utils.POST_TYPE,
      (0, import_utils.buildWidgetAreasPostId)()
    );
    return widgetAreasPost?.blocks[0]?.clientId;
  }, []);
  return (0, import_data.useSelect)(
    (select) => {
      const {
        getBlockRootClientId,
        getBlockSelectionEnd,
        getBlockOrder,
        getBlockIndex
      } = select(import_block_editor.store);
      const insertionPoint = select(import_store.store).__experimentalGetInsertionPoint();
      if (insertionPoint.rootClientId) {
        return insertionPoint;
      }
      const clientId = getBlockSelectionEnd() || firstRootId;
      const rootClientId = getBlockRootClientId(clientId);
      if (clientId && rootClientId === "") {
        return {
          rootClientId: clientId,
          insertionIndex: getBlockOrder(clientId).length
        };
      }
      return {
        rootClientId,
        insertionIndex: getBlockIndex(clientId) + 1
      };
    },
    [firstRootId]
  );
};
var use_widget_library_insertion_point_default = useWidgetLibraryInsertionPoint;
//# sourceMappingURL=use-widget-library-insertion-point.cjs.map
