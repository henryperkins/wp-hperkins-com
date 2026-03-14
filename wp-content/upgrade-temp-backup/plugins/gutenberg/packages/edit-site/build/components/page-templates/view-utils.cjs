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

// packages/edit-site/src/components/page-templates/view-utils.js
var view_utils_exports = {};
__export(view_utils_exports, {
  DEFAULT_VIEW: () => DEFAULT_VIEW,
  defaultLayouts: () => defaultLayouts,
  getActiveViewOverridesForTab: () => getActiveViewOverridesForTab
});
module.exports = __toCommonJS(view_utils_exports);
var defaultLayouts = {
  table: {
    showMedia: false
  },
  grid: {
    showMedia: true
  },
  list: {
    showMedia: false
  }
};
var DEFAULT_VIEW = {
  type: "grid",
  perPage: 20,
  sort: {
    field: "title",
    direction: "asc"
  },
  titleField: "title",
  descriptionField: "description",
  mediaField: "preview",
  fields: ["author", "active", "slug", "theme"],
  filters: [],
  ...defaultLayouts.grid
};
function getActiveViewOverridesForTab(activeView) {
  if (activeView === "user") {
    return {
      sort: { field: "date", direction: "desc" }
    };
  }
  if (activeView === "active") {
    return {};
  }
  return {
    filters: [
      {
        field: "author",
        operator: "isAny",
        value: [activeView]
      }
    ]
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_VIEW,
  defaultLayouts,
  getActiveViewOverridesForTab
});
//# sourceMappingURL=view-utils.cjs.map
