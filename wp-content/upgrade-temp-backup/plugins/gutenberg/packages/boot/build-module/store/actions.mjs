// packages/boot/src/store/actions.ts
function registerMenuItem(id, menuItem) {
  return {
    type: "REGISTER_MENU_ITEM",
    id,
    menuItem
  };
}
function updateMenuItem(id, updates) {
  return {
    type: "UPDATE_MENU_ITEM",
    id,
    updates
  };
}
function registerRoute(route) {
  return {
    type: "REGISTER_ROUTE",
    route
  };
}
function setDashboardLink(dashboardLink) {
  return {
    type: "SET_DASHBOARD_LINK",
    dashboardLink
  };
}
export {
  registerMenuItem,
  registerRoute,
  setDashboardLink,
  updateMenuItem
};
//# sourceMappingURL=actions.mjs.map
