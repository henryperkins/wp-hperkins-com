// packages/block-directory/src/plugins/get-install-missing/index.js
import { __, sprintf } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { createBlock } from "@wordpress/blocks";
import { RawHTML } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import {
  Warning,
  useBlockProps,
  store as blockEditorStore
} from "@wordpress/block-editor";
import InstallButton from "./install-button.mjs";
import { store as blockDirectoryStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var getInstallMissing = (OriginalComponent) => (props) => {
  const { originalName } = props.attributes;
  const { block, hasPermission } = useSelect(
    (select) => {
      const { getDownloadableBlocks } = select(blockDirectoryStore);
      const blocks = getDownloadableBlocks(
        "block:" + originalName
      ).filter(({ name }) => originalName === name);
      return {
        hasPermission: select(coreStore).canUser(
          "read",
          "block-directory/search"
        ),
        block: blocks.length && blocks[0]
      };
    },
    [originalName]
  );
  if (!hasPermission || !block) {
    return /* @__PURE__ */ jsx(OriginalComponent, { ...props });
  }
  return /* @__PURE__ */ jsx(ModifiedWarning, { ...props, originalBlock: block });
};
var ModifiedWarning = ({ originalBlock, ...props }) => {
  const { originalName, originalUndelimitedContent, clientId } = props.attributes;
  const { replaceBlock } = useDispatch(blockEditorStore);
  const convertToHTML = () => {
    replaceBlock(
      props.clientId,
      createBlock("core/html", {
        content: originalUndelimitedContent
      })
    );
  };
  const hasContent = !!originalUndelimitedContent;
  const hasHTMLBlock = useSelect(
    (select) => {
      const { canInsertBlockType, getBlockRootClientId } = select(blockEditorStore);
      return canInsertBlockType(
        "core/html",
        getBlockRootClientId(clientId)
      );
    },
    [clientId]
  );
  let messageHTML = sprintf(
    /* translators: %s: block name */
    __(
      "Your site doesn\u2019t include support for the %s block. You can try installing the block or remove it entirely."
    ),
    originalBlock.title || originalName
  );
  const actions = [
    /* @__PURE__ */ jsx(
      InstallButton,
      {
        block: originalBlock,
        attributes: props.attributes,
        clientId: props.clientId
      },
      "install"
    )
  ];
  if (hasContent && hasHTMLBlock) {
    messageHTML = sprintf(
      /* translators: %s: block name */
      __(
        "Your site doesn\u2019t include support for the %s block. You can try installing the block, convert it to a Custom HTML block, or remove it entirely."
      ),
      originalBlock.title || originalName
    );
    actions.push(
      /* @__PURE__ */ jsx(
        Button,
        {
          __next40pxDefaultSize: true,
          onClick: convertToHTML,
          variant: "tertiary",
          children: __("Keep as HTML")
        },
        "convert"
      )
    );
  }
  return /* @__PURE__ */ jsxs("div", { ...useBlockProps(), children: [
    /* @__PURE__ */ jsx(Warning, { actions, children: messageHTML }),
    /* @__PURE__ */ jsx(RawHTML, { children: originalUndelimitedContent })
  ] });
};
var get_install_missing_default = getInstallMissing;
export {
  get_install_missing_default as default
};
//# sourceMappingURL=index.mjs.map
