// packages/edit-widgets/src/store/index.js
import apiFetch from "@wordpress/api-fetch";
import { createReduxStore, register } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as resolvers from "./resolvers.mjs";
import * as selectors from "./selectors.mjs";
import * as actions from "./actions.mjs";
import * as privateSelectors from "./private-selectors.mjs";
import { STORE_NAME } from "./constants.mjs";
import { unlock } from "../lock-unlock.mjs";
var storeConfig = {
  reducer,
  selectors,
  resolvers,
  actions
};
var store = createReduxStore(STORE_NAME, storeConfig);
register(store);
apiFetch.use(function(options, next) {
  if (options.path?.indexOf("/wp/v2/types/widget-area") === 0) {
    return Promise.resolve({});
  }
  return next(options);
});
unlock(store).registerPrivateSelectors(privateSelectors);
export {
  store
};
//# sourceMappingURL=index.mjs.map
