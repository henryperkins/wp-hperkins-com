// packages/block-library/src/freeform/convert-to-blocks-button.js
import { __ } from "@wordpress/i18n";
import { ToolbarButton } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { rawHandler, serialize } from "@wordpress/blocks";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
var ConvertToBlocksButton = ({ clientId }) => {
  const { replaceBlocks } = useDispatch(blockEditorStore);
  const block = useSelect(
    (select) => {
      return select(blockEditorStore).getBlock(clientId);
    },
    [clientId]
  );
  return /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      onClick: () => replaceBlocks(
        block.clientId,
        rawHandler({ HTML: serialize(block) })
      ),
      children: __("Convert to blocks")
    }
  );
};
var convert_to_blocks_button_default = ConvertToBlocksButton;
export {
  convert_to_blocks_button_default as default
};
//# sourceMappingURL=convert-to-blocks-button.mjs.map
