// packages/block-editor/src/components/link-control/index.js
import clsx from "clsx";
import {
  Button,
  Spinner,
  Notice,
  TextControl,
  __experimentalHStack as HStack,
  __experimentalInputControlSuffixWrapper as InputControlSuffixWrapper
} from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { useRef, useState, useEffect, useMemo } from "@wordpress/element";
import { useInstanceId } from "@wordpress/compose";
import { focus } from "@wordpress/dom";
import { ENTER } from "@wordpress/keycodes";
import { isShallowEqualObjects } from "@wordpress/is-shallow-equal";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as preferencesStore } from "@wordpress/preferences";
import { keyboardReturn, linkOff } from "@wordpress/icons";
import deprecated from "@wordpress/deprecated";
import { isURL, prependHTTPS } from "@wordpress/url";
import LinkControlSettingsDrawer from "./settings-drawer.mjs";
import LinkControlSearchInput from "./search-input.mjs";
import LinkPreview from "./link-preview.mjs";
import LinkSettings from "./settings.mjs";
import useCreatePage from "./use-create-page.mjs";
import useInternalValue from "./use-internal-value.mjs";
import { ViewerFill } from "./viewer-slot.mjs";
import { DEFAULT_LINK_SETTINGS, LINK_ENTRY_TYPES } from "./constants.mjs";
import isURLLike, { isHashLink, isRelativePath } from "./is-url-like.mjs";
import normalizeUrl from "./normalize-url.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var noop = () => {
};
var PREFERENCE_SCOPE = "core/block-editor";
var PREFERENCE_KEY = "linkControlSettingsDrawer";
function LinkControl({
  searchInputPlaceholder,
  value,
  settings = DEFAULT_LINK_SETTINGS,
  onChange = noop,
  onInputChange,
  onRemove,
  onCancel,
  noDirectEntry = false,
  showSuggestions = true,
  showInitialSuggestions,
  forceIsEditingLink,
  createSuggestion,
  withCreateSuggestion,
  inputValue: propInputValue = "",
  suggestionsQuery = {},
  noURLSuggestion = false,
  createSuggestionButtonText,
  hasRichPreviews = false,
  hasTextControl = false,
  renderControlBottom = null,
  handleEntities = false
}) {
  if (withCreateSuggestion === void 0 && createSuggestion) {
    withCreateSuggestion = true;
  }
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customValidity, setCustomValidity] = useState(void 0);
  const { advancedSettingsPreference } = useSelect((select) => {
    const prefsStore = select(preferencesStore);
    return {
      advancedSettingsPreference: prefsStore.get(PREFERENCE_SCOPE, PREFERENCE_KEY) ?? false
    };
  }, []);
  const { set: setPreference } = useDispatch(preferencesStore);
  const setSettingsOpenWithPreference = (prefVal) => {
    if (setPreference) {
      setPreference(PREFERENCE_SCOPE, PREFERENCE_KEY, prefVal);
    }
    setSettingsOpen(prefVal);
  };
  const isSettingsOpen = advancedSettingsPreference || settingsOpen;
  const isMountingRef = useRef(true);
  const wrapperNode = useRef();
  const textInputRef = useRef();
  const searchInputRef = useRef();
  const entityUrlFallbackRef = useRef();
  const settingsKeys = settings.map(({ id }) => id);
  const [
    internalControlValue,
    setInternalControlValue,
    setInternalURLInputValue,
    setInternalTextInputValue,
    createSetInternalSettingValueHandler
  ] = useInternalValue(value);
  const handleInputChange = (newValue) => {
    setInternalURLInputValue(newValue);
    onInputChange?.(newValue);
  };
  const isEntity = handleEntities && !!internalControlValue?.id;
  const baseId = useInstanceId(LinkControl, "link-control");
  const helpTextId = isEntity ? `${baseId}__help` : null;
  const valueHasChanges = value && !isShallowEqualObjects(internalControlValue, value);
  const [isEditingLink, setIsEditingLink] = useState(
    forceIsEditingLink !== void 0 ? forceIsEditingLink : !value || !value.url
  );
  const { createPage, isCreatingPage, errorMessage } = useCreatePage(createSuggestion);
  useEffect(() => {
    if (forceIsEditingLink === void 0) {
      return;
    }
    setIsEditingLink(forceIsEditingLink);
  }, [forceIsEditingLink]);
  useEffect(() => {
    if (isMountingRef.current) {
      return;
    }
    const nextFocusTarget = focus.focusable.find(wrapperNode.current)[0] || wrapperNode.current;
    nextFocusTarget.focus();
  }, [isEditingLink, isCreatingPage]);
  useEffect(() => {
    isMountingRef.current = false;
    return () => {
      isMountingRef.current = true;
    };
  }, []);
  const prevInputValueRef = useRef();
  useEffect(() => {
    if (prevInputValueRef.current === void 0) {
      prevInputValueRef.current = propInputValue;
      return;
    }
    if (prevInputValueRef.current !== propInputValue) {
      console.warn(
        "LinkControl: The inputValue prop is uncontrolled and only sets the initial value. onInputChange is an observer for the input value. Changes to inputValue from the parent will not update the search input."
      );
      prevInputValueRef.current = propInputValue;
    }
  }, [propInputValue]);
  useEffect(() => {
    if (customValidity?.type === "invalid") {
      const inputElement = searchInputRef.current;
      if (inputElement && typeof inputElement.reportValidity === "function") {
        inputElement.reportValidity();
      }
    }
  }, [customValidity]);
  const hasLinkValue = value?.url?.trim()?.length > 0;
  const stopEditing = () => {
    setIsEditingLink(false);
  };
  const validateUrl = (urlToValidate) => {
    const invalidResult = {
      type: "invalid",
      message: __("Please enter a valid URL.")
    };
    const validResult = {
      type: "valid"
    };
    const trimmedValue = urlToValidate?.trim();
    if (!trimmedValue?.length || !isURLLike(trimmedValue)) {
      return invalidResult;
    }
    if (isHashLink(trimmedValue) || isRelativePath(trimmedValue)) {
      return validResult;
    }
    const urlToCheck = prependHTTPS(trimmedValue);
    return isURL(urlToCheck) ? validResult : invalidResult;
  };
  const handleSelectSuggestion = (updatedValue) => {
    const isEntitySuggestion = updatedValue && updatedValue.id && updatedValue.type && !LINK_ENTRY_TYPES.includes(updatedValue.type);
    if (!isEntitySuggestion) {
      const urlToValidate = updatedValue?.url || currentUrlInputValue;
      const validation = validateUrl(urlToValidate);
      if (validation.type === "invalid") {
        setCustomValidity(validation);
        return;
      }
      const { url: normalizedUrl } = normalizeUrl(urlToValidate);
      updatedValue = {
        ...updatedValue,
        url: normalizedUrl
      };
    }
    if (updatedValue?.kind === "taxonomy" && updatedValue?.url) {
      entityUrlFallbackRef.current = updatedValue.url;
    }
    const nonSettingsChanges = Object.keys(updatedValue).reduce(
      (acc, key) => {
        if (!settingsKeys.includes(key)) {
          acc[key] = updatedValue[key];
        }
        return acc;
      },
      {}
    );
    onChange({
      ...internalControlValue,
      ...nonSettingsChanges,
      // As title is not a setting, it must be manually applied
      // in such a way as to preserve the users changes over
      // any "title" value provided by the "suggestion".
      title: internalControlValue?.title || updatedValue?.title
    });
    setCustomValidity(void 0);
    stopEditing();
  };
  const validateAndSetValidity = () => {
    if (currentInputIsEmpty) {
      return false;
    }
    const trimmedValue = currentUrlInputValue.trim();
    const isEntityLink = internalControlValue && internalControlValue.id && internalControlValue.type && !LINK_ENTRY_TYPES.includes(internalControlValue.type);
    const urlUnchanged = value?.url === trimmedValue;
    if (isEntityLink && urlUnchanged) {
      setCustomValidity(void 0);
      return true;
    }
    const validation = validateUrl(currentUrlInputValue);
    if (validation.type === "invalid") {
      setCustomValidity(validation);
      return false;
    }
    setCustomValidity(void 0);
    return true;
  };
  const submitUrlValue = () => {
    if (valueHasChanges) {
      onChange({
        ...value,
        ...internalControlValue,
        url: normalizeUrl(currentUrlInputValue).url
      });
    }
    stopEditing();
    setCustomValidity(void 0);
  };
  const handleSubmit = () => {
    if (!validateAndSetValidity()) {
      return;
    }
    submitUrlValue();
  };
  const handleSubmitWithEnter = (event) => {
    const { keyCode } = event;
    if (keyCode === ENTER && !currentInputIsEmpty) {
      event.preventDefault();
      handleSubmit();
    }
  };
  const resetInternalValues = () => {
    setInternalControlValue(value);
  };
  const handleCancel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetInternalValues();
    setCustomValidity(void 0);
    if (hasLinkValue) {
      stopEditing();
    } else {
      onRemove?.();
    }
    onCancel?.();
  };
  const [shouldFocusSearchInput, setShouldFocusSearchInput] = useState(false);
  const handleUnlink = () => {
    const { id, kind, type, ...restValue } = internalControlValue;
    setInternalControlValue({
      ...restValue,
      id: void 0,
      kind: void 0,
      type: void 0,
      url: void 0
    });
    setShouldFocusSearchInput(true);
  };
  useEffect(() => {
    if (shouldFocusSearchInput) {
      searchInputRef.current?.focus();
      setShouldFocusSearchInput(false);
    }
  }, [shouldFocusSearchInput]);
  const currentUrlInputValue = internalControlValue?.url !== void 0 ? internalControlValue.url : propInputValue || "";
  const currentInputIsEmpty = !currentUrlInputValue?.trim()?.length;
  useEffect(() => {
    setCustomValidity(void 0);
  }, [currentUrlInputValue]);
  const isUrlValid = !customValidity;
  const shownUnlinkControl = onRemove && value && !isEditingLink && !isCreatingPage;
  const showActions = isEditingLink && hasLinkValue;
  const showTextControl = hasLinkValue && hasTextControl;
  const isEditing = (isEditingLink || !value) && !isCreatingPage;
  const isDisabled = currentInputIsEmpty || !isUrlValid || value && !valueHasChanges;
  const showSettings = !!settings?.length && isEditingLink && hasLinkValue;
  const previewValue = useMemo(() => {
    if (value?.kind === "taxonomy" && !value?.url && entityUrlFallbackRef.current) {
      return {
        ...value,
        url: entityUrlFallbackRef.current
      };
    }
    return value;
  }, [value]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      tabIndex: -1,
      ref: wrapperNode,
      className: "block-editor-link-control",
      children: [
        isCreatingPage && /* @__PURE__ */ jsxs("div", { className: "block-editor-link-control__loading", children: [
          /* @__PURE__ */ jsx(Spinner, {}),
          " ",
          __("Creating"),
          "\u2026"
        ] }),
        isEditing && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: clsx({
                "block-editor-link-control__search-input-wrapper": true,
                "has-text-control": showTextControl,
                "has-actions": showActions
              }),
              children: [
                showTextControl && /* @__PURE__ */ jsx(
                  TextControl,
                  {
                    ref: textInputRef,
                    className: "block-editor-link-control__field block-editor-link-control__text-content",
                    label: __("Text"),
                    value: internalControlValue?.title,
                    onChange: setInternalTextInputValue,
                    onKeyDown: handleSubmitWithEnter,
                    __next40pxDefaultSize: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  LinkControlSearchInput,
                  {
                    ref: searchInputRef,
                    currentLink: value,
                    className: "block-editor-link-control__field block-editor-link-control__search-input",
                    placeholder: searchInputPlaceholder,
                    value: currentUrlInputValue,
                    withCreateSuggestion,
                    onCreateSuggestion: createPage,
                    onChange: handleInputChange,
                    onSelect: handleSelectSuggestion,
                    showInitialSuggestions,
                    allowDirectEntry: !noDirectEntry,
                    showSuggestions,
                    suggestionsQuery,
                    withURLSuggestion: !noURLSuggestion,
                    createSuggestionButtonText,
                    hideLabelFromVision: !showTextControl,
                    isEntity,
                    customValidity,
                    suffix: /* @__PURE__ */ jsx(
                      SearchSuffixControl,
                      {
                        isEntity,
                        showActions,
                        isDisabled,
                        onUnlink: handleUnlink,
                        onSubmit: handleSubmit,
                        helpTextId
                      }
                    )
                  }
                ),
                isEntity && helpTextId && /* @__PURE__ */ jsx(
                  "p",
                  {
                    id: helpTextId,
                    className: "block-editor-link-control__help",
                    children: sprintf(
                      /* translators: %s: entity type (e.g., page, post) */
                      __("Synced with the selected %s."),
                      internalControlValue?.type || "item"
                    )
                  }
                )
              ]
            }
          ),
          errorMessage && /* @__PURE__ */ jsx(
            Notice,
            {
              className: "block-editor-link-control__search-error",
              status: "error",
              isDismissible: false,
              children: errorMessage
            }
          )
        ] }),
        value && !isEditingLink && !isCreatingPage && /* @__PURE__ */ jsx(
          LinkPreview,
          {
            value: previewValue,
            onEditClick: () => setIsEditingLink(true),
            hasRichPreviews,
            hasUnlinkControl: shownUnlinkControl,
            onRemove: () => {
              onRemove();
              setIsEditingLink(true);
            }
          },
          previewValue?.url
        ),
        showSettings && /* @__PURE__ */ jsx("div", { className: "block-editor-link-control__tools", children: !currentInputIsEmpty && /* @__PURE__ */ jsx(
          LinkControlSettingsDrawer,
          {
            settingsOpen: isSettingsOpen,
            setSettingsOpen: setSettingsOpenWithPreference,
            children: /* @__PURE__ */ jsx(
              LinkSettings,
              {
                value: internalControlValue,
                settings,
                onChange: createSetInternalSettingValueHandler(
                  settingsKeys
                )
              }
            )
          }
        ) }),
        showActions && /* @__PURE__ */ jsxs(
          HStack,
          {
            justify: "right",
            className: "block-editor-link-control__search-actions",
            children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  __next40pxDefaultSize: true,
                  variant: "tertiary",
                  onClick: handleCancel,
                  children: __("Cancel")
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  __next40pxDefaultSize: true,
                  variant: "primary",
                  onClick: isDisabled ? noop : handleSubmit,
                  className: "block-editor-link-control__search-submit",
                  "aria-disabled": isDisabled,
                  children: __("Apply")
                }
              )
            ]
          }
        ),
        !isCreatingPage && renderControlBottom && renderControlBottom()
      ]
    }
  );
}
function SearchSuffixControl({
  isEntity,
  showActions,
  isDisabled,
  onUnlink,
  onSubmit,
  helpTextId
}) {
  if (isEntity) {
    return /* @__PURE__ */ jsx(
      Button,
      {
        icon: linkOff,
        onClick: onUnlink,
        "aria-describedby": helpTextId,
        showTooltip: true,
        label: __("Unsync and edit"),
        __next40pxDefaultSize: true
      }
    );
  }
  if (showActions) {
    return void 0;
  }
  return /* @__PURE__ */ jsx(InputControlSuffixWrapper, { variant: "control", children: /* @__PURE__ */ jsx(
    Button,
    {
      onClick: isDisabled ? noop : onSubmit,
      label: __("Submit"),
      icon: keyboardReturn,
      className: "block-editor-link-control__search-submit",
      "aria-disabled": isDisabled,
      size: "small"
    }
  ) });
}
LinkControl.ViewerFill = ViewerFill;
LinkControl.DEFAULT_LINK_SETTINGS = DEFAULT_LINK_SETTINGS;
var DeprecatedExperimentalLinkControl = (props) => {
  deprecated("wp.blockEditor.__experimentalLinkControl", {
    since: "6.8",
    alternative: "wp.blockEditor.LinkControl"
  });
  return /* @__PURE__ */ jsx(LinkControl, { ...props });
};
DeprecatedExperimentalLinkControl.ViewerFill = LinkControl.ViewerFill;
DeprecatedExperimentalLinkControl.DEFAULT_LINK_SETTINGS = LinkControl.DEFAULT_LINK_SETTINGS;
var link_control_default = LinkControl;
export {
  DeprecatedExperimentalLinkControl,
  link_control_default as default
};
//# sourceMappingURL=index.mjs.map
