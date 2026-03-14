// packages/boot/src/store/reducer.ts
var initialState = {
  menuItems: {},
  routes: [],
  dashboardLink: void 0
};
function reducer(state = initialState, action) {
  switch (action.type) {
    case "REGISTER_MENU_ITEM":
      return {
        ...state,
        menuItems: {
          ...state.menuItems,
          [action.id]: action.menuItem
        }
      };
    case "UPDATE_MENU_ITEM":
      return {
        ...state,
        menuItems: {
          ...state.menuItems,
          [action.id]: {
            ...state.menuItems[action.id],
            ...action.updates
          }
        }
      };
    case "REGISTER_ROUTE":
      return {
        ...state,
        routes: [...state.routes, action.route]
      };
    case "SET_DASHBOARD_LINK":
      return {
        ...state,
        dashboardLink: action.dashboardLink
      };
  }
  return state;
}
export {
  reducer
};
//# sourceMappingURL=reducer.mjs.map
