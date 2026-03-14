// packages/boot/src/store/index.ts
import { createReduxStore, register } from "@wordpress/data";
import { reducer } from "./reducer.mjs";
import * as actions from "./actions.mjs";
import * as selectors from "./selectors.mjs";
var STORE_NAME = "wordpress/boot";
var store = createReduxStore(STORE_NAME, {
  reducer,
  actions,
  selectors
});
register(store);
export {
  STORE_NAME,
  store
};
//# sourceMappingURL=index.mjs.map
