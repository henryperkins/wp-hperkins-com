// packages/patterns/src/components/overrides-panel.js
import {
  privateApis as blockEditorPrivateApis,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { isOverridableBlock } from "../api/index.mjs";
import { unlock } from "../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { BlockQuickNavigation } = unlock(blockEditorPrivateApis);
function OverridesPanel() {
  const { allClientIds, supportedBlockTypesRaw } = useSelect(
    (select) => ({
      allClientIds: select(blockEditorStore).getClientIdsWithDescendants(),
      supportedBlockTypesRaw: select(blockEditorStore).getSettings()?.__experimentalBlockBindingsSupportedAttributes
    }),
    []
  );
  const { getBlock } = useSelect(blockEditorStore);
  const clientIdsWithOverrides = useMemo(() => {
    const supportedBlockTypes = Object.keys(supportedBlockTypesRaw ?? {});
    return allClientIds.filter((clientId) => {
      const block = getBlock(clientId);
      return supportedBlockTypes.includes(block.name) && isOverridableBlock(block);
    });
  }, [allClientIds, getBlock, supportedBlockTypesRaw]);
  if (!clientIdsWithOverrides?.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(PanelBody, { title: __("Overrides"), children: /* @__PURE__ */ jsx(BlockQuickNavigation, { clientIds: clientIdsWithOverrides }) });
}
export {
  OverridesPanel as default
};
//# sourceMappingURL=overrides-panel.mjs.map
