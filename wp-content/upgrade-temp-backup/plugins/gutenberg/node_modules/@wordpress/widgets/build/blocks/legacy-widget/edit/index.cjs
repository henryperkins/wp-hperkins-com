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

// packages/widgets/src/blocks/legacy-widget/edit/index.js
var edit_exports = {};
__export(edit_exports, {
  default: () => Edit
});
module.exports = __toCommonJS(edit_exports);
var import_clsx = __toESM(require("clsx"));
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_widget_type_selector = __toESM(require("./widget-type-selector.cjs"));
var import_inspector_card = __toESM(require("./inspector-card.cjs"));
var import_form = __toESM(require("./form.cjs"));
var import_preview = __toESM(require("./preview.cjs"));
var import_no_preview = __toESM(require("./no-preview.cjs"));
var import_convert_to_blocks_button = __toESM(require("./convert-to-blocks-button.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function Edit(props) {
  const { id, idBase } = props.attributes;
  const { isWide = false } = props;
  const blockProps = (0, import_block_editor.useBlockProps)({
    className: (0, import_clsx.default)({
      "is-wide-widget": isWide
    })
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ...blockProps, children: !id && !idBase ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { ...props }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotEmpty, { ...props }) });
}
function Empty({ attributes: { id, idBase }, setAttributes }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Placeholder,
    {
      icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockIcon, { icon: import_icons.brush }),
      label: (0, import_i18n.__)("Legacy Widget"),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Flex, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexBlock, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_widget_type_selector.default,
        {
          selectedId: id ?? idBase,
          onSelect: ({ selectedId, isMulti }) => {
            if (!selectedId) {
              setAttributes({
                id: null,
                idBase: null,
                instance: null
              });
            } else if (isMulti) {
              setAttributes({
                id: null,
                idBase: selectedId,
                instance: {}
              });
            } else {
              setAttributes({
                id: selectedId,
                idBase: null,
                instance: null
              });
            }
          }
        }
      ) }) })
    }
  );
}
function NotEmpty({
  attributes: { id, idBase, instance },
  setAttributes,
  clientId,
  isSelected,
  isWide = false
}) {
  const [hasPreview, setHasPreview] = (0, import_element.useState)(null);
  const widgetTypeId = id ?? idBase;
  const { record: widgetType, hasResolved: hasResolvedWidgetType } = (0, import_core_data.useEntityRecord)("root", "widgetType", widgetTypeId);
  const setInstance = (0, import_element.useCallback)((nextInstance) => {
    setAttributes({ instance: nextInstance });
  }, []);
  if (!widgetType && hasResolvedWidgetType) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Placeholder,
      {
        icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockIcon, { icon: import_icons.brush }),
        label: (0, import_i18n.__)("Legacy Widget"),
        children: (0, import_i18n.__)("Widget is missing.")
      }
    );
  }
  if (!hasResolvedWidgetType) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Placeholder, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}) });
  }
  const mode = idBase && !isSelected ? "preview" : "edit";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    idBase === "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockControls, { group: "other", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_convert_to_blocks_button.default,
      {
        clientId,
        rawInstance: instance.raw
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InspectorControls, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_inspector_card.default,
      {
        name: widgetType.name,
        description: widgetType.description
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_form.default,
      {
        title: widgetType.name,
        isVisible: mode === "edit",
        id,
        idBase,
        instance,
        isWide,
        onChangeInstance: setInstance,
        onChangeHasPreview: setHasPreview
      }
    ),
    idBase && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      hasPreview === null && mode === "preview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Placeholder, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}) }),
      hasPreview === true && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_preview.default,
        {
          idBase,
          instance,
          isVisible: mode === "preview"
        }
      ),
      hasPreview === false && mode === "preview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_no_preview.default, { name: widgetType.name })
    ] })
  ] });
}
//# sourceMappingURL=index.cjs.map
