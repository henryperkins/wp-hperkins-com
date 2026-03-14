// packages/boot/src/store/selectors.ts
function getMenuItems(state) {
  return Object.values(state.menuItems);
}
function getRoutes(state) {
  return state.routes;
}
function getDashboardLink(state) {
  return state.dashboardLink;
}
export {
  getDashboardLink,
  getMenuItems,
  getRoutes
};
//# sourceMappingURL=selectors.mjs.map
