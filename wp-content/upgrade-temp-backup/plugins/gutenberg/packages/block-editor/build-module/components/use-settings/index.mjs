// packages/block-editor/src/components/use-settings/index.js
import { useSelect } from "@wordpress/data";
import deprecated from "@wordpress/deprecated";
import { useBlockEditContext } from "../block-edit/index.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
function useSettings(...paths) {
  const { clientId = null } = useBlockEditContext();
  return useSelect(
    (select) => unlock(select(blockEditorStore)).getBlockSettings(
      clientId,
      ...paths
    ),
    [clientId, ...paths]
  );
}
function useSetting(path) {
  deprecated("wp.blockEditor.useSetting", {
    since: "6.5",
    alternative: "wp.blockEditor.useSettings",
    note: "The new useSettings function can retrieve multiple settings at once, with better performance."
  });
  const [value] = useSettings(path);
  return value;
}
export {
  useSetting,
  useSettings
};
//# sourceMappingURL=index.mjs.map
