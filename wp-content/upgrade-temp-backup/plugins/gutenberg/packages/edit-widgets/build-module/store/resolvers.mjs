// packages/edit-widgets/src/store/resolvers.js
import { createBlock } from "@wordpress/blocks";
import { store as coreStore } from "@wordpress/core-data";
import { persistStubPost, setWidgetAreasOpenState } from "./actions.mjs";
import {
  KIND,
  WIDGET_AREA_ENTITY_TYPE,
  buildWidgetsQuery,
  buildWidgetAreasQuery,
  buildWidgetAreaPostId,
  buildWidgetAreasPostId
} from "./utils.mjs";
import { transformWidgetToBlock } from "./transformers.mjs";
var getWidgetAreas = () => async ({ dispatch, registry }) => {
  const query = buildWidgetAreasQuery();
  const widgetAreas = await registry.resolveSelect(coreStore).getEntityRecords(KIND, WIDGET_AREA_ENTITY_TYPE, query);
  const widgetAreaBlocks = [];
  const sortedWidgetAreas = widgetAreas.sort((a, b) => {
    if (a.id === "wp_inactive_widgets") {
      return 1;
    }
    if (b.id === "wp_inactive_widgets") {
      return -1;
    }
    return 0;
  });
  for (const widgetArea of sortedWidgetAreas) {
    widgetAreaBlocks.push(
      createBlock("core/widget-area", {
        id: widgetArea.id,
        name: widgetArea.name
      })
    );
    if (!widgetArea.widgets.length) {
      dispatch(
        persistStubPost(
          buildWidgetAreaPostId(widgetArea.id),
          []
        )
      );
    }
  }
  const widgetAreasOpenState = {};
  widgetAreaBlocks.forEach((widgetAreaBlock, index) => {
    widgetAreasOpenState[widgetAreaBlock.clientId] = index === 0;
  });
  dispatch(setWidgetAreasOpenState(widgetAreasOpenState));
  dispatch(
    persistStubPost(buildWidgetAreasPostId(), widgetAreaBlocks)
  );
};
var getWidgets = () => async ({ dispatch, registry }) => {
  const query = buildWidgetsQuery();
  const widgets = await registry.resolveSelect(coreStore).getEntityRecords("root", "widget", query);
  const groupedBySidebar = {};
  for (const widget of widgets) {
    const block = transformWidgetToBlock(widget);
    groupedBySidebar[widget.sidebar] = groupedBySidebar[widget.sidebar] || [];
    groupedBySidebar[widget.sidebar].push(block);
  }
  for (const sidebarId in groupedBySidebar) {
    if (groupedBySidebar.hasOwnProperty(sidebarId)) {
      dispatch(
        persistStubPost(
          buildWidgetAreaPostId(sidebarId),
          groupedBySidebar[sidebarId]
        )
      );
    }
  }
};
export {
  getWidgetAreas,
  getWidgets
};
//# sourceMappingURL=resolvers.mjs.map
