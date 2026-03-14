// packages/annotations/src/store/index.js
import { register, createReduxStore } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as selectors from "./selectors.mjs";
import * as actions from "./actions.mjs";
import { STORE_NAME } from "./constants.mjs";
var store = createReduxStore(STORE_NAME, {
  reducer,
  selectors,
  actions
});
register(store);
export {
  store
};
//# sourceMappingURL=index.mjs.map
