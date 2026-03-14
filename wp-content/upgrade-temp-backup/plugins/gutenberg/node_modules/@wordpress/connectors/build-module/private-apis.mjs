// packages/connectors/src/private-apis.ts
import { lock } from "./lock-unlock.mjs";
import { store, STORE_NAME } from "./store.mjs";
var privateApis = {};
lock(privateApis, { store, STORE_NAME });
export {
  privateApis
};
//# sourceMappingURL=private-apis.mjs.map
