// packages/block-editor/src/components/rich-text/index.js
import clsx from "clsx";
import fastDeepEqual from "fast-deep-equal/es6/index.js";
import {
  useRef,
  useState,
  useCallback,
  useMemo,
  forwardRef,
  createContext,
  useContext
} from "@wordpress/element";
import { useDispatch, useRegistry, useSelect } from "@wordpress/data";
import { useMergeRefs, useInstanceId } from "@wordpress/compose";
import { privateApis as richTextPrivateApis } from "@wordpress/rich-text";
import { Popover } from "@wordpress/components";
import { getBlockBindingsSource } from "@wordpress/blocks";
import deprecated from "@wordpress/deprecated";
import { __, sprintf } from "@wordpress/i18n";
import { useBlockEditorAutocompleteProps } from "../autocomplete/index.mjs";
import { useBlockEditContext } from "../block-edit/index.mjs";
import { blockBindingsKey, isPreviewModeKey } from "../block-edit/context.mjs";
import FormatToolbarContainer from "./format-toolbar-container.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { useMarkPersistent } from "./use-mark-persistent.mjs";
import { useEventListeners } from "./event-listeners/index.mjs";
import FormatEdit from "./format-edit.mjs";
import { getAllowedFormats } from "./utils.mjs";
import { Content, valueToHTMLString } from "./content.mjs";
import { withDeprecations } from "./with-deprecations.mjs";
import BlockContext from "../block-context/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { RichTextShortcut } from "./shortcut.mjs";
import { RichTextToolbarButton } from "./toolbar-button.mjs";
import { __unstableRichTextInputEvent } from "./input-event.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useRichText } = unlock(richTextPrivateApis);
var keyboardShortcutContext = createContext();
keyboardShortcutContext.displayName = "keyboardShortcutContext";
var inputEventContext = createContext();
inputEventContext.displayName = "inputEventContext";
var instanceIdKey = /* @__PURE__ */ Symbol("instanceId");
function removeNativeProps(props) {
  const {
    __unstableMobileNoFocusOnMount,
    deleteEnter,
    placeholderTextColor,
    textAlign,
    selectionColor,
    tagsToEliminate,
    disableEditingMenu,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    minWidth,
    maxWidth,
    disableSuggestions,
    disableAutocorrection,
    ...restProps
  } = props;
  return restProps;
}
function RichTextWrapper({
  children,
  tagName = "div",
  value: adjustedValue = "",
  onChange: adjustedOnChange,
  isSelected: originalIsSelected,
  multiline,
  inlineToolbar,
  wrapperClassName,
  autocompleters,
  onReplace,
  placeholder,
  allowedFormats,
  withoutInteractiveFormatting,
  onRemove,
  onMerge,
  onSplit,
  __unstableOnSplitAtEnd: onSplitAtEnd,
  __unstableOnSplitAtDoubleLineEnd: onSplitAtDoubleLineEnd,
  identifier,
  preserveWhiteSpace,
  __unstablePastePlainText: pastePlainText,
  __unstableEmbedURLOnPaste,
  __unstableDisableFormats: disableFormats,
  disableLineBreaks,
  __unstableAllowPrefixTransformations,
  readOnly,
  ...props
}, forwardedRef) {
  props = removeNativeProps(props);
  if (onSplit) {
    deprecated("wp.blockEditor.RichText onSplit prop", {
      since: "6.4",
      alternative: 'block.json support key: "splitting"'
    });
  }
  const instanceId = useInstanceId(RichTextWrapper);
  const anchorRef = useRef();
  const [anchorElement, setAnchorElement] = useState(null);
  const context = useBlockEditContext();
  const { clientId, isSelected: isBlockSelected, name: blockName } = context;
  const blockBindings = context[blockBindingsKey];
  const blockContext = useContext(BlockContext);
  const registry = useRegistry();
  const selector = (select) => {
    if (!isBlockSelected) {
      return { isSelected: false };
    }
    const { getSelectionStart: getSelectionStart2, getSelectionEnd: getSelectionEnd2 } = select(blockEditorStore);
    const selectionStart2 = getSelectionStart2();
    const selectionEnd2 = getSelectionEnd2();
    let isSelected2;
    if (originalIsSelected === void 0) {
      isSelected2 = selectionStart2.clientId === clientId && selectionEnd2.clientId === clientId && (identifier ? selectionStart2.attributeKey === identifier : selectionStart2[instanceIdKey] === instanceId);
    } else if (originalIsSelected) {
      isSelected2 = selectionStart2.clientId === clientId;
    }
    return {
      selectionStart: isSelected2 ? selectionStart2.offset : void 0,
      selectionEnd: isSelected2 ? selectionEnd2.offset : void 0,
      isSelected: isSelected2
    };
  };
  const { selectionStart, selectionEnd, isSelected } = useSelect(selector, [
    clientId,
    identifier,
    instanceId,
    originalIsSelected,
    isBlockSelected
  ]);
  const { disableBoundBlock, bindingsPlaceholder, bindingsLabel } = useSelect(
    (select) => {
      if (!blockBindings?.[identifier]) {
        return {};
      }
      const { __experimentalBlockBindingsSupportedAttributes } = select(blockEditorStore).getSettings();
      const bindableAttributes = __experimentalBlockBindingsSupportedAttributes?.[blockName];
      if (!bindableAttributes) {
        return {};
      }
      const relatedBinding = blockBindings[identifier];
      const blockBindingsSource = getBlockBindingsSource(
        relatedBinding.source
      );
      const blockBindingsContext = {};
      if (blockBindingsSource?.usesContext?.length) {
        for (const key of blockBindingsSource.usesContext) {
          blockBindingsContext[key] = blockContext[key];
        }
      }
      const _disableBoundBlock = !blockBindingsSource?.canUserEditValue?.({
        select,
        context: blockBindingsContext,
        args: relatedBinding.args
      });
      if (adjustedValue.length > 0) {
        return {
          disableBoundBlock: _disableBoundBlock,
          // Null values will make them fall back to the default behavior.
          bindingsPlaceholder: null,
          bindingsLabel: null
        };
      }
      const { getBlockAttributes } = select(blockEditorStore);
      const blockAttributes = getBlockAttributes(clientId);
      let clientSideFieldLabel = null;
      if (blockBindingsSource?.getFieldsList) {
        const fieldsItems = blockBindingsSource.getFieldsList({
          select,
          context: blockBindingsContext
        });
        clientSideFieldLabel = fieldsItems?.find(
          (item) => fastDeepEqual(item.args, relatedBinding?.args)
        )?.label;
      }
      const bindingKey = clientSideFieldLabel ?? blockBindingsSource?.label;
      const _bindingsPlaceholder = _disableBoundBlock ? bindingKey : sprintf(
        /* translators: %s: connected field label or source label */
        __("Add %s"),
        bindingKey
      );
      const _bindingsLabel = _disableBoundBlock ? relatedBinding?.args?.key || blockBindingsSource?.label : sprintf(
        /* translators: %s: source label or key */
        __("Empty %s; start writing to edit its value"),
        relatedBinding?.args?.key || blockBindingsSource?.label
      );
      return {
        disableBoundBlock: _disableBoundBlock,
        bindingsPlaceholder: blockAttributes?.placeholder || _bindingsPlaceholder,
        bindingsLabel: _bindingsLabel
      };
    },
    [
      blockBindings,
      identifier,
      blockName,
      adjustedValue,
      clientId,
      blockContext
    ]
  );
  const isInsidePatternOverrides = !!blockContext?.["pattern/overrides"];
  const hasOverrideEnabled = blockBindings?.__default?.source === "core/pattern-overrides";
  const shouldDisableForPattern = isInsidePatternOverrides && !hasOverrideEnabled;
  const shouldDisableEditing = readOnly || disableBoundBlock || shouldDisableForPattern;
  const { getSelectionStart, getSelectionEnd, getBlockRootClientId } = useSelect(blockEditorStore);
  const { selectionChange } = useDispatch(blockEditorStore);
  const adjustedAllowedFormats = getAllowedFormats({
    allowedFormats,
    disableFormats
  });
  const hasFormats = !adjustedAllowedFormats || adjustedAllowedFormats.length > 0;
  const onSelectionChange = useCallback(
    (start, end) => {
      const selection = {};
      const unset = start === void 0 && end === void 0;
      const baseSelection = {
        clientId,
        [identifier ? "attributeKey" : instanceIdKey]: identifier ? identifier : instanceId
      };
      if (typeof start === "number" || unset) {
        if (end === void 0 && getBlockRootClientId(clientId) !== getBlockRootClientId(getSelectionEnd().clientId)) {
          return;
        }
        selection.start = {
          ...baseSelection,
          offset: start
        };
      }
      if (typeof end === "number" || unset) {
        if (start === void 0 && getBlockRootClientId(clientId) !== getBlockRootClientId(getSelectionStart().clientId)) {
          return;
        }
        selection.end = {
          ...baseSelection,
          offset: end
        };
      }
      selectionChange(selection);
    },
    [
      clientId,
      getBlockRootClientId,
      getSelectionEnd,
      getSelectionStart,
      identifier,
      instanceId,
      selectionChange
    ]
  );
  const {
    value,
    getValue,
    onChange,
    ref: richTextRef,
    formatTypes
  } = useRichText({
    value: adjustedValue,
    onChange: adjustedOnChange,
    selectionStart,
    selectionEnd,
    onSelectionChange,
    placeholder: bindingsPlaceholder || placeholder,
    __unstableIsSelected: isSelected,
    __unstableDisableFormats: disableFormats,
    preserveWhiteSpace,
    __unstableDependencies: [tagName],
    allowedFormats: adjustedAllowedFormats,
    withoutInteractiveFormatting,
    __unstableFormatTypeHandlerContext: useMemo(
      () => ({
        richTextIdentifier: identifier,
        blockClientId: clientId
      }),
      [identifier, clientId]
    )
  });
  const autocompleteProps = useBlockEditorAutocompleteProps({
    onReplace,
    completers: autocompleters,
    record: value,
    onChange
  });
  useMarkPersistent({ html: adjustedValue, value });
  const keyboardShortcuts = useRef(/* @__PURE__ */ new Set());
  const inputEvents = useRef(/* @__PURE__ */ new Set());
  function onFocus() {
    anchorRef.current?.focus();
  }
  const TagName = tagName;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isSelected && /* @__PURE__ */ jsx(keyboardShortcutContext.Provider, { value: keyboardShortcuts, children: /* @__PURE__ */ jsx(inputEventContext.Provider, { value: inputEvents, children: /* @__PURE__ */ jsxs(Popover.__unstableSlotNameProvider, { value: "__unstable-block-tools-after", children: [
      children && children({ value, onChange, onFocus }),
      /* @__PURE__ */ jsx(
        FormatEdit,
        {
          value,
          onChange,
          onFocus,
          formatTypes,
          forwardedRef: anchorRef
        }
      )
    ] }) }) }),
    isSelected && hasFormats && /* @__PURE__ */ jsx(
      FormatToolbarContainer,
      {
        inline: inlineToolbar,
        editableContentElement: anchorElement
      }
    ),
    /* @__PURE__ */ jsx(
      TagName,
      {
        role: "textbox",
        "aria-multiline": !disableLineBreaks,
        "aria-readonly": shouldDisableEditing,
        ...props,
        draggable: void 0,
        "aria-label": bindingsLabel || props["aria-label"] || placeholder,
        ...autocompleteProps,
        ref: useMergeRefs([
          // Rich text ref must be first because its focus listener
          // must be set up before any other ref calls .focus() on
          // mount.
          richTextRef,
          forwardedRef,
          autocompleteProps.ref,
          props.ref,
          useEventListeners({
            registry,
            getValue,
            onChange,
            __unstableAllowPrefixTransformations,
            formatTypes,
            onReplace,
            selectionChange,
            isSelected,
            disableFormats,
            value,
            tagName,
            onSplit,
            __unstableEmbedURLOnPaste,
            pastePlainText,
            onMerge,
            onRemove,
            disableLineBreaks,
            onSplitAtEnd,
            onSplitAtDoubleLineEnd,
            keyboardShortcuts,
            inputEvents
          }),
          anchorRef,
          setAnchorElement
        ]),
        contentEditable: !shouldDisableEditing,
        suppressContentEditableWarning: true,
        className: clsx(
          "block-editor-rich-text__editable",
          props.className,
          "rich-text"
        ),
        tabIndex: props.tabIndex === 0 && !shouldDisableEditing ? null : props.tabIndex,
        "data-wp-block-attribute-key": identifier
      }
    )
  ] });
}
var PrivateRichText = withDeprecations(
  forwardRef(RichTextWrapper)
);
PrivateRichText.Content = Content;
PrivateRichText.isEmpty = (value) => {
  return !value || value.length === 0;
};
var PublicForwardedRichTextContainer = forwardRef((props, ref) => {
  const context = useBlockEditContext();
  const isPreviewMode = context[isPreviewModeKey];
  if (isPreviewMode) {
    const {
      children,
      tagName: Tag = "div",
      value,
      onChange,
      isSelected,
      multiline,
      inlineToolbar,
      wrapperClassName,
      autocompleters,
      onReplace,
      placeholder,
      allowedFormats,
      withoutInteractiveFormatting,
      onRemove,
      onMerge,
      onSplit,
      __unstableOnSplitAtEnd,
      __unstableOnSplitAtDoubleLineEnd,
      identifier,
      preserveWhiteSpace,
      __unstablePastePlainText,
      __unstableEmbedURLOnPaste,
      __unstableDisableFormats,
      disableLineBreaks,
      __unstableAllowPrefixTransformations,
      readOnly,
      ...contentProps
    } = removeNativeProps(props);
    return /* @__PURE__ */ jsx(
      Tag,
      {
        ref,
        ...contentProps,
        dangerouslySetInnerHTML: {
          __html: valueToHTMLString(value, multiline) || "<br>"
        }
      }
    );
  }
  return /* @__PURE__ */ jsx(PrivateRichText, { ref, ...props, readOnly: false });
});
PublicForwardedRichTextContainer.Content = Content;
PublicForwardedRichTextContainer.isEmpty = (value) => {
  return !value || value.length === 0;
};
var rich_text_default = PublicForwardedRichTextContainer;
export {
  PrivateRichText,
  RichTextShortcut,
  RichTextToolbarButton,
  RichTextWrapper,
  __unstableRichTextInputEvent,
  rich_text_default as default,
  inputEventContext,
  keyboardShortcutContext
};
//# sourceMappingURL=index.mjs.map
