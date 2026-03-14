// packages/connectors/src/store.ts
import { createReduxStore, register } from "@wordpress/data";
import { unlock } from "./lock-unlock.mjs";
var STORE_NAME = "core/connectors";
var DEFAULT_STATE = {
  connectors: {}
};
var actions = {
  registerConnector(slug, config) {
    return {
      type: "REGISTER_CONNECTOR",
      slug,
      config
    };
  }
};
function reducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case "REGISTER_CONNECTOR":
      return {
        ...state,
        connectors: {
          ...state.connectors,
          [action.slug]: {
            slug: action.slug,
            ...action.config
          }
        }
      };
    default:
      return state;
  }
}
var selectors = {
  getConnectors(state) {
    return Object.values(state.connectors);
  },
  getConnector(state, slug) {
    return state.connectors[slug];
  }
};
var store = createReduxStore(STORE_NAME, {
  reducer
});
register(store);
unlock(store).registerPrivateActions(actions);
unlock(store).registerPrivateSelectors(selectors);
export {
  STORE_NAME,
  store
};
//# sourceMappingURL=store.mjs.map
