// packages/data-controls/src/index.ts
import triggerFetch from "@wordpress/api-fetch";
import { controls as dataControls } from "@wordpress/data";
import deprecated from "@wordpress/deprecated";
function apiFetch(request) {
  return {
    type: "API_FETCH",
    request
  };
}
function select(storeNameOrDescriptor, selectorName, ...args) {
  deprecated("`select` control in `@wordpress/data-controls`", {
    since: "5.7",
    alternative: "built-in `resolveSelect` control in `@wordpress/data`"
  });
  return dataControls.resolveSelect(
    storeNameOrDescriptor,
    selectorName,
    ...args
  );
}
function syncSelect(storeNameOrDescriptor, selectorName, ...args) {
  deprecated("`syncSelect` control in `@wordpress/data-controls`", {
    since: "5.7",
    alternative: "built-in `select` control in `@wordpress/data`"
  });
  return dataControls.select(storeNameOrDescriptor, selectorName, ...args);
}
function dispatch(storeNameOrDescriptor, actionName, ...args) {
  deprecated("`dispatch` control in `@wordpress/data-controls`", {
    since: "5.7",
    alternative: "built-in `dispatch` control in `@wordpress/data`"
  });
  return dataControls.dispatch(storeNameOrDescriptor, actionName, ...args);
}
var __unstableAwaitPromise = function(promise) {
  return {
    type: "AWAIT_PROMISE",
    promise
  };
};
var controls = {
  AWAIT_PROMISE({ promise }) {
    return promise;
  },
  API_FETCH({ request }) {
    return triggerFetch(request);
  }
};
export {
  __unstableAwaitPromise,
  apiFetch,
  controls,
  dispatch,
  select,
  syncSelect
};
//# sourceMappingURL=index.mjs.map
