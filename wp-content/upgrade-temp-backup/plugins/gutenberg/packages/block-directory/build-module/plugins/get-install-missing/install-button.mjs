// packages/block-directory/src/plugins/get-install-missing/install-button.js
import { __, sprintf } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { createBlock, getBlockType, parse } from "@wordpress/blocks";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { store as blockDirectoryStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function InstallButton({ attributes, block, clientId }) {
  const isInstallingBlock = useSelect(
    (select) => select(blockDirectoryStore).isInstalling(block.id),
    [block.id]
  );
  const { installBlockType } = useDispatch(blockDirectoryStore);
  const { replaceBlock } = useDispatch(blockEditorStore);
  return /* @__PURE__ */ jsx(
    Button,
    {
      __next40pxDefaultSize: true,
      onClick: () => installBlockType(block).then((success) => {
        if (success) {
          const blockType = getBlockType(block.name);
          const [originalBlock] = parse(
            attributes.originalContent
          );
          if (originalBlock && blockType) {
            replaceBlock(
              clientId,
              createBlock(
                blockType.name,
                originalBlock.attributes,
                originalBlock.innerBlocks
              )
            );
          }
        }
      }),
      accessibleWhenDisabled: true,
      disabled: isInstallingBlock,
      isBusy: isInstallingBlock,
      variant: "primary",
      children: sprintf(
        /* translators: %s: block name */
        __("Install %s"),
        block.title
      )
    }
  );
}
export {
  InstallButton as default
};
//# sourceMappingURL=install-button.mjs.map
