// packages/editor/src/store/index.js
import { createReduxStore, register } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as selectors from "./selectors.mjs";
import * as actions from "./actions.mjs";
import * as privateActions from "./private-actions.mjs";
import * as privateSelectors from "./private-selectors.mjs";
import { STORE_NAME } from "./constants.mjs";
import { unlock } from "../lock-unlock.mjs";
var storeConfig = {
  reducer,
  selectors,
  actions
};
var store = createReduxStore(STORE_NAME, {
  ...storeConfig
});
register(store);
unlock(store).registerPrivateActions(privateActions);
unlock(store).registerPrivateSelectors(privateSelectors);
export {
  store,
  storeConfig
};
//# sourceMappingURL=index.mjs.map
