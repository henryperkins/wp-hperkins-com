// packages/reusable-blocks/src/store/index.js
import { createReduxStore, register } from "@wordpress/data";
import * as actions from "./actions.mjs";
import reducer from "./reducer.mjs";
import * as selectors from "./selectors.mjs";
var STORE_NAME = "core/reusable-blocks";
var store = createReduxStore(STORE_NAME, {
  actions,
  reducer,
  selectors
});
register(store);
export {
  store
};
//# sourceMappingURL=index.mjs.map
