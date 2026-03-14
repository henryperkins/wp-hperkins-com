// packages/notices/src/store/selectors.ts
import { DEFAULT_CONTEXT } from "./constants.mjs";
var DEFAULT_NOTICES = [];
function getNotices(state, context = DEFAULT_CONTEXT) {
  return state[context] || DEFAULT_NOTICES;
}
export {
  getNotices
};
//# sourceMappingURL=selectors.mjs.map
