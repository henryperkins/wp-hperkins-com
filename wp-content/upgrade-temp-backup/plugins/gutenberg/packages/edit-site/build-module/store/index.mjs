// packages/edit-site/src/store/index.js
import { createReduxStore, register } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as actions from "./actions.mjs";
import * as privateActions from "./private-actions.mjs";
import * as selectors from "./selectors.mjs";
import * as privateSelectors from "./private-selectors.mjs";
import { STORE_NAME } from "./constants.mjs";
import { unlock } from "../lock-unlock.mjs";
var storeConfig = {
  reducer,
  actions,
  selectors
};
var store = createReduxStore(STORE_NAME, storeConfig);
register(store);
unlock(store).registerPrivateSelectors(privateSelectors);
unlock(store).registerPrivateActions(privateActions);
export {
  store,
  storeConfig
};
//# sourceMappingURL=index.mjs.map
