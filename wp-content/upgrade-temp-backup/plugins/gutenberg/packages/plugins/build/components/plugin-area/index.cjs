"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/plugins/src/components/plugin-area/index.tsx
var plugin_area_exports = {};
__export(plugin_area_exports, {
  default: () => plugin_area_default
});
module.exports = __toCommonJS(plugin_area_exports);
var import_memize = __toESM(require("memize"));
var import_element = require("@wordpress/element");
var import_hooks = require("@wordpress/hooks");
var import_is_shallow_equal = require("@wordpress/is-shallow-equal");
var import_plugin_context = require("../plugin-context/index.cjs");
var import_plugin_error_boundary = require("../plugin-error-boundary/index.cjs");
var import_api = require("../../api/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var getPluginContext = (0, import_memize.default)(
  (icon, name) => ({
    icon,
    name
  })
);
function PluginArea({
  scope,
  onError
}) {
  const store = (0, import_element.useMemo)(() => {
    let lastValue = [];
    return {
      subscribe(listener) {
        (0, import_hooks.addAction)(
          "plugins.pluginRegistered",
          "core/plugins/plugin-area/plugins-registered",
          listener
        );
        (0, import_hooks.addAction)(
          "plugins.pluginUnregistered",
          "core/plugins/plugin-area/plugins-unregistered",
          listener
        );
        return () => {
          (0, import_hooks.removeAction)(
            "plugins.pluginRegistered",
            "core/plugins/plugin-area/plugins-registered"
          );
          (0, import_hooks.removeAction)(
            "plugins.pluginUnregistered",
            "core/plugins/plugin-area/plugins-unregistered"
          );
        };
      },
      getValue() {
        const nextValue = (0, import_api.getPlugins)(scope);
        if (!(0, import_is_shallow_equal.isShallowEqual)(lastValue, nextValue)) {
          lastValue = nextValue;
        }
        return lastValue;
      }
    };
  }, [scope]);
  const plugins = (0, import_element.useSyncExternalStore)(
    store.subscribe,
    store.getValue,
    store.getValue
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "none" }, children: plugins.map(({ icon, name, render: Plugin }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_plugin_context.PluginContextProvider,
    {
      value: getPluginContext(icon, name),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_plugin_error_boundary.PluginErrorBoundary, { name, onError, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plugin, {}) })
    },
    name
  )) });
}
var plugin_area_default = PluginArea;
//# sourceMappingURL=index.cjs.map
