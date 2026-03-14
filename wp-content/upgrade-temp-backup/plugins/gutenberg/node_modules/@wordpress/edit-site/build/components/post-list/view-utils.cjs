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

// packages/edit-site/src/components/post-list/view-utils.js
var view_utils_exports = {};
__export(view_utils_exports, {
  DEFAULT_VIEW: () => DEFAULT_VIEW,
  defaultLayouts: () => defaultLayouts,
  getActiveViewOverridesForTab: () => getActiveViewOverridesForTab,
  getDefaultViews: () => getDefaultViews
});
module.exports = __toCommonJS(view_utils_exports);
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_constants = require("../../utils/constants.cjs");
var defaultLayouts = {
  table: {
    layout: {
      styles: {
        author: {
          align: "start"
        }
      }
    }
  },
  grid: {},
  list: {}
};
var DEFAULT_VIEW = {
  type: "list",
  filters: [],
  perPage: 20,
  sort: {
    field: "title",
    direction: "asc"
  },
  showLevels: true,
  titleField: "title",
  mediaField: "featured_media",
  fields: ["author", "status"],
  ...defaultLayouts.list
};
function getDefaultViews(postType) {
  return [
    {
      title: postType?.labels?.all_items || (0, import_i18n.__)("All items"),
      slug: "all",
      icon: import_icons.pages,
      view: DEFAULT_VIEW
    },
    {
      title: (0, import_i18n.__)("Published"),
      slug: "published",
      icon: import_icons.published,
      view: {
        ...DEFAULT_VIEW,
        filters: [
          {
            field: "status",
            operator: import_constants.OPERATOR_IS_ANY,
            value: "publish",
            isLocked: true
          }
        ]
      }
    },
    {
      title: (0, import_i18n.__)("Scheduled"),
      slug: "future",
      icon: import_icons.scheduled,
      view: {
        ...DEFAULT_VIEW,
        filters: [
          {
            field: "status",
            operator: import_constants.OPERATOR_IS_ANY,
            value: "future",
            isLocked: true
          }
        ]
      }
    },
    {
      title: (0, import_i18n.__)("Drafts"),
      slug: "drafts",
      icon: import_icons.drafts,
      view: {
        ...DEFAULT_VIEW,
        filters: [
          {
            field: "status",
            operator: import_constants.OPERATOR_IS_ANY,
            value: "draft",
            isLocked: true
          }
        ]
      }
    },
    {
      title: (0, import_i18n.__)("Pending"),
      slug: "pending",
      icon: import_icons.pending,
      view: {
        ...DEFAULT_VIEW,
        filters: [
          {
            field: "status",
            operator: import_constants.OPERATOR_IS_ANY,
            value: "pending",
            isLocked: true
          }
        ]
      }
    },
    {
      title: (0, import_i18n.__)("Private"),
      slug: "private",
      icon: import_icons.notAllowed,
      view: {
        ...DEFAULT_VIEW,
        filters: [
          {
            field: "status",
            operator: import_constants.OPERATOR_IS_ANY,
            value: "private",
            isLocked: true
          }
        ]
      }
    },
    {
      title: (0, import_i18n.__)("Trash"),
      slug: "trash",
      icon: import_icons.trash,
      view: {
        ...DEFAULT_VIEW,
        type: "table",
        layout: defaultLayouts.table.layout,
        filters: [
          {
            field: "status",
            operator: import_constants.OPERATOR_IS_ANY,
            value: "trash",
            isLocked: true
          }
        ]
      }
    }
  ];
}
var SLUG_TO_STATUS = {
  published: "publish",
  future: "future",
  drafts: "draft",
  pending: "pending",
  private: "private",
  trash: "trash"
};
function getActiveViewOverridesForTab(activeView) {
  const base = {
    ...defaultLayouts.table
  };
  const status = SLUG_TO_STATUS[activeView];
  if (!status) {
    return base;
  }
  return {
    ...base,
    filters: [
      {
        field: "status",
        operator: import_constants.OPERATOR_IS_ANY,
        value: status,
        isLocked: true
      }
    ]
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_VIEW,
  defaultLayouts,
  getActiveViewOverridesForTab,
  getDefaultViews
});
//# sourceMappingURL=view-utils.cjs.map
