// packages/plugins/src/components/plugin-area/index.tsx
import memoize from "memize";
import { useMemo, useSyncExternalStore } from "@wordpress/element";
import { addAction, removeAction } from "@wordpress/hooks";
import { isShallowEqual } from "@wordpress/is-shallow-equal";
import { PluginContextProvider } from "../plugin-context/index.mjs";
import { PluginErrorBoundary } from "../plugin-error-boundary/index.mjs";
import { getPlugins } from "../../api/index.mjs";
import { jsx } from "react/jsx-runtime";
var getPluginContext = memoize(
  (icon, name) => ({
    icon,
    name
  })
);
function PluginArea({
  scope,
  onError
}) {
  const store = useMemo(() => {
    let lastValue = [];
    return {
      subscribe(listener) {
        addAction(
          "plugins.pluginRegistered",
          "core/plugins/plugin-area/plugins-registered",
          listener
        );
        addAction(
          "plugins.pluginUnregistered",
          "core/plugins/plugin-area/plugins-unregistered",
          listener
        );
        return () => {
          removeAction(
            "plugins.pluginRegistered",
            "core/plugins/plugin-area/plugins-registered"
          );
          removeAction(
            "plugins.pluginUnregistered",
            "core/plugins/plugin-area/plugins-unregistered"
          );
        };
      },
      getValue() {
        const nextValue = getPlugins(scope);
        if (!isShallowEqual(lastValue, nextValue)) {
          lastValue = nextValue;
        }
        return lastValue;
      }
    };
  }, [scope]);
  const plugins = useSyncExternalStore(
    store.subscribe,
    store.getValue,
    store.getValue
  );
  return /* @__PURE__ */ jsx("div", { style: { display: "none" }, children: plugins.map(({ icon, name, render: Plugin }) => /* @__PURE__ */ jsx(
    PluginContextProvider,
    {
      value: getPluginContext(icon, name),
      children: /* @__PURE__ */ jsx(PluginErrorBoundary, { name, onError, children: /* @__PURE__ */ jsx(Plugin, {}) })
    },
    name
  )) });
}
var plugin_area_default = PluginArea;
export {
  plugin_area_default as default
};
//# sourceMappingURL=index.mjs.map
