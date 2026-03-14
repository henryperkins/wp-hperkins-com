// packages/block-editor/src/components/provider/with-registry-provider.js
import { useState } from "@wordpress/element";
import { useRegistry, createRegistry, RegistryProvider } from "@wordpress/data";
import { createHigherOrderComponent } from "@wordpress/compose";
import { storeConfig } from "../../store/index.mjs";
import { STORE_NAME as blockEditorStoreName } from "../../store/constants.mjs";
import { jsx } from "react/jsx-runtime";
function getSubRegistry(subRegistries, registry, useSubRegistry) {
  if (!useSubRegistry) {
    return registry;
  }
  let subRegistry = subRegistries.get(registry);
  if (!subRegistry) {
    subRegistry = createRegistry({}, registry);
    subRegistry.registerStore(blockEditorStoreName, storeConfig);
    subRegistries.set(registry, subRegistry);
  }
  return subRegistry;
}
var withRegistryProvider = createHigherOrderComponent(
  (WrappedComponent) => function WithRegistryProvider({ useSubRegistry = true, ...props }) {
    const registry = useRegistry();
    const [subRegistries] = useState(() => /* @__PURE__ */ new WeakMap());
    const subRegistry = getSubRegistry(
      subRegistries,
      registry,
      useSubRegistry
    );
    if (subRegistry === registry) {
      return /* @__PURE__ */ jsx(WrappedComponent, { registry, ...props });
    }
    return /* @__PURE__ */ jsx(RegistryProvider, { value: subRegistry, children: /* @__PURE__ */ jsx(WrappedComponent, { registry: subRegistry, ...props }) });
  },
  "withRegistryProvider"
);
var with_registry_provider_default = withRegistryProvider;
export {
  with_registry_provider_default as default
};
//# sourceMappingURL=with-registry-provider.mjs.map
