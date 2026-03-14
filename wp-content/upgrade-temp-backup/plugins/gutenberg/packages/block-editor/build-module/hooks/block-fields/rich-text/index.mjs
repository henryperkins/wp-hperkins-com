// packages/block-editor/src/hooks/block-fields/rich-text/index.js
import { BaseControl, useBaseControlProps } from "@wordpress/components";
import { useMergeRefs } from "@wordpress/compose";
import { useRegistry } from "@wordpress/data";
import { useMemo, useRef, useState } from "@wordpress/element";
import { privateApis as richTextPrivateApis } from "@wordpress/rich-text";
import { getAllowedFormats } from "../../../components/rich-text/utils.mjs";
import { useEventListeners } from "../../../components/rich-text/event-listeners/index.mjs";
import FormatEdit from "../../../components/rich-text/format-edit.mjs";
import {
  keyboardShortcutContext,
  inputEventContext
} from "../../../components/rich-text/index.mjs";
import { unlock } from "../../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useRichText } = unlock(richTextPrivateApis);
function RichTextControl({
  data,
  field,
  hideLabelFromVision,
  onChange,
  config = {}
}) {
  const registry = useRegistry();
  const attrValue = field.getValue({ item: data });
  const fieldConfig = field.config || {};
  const { clientId } = config;
  const [selection, setSelection] = useState({
    start: void 0,
    end: void 0
  });
  const [isSelected, setIsSelected] = useState(false);
  const anchorRef = useRef();
  const inputEvents = useRef(/* @__PURE__ */ new Set());
  const keyboardShortcuts = useRef(/* @__PURE__ */ new Set());
  const adjustedAllowedFormats = getAllowedFormats({
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
    __unstableFormatTypeHandlerContext: useMemo(
      () => ({ richTextIdentifier: field.id, blockClientId: clientId }),
      [field.id, clientId]
    )
  });
  const { baseControlProps, controlProps } = useBaseControlProps({
    hideLabelFromVision: hideLabelFromVision ?? field.hideLabelFromVision,
    label: field.label
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isSelected && /* @__PURE__ */ jsx(keyboardShortcutContext.Provider, { value: keyboardShortcuts, children: /* @__PURE__ */ jsx(inputEventContext.Provider, { value: inputEvents, children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      FormatEdit,
      {
        value,
        onChange: onRichTextChange,
        onFocus,
        formatTypes,
        forwardedRef: anchorRef,
        isVisible: false
      }
    ) }) }) }),
    /* @__PURE__ */ jsx(BaseControl, { ...baseControlProps, children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "block-editor-content-only-controls__rich-text",
        role: "textbox",
        "aria-multiline": !fieldConfig?.disableLineBreaks,
        ref: useMergeRefs([
          richTextRef,
          useEventListeners({
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
export {
  RichTextControl as default
};
//# sourceMappingURL=index.mjs.map
