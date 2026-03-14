// packages/notices/src/store/index.ts
import { createReduxStore, register } from "@wordpress/data";
import reducer from "./reducer.mjs";
import * as actions from "./actions.mjs";
import * as selectors from "./selectors.mjs";
var store = createReduxStore("core/notices", {
  reducer,
  actions,
  selectors
});
register(store);
export {
  store
};
//# sourceMappingURL=index.mjs.map
