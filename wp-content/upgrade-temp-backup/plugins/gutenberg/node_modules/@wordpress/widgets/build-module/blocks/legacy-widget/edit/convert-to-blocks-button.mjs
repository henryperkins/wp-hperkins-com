// packages/widgets/src/blocks/legacy-widget/edit/convert-to-blocks-button.js
import { useDispatch } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { ToolbarButton } from "@wordpress/components";
import { createBlock, rawHandler } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
function ConvertToBlocksButton({ clientId, rawInstance }) {
  const { replaceBlocks } = useDispatch(blockEditorStore);
  return /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      onClick: () => {
        if (rawInstance.title) {
          replaceBlocks(clientId, [
            createBlock("core/heading", {
              content: rawInstance.title
            }),
            ...rawHandler({ HTML: rawInstance.text })
          ]);
        } else {
          replaceBlocks(
            clientId,
            rawHandler({ HTML: rawInstance.text })
          );
        }
      },
      children: __("Convert to blocks")
    }
  );
}
export {
  ConvertToBlocksButton as default
};
//# sourceMappingURL=convert-to-blocks-button.mjs.map
