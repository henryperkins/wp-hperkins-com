// packages/block-editor/src/store/index.js
import { createReduxStore, registerStore } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as selectors from "./selectors.mjs";
import * as privateActions from "./private-actions.mjs";
import * as privateSelectors from "./private-selectors.mjs";
import * as actions from "./actions.mjs";
import { STORE_NAME } from "./constants.mjs";
import { unlock } from "../lock-unlock.mjs";
var storeConfig = {
  reducer,
  selectors,
  actions
};
var store = createReduxStore(STORE_NAME, {
  ...storeConfig,
  persist: ["preferences"]
});
var registeredStore = registerStore(STORE_NAME, {
  ...storeConfig,
  persist: ["preferences"]
});
unlock(registeredStore).registerPrivateActions(privateActions);
unlock(registeredStore).registerPrivateSelectors(privateSelectors);
unlock(store).registerPrivateActions(privateActions);
unlock(store).registerPrivateSelectors(privateSelectors);
export {
  store,
  storeConfig
};
//# sourceMappingURL=index.mjs.map
