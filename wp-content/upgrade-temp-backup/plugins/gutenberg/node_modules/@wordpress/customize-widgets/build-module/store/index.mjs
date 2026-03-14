// packages/customize-widgets/src/store/index.js
import { createReduxStore, register } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as selectors from "./selectors.mjs";
import * as actions from "./actions.mjs";
import { STORE_NAME } from "./constants.mjs";
var storeConfig = {
  reducer,
  selectors,
  actions
};
var store = createReduxStore(STORE_NAME, storeConfig);
register(store);
export {
  store
};
//# sourceMappingURL=index.mjs.map
