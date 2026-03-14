// packages/interface/src/store/index.js
import { createReduxStore, register } from "@wordpress/data";
import * as actions from "./actions.mjs";
import * as selectors from "./selectors.mjs";
import reducer from "./reducer.mjs";
import { STORE_NAME } from "./constants.mjs";
var store = createReduxStore(STORE_NAME, {
  reducer,
  actions,
  selectors
});
register(store);
export {
  store
};
//# sourceMappingURL=index.mjs.map
