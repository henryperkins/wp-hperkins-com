"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/plugins/src/api/index.ts
var api_exports = {};
__export(api_exports, {
  getPlugin: () => getPlugin,
  getPlugins: () => getPlugins,
  registerPlugin: () => registerPlugin,
  unregisterPlugin: () => unregisterPlugin
});
module.exports = __toCommonJS(api_exports);
var import_hooks = require("@wordpress/hooks");
var import_icons = require("@wordpress/icons");
var plugins = {};
function registerPlugin(name, settings) {
  if (typeof settings !== "object") {
    console.error("No settings object provided!");
    return null;
  }
  if (typeof name !== "string") {
    console.error("Plugin name must be string.");
    return null;
  }
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    console.error(
      'Plugin name must include only lowercase alphanumeric characters or dashes, and start with a letter. Example: "my-plugin".'
    );
    return null;
  }
  if (plugins[name]) {
    console.error(`Plugin "${name}" is already registered.`);
  }
  settings = (0, import_hooks.applyFilters)(
    "plugins.registerPlugin",
    settings,
    name
  );
  const { render, scope } = settings;
  if (typeof render !== "function") {
    console.error(
      'The "render" property must be specified and must be a valid function.'
    );
    return null;
  }
  if (scope) {
    if (typeof scope !== "string") {
      console.error("Plugin scope must be string.");
      return null;
    }
    if (!/^[a-z][a-z0-9-]*$/.test(scope)) {
      console.error(
        'Plugin scope must include only lowercase alphanumeric characters or dashes, and start with a letter. Example: "my-page".'
      );
      return null;
    }
  }
  plugins[name] = {
    name,
    icon: import_icons.plugins,
    ...settings
  };
  (0, import_hooks.doAction)("plugins.pluginRegistered", settings, name);
  return settings;
}
function unregisterPlugin(name) {
  if (!plugins[name]) {
    console.error('Plugin "' + name + '" is not registered.');
    return;
  }
  const oldPlugin = plugins[name];
  delete plugins[name];
  (0, import_hooks.doAction)("plugins.pluginUnregistered", oldPlugin, name);
  return oldPlugin;
}
function getPlugin(name) {
  return plugins[name];
}
function getPlugins(scope) {
  return Object.values(plugins).filter(
    (plugin) => plugin.scope === scope
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getPlugin,
  getPlugins,
  registerPlugin,
  unregisterPlugin
});
//# sourceMappingURL=index.cjs.map
