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

// packages/block-editor/src/hooks/block-fields/rich-text/index.js
var rich_text_exports = {};
__export(rich_text_exports, {
  default: () => RichTextControl
});
module.exports = __toCommonJS(rich_text_exports);
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_rich_text = require("@wordpress/rich-text");
var import_utils = require("../../../components/rich-text/utils.cjs");
var import_event_listeners = require("../../../components/rich-text/event-listeners/index.cjs");
var import_format_edit = __toESM(require("../../../components/rich-text/format-edit.cjs"));
var import_rich_text2 = require("../../../components/rich-text/index.cjs");
var import_lock_unlock = require("../../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useRichText } = (0, import_lock_unlock.unlock)(import_rich_text.privateApis);
function RichTextControl({
  data,
  field,
  hideLabelFromVision,
  onChange,
  config = {}
}) {
  const registry = (0, import_data.useRegistry)();
  const attrValue = field.getValue({ item: data });
  const fieldConfig = field.config || {};
  const { clientId } = config;
  const [selection, setSelection] = (0, import_element.useState)({
    start: void 0,
    end: void 0
  });
  const [isSelected, setIsSelected] = (0, import_element.useState)(false);
  const anchorRef = (0, import_element.useRef)();
  const inputEvents = (0, import_element.useRef)(/* @__PURE__ */ new Set());
  const keyboardShortcuts = (0, import_element.useRef)(/* @__PURE__ */ new Set());
  const adjustedAllowedFormats = (0, import_utils.getAllowedFormats)({
    allowedFormats: fieldConfig?.allowedFormats,
    disableFormats: fieldConfig?.disableFormats
  });
  function onFocus() {
    anchorRef.current?.focus();
  }
  const {
    value,
    getValue,
    onChange: onRichTextChange,
    ref: richTextRef,
    formatTypes
  } = useRichText({
    value: attrValue,
    onChange(html) {
      onChange(field.setValue({ item: data, value: html }));
    },
    selectionStart: selection.start,
    selectionEnd: selection.end,
    onSelectionChange: (start, end) => setSelection({ start, end }),
    __unstableIsSelected: isSelected,
    preserveWhiteSpace: !!fieldConfig?.preserveWhiteSpace,
    placeholder: fieldConfig?.placeholder,
    __unstableDisableFormats: fieldConfig?.disableFormats,
    allowedFormats: adjustedAllowedFormats,
    withoutInteractiveFormatting: fieldConfig?.withoutInteractiveFormatting,
    __unstableFormatTypeHandlerContext: (0, import_element.useMemo)(
      () => ({ richTextIdentifier: field.id, blockClientId: clientId }),
      [field.id, clientId]
    )
  });
  const { baseControlProps, controlProps } = (0, import_components.useBaseControlProps)({
    hideLabelFromVision: hideLabelFromVision ?? field.hideLabelFromVision,
    label: field.label
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_rich_text2.keyboardShortcutContext.Provider, { value: keyboardShortcuts, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_rich_text2.inputEventContext.Provider, { value: inputEvents, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_format_edit.default,
      {
        value,
        onChange: onRichTextChange,
        onFocus,
        formatTypes,
        forwardedRef: anchorRef,
        isVisible: false
      }
    ) }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.BaseControl, { ...baseControlProps, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: "block-editor-content-only-controls__rich-text",
        role: "textbox",
        "aria-multiline": !fieldConfig?.disableLineBreaks,
        ref: (0, import_compose.useMergeRefs)([
          richTextRef,
          (0, import_event_listeners.useEventListeners)({
            registry,
            getValue,
            onChange: onRichTextChange,
            formatTypes,
            selectionChange: setSelection,
            isSelected,
            disableFormats: fieldConfig?.disableFormats,
            value,
            tagName: "div",
            disableLineBreaks: fieldConfig?.disableLineBreaks,
            keyboardShortcuts,
            inputEvents
          }),
          anchorRef
        ]),
        onFocus: () => setIsSelected(true),
        onBlur: () => setIsSelected(false),
        contentEditable: true,
        ...controlProps
      }
    ) })
  ] });
}
//# sourceMappingURL=index.cjs.map
