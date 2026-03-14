// packages/block-editor/src/components/block-edit-visually-button/index.js
import { ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function BlockEditVisuallyButton({ clientIds }) {
  const clientId = clientIds.length === 1 ? clientIds[0] : void 0;
  const canEditVisually = useSelect(
    (select) => !!clientId && select(blockEditorStore).getBlockMode(clientId) === "html",
    [clientId]
  );
  const { toggleBlockMode } = useDispatch(blockEditorStore);
  if (!canEditVisually) {
    return null;
  }
  return /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      onClick: () => {
        toggleBlockMode(clientId);
      },
      children: __("Edit visually")
    }
  ) });
}
export {
  BlockEditVisuallyButton as default
};
//# sourceMappingURL=index.mjs.map
