// packages/patterns/src/store/index.js
import { createReduxStore, register } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as actions from "./actions.mjs";
import { STORE_NAME } from "./constants.mjs";
import * as selectors from "./selectors.mjs";
import { unlock } from "../lock-unlock.mjs";
var storeConfig = {
  reducer
};
var store = createReduxStore(STORE_NAME, {
  ...storeConfig
});
register(store);
unlock(store).registerPrivateActions(actions);
unlock(store).registerPrivateSelectors(selectors);
export {
  store,
  storeConfig
};
//# sourceMappingURL=index.mjs.map
