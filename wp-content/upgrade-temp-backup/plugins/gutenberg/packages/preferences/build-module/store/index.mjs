// packages/preferences/src/store/index.ts
import { createReduxStore, register } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as actions from "./actions.mjs";
import * as selectors from "./selectors.mjs";
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
