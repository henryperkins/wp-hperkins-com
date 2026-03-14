// packages/block-editor/src/components/block-visibility/viewport-toolbar.js
import { __ } from "@wordpress/i18n";
import { ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { useRef, useEffect } from "@wordpress/element";
import { seen, unseen } from "@wordpress/icons";
import { hasBlockSupport } from "@wordpress/blocks";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
function BlockVisibilityViewportToolbar({ clientIds }) {
  const hasBlockVisibilityButtonShownRef = useRef(false);
  const { canToggleBlockVisibility, areBlocksHiddenAnywhere } = useSelect(
    (select) => {
      const { getBlocksByClientId, getBlockName, isBlockHiddenAnywhere } = unlock(select(blockEditorStore));
      const _blocks = getBlocksByClientId(clientIds);
      return {
        canToggleBlockVisibility: _blocks.every(
          ({ clientId }) => hasBlockSupport(
            getBlockName(clientId),
            "visibility",
            true
          )
        ),
        areBlocksHiddenAnywhere: clientIds?.every(
          (clientId) => isBlockHiddenAnywhere(clientId)
        )
      };
    },
    [clientIds]
  );
  const blockEditorDispatch = useDispatch(blockEditorStore);
  useEffect(() => {
    if (areBlocksHiddenAnywhere) {
      hasBlockVisibilityButtonShownRef.current = true;
    }
  }, [areBlocksHiddenAnywhere]);
  if (!areBlocksHiddenAnywhere && !hasBlockVisibilityButtonShownRef.current) {
    return null;
  }
  const { showViewportModal } = unlock(blockEditorDispatch);
  return /* @__PURE__ */ jsx(ToolbarGroup, { className: "block-editor-block-visibility-toolbar", children: /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      disabled: !canToggleBlockVisibility,
      icon: areBlocksHiddenAnywhere ? unseen : seen,
      label: areBlocksHiddenAnywhere ? __("Hidden") : __("Visible"),
      onClick: () => showViewportModal(clientIds),
      "aria-haspopup": "dialog"
    }
  ) });
}
export {
  BlockVisibilityViewportToolbar as default
};
//# sourceMappingURL=viewport-toolbar.mjs.map
