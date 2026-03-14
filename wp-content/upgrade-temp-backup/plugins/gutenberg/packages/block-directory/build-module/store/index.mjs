// packages/block-directory/src/store/index.js
import { createReduxStore, register } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as selectors from "./selectors.mjs";
import * as actions from "./actions.mjs";
import * as resolvers from "./resolvers.mjs";
var STORE_NAME = "core/block-directory";
var storeConfig = {
  reducer,
  selectors,
  actions,
  resolvers
};
var store = createReduxStore(STORE_NAME, storeConfig);
register(store);
export {
  store,
  storeConfig
};
//# sourceMappingURL=index.mjs.map
