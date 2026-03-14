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

// packages/edit-widgets/src/store/utils.js
var utils_exports = {};
__export(utils_exports, {
  KIND: () => KIND,
  POST_TYPE: () => POST_TYPE,
  WIDGET_AREA_ENTITY_TYPE: () => WIDGET_AREA_ENTITY_TYPE,
  buildWidgetAreaPostId: () => buildWidgetAreaPostId,
  buildWidgetAreasPostId: () => buildWidgetAreasPostId,
  buildWidgetAreasQuery: () => buildWidgetAreasQuery,
  buildWidgetsQuery: () => buildWidgetsQuery,
  createStubPost: () => createStubPost
});
module.exports = __toCommonJS(utils_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  KIND,
  POST_TYPE,
  WIDGET_AREA_ENTITY_TYPE,
  buildWidgetAreaPostId,
  buildWidgetAreasPostId,
  buildWidgetAreasQuery,
  buildWidgetsQuery,
  createStubPost
});
//# sourceMappingURL=utils.cjs.map
