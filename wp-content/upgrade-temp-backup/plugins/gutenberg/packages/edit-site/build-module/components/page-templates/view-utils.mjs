// packages/edit-site/src/components/page-templates/view-utils.js
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
export {
  DEFAULT_VIEW,
  defaultLayouts,
  getActiveViewOverridesForTab
};
//# sourceMappingURL=view-utils.mjs.map
