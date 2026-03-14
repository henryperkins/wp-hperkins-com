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

// packages/edit-widgets/src/store/actions.js
var actions_exports = {};
__export(actions_exports, {
  closeGeneralSidebar: () => closeGeneralSidebar,
  lockWidgetSaving: () => lockWidgetSaving,
  moveBlockToWidgetArea: () => moveBlockToWidgetArea,
  persistStubPost: () => persistStubPost,
  saveEditedWidgetAreas: () => saveEditedWidgetAreas,
  saveWidgetArea: () => saveWidgetArea,
  saveWidgetAreas: () => saveWidgetAreas,
  setIsInserterOpened: () => setIsInserterOpened,
  setIsListViewOpened: () => setIsListViewOpened,
  setIsWidgetAreaOpen: () => setIsWidgetAreaOpen,
  setWidgetAreasOpenState: () => setWidgetAreasOpenState,
  setWidgetIdForClientId: () => setWidgetIdForClientId,
  unlockWidgetSaving: () => unlockWidgetSaving
});
module.exports = __toCommonJS(actions_exports);
var import_i18n = require("@wordpress/i18n");
var import_notices = require("@wordpress/notices");
var import_interface = require("@wordpress/interface");
var import_widgets = require("@wordpress/widgets");
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var import_transformers = require("./transformers.cjs");
var import_utils = require("./utils.cjs");
var import_constants = require("./constants.cjs");
var persistStubPost = (id, blocks) => ({ registry }) => {
  const stubPost = (0, import_utils.createStubPost)(id, blocks);
  registry.dispatch(import_core_data.store).receiveEntityRecords(
    import_utils.KIND,
    import_utils.POST_TYPE,
    stubPost,
    { id: stubPost.id },
    false
  );
  return stubPost;
};
var saveEditedWidgetAreas = () => async ({ select, dispatch, registry }) => {
  const editedWidgetAreas = select.getEditedWidgetAreas();
  if (!editedWidgetAreas?.length) {
    return;
  }
  try {
    await dispatch.saveWidgetAreas(editedWidgetAreas);
    registry.dispatch(import_notices.store).createSuccessNotice((0, import_i18n.__)("Widgets saved."), {
      type: "snackbar"
    });
  } catch (e) {
    registry.dispatch(import_notices.store).createErrorNotice(
      /* translators: %s: The error message. */
      (0, import_i18n.sprintf)((0, import_i18n.__)("There was an error. %s"), e.message),
      {
        type: "snackbar"
      }
    );
  }
};
var saveWidgetAreas = (widgetAreas) => async ({ dispatch, registry }) => {
  try {
    for (const widgetArea of widgetAreas) {
      await dispatch.saveWidgetArea(widgetArea.id);
    }
  } finally {
    await registry.dispatch(import_core_data.store).finishResolution(
      "getEntityRecord",
      import_utils.KIND,
      import_utils.WIDGET_AREA_ENTITY_TYPE,
      (0, import_utils.buildWidgetAreasQuery)()
    );
  }
};
var saveWidgetArea = (widgetAreaId) => async ({ dispatch, select, registry }) => {
  const widgets = select.getWidgets();
  const post = registry.select(import_core_data.store).getEditedEntityRecord(
    import_utils.KIND,
    import_utils.POST_TYPE,
    (0, import_utils.buildWidgetAreaPostId)(widgetAreaId)
  );
  const areaWidgets = Object.values(widgets).filter(
    ({ sidebar }) => sidebar === widgetAreaId
  );
  const usedReferenceWidgets = [];
  const widgetsBlocks = post.blocks.filter((block) => {
    const { id } = block.attributes;
    if (block.name === "core/legacy-widget" && id) {
      if (usedReferenceWidgets.includes(id)) {
        return false;
      }
      usedReferenceWidgets.push(id);
    }
    return true;
  });
  const deletedWidgets = [];
  for (const widget of areaWidgets) {
    const widgetsNewArea = select.getWidgetAreaForWidgetId(widget.id);
    if (!widgetsNewArea) {
      deletedWidgets.push(widget);
    }
  }
  const batchMeta = [];
  const batchTasks = [];
  const sidebarWidgetsIds = [];
  for (let i = 0; i < widgetsBlocks.length; i++) {
    const block = widgetsBlocks[i];
    const widgetId = (0, import_widgets.getWidgetIdFromBlock)(block);
    const oldWidget = widgets[widgetId];
    const widget = (0, import_transformers.transformBlockToWidget)(block, oldWidget);
    sidebarWidgetsIds.push(widgetId);
    if (oldWidget) {
      registry.dispatch(import_core_data.store).editEntityRecord(
        "root",
        "widget",
        widgetId,
        {
          ...widget,
          sidebar: widgetAreaId
        },
        { undoIgnore: true }
      );
      const hasEdits = registry.select(import_core_data.store).hasEditsForEntityRecord("root", "widget", widgetId);
      if (!hasEdits) {
        continue;
      }
      batchTasks.push(
        ({ saveEditedEntityRecord }) => saveEditedEntityRecord("root", "widget", widgetId)
      );
    } else {
      batchTasks.push(
        ({ saveEntityRecord }) => saveEntityRecord("root", "widget", {
          ...widget,
          sidebar: widgetAreaId
        })
      );
    }
    batchMeta.push({
      block,
      position: i,
      clientId: block.clientId
    });
  }
  for (const widget of deletedWidgets) {
    batchTasks.push(
      ({ deleteEntityRecord }) => deleteEntityRecord("root", "widget", widget.id, {
        force: true
      })
    );
  }
  const records = await registry.dispatch(import_core_data.store).__experimentalBatch(batchTasks);
  const preservedRecords = records.filter(
    (record) => !record.hasOwnProperty("deleted")
  );
  const failedWidgetNames = [];
  for (let i = 0; i < preservedRecords.length; i++) {
    const widget = preservedRecords[i];
    const { block, position } = batchMeta[i];
    post.blocks[position].attributes.__internalWidgetId = widget.id;
    const error = registry.select(import_core_data.store).getLastEntitySaveError("root", "widget", widget.id);
    if (error) {
      failedWidgetNames.push(block.attributes?.name || block?.name);
    }
    if (!sidebarWidgetsIds[position]) {
      sidebarWidgetsIds[position] = widget.id;
    }
  }
  if (failedWidgetNames.length) {
    throw new Error(
      (0, import_i18n.sprintf)(
        /* translators: %s: List of widget names */
        (0, import_i18n.__)("Could not save the following widgets: %s."),
        failedWidgetNames.join(", ")
      )
    );
  }
  registry.dispatch(import_core_data.store).editEntityRecord(
    import_utils.KIND,
    import_utils.WIDGET_AREA_ENTITY_TYPE,
    widgetAreaId,
    {
      widgets: sidebarWidgetsIds
    },
    { undoIgnore: true }
  );
  dispatch(trySaveWidgetArea(widgetAreaId));
  registry.dispatch(import_core_data.store).receiveEntityRecords(import_utils.KIND, import_utils.POST_TYPE, post, void 0);
};
var trySaveWidgetArea = (widgetAreaId) => ({ registry }) => {
  registry.dispatch(import_core_data.store).saveEditedEntityRecord(
    import_utils.KIND,
    import_utils.WIDGET_AREA_ENTITY_TYPE,
    widgetAreaId,
    {
      throwOnError: true
    }
  );
};
function setWidgetIdForClientId(clientId, widgetId) {
  return {
    type: "SET_WIDGET_ID_FOR_CLIENT_ID",
    clientId,
    widgetId
  };
}
function setWidgetAreasOpenState(widgetAreasOpenState) {
  return {
    type: "SET_WIDGET_AREAS_OPEN_STATE",
    widgetAreasOpenState
  };
}
function setIsWidgetAreaOpen(clientId, isOpen) {
  return {
    type: "SET_IS_WIDGET_AREA_OPEN",
    clientId,
    isOpen
  };
}
function setIsInserterOpened(value) {
  return {
    type: "SET_IS_INSERTER_OPENED",
    value
  };
}
function setIsListViewOpened(isOpen) {
  return {
    type: "SET_IS_LIST_VIEW_OPENED",
    isOpen
  };
}
var closeGeneralSidebar = () => ({ registry }) => {
  registry.dispatch(import_interface.store).disableComplementaryArea(import_constants.STORE_NAME);
};
var moveBlockToWidgetArea = (clientId, widgetAreaId) => async ({ dispatch, select, registry }) => {
  const sourceRootClientId = registry.select(import_block_editor.store).getBlockRootClientId(clientId);
  const widgetAreas = registry.select(import_block_editor.store).getBlocks();
  const destinationWidgetAreaBlock = widgetAreas.find(
    ({ attributes }) => attributes.id === widgetAreaId
  );
  const destinationRootClientId = destinationWidgetAreaBlock.clientId;
  const destinationInnerBlocksClientIds = registry.select(import_block_editor.store).getBlockOrder(destinationRootClientId);
  const destinationIndex = destinationInnerBlocksClientIds.length;
  const isDestinationWidgetAreaOpen = select.getIsWidgetAreaOpen(
    destinationRootClientId
  );
  if (!isDestinationWidgetAreaOpen) {
    dispatch.setIsWidgetAreaOpen(destinationRootClientId, true);
  }
  registry.dispatch(import_block_editor.store).moveBlocksToPosition(
    [clientId],
    sourceRootClientId,
    destinationRootClientId,
    destinationIndex
  );
};
function unlockWidgetSaving(lockName) {
  return {
    type: "UNLOCK_WIDGET_SAVING",
    lockName
  };
}
function lockWidgetSaving(lockName) {
  return {
    type: "LOCK_WIDGET_SAVING",
    lockName
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  closeGeneralSidebar,
  lockWidgetSaving,
  moveBlockToWidgetArea,
  persistStubPost,
  saveEditedWidgetAreas,
  saveWidgetArea,
  saveWidgetAreas,
  setIsInserterOpened,
  setIsListViewOpened,
  setIsWidgetAreaOpen,
  setWidgetAreasOpenState,
  setWidgetIdForClientId,
  unlockWidgetSaving
});
//# sourceMappingURL=actions.cjs.map
