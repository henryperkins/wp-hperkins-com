// packages/edit-widgets/src/store/actions.js
import { __, sprintf } from "@wordpress/i18n";
import { store as noticesStore } from "@wordpress/notices";
import { store as interfaceStore } from "@wordpress/interface";
import { getWidgetIdFromBlock } from "@wordpress/widgets";
import { store as coreStore } from "@wordpress/core-data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { transformBlockToWidget } from "./transformers.mjs";
import {
  buildWidgetAreaPostId,
  buildWidgetAreasQuery,
  createStubPost,
  KIND,
  POST_TYPE,
  WIDGET_AREA_ENTITY_TYPE
} from "./utils.mjs";
import { STORE_NAME as editWidgetsStoreName } from "./constants.mjs";
var persistStubPost = (id, blocks) => ({ registry }) => {
  const stubPost = createStubPost(id, blocks);
  registry.dispatch(coreStore).receiveEntityRecords(
    KIND,
    POST_TYPE,
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
    registry.dispatch(noticesStore).createSuccessNotice(__("Widgets saved."), {
      type: "snackbar"
    });
  } catch (e) {
    registry.dispatch(noticesStore).createErrorNotice(
      /* translators: %s: The error message. */
      sprintf(__("There was an error. %s"), e.message),
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
    await registry.dispatch(coreStore).finishResolution(
      "getEntityRecord",
      KIND,
      WIDGET_AREA_ENTITY_TYPE,
      buildWidgetAreasQuery()
    );
  }
};
var saveWidgetArea = (widgetAreaId) => async ({ dispatch, select, registry }) => {
  const widgets = select.getWidgets();
  const post = registry.select(coreStore).getEditedEntityRecord(
    KIND,
    POST_TYPE,
    buildWidgetAreaPostId(widgetAreaId)
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
    const widgetId = getWidgetIdFromBlock(block);
    const oldWidget = widgets[widgetId];
    const widget = transformBlockToWidget(block, oldWidget);
    sidebarWidgetsIds.push(widgetId);
    if (oldWidget) {
      registry.dispatch(coreStore).editEntityRecord(
        "root",
        "widget",
        widgetId,
        {
          ...widget,
          sidebar: widgetAreaId
        },
        { undoIgnore: true }
      );
      const hasEdits = registry.select(coreStore).hasEditsForEntityRecord("root", "widget", widgetId);
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
  const records = await registry.dispatch(coreStore).__experimentalBatch(batchTasks);
  const preservedRecords = records.filter(
    (record) => !record.hasOwnProperty("deleted")
  );
  const failedWidgetNames = [];
  for (let i = 0; i < preservedRecords.length; i++) {
    const widget = preservedRecords[i];
    const { block, position } = batchMeta[i];
    post.blocks[position].attributes.__internalWidgetId = widget.id;
    const error = registry.select(coreStore).getLastEntitySaveError("root", "widget", widget.id);
    if (error) {
      failedWidgetNames.push(block.attributes?.name || block?.name);
    }
    if (!sidebarWidgetsIds[position]) {
      sidebarWidgetsIds[position] = widget.id;
    }
  }
  if (failedWidgetNames.length) {
    throw new Error(
      sprintf(
        /* translators: %s: List of widget names */
        __("Could not save the following widgets: %s."),
        failedWidgetNames.join(", ")
      )
    );
  }
  registry.dispatch(coreStore).editEntityRecord(
    KIND,
    WIDGET_AREA_ENTITY_TYPE,
    widgetAreaId,
    {
      widgets: sidebarWidgetsIds
    },
    { undoIgnore: true }
  );
  dispatch(trySaveWidgetArea(widgetAreaId));
  registry.dispatch(coreStore).receiveEntityRecords(KIND, POST_TYPE, post, void 0);
};
var trySaveWidgetArea = (widgetAreaId) => ({ registry }) => {
  registry.dispatch(coreStore).saveEditedEntityRecord(
    KIND,
    WIDGET_AREA_ENTITY_TYPE,
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
  registry.dispatch(interfaceStore).disableComplementaryArea(editWidgetsStoreName);
};
var moveBlockToWidgetArea = (clientId, widgetAreaId) => async ({ dispatch, select, registry }) => {
  const sourceRootClientId = registry.select(blockEditorStore).getBlockRootClientId(clientId);
  const widgetAreas = registry.select(blockEditorStore).getBlocks();
  const destinationWidgetAreaBlock = widgetAreas.find(
    ({ attributes }) => attributes.id === widgetAreaId
  );
  const destinationRootClientId = destinationWidgetAreaBlock.clientId;
  const destinationInnerBlocksClientIds = registry.select(blockEditorStore).getBlockOrder(destinationRootClientId);
  const destinationIndex = destinationInnerBlocksClientIds.length;
  const isDestinationWidgetAreaOpen = select.getIsWidgetAreaOpen(
    destinationRootClientId
  );
  if (!isDestinationWidgetAreaOpen) {
    dispatch.setIsWidgetAreaOpen(destinationRootClientId, true);
  }
  registry.dispatch(blockEditorStore).moveBlocksToPosition(
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
export {
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
};
//# sourceMappingURL=actions.mjs.map
