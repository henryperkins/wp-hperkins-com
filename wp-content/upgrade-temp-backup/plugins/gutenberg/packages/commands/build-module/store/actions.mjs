// packages/commands/src/store/actions.js
var REGISTERABLE_CATEGORIES = /* @__PURE__ */ new Set([
  "command",
  "view",
  "edit",
  "action"
]);
function registerCommand(config) {
  let { category } = config;
  if (!category || !REGISTERABLE_CATEGORIES.has(category)) {
    category = "action";
  }
  return {
    type: "REGISTER_COMMAND",
    ...config,
    category
  };
}
function unregisterCommand(name) {
  return {
    type: "UNREGISTER_COMMAND",
    name
  };
}
function registerCommandLoader(config) {
  let { category } = config;
  if (!category || !REGISTERABLE_CATEGORIES.has(category)) {
    category = "action";
  }
  return {
    type: "REGISTER_COMMAND_LOADER",
    ...config,
    category
  };
}
function unregisterCommandLoader(name) {
  return {
    type: "UNREGISTER_COMMAND_LOADER",
    name
  };
}
function open() {
  return {
    type: "OPEN"
  };
}
function close() {
  return {
    type: "CLOSE"
  };
}
export {
  close,
  open,
  registerCommand,
  registerCommandLoader,
  unregisterCommand,
  unregisterCommandLoader
};
//# sourceMappingURL=actions.mjs.map
