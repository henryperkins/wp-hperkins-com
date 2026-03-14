// packages/commands/src/hooks/use-command-loader.js
import { useEffect } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { store as commandsStore } from "../store/index.mjs";
function useCommandLoader(loader) {
  const { registerCommandLoader, unregisterCommandLoader } = useDispatch(commandsStore);
  useEffect(() => {
    if (loader.disabled) {
      return;
    }
    registerCommandLoader({
      name: loader.name,
      hook: loader.hook,
      context: loader.context,
      category: loader.category
    });
    return () => {
      unregisterCommandLoader(loader.name);
    };
  }, [
    loader.name,
    loader.hook,
    loader.context,
    loader.category,
    loader.disabled,
    registerCommandLoader,
    unregisterCommandLoader
  ]);
}
export {
  useCommandLoader as default
};
//# sourceMappingURL=use-command-loader.mjs.map
