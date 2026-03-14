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

// packages/edit-widgets/src/store/selectors.js
var selectors_exports = {};
__export(selectors_exports, {
  __experimentalGetInsertionPoint: () => __experimentalGetInsertionPoint,
  canInsertBlockInWidgetArea: () => canInsertBlockInWidgetArea,
  getEditedWidgetAreas: () => getEditedWidgetAreas,
  getIsWidgetAreaOpen: () => getIsWidgetAreaOpen,
  getParentWidgetAreaBlock: () => getParentWidgetAreaBlock,
  getReferenceWidgetBlocks: () => getReferenceWidgetBlocks,
  getWidget: () => getWidget,
  getWidgetAreaForWidgetId: () => getWidgetAreaForWidgetId,
  getWidgetAreas: () => getWidgetAreas,
  getWidgets: () => getWidgets,
  isInserterOpened: () => isInserterOpened,
  isListViewOpened: () => isListViewOpened,
  isSavingWidgetAreas: () => isSavingWidgetAreas,
  isWidgetSavingLocked: () => isWidgetSavingLocked
});
module.exports = __toCommonJS(selectors_exports);
var import_data = require("@wordpress/data");
var import_widgets = require("@wordpress/widgets");
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var import_utils = require("./utils.cjs");
var import_constants = require("./constants.cjs");
var EMPTY_INSERTION_POINT = {
  rootClientId: void 0,
  insertionIndex: void 0
};
var getWidgets = (0, import_data.createRegistrySelector)(
  (select) => (0, import_data.createSelector)(
    () => {
      const widgets = select(import_core_data.store).getEntityRecords(
        "root",
        "widget",
        (0, import_utils.buildWidgetsQuery)()
      );
      return (
        // Key widgets by their ID.
        widgets?.reduce(
          (allWidgets, widget) => ({
            ...allWidgets,
            [widget.id]: widget
          }),
          {}
        ) ?? {}
      );
    },
    () => [
      select(import_core_data.store).getEntityRecords(
        "root",
        "widget",
        (0, import_utils.buildWidgetsQuery)()
      )
    ]
  )
);
var getWidget = (0, import_data.createRegistrySelector)(
  (select) => (state, id) => {
    const widgets = select(import_constants.STORE_NAME).getWidgets();
    return widgets[id];
  }
);
var getWidgetAreas = (0, import_data.createRegistrySelector)((select) => () => {
  const query = (0, import_utils.buildWidgetAreasQuery)();
  return select(import_core_data.store).getEntityRecords(
    import_utils.KIND,
    import_utils.WIDGET_AREA_ENTITY_TYPE,
    query
  );
});
var getWidgetAreaForWidgetId = (0, import_data.createRegistrySelector)(
  (select) => (state, widgetId) => {
    const widgetAreas = select(import_constants.STORE_NAME).getWidgetAreas();
    return widgetAreas.find((widgetArea) => {
      const post = select(import_core_data.store).getEditedEntityRecord(
        import_utils.KIND,
        import_utils.POST_TYPE,
        (0, import_utils.buildWidgetAreaPostId)(widgetArea.id)
      );
      const blockWidgetIds = post.blocks.map(
        (block) => (0, import_widgets.getWidgetIdFromBlock)(block)
      );
      return blockWidgetIds.includes(widgetId);
    });
  }
);
var getParentWidgetAreaBlock = (0, import_data.createRegistrySelector)(
  (select) => (state, clientId) => {
    const { getBlock, getBlockName, getBlockParents } = select(import_block_editor.store);
    const blockParents = getBlockParents(clientId);
    const widgetAreaClientId = blockParents.find(
      (parentClientId) => getBlockName(parentClientId) === "core/widget-area"
    );
    return getBlock(widgetAreaClientId);
  }
);
var getEditedWidgetAreas = (0, import_data.createRegistrySelector)(
  (select) => (state, ids) => {
    let widgetAreas = select(import_constants.STORE_NAME).getWidgetAreas();
    if (!widgetAreas) {
      return [];
    }
    if (ids) {
      widgetAreas = widgetAreas.filter(
        ({ id }) => ids.includes(id)
      );
    }
    return widgetAreas.filter(
      ({ id }) => select(import_core_data.store).hasEditsForEntityRecord(
        import_utils.KIND,
        import_utils.POST_TYPE,
        (0, import_utils.buildWidgetAreaPostId)(id)
      )
    ).map(
      ({ id }) => select(import_core_data.store).getEditedEntityRecord(
        import_utils.KIND,
        import_utils.WIDGET_AREA_ENTITY_TYPE,
        id
      )
    );
  }
);
var getReferenceWidgetBlocks = (0, import_data.createRegistrySelector)(
  (select) => (state, referenceWidgetName = null) => {
    const results = [];
    const widgetAreas = select(import_constants.STORE_NAME).getWidgetAreas();
    for (const _widgetArea of widgetAreas) {
      const post = select(import_core_data.store).getEditedEntityRecord(
        import_utils.KIND,
        import_utils.POST_TYPE,
        (0, import_utils.buildWidgetAreaPostId)(_widgetArea.id)
      );
      for (const block of post.blocks) {
        if (block.name === "core/legacy-widget" && (!referenceWidgetName || block.attributes?.referenceWidgetName === referenceWidgetName)) {
          results.push(block);
        }
      }
    }
    return results;
  }
);
var isSavingWidgetAreas = (0, import_data.createRegistrySelector)((select) => () => {
  const widgetAreasIds = select(import_constants.STORE_NAME).getWidgetAreas()?.map(({ id }) => id);
  if (!widgetAreasIds) {
    return false;
  }
  for (const id of widgetAreasIds) {
    const isSaving = select(import_core_data.store).isSavingEntityRecord(
      import_utils.KIND,
      import_utils.WIDGET_AREA_ENTITY_TYPE,
      id
    );
    if (isSaving) {
      return true;
    }
  }
  const widgetIds = [
    ...Object.keys(select(import_constants.STORE_NAME).getWidgets()),
    void 0
    // account for new widgets without an ID
  ];
  for (const id of widgetIds) {
    const isSaving = select(import_core_data.store).isSavingEntityRecord(
      "root",
      "widget",
      id
    );
    if (isSaving) {
      return true;
    }
  }
  return false;
});
var getIsWidgetAreaOpen = (state, clientId) => {
  const { widgetAreasOpenState } = state;
  return !!widgetAreasOpenState[clientId];
};
function isInserterOpened(state) {
  return !!state.blockInserterPanel;
}
function __experimentalGetInsertionPoint(state) {
  if (typeof state.blockInserterPanel === "boolean") {
    return EMPTY_INSERTION_POINT;
  }
  return state.blockInserterPanel;
}
var canInsertBlockInWidgetArea = (0, import_data.createRegistrySelector)(
  (select) => (state, blockName) => {
    const widgetAreas = select(import_block_editor.store).getBlocks();
    const [firstWidgetArea] = widgetAreas;
    return select(import_block_editor.store).canInsertBlockType(
      blockName,
      firstWidgetArea.clientId
    );
  }
);
function isListViewOpened(state) {
  return state.listViewPanel;
}
function isWidgetSavingLocked(state) {
  return Object.keys(state.widgetSavingLock).length > 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __experimentalGetInsertionPoint,
  canInsertBlockInWidgetArea,
  getEditedWidgetAreas,
  getIsWidgetAreaOpen,
  getParentWidgetAreaBlock,
  getReferenceWidgetBlocks,
  getWidget,
  getWidgetAreaForWidgetId,
  getWidgetAreas,
  getWidgets,
  isInserterOpened,
  isListViewOpened,
  isSavingWidgetAreas,
  isWidgetSavingLocked
});
//# sourceMappingURL=selectors.cjs.map
