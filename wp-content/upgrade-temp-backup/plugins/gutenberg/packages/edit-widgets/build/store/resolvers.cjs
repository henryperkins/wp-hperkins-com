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

// packages/edit-widgets/src/store/resolvers.js
var resolvers_exports = {};
__export(resolvers_exports, {
  getWidgetAreas: () => getWidgetAreas,
  getWidgets: () => getWidgets
});
module.exports = __toCommonJS(resolvers_exports);
var import_blocks = require("@wordpress/blocks");
var import_core_data = require("@wordpress/core-data");
var import_actions = require("./actions.cjs");
var import_utils = require("./utils.cjs");
var import_transformers = require("./transformers.cjs");
var getWidgetAreas = () => async ({ dispatch, registry }) => {
  const query = (0, import_utils.buildWidgetAreasQuery)();
  const widgetAreas = await registry.resolveSelect(import_core_data.store).getEntityRecords(import_utils.KIND, import_utils.WIDGET_AREA_ENTITY_TYPE, query);
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
      (0, import_blocks.createBlock)("core/widget-area", {
        id: widgetArea.id,
        name: widgetArea.name
      })
    );
    if (!widgetArea.widgets.length) {
      dispatch(
        (0, import_actions.persistStubPost)(
          (0, import_utils.buildWidgetAreaPostId)(widgetArea.id),
          []
        )
      );
    }
  }
  const widgetAreasOpenState = {};
  widgetAreaBlocks.forEach((widgetAreaBlock, index) => {
    widgetAreasOpenState[widgetAreaBlock.clientId] = index === 0;
  });
  dispatch((0, import_actions.setWidgetAreasOpenState)(widgetAreasOpenState));
  dispatch(
    (0, import_actions.persistStubPost)((0, import_utils.buildWidgetAreasPostId)(), widgetAreaBlocks)
  );
};
var getWidgets = () => async ({ dispatch, registry }) => {
  const query = (0, import_utils.buildWidgetsQuery)();
  const widgets = await registry.resolveSelect(import_core_data.store).getEntityRecords("root", "widget", query);
  const groupedBySidebar = {};
  for (const widget of widgets) {
    const block = (0, import_transformers.transformWidgetToBlock)(widget);
    groupedBySidebar[widget.sidebar] = groupedBySidebar[widget.sidebar] || [];
    groupedBySidebar[widget.sidebar].push(block);
  }
  for (const sidebarId in groupedBySidebar) {
    if (groupedBySidebar.hasOwnProperty(sidebarId)) {
      dispatch(
        (0, import_actions.persistStubPost)(
          (0, import_utils.buildWidgetAreaPostId)(sidebarId),
          groupedBySidebar[sidebarId]
        )
      );
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getWidgetAreas,
  getWidgets
});
//# sourceMappingURL=resolvers.cjs.map
