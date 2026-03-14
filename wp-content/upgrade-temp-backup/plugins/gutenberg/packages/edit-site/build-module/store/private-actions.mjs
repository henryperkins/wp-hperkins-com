// packages/edit-site/src/store/private-actions.js
function registerRoute(route) {
  return {
    type: "REGISTER_ROUTE",
    route
  };
}
function unregisterRoute(name) {
  return {
    type: "UNREGISTER_ROUTE",
    name
  };
}
export {
  registerRoute,
  unregisterRoute
};
//# sourceMappingURL=private-actions.mjs.map
