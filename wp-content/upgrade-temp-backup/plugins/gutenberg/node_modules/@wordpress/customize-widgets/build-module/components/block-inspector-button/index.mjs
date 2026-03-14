// packages/customize-widgets/src/components/block-inspector-button/index.js
import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { MenuItem } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
function BlockInspectorButton({ inspector, closeMenu, ...props }) {
  const selectedBlockClientId = useSelect(
    (select) => select(blockEditorStore).getSelectedBlockClientId(),
    []
  );
  const selectedBlock = useMemo(
    () => document.getElementById(`block-${selectedBlockClientId}`),
    [selectedBlockClientId]
  );
  return /* @__PURE__ */ jsx(
    MenuItem,
    {
      onClick: () => {
        inspector.open({
          returnFocusWhenClose: selectedBlock
        });
        closeMenu();
      },
      ...props,
      children: __("Show more settings")
    }
  );
}
var block_inspector_button_default = BlockInspectorButton;
export {
  block_inspector_button_default as default
};
//# sourceMappingURL=index.mjs.map
