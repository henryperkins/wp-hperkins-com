// packages/commands/src/store/index.js
import { createReduxStore, register } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as actions from "./actions.mjs";
import * as selectors from "./selectors.mjs";
import * as privateActions from "./private-actions.mjs";
import { unlock } from "../lock-unlock.mjs";
var STORE_NAME = "core/commands";
var store = createReduxStore(STORE_NAME, {
  reducer,
  actions,
  selectors
});
register(store);
unlock(store).registerPrivateActions(privateActions);
export {
  store
};
//# sourceMappingURL=index.mjs.map
