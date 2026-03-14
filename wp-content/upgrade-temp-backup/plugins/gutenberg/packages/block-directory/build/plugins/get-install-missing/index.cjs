var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-directory/src/plugins/get-install-missing/index.js
var get_install_missing_exports = {};
__export(get_install_missing_exports, {
  default: () => get_install_missing_default
});
module.exports = __toCommonJS(get_install_missing_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_blocks = require("@wordpress/blocks");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var import_install_button = __toESM(require("./install-button.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var getInstallMissing = (OriginalComponent) => (props) => {
  const { originalName } = props.attributes;
  const { block, hasPermission } = (0, import_data.useSelect)(
    (select) => {
      const { getDownloadableBlocks } = select(import_store.store);
      const blocks = getDownloadableBlocks(
        "block:" + originalName
      ).filter(({ name }) => originalName === name);
      return {
        hasPermission: select(import_core_data.store).canUser(
          "read",
          "block-directory/search"
        ),
        block: blocks.length && blocks[0]
      };
    },
    [originalName]
  );
  if (!hasPermission || !block) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OriginalComponent, { ...props });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModifiedWarning, { ...props, originalBlock: block });
};
var ModifiedWarning = ({ originalBlock, ...props }) => {
  const { originalName, originalUndelimitedContent, clientId } = props.attributes;
  const { replaceBlock } = (0, import_data.useDispatch)(import_block_editor.store);
  const convertToHTML = () => {
    replaceBlock(
      props.clientId,
      (0, import_blocks.createBlock)("core/html", {
        content: originalUndelimitedContent
      })
    );
  };
  const hasContent = !!originalUndelimitedContent;
  const hasHTMLBlock = (0, import_data.useSelect)(
    (select) => {
      const { canInsertBlockType, getBlockRootClientId } = select(import_block_editor.store);
      return canInsertBlockType(
        "core/html",
        getBlockRootClientId(clientId)
      );
    },
    [clientId]
  );
  let messageHTML = (0, import_i18n.sprintf)(
    /* translators: %s: block name */
    (0, import_i18n.__)(
      "Your site doesn\u2019t include support for the %s block. You can try installing the block or remove it entirely."
    ),
    originalBlock.title || originalName
  );
  const actions = [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_install_button.default,
      {
        block: originalBlock,
        attributes: props.attributes,
        clientId: props.clientId
      },
      "install"
    )
  ];
  if (hasContent && hasHTMLBlock) {
    messageHTML = (0, import_i18n.sprintf)(
      /* translators: %s: block name */
      (0, import_i18n.__)(
        "Your site doesn\u2019t include support for the %s block. You can try installing the block, convert it to a Custom HTML block, or remove it entirely."
      ),
      originalBlock.title || originalName
    );
    actions.push(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          onClick: convertToHTML,
          variant: "tertiary",
          children: (0, import_i18n.__)("Keep as HTML")
        },
        "convert"
      )
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ...(0, import_block_editor.useBlockProps)(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.Warning, { actions, children: messageHTML }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_element.RawHTML, { children: originalUndelimitedContent })
  ] });
};
var get_install_missing_default = getInstallMissing;
//# sourceMappingURL=index.cjs.map
