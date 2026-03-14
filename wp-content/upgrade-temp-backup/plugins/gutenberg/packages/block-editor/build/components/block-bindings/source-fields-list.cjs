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

// packages/block-editor/src/components/block-bindings/source-fields-list.js
var source_fields_list_exports = {};
__export(source_fields_list_exports, {
  default: () => BlockBindingsSourceFieldsList
});
module.exports = __toCommonJS(source_fields_list_exports);
var import_es6 = __toESM(require("fast-deep-equal/es6/index.js"));
var import_blocks = require("@wordpress/blocks");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_use_block_bindings_utils = __toESM(require("./use-block-bindings-utils.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_block_context = __toESM(require("../block-context/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var { Menu } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function BlockBindingsSourceFieldsListItem({
  args,
  attribute,
  field,
  source,
  sourceKey
}) {
  const itemBindings = (0, import_element.useMemo)(
    () => ({
      source: sourceKey,
      args: field.args || {
        key: field.key
      }
    }),
    [field.args, field.key, sourceKey]
  );
  const blockContext = (0, import_element.useContext)(import_block_context.default);
  const values = (0, import_data.useSelect)(
    (select) => source.getValues({
      select,
      context: blockContext,
      bindings: {
        [attribute]: itemBindings
      }
    }),
    [attribute, blockContext, itemBindings, source]
  );
  const { updateBlockBindings } = (0, import_use_block_bindings_utils.default)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    Menu.CheckboxItem,
    {
      onChange: () => {
        const isCurrentlySelected = (0, import_es6.default)(args, field.args) ?? // Deprecate key dependency in 7.0.
        field.key === args?.key;
        if (isCurrentlySelected) {
          updateBlockBindings({
            [attribute]: void 0
          });
        } else {
          updateBlockBindings({
            [attribute]: itemBindings
          });
        }
      },
      name: attribute + "-binding",
      value: values[attribute],
      checked: (0, import_es6.default)(args, field.args) ?? // Deprecate key dependency in 7.0.
      field.key === args?.key,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.ItemLabel, { children: field.label }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.ItemHelpText, { children: values[attribute] })
      ]
    }
  );
}
function BlockBindingsSourceFieldsList({
  args,
  attribute,
  sourceKey,
  fields
}) {
  const isMobile = (0, import_compose.useViewportMatch)("medium", "<");
  if (!fields || fields.length === 0) {
    return null;
  }
  const source = (0, import_blocks.getBlockBindingsSource)(sourceKey);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    Menu,
    {
      placement: isMobile ? "bottom-start" : "left-start",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.SubmenuTriggerItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.ItemLabel, { children: source.label }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.Popover, { gutter: 8, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.Group, { children: fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          BlockBindingsSourceFieldsListItem,
          {
            args,
            attribute,
            field,
            source,
            sourceKey
          },
          sourceKey + JSON.stringify(field.args) || field.key
        )) }) })
      ]
    },
    sourceKey
  );
}
//# sourceMappingURL=source-fields-list.cjs.map
