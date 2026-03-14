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

// packages/block-editor/src/components/block-bindings/attribute-control.js
var attribute_control_exports = {};
__export(attribute_control_exports, {
  default: () => BlockBindingsAttributeControl
});
module.exports = __toCommonJS(attribute_control_exports);
var import_es6 = __toESM(require("fast-deep-equal/es6/index.js"));
var import_i18n = require("@wordpress/i18n");
var import_blocks = require("@wordpress/blocks");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_block_context = __toESM(require("../block-context/index.cjs"));
var import_source_fields_list = __toESM(require("./source-fields-list.cjs"));
var import_use_block_bindings_utils = __toESM(require("./use-block-bindings-utils.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Menu } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function BlockBindingsAttributeControl({
  attribute,
  binding,
  blockName
}) {
  const { updateBlockBindings } = (0, import_use_block_bindings_utils.default)();
  const isMobile = (0, import_compose.useViewportMatch)("medium", "<");
  const blockContext = (0, import_element.useContext)(import_block_context.default);
  const compatibleFields = (0, import_data.useSelect)(
    (select) => {
      const {
        getAllBlockBindingsSources,
        getBlockBindingsSourceFieldsList,
        getBlockType
      } = (0, import_lock_unlock.unlock)(select(import_blocks.store));
      const _attributeType = getBlockType(blockName).attributes?.[attribute]?.type;
      const attributeType = _attributeType === "rich-text" ? "string" : _attributeType;
      const sourceFields = {};
      Object.entries(getAllBlockBindingsSources()).forEach(
        ([sourceName, source2]) => {
          const fieldsList = getBlockBindingsSourceFieldsList(
            source2,
            blockContext
          );
          if (!fieldsList?.length) {
            return;
          }
          const compatibleFieldsList = fieldsList.filter(
            (field) => field.type === attributeType
          );
          if (compatibleFieldsList.length) {
            sourceFields[sourceName] = compatibleFieldsList;
          }
        }
      );
      return sourceFields;
    },
    [attribute, blockName, blockContext]
  );
  const { canUpdateBlockBindings } = (0, import_data.useSelect)((select) => ({
    canUpdateBlockBindings: select(import_store.store).getSettings().canUpdateBlockBindings
  }));
  const hasCompatibleFields = Object.keys(compatibleFields).length > 0;
  const isAttributeReadOnly = !canUpdateBlockBindings || !hasCompatibleFields;
  const { source: boundSourceName, args } = binding || {};
  const source = (0, import_blocks.getBlockBindingsSource)(boundSourceName);
  let displayText;
  let isValid = true;
  if (binding === void 0) {
    if (!hasCompatibleFields) {
      displayText = (0, import_i18n.__)("No sources available");
    } else {
      displayText = (0, import_i18n.__)("Not connected");
    }
    isValid = true;
  } else if (!source) {
    isValid = false;
    displayText = (0, import_i18n.__)("Source not registered");
  } else {
    displayText = compatibleFields?.[boundSourceName]?.find(
      (field) => (0, import_es6.default)(field.args, args)
    )?.label || source?.label || boundSourceName;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalToolsPanelItem,
    {
      hasValue: () => !!binding,
      label: attribute,
      onDeselect: !!hasCompatibleFields && (() => {
        updateBlockBindings({
          [attribute]: void 0
        });
      }),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, { placement: isMobile ? "bottom-start" : "left-start", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Menu.TriggerButton,
          {
            render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItem, {}),
            disabled: !hasCompatibleFields,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              import_components.__experimentalVStack,
              {
                className: "block-editor-bindings__item",
                spacing: 0,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { truncate: true, children: attribute }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_components.__experimentalText,
                    {
                      truncate: true,
                      variant: isValid ? "muted" : void 0,
                      isDestructive: !isValid,
                      children: displayText
                    }
                  )
                ]
              }
            )
          }
        ),
        !isAttributeReadOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.Popover, { gutter: isMobile ? 8 : 36, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Menu,
          {
            placement: isMobile ? "bottom-start" : "left-start",
            children: Object.entries(compatibleFields).map(
              ([sourceKey, fields]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_source_fields_list.default,
                {
                  args: binding?.args,
                  attribute,
                  sourceKey,
                  fields
                },
                sourceKey
              )
            )
          }
        ) })
      ] })
    }
  );
}
//# sourceMappingURL=attribute-control.cjs.map
