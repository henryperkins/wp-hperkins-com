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

// packages/block-editor/src/hooks/auto-inspector-controls.js
var auto_inspector_controls_exports = {};
__export(auto_inspector_controls_exports, {
  default: () => auto_inspector_controls_default
});
module.exports = __toCommonJS(auto_inspector_controls_exports);
var import_blocks = require("@wordpress/blocks");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_dataviews = require("@wordpress/dataviews");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_inspector_controls = __toESM(require("../components/inspector-controls/index.cjs"));
var import_block_editing_mode = require("../components/block-editing-mode/index.cjs");
var import_store = require("../store/index.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_block_context = __toESM(require("../components/block-context/index.cjs"));
var import_generate_fields_from_attributes = require("./generate-fields-from-attributes.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function hasAutoGenerateControl(blockTypeAttributes) {
  if (!blockTypeAttributes) {
    return false;
  }
  return Object.values(blockTypeAttributes).some(
    (attr) => attr?.autoGenerateControl
  );
}
function AutoRegisterControls({ name, clientId, setAttributes }) {
  const blockEditingMode = (0, import_block_editing_mode.useBlockEditingMode)();
  const blockContext = (0, import_element.useContext)(import_block_context.default);
  const attributes = (0, import_data.useSelect)(
    (select) => {
      const _attributes = select(import_store.store).getBlockAttributes(clientId);
      if (!_attributes?.metadata?.bindings) {
        return _attributes;
      }
      const { getBlockBindingsSource } = (0, import_lock_unlock.unlock)(select(import_blocks.store));
      return Object.entries(_attributes.metadata.bindings).reduce(
        (acc, [attribute, binding]) => {
          const source = getBlockBindingsSource(binding.source);
          if (!source) {
            return acc;
          }
          const values = source.getValues({
            select,
            context: blockContext,
            bindings: { [attribute]: binding }
          });
          return { ...acc, ...values };
        },
        _attributes
      );
    },
    [blockContext, clientId]
  );
  const blockType = (0, import_blocks.getBlockType)(name);
  const { fields, form } = (0, import_element.useMemo)(() => {
    if (!blockType?.attributes) {
      return { fields: [], form: { fields: [] } };
    }
    return (0, import_generate_fields_from_attributes.generateFieldsFromAttributes)(blockType.attributes);
  }, [blockType?.attributes]);
  if (blockEditingMode !== "default") {
    return null;
  }
  if (!fields || fields.length === 0) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.PanelBody, { title: (0, import_i18n.__)("Settings"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_dataviews.DataForm,
    {
      data: attributes,
      fields,
      form,
      onChange: setAttributes
    }
  ) }) });
}
var auto_inspector_controls_default = {
  edit: AutoRegisterControls,
  attributeKeys: [],
  hasSupport(name) {
    const blockType = (0, import_blocks.getBlockType)(name);
    return hasAutoGenerateControl(blockType?.attributes);
  }
};
//# sourceMappingURL=auto-inspector-controls.cjs.map
