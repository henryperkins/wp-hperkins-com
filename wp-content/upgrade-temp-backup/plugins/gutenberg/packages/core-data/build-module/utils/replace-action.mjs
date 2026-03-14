// packages/core-data/src/utils/replace-action.js
var replaceAction = (replacer) => (reducer) => (state, action) => {
  return reducer(state, replacer(action));
};
var replace_action_default = replaceAction;
export {
  replace_action_default as default
};
//# sourceMappingURL=replace-action.mjs.map
