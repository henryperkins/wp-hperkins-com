// packages/connectors/src/api.ts
import { dispatch } from "@wordpress/data";
import { store } from "./store.mjs";
import { unlock } from "./lock-unlock.mjs";
function registerConnector(slug, config) {
  unlock(dispatch(store)).registerConnector(slug, config);
}
export {
  registerConnector
};
//# sourceMappingURL=api.mjs.map
