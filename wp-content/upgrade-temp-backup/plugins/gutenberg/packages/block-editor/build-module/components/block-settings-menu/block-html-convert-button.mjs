// packages/block-editor/src/components/block-settings-menu/block-html-convert-button.js
import { __ } from "@wordpress/i18n";
import { MenuItem } from "@wordpress/components";
import { rawHandler, getBlockContent } from "@wordpress/blocks";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function BlockHTMLConvertButton({ clientId }) {
  const block = useSelect(
    (select) => select(blockEditorStore).getBlock(clientId),
    [clientId]
  );
  const { replaceBlocks } = useDispatch(blockEditorStore);
  if (!block || block.name !== "core/html") {
    return null;
  }
  return /* @__PURE__ */ jsx(
    MenuItem,
    {
      onClick: () => replaceBlocks(
        clientId,
        rawHandler({ HTML: getBlockContent(block) })
      ),
      children: __("Convert to Blocks")
    }
  );
}
var block_html_convert_button_default = BlockHTMLConvertButton;
export {
  block_html_convert_button_default as default
};
//# sourceMappingURL=block-html-convert-button.mjs.map
