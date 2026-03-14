// packages/blocks/src/store/index.js
import { createReduxStore, register } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as selectors from "./selectors.mjs";
import * as privateSelectors from "./private-selectors.mjs";
import * as actions from "./actions.mjs";
import * as privateActions from "./private-actions.mjs";
import { STORE_NAME } from "./constants.mjs";
import { unlock } from "../lock-unlock.mjs";
var store = createReduxStore(STORE_NAME, {
  reducer,
  selectors,
  actions
});
register(store);
unlock(store).registerPrivateSelectors(privateSelectors);
unlock(store).registerPrivateActions(privateActions);
export {
  store
};
//# sourceMappingURL=index.mjs.map
