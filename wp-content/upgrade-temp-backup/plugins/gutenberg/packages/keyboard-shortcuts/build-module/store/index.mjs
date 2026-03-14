// packages/keyboard-shortcuts/src/store/index.js
import { createReduxStore, register } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as actions from "./actions.mjs";
import * as selectors from "./selectors.mjs";
var STORE_NAME = "core/keyboard-shortcuts";
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
