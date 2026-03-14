// packages/nux/src/store/index.js
import { createReduxStore, registerStore } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as actions from "./actions.mjs";
import * as selectors from "./selectors.mjs";
var STORE_NAME = "core/nux";
var store = createReduxStore(STORE_NAME, {
  reducer,
  actions,
  selectors,
  persist: ["preferences"]
});
registerStore(STORE_NAME, {
  reducer,
  actions,
  selectors,
  persist: ["preferences"]
});
export {
  store
};
//# sourceMappingURL=index.mjs.map
