// packages/commands/src/private-apis.js
import { default as useCommandContext } from "./hooks/use-command-context.mjs";
import { lock } from "./lock-unlock.mjs";
var privateApis = {};
lock(privateApis, {
  useCommandContext
});
export {
  privateApis
};
//# sourceMappingURL=private-apis.mjs.map
