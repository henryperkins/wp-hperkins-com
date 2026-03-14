"use strict";
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

// packages/block-editor/src/hooks/block-bindings.js
var block_bindings_exports = {};
__export(block_bindings_exports, {
  BlockBindingsPanel: () => BlockBindingsPanel,
  default: () => block_bindings_default
});
module.exports = __toCommonJS(block_bindings_exports);
var import_i18n = require("@wordpress/i18n");
var import_blocks = require("@wordpress/blocks");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_block_bindings = require("../components/block-bindings/index.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_inspector_controls = __toESM(require("../components/inspector-controls/index.cjs"));
var import_block_context = __toESM(require("../components/block-context/index.cjs"));
var import_store = require("../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var useToolsPanelDropdownMenuProps = () => {
  const isMobile = (0, import_compose.useViewportMatch)("medium", "<");
  return !isMobile ? {
    popoverProps: {
      placement: "left-start",
      // For non-mobile, inner sidebar width (248px) - button width (24px) - border (1px) + padding (16px) + spacing (20px)
      offset: 259
    }
  } : {};
};
var BlockBindingsPanel = ({ name: blockName, metadata }) => {
  const blockContext = (0, import_element.useContext)(import_block_context.default);
  const { removeAllBlockBindings } = (0, import_block_bindings.useBlockBindingsUtils)();
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const { bindableAttributes, hasCompatibleFields } = (0, import_data.useSelect)(
    (select) => {
      const { __experimentalBlockBindingsSupportedAttributes } = select(import_store.store).getSettings();
      const {
        getAllBlockBindingsSources,
        getBlockBindingsSourceFieldsList
      } = (0, import_lock_unlock.unlock)(select(import_blocks.store));
      return {
        bindableAttributes: __experimentalBlockBindingsSupportedAttributes?.[blockName],
        hasCompatibleFields: Object.values(
          getAllBlockBindingsSources()
        ).some(
          (source) => getBlockBindingsSourceFieldsList(source, blockContext)?.length > 0
        )
      };
    },
    [blockName, blockContext]
  );
  if (!bindableAttributes || bindableAttributes.length === 0) {
    return null;
  }
  const { bindings } = metadata || {};
  if (bindings === void 0 && !hasCompatibleFields) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default, { group: "bindings", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalToolsPanel,
    {
      label: (0, import_i18n.__)("Attributes"),
      resetAll: () => {
        removeAllBlockBindings();
      },
      dropdownMenuProps,
      className: "block-editor-bindings__panel",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItemGroup, { isBordered: true, isSeparated: true, children: bindableAttributes.map((attribute) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_bindings.BlockBindingsAttributeControl,
          {
            attribute,
            blockName,
            binding: bindings?.[attribute]
          },
          attribute
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { as: "div", variant: "muted", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)(
          "Attributes connected to custom fields or other dynamic data."
        ) }) })
      ]
    }
  ) });
};
var block_bindings_default = {
  edit: BlockBindingsPanel,
  attributeKeys: ["metadata"],
  hasSupport(name) {
    return ![
      "core/post-date",
      "core/navigation-link",
      "core/navigation-submenu"
    ].includes(name);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockBindingsPanel
});
//# sourceMappingURL=block-bindings.cjs.map
