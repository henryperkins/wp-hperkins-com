// packages/edit-widgets/src/store/selectors.js
import { createSelector, createRegistrySelector } from "@wordpress/data";
import { getWidgetIdFromBlock } from "@wordpress/widgets";
import { store as coreStore } from "@wordpress/core-data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import {
  buildWidgetsQuery,
  buildWidgetAreasQuery,
  buildWidgetAreaPostId,
  KIND,
  POST_TYPE,
  WIDGET_AREA_ENTITY_TYPE
} from "./utils.mjs";
import { STORE_NAME as editWidgetsStoreName } from "./constants.mjs";
var EMPTY_INSERTION_POINT = {
  rootClientId: void 0,
  insertionIndex: void 0
};
var getWidgets = createRegistrySelector(
  (select) => createSelector(
    () => {
      const widgets = select(coreStore).getEntityRecords(
        "root",
        "widget",
        buildWidgetsQuery()
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
      select(coreStore).getEntityRecords(
        "root",
        "widget",
        buildWidgetsQuery()
      )
    ]
  )
);
var getWidget = createRegistrySelector(
  (select) => (state, id) => {
    const widgets = select(editWidgetsStoreName).getWidgets();
    return widgets[id];
  }
);
var getWidgetAreas = createRegistrySelector((select) => () => {
  const query = buildWidgetAreasQuery();
  return select(coreStore).getEntityRecords(
    KIND,
    WIDGET_AREA_ENTITY_TYPE,
    query
  );
});
var getWidgetAreaForWidgetId = createRegistrySelector(
  (select) => (state, widgetId) => {
    const widgetAreas = select(editWidgetsStoreName).getWidgetAreas();
    return widgetAreas.find((widgetArea) => {
      const post = select(coreStore).getEditedEntityRecord(
        KIND,
        POST_TYPE,
        buildWidgetAreaPostId(widgetArea.id)
      );
      const blockWidgetIds = post.blocks.map(
        (block) => getWidgetIdFromBlock(block)
      );
      return blockWidgetIds.includes(widgetId);
    });
  }
);
var getParentWidgetAreaBlock = createRegistrySelector(
  (select) => (state, clientId) => {
    const { getBlock, getBlockName, getBlockParents } = select(blockEditorStore);
    const blockParents = getBlockParents(clientId);
    const widgetAreaClientId = blockParents.find(
      (parentClientId) => getBlockName(parentClientId) === "core/widget-area"
    );
    return getBlock(widgetAreaClientId);
  }
);
var getEditedWidgetAreas = createRegistrySelector(
  (select) => (state, ids) => {
    let widgetAreas = select(editWidgetsStoreName).getWidgetAreas();
    if (!widgetAreas) {
      return [];
    }
    if (ids) {
      widgetAreas = widgetAreas.filter(
        ({ id }) => ids.includes(id)
      );
    }
    return widgetAreas.filter(
      ({ id }) => select(coreStore).hasEditsForEntityRecord(
        KIND,
        POST_TYPE,
        buildWidgetAreaPostId(id)
      )
    ).map(
      ({ id }) => select(coreStore).getEditedEntityRecord(
        KIND,
        WIDGET_AREA_ENTITY_TYPE,
        id
      )
    );
  }
);
var getReferenceWidgetBlocks = createRegistrySelector(
  (select) => (state, referenceWidgetName = null) => {
    const results = [];
    const widgetAreas = select(editWidgetsStoreName).getWidgetAreas();
    for (const _widgetArea of widgetAreas) {
      const post = select(coreStore).getEditedEntityRecord(
        KIND,
        POST_TYPE,
        buildWidgetAreaPostId(_widgetArea.id)
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
var isSavingWidgetAreas = createRegistrySelector((select) => () => {
  const widgetAreasIds = select(editWidgetsStoreName).getWidgetAreas()?.map(({ id }) => id);
  if (!widgetAreasIds) {
    return false;
  }
  for (const id of widgetAreasIds) {
    const isSaving = select(coreStore).isSavingEntityRecord(
      KIND,
      WIDGET_AREA_ENTITY_TYPE,
      id
    );
    if (isSaving) {
      return true;
    }
  }
  const widgetIds = [
    ...Object.keys(select(editWidgetsStoreName).getWidgets()),
    void 0
    // account for new widgets without an ID
  ];
  for (const id of widgetIds) {
    const isSaving = select(coreStore).isSavingEntityRecord(
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
var canInsertBlockInWidgetArea = createRegistrySelector(
  (select) => (state, blockName) => {
    const widgetAreas = select(blockEditorStore).getBlocks();
    const [firstWidgetArea] = widgetAreas;
    return select(blockEditorStore).canInsertBlockType(
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
export {
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
};
//# sourceMappingURL=selectors.mjs.map
