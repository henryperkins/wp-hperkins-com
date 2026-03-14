"use strict";
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

// packages/edit-site/src/components/sidebar-navigation-screen-patterns/use-template-part-areas.js
var use_template_part_areas_exports = {};
__export(use_template_part_areas_exports, {
  default: () => useTemplatePartAreas
});
module.exports = __toCommonJS(use_template_part_areas_exports);
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_block_library = require("@wordpress/block-library");
var import_constants = require("../../utils/constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var { NAVIGATION_OVERLAY_TEMPLATE_PART_AREA } = (0, import_lock_unlock.unlock)(
  import_block_library.privateApis
);
var useTemplatePartsGroupedByArea = (items) => {
  const allItems = items || [];
  const templatePartAreas = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getCurrentTheme()?.default_template_part_areas || [],
    []
  );
  const knownAreas = {
    header: {},
    footer: {},
    sidebar: {},
    uncategorized: {},
    [NAVIGATION_OVERLAY_TEMPLATE_PART_AREA]: {}
  };
  templatePartAreas.forEach(
    (templatePartArea) => knownAreas[templatePartArea.area] = {
      ...templatePartArea,
      templateParts: []
    }
  );
  const groupedByArea = allItems.reduce((accumulator, item) => {
    const key = accumulator[item.area] ? item.area : import_constants.TEMPLATE_PART_AREA_DEFAULT_CATEGORY;
    accumulator[key]?.templateParts?.push(item);
    return accumulator;
  }, knownAreas);
  return groupedByArea;
};
function useTemplatePartAreas() {
  const { records: templateParts, isResolving: isLoading } = (0, import_core_data.useEntityRecords)(
    "postType",
    import_constants.TEMPLATE_PART_POST_TYPE,
    { per_page: -1 }
  );
  return {
    hasTemplateParts: templateParts ? !!templateParts.length : false,
    isLoading,
    templatePartAreas: useTemplatePartsGroupedByArea(templateParts)
  };
}
//# sourceMappingURL=use-template-part-areas.cjs.map
