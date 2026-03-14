// packages/plugins/src/api/index.ts
import { applyFilters, doAction } from "@wordpress/hooks";
import { plugins as pluginsIcon } from "@wordpress/icons";
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
  settings = applyFilters(
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
    icon: pluginsIcon,
    ...settings
  };
  doAction("plugins.pluginRegistered", settings, name);
  return settings;
}
function unregisterPlugin(name) {
  if (!plugins[name]) {
    console.error('Plugin "' + name + '" is not registered.');
    return;
  }
  const oldPlugin = plugins[name];
  delete plugins[name];
  doAction("plugins.pluginUnregistered", oldPlugin, name);
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
export {
  getPlugin,
  getPlugins,
  registerPlugin,
  unregisterPlugin
};
//# sourceMappingURL=index.mjs.map
