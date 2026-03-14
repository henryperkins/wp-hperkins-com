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

// packages/block-editor/src/hooks/block-fields/index.js
var block_fields_exports = {};
__export(block_fields_exports, {
  BlockFieldsPanel: () => BlockFieldsPanel,
  default: () => block_fields_default
});
module.exports = __toCommonJS(block_fields_exports);
var import_blocks = require("@wordpress/blocks");
var import_compose = require("@wordpress/compose");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_dataviews = require("@wordpress/dataviews");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_block_context = __toESM(require("../../components/block-context/index.cjs"));
var import_block_icon = __toESM(require("../../components/block-icon/index.cjs"));
var import_use_block_display_title = __toESM(require("../../components/block-title/use-block-display-title.cjs"));
var import_use_block_display_information = __toESM(require("../../components/use-block-display-information/index.cjs"));
var import_fields_dropdown_menu = __toESM(require("./fields-dropdown-menu.cjs"));
var import_private_block_context = require("../../components/block-list/private-block-context.cjs");
var import_fill = __toESM(require("../../components/inspector-controls/fill.cjs"));
var import_rich_text = __toESM(require("./rich-text/index.cjs"));
var import_media = __toESM(require("./media/index.cjs"));
var import_link = __toESM(require("./link/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var { fieldsKey, formKey } = (0, import_lock_unlock.unlock)(import_blocks.privateApis);
function createConfiguredControl(ControlComponent, config = {}) {
  return function ConfiguredControl(props) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlComponent, { ...props, config });
  };
}
function BlockFields({
  clientId,
  blockType,
  setAttributes,
  isMultiBlock = false
}) {
  const blockTitle = (0, import_use_block_display_title.default)({
    clientId,
    context: "list-view"
  });
  const blockInformation = (0, import_use_block_display_information.default)(clientId);
  const blockTypeFields = blockType?.[fieldsKey];
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
  const { selectBlock, toggleBlockHighlight } = (0, import_data.useDispatch)(import_store.store);
  const debouncedToggleBlockHighlight = (0, import_compose.useDebounce)(
    toggleBlockHighlight,
    50
  );
  const computedForm = (0, import_element.useMemo)(() => {
    if (!isMultiBlock) {
      return blockType?.[formKey];
    }
    return {
      ...blockType?.[formKey],
      fields: [blockType?.[formKey]?.fields?.[0]]
    };
  }, [blockType, isMultiBlock]);
  const [form, setForm] = (0, import_element.useState)(computedForm);
  const dataFormFields = (0, import_element.useMemo)(() => {
    if (!blockTypeFields?.length) {
      return [];
    }
    return blockTypeFields.map((fieldDef) => {
      const field = {
        ...fieldDef
      };
      if ("string" === typeof fieldDef.Edit && fieldDef.Edit === "rich-text") {
        field.Edit = createConfiguredControl(import_rich_text.default, {
          clientId
        });
      } else if ("string" === typeof fieldDef.Edit && fieldDef.Edit === "link") {
        field.Edit = createConfiguredControl(import_link.default);
      } else if ("object" === typeof fieldDef.Edit && fieldDef.Edit.control === "media") {
        field.Edit = createConfiguredControl(import_media.default, {
          ...fieldDef.Edit
        });
      }
      return field;
    });
  }, [blockTypeFields, clientId]);
  if (!blockTypeFields?.length) {
    return null;
  }
  const handleToggleField = (fieldId) => {
    setForm((prev) => {
      if (prev.fields?.includes(fieldId)) {
        return {
          ...prev,
          fields: prev.fields.filter((id) => id !== fieldId)
        };
      }
      return {
        ...prev,
        fields: [...prev.fields || [], fieldId]
      };
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: "block-editor-block-fields__container",
      onMouseEnter: isMultiBlock ? () => debouncedToggleBlockHighlight(clientId, true) : void 0,
      onMouseLeave: () => isMultiBlock ? debouncedToggleBlockHighlight(clientId, false) : void 0,
      onFocus: isMultiBlock ? () => {
        selectBlock(
          clientId,
          null
          /* null to avoid focus on the block in the canvas */
        );
      } : void 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-editor-block-fields__header", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { spacing: 1, children: [
          isMultiBlock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_block_icon.default,
              {
                className: "block-editor-block-fields__header-icon",
                icon: blockInformation?.icon
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "block-editor-block-fields__header-title", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalTruncate, { numberOfLines: 1, children: blockTitle }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_fields_dropdown_menu.default,
              {
                fields: dataFormFields,
                visibleFields: form.fields,
                onToggleField: handleToggleField
              }
            )
          ] }),
          !isMultiBlock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "block-editor-block-fields__header-title", children: (0, import_i18n.__)("Content") })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_dataviews.DataForm,
          {
            data: attributes,
            fields: dataFormFields,
            form,
            onChange: setAttributes
          }
        )
      ]
    }
  );
}
function hasBlockFieldsSupport(blockName) {
  return !!(window?.__experimentalContentOnlyInspectorFields && (0, import_blocks.getBlockType)(blockName)?.[fieldsKey]);
}
function BlockFieldsPanel(props) {
  const { blockType, isSelectionWithinCurrentSection } = (0, import_element.useContext)(import_private_block_context.PrivateBlockContext);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_fill.default, { group: "content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    BlockFields,
    {
      ...props,
      blockType,
      isMultiBlock: isSelectionWithinCurrentSection
    }
  ) });
}
var block_fields_default = {
  edit: BlockFieldsPanel,
  hasSupport: hasBlockFieldsSupport,
  attributeKeys: [],
  supportsPatternEditing: true
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockFieldsPanel
});
//# sourceMappingURL=index.cjs.map
