// packages/core-data/src/utils/forward-resolver.js
var forwardResolver = (resolverName) => (...args) => async ({ resolveSelect }) => {
  await resolveSelect[resolverName](...args);
};
var forward_resolver_default = forwardResolver;
export {
  forward_resolver_default as default
};
//# sourceMappingURL=forward-resolver.mjs.map
