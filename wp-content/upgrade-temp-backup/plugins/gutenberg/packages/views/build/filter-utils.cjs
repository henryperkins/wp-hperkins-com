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

// packages/views/src/filter-utils.ts
var filter_utils_exports = {};
__export(filter_utils_exports, {
  mergeActiveViewOverrides: () => mergeActiveViewOverrides,
  stripActiveViewOverrides: () => stripActiveViewOverrides
});
module.exports = __toCommonJS(filter_utils_exports);
var SCALAR_VALUES = [
  "titleField",
  "mediaField",
  "descriptionField",
  "showTitle",
  "showMedia",
  "showDescription",
  "showLevels",
  "infiniteScrollEnabled"
];
function mergeActiveViewOverrides(view, activeViewOverrides, defaultView) {
  if (!activeViewOverrides) {
    return view;
  }
  let result = view;
  for (const key of SCALAR_VALUES) {
    if (key in activeViewOverrides) {
      result = { ...result, [key]: activeViewOverrides[key] };
    }
  }
  if (activeViewOverrides.filters && activeViewOverrides.filters.length > 0) {
    const activeFields = new Set(
      activeViewOverrides.filters.map((f) => f.field)
    );
    const preserved = (view.filters ?? []).filter(
      (f) => !activeFields.has(f.field)
    );
    result = {
      ...result,
      filters: [...preserved, ...activeViewOverrides.filters]
    };
  }
  if (activeViewOverrides.sort) {
    const isDefaultSort = defaultView && view.sort?.field === defaultView.sort?.field && view.sort?.direction === defaultView.sort?.direction;
    if (isDefaultSort) {
      result = {
        ...result,
        sort: activeViewOverrides.sort
      };
    }
  }
  if (activeViewOverrides.layout) {
    result = {
      ...result,
      layout: {
        ...result.layout,
        ...activeViewOverrides.layout
      }
    };
  }
  if (activeViewOverrides.groupBy) {
    result = {
      ...result,
      groupBy: activeViewOverrides.groupBy
    };
  }
  return result;
}
function stripActiveViewOverrides(view, activeViewOverrides, defaultView) {
  if (!activeViewOverrides) {
    return view;
  }
  let result = view;
  for (const key of SCALAR_VALUES) {
    if (key in activeViewOverrides) {
      const { [key]: _, ...rest } = result;
      result = rest;
    }
  }
  if (activeViewOverrides.filters && activeViewOverrides.filters.length > 0) {
    const activeFields = new Set(
      activeViewOverrides.filters.map((f) => f.field)
    );
    result = {
      ...result,
      filters: (view.filters ?? []).filter(
        (f) => !activeFields.has(f.field)
      )
    };
  }
  if (activeViewOverrides.sort && view.sort?.field === activeViewOverrides.sort.field && view.sort?.direction === activeViewOverrides.sort.direction) {
    result = {
      ...result,
      sort: defaultView?.sort
    };
  }
  if (activeViewOverrides.layout && "layout" in result && result.layout) {
    const layout = { ...result.layout };
    for (const key of Object.keys(activeViewOverrides.layout)) {
      delete layout[key];
    }
    result = {
      ...result,
      layout: Object.keys(layout).length > 0 ? layout : void 0
    };
  }
  if (activeViewOverrides.groupBy && "groupBy" in result) {
    const { groupBy: _, ...rest } = result;
    result = rest;
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mergeActiveViewOverrides,
  stripActiveViewOverrides
});
//# sourceMappingURL=filter-utils.cjs.map
