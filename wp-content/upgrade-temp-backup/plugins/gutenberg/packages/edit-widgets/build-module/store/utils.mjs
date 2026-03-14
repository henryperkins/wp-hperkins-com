// packages/edit-widgets/src/store/utils.js
var KIND = "root";
var WIDGET_AREA_ENTITY_TYPE = "sidebar";
var POST_TYPE = "postType";
var buildWidgetAreaPostId = (widgetAreaId) => `widget-area-${widgetAreaId}`;
var buildWidgetAreasPostId = () => `widget-areas`;
function buildWidgetAreasQuery() {
  return {
    per_page: -1
  };
}
function buildWidgetsQuery() {
  return {
    per_page: -1,
    _embed: "about"
  };
}
var createStubPost = (id, blocks) => ({
  id,
  slug: id,
  status: "draft",
  type: "page",
  blocks,
  meta: {
    widgetAreaId: id
  }
});
export {
  KIND,
  POST_TYPE,
  WIDGET_AREA_ENTITY_TYPE,
  buildWidgetAreaPostId,
  buildWidgetAreasPostId,
  buildWidgetAreasQuery,
  buildWidgetsQuery,
  createStubPost
};
//# sourceMappingURL=utils.mjs.map
