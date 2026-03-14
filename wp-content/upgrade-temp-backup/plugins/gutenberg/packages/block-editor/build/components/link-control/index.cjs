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

// packages/block-editor/src/components/link-control/index.js
var link_control_exports = {};
__export(link_control_exports, {
  DeprecatedExperimentalLinkControl: () => DeprecatedExperimentalLinkControl,
  default: () => link_control_default
});
module.exports = __toCommonJS(link_control_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_dom = require("@wordpress/dom");
var import_keycodes = require("@wordpress/keycodes");
var import_is_shallow_equal = require("@wordpress/is-shallow-equal");
var import_data = require("@wordpress/data");
var import_preferences = require("@wordpress/preferences");
var import_icons = require("@wordpress/icons");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_url = require("@wordpress/url");
var import_settings_drawer = __toESM(require("./settings-drawer.cjs"));
var import_search_input = __toESM(require("./search-input.cjs"));
var import_link_preview = __toESM(require("./link-preview.cjs"));
var import_settings = __toESM(require("./settings.cjs"));
var import_use_create_page = __toESM(require("./use-create-page.cjs"));
var import_use_internal_value = __toESM(require("./use-internal-value.cjs"));
var import_viewer_slot = require("./viewer-slot.cjs");
var import_constants = require("./constants.cjs");
var import_is_url_like = __toESM(require("./is-url-like.cjs"));
var import_normalize_url = __toESM(require("./normalize-url.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var noop = () => {
};
var PREFERENCE_SCOPE = "core/block-editor";
var PREFERENCE_KEY = "linkControlSettingsDrawer";
function LinkControl({
  searchInputPlaceholder,
  value,
  settings = import_constants.DEFAULT_LINK_SETTINGS,
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
  const [settingsOpen, setSettingsOpen] = (0, import_element.useState)(false);
  const [customValidity, setCustomValidity] = (0, import_element.useState)(void 0);
  const { advancedSettingsPreference } = (0, import_data.useSelect)((select) => {
    const prefsStore = select(import_preferences.store);
    return {
      advancedSettingsPreference: prefsStore.get(PREFERENCE_SCOPE, PREFERENCE_KEY) ?? false
    };
  }, []);
  const { set: setPreference } = (0, import_data.useDispatch)(import_preferences.store);
  const setSettingsOpenWithPreference = (prefVal) => {
    if (setPreference) {
      setPreference(PREFERENCE_SCOPE, PREFERENCE_KEY, prefVal);
    }
    setSettingsOpen(prefVal);
  };
  const isSettingsOpen = advancedSettingsPreference || settingsOpen;
  const isMountingRef = (0, import_element.useRef)(true);
  const wrapperNode = (0, import_element.useRef)();
  const textInputRef = (0, import_element.useRef)();
  const searchInputRef = (0, import_element.useRef)();
  const entityUrlFallbackRef = (0, import_element.useRef)();
  const settingsKeys = settings.map(({ id }) => id);
  const [
    internalControlValue,
    setInternalControlValue,
    setInternalURLInputValue,
    setInternalTextInputValue,
    createSetInternalSettingValueHandler
  ] = (0, import_use_internal_value.default)(value);
  const handleInputChange = (newValue) => {
    setInternalURLInputValue(newValue);
    onInputChange?.(newValue);
  };
  const isEntity = handleEntities && !!internalControlValue?.id;
  const baseId = (0, import_compose.useInstanceId)(LinkControl, "link-control");
  const helpTextId = isEntity ? `${baseId}__help` : null;
  const valueHasChanges = value && !(0, import_is_shallow_equal.isShallowEqualObjects)(internalControlValue, value);
  const [isEditingLink, setIsEditingLink] = (0, import_element.useState)(
    forceIsEditingLink !== void 0 ? forceIsEditingLink : !value || !value.url
  );
  const { createPage, isCreatingPage, errorMessage } = (0, import_use_create_page.default)(createSuggestion);
  (0, import_element.useEffect)(() => {
    if (forceIsEditingLink === void 0) {
      return;
    }
    setIsEditingLink(forceIsEditingLink);
  }, [forceIsEditingLink]);
  (0, import_element.useEffect)(() => {
    if (isMountingRef.current) {
      return;
    }
    const nextFocusTarget = import_dom.focus.focusable.find(wrapperNode.current)[0] || wrapperNode.current;
    nextFocusTarget.focus();
  }, [isEditingLink, isCreatingPage]);
  (0, import_element.useEffect)(() => {
    isMountingRef.current = false;
    return () => {
      isMountingRef.current = true;
    };
  }, []);
  const prevInputValueRef = (0, import_element.useRef)();
  (0, import_element.useEffect)(() => {
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
  (0, import_element.useEffect)(() => {
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
      message: (0, import_i18n.__)("Please enter a valid URL.")
    };
    const validResult = {
      type: "valid"
    };
    const trimmedValue = urlToValidate?.trim();
    if (!trimmedValue?.length || !(0, import_is_url_like.default)(trimmedValue)) {
      return invalidResult;
    }
    if ((0, import_is_url_like.isHashLink)(trimmedValue) || (0, import_is_url_like.isRelativePath)(trimmedValue)) {
      return validResult;
    }
    const urlToCheck = (0, import_url.prependHTTPS)(trimmedValue);
    return (0, import_url.isURL)(urlToCheck) ? validResult : invalidResult;
  };
  const handleSelectSuggestion = (updatedValue) => {
    const isEntitySuggestion = updatedValue && updatedValue.id && updatedValue.type && !import_constants.LINK_ENTRY_TYPES.includes(updatedValue.type);
    if (!isEntitySuggestion) {
      const urlToValidate = updatedValue?.url || currentUrlInputValue;
      const validation = validateUrl(urlToValidate);
      if (validation.type === "invalid") {
        setCustomValidity(validation);
        return;
      }
      const { url: normalizedUrl } = (0, import_normalize_url.default)(urlToValidate);
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
    const isEntityLink = internalControlValue && internalControlValue.id && internalControlValue.type && !import_constants.LINK_ENTRY_TYPES.includes(internalControlValue.type);
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
        url: (0, import_normalize_url.default)(currentUrlInputValue).url
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
    if (keyCode === import_keycodes.ENTER && !currentInputIsEmpty) {
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
  const [shouldFocusSearchInput, setShouldFocusSearchInput] = (0, import_element.useState)(false);
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
  (0, import_element.useEffect)(() => {
    if (shouldFocusSearchInput) {
      searchInputRef.current?.focus();
      setShouldFocusSearchInput(false);
    }
  }, [shouldFocusSearchInput]);
  const currentUrlInputValue = internalControlValue?.url !== void 0 ? internalControlValue.url : propInputValue || "";
  const currentInputIsEmpty = !currentUrlInputValue?.trim()?.length;
  (0, import_element.useEffect)(() => {
    setCustomValidity(void 0);
  }, [currentUrlInputValue]);
  const isUrlValid = !customValidity;
  const shownUnlinkControl = onRemove && value && !isEditingLink && !isCreatingPage;
  const showActions = isEditingLink && hasLinkValue;
  const showTextControl = hasLinkValue && hasTextControl;
  const isEditing = (isEditingLink || !value) && !isCreatingPage;
  const isDisabled = currentInputIsEmpty || !isUrlValid || value && !valueHasChanges;
  const showSettings = !!settings?.length && isEditingLink && hasLinkValue;
  const previewValue = (0, import_element.useMemo)(() => {
    if (value?.kind === "taxonomy" && !value?.url && entityUrlFallbackRef.current) {
      return {
        ...value,
        url: entityUrlFallbackRef.current
      };
    }
    return value;
  }, [value]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      tabIndex: -1,
      ref: wrapperNode,
      className: "block-editor-link-control",
      children: [
        isCreatingPage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "block-editor-link-control__loading", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}),
          " ",
          (0, import_i18n.__)("Creating"),
          "\u2026"
        ] }),
        isEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "div",
            {
              className: (0, import_clsx.default)({
                "block-editor-link-control__search-input-wrapper": true,
                "has-text-control": showTextControl,
                "has-actions": showActions
              }),
              children: [
                showTextControl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.TextControl,
                  {
                    ref: textInputRef,
                    className: "block-editor-link-control__field block-editor-link-control__text-content",
                    label: (0, import_i18n.__)("Text"),
                    value: internalControlValue?.title,
                    onChange: setInternalTextInputValue,
                    onKeyDown: handleSubmitWithEnter,
                    __next40pxDefaultSize: true
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_search_input.default,
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
                    suffix: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
                isEntity && helpTextId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "p",
                  {
                    id: helpTextId,
                    className: "block-editor-link-control__help",
                    children: (0, import_i18n.sprintf)(
                      /* translators: %s: entity type (e.g., page, post) */
                      (0, import_i18n.__)("Synced with the selected %s."),
                      internalControlValue?.type || "item"
                    )
                  }
                )
              ]
            }
          ),
          errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Notice,
            {
              className: "block-editor-link-control__search-error",
              status: "error",
              isDismissible: false,
              children: errorMessage
            }
          )
        ] }),
        value && !isEditingLink && !isCreatingPage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_link_preview.default,
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
        showSettings && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-editor-link-control__tools", children: !currentInputIsEmpty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_settings_drawer.default,
          {
            settingsOpen: isSettingsOpen,
            setSettingsOpen: setSettingsOpenWithPreference,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_settings.default,
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
        showActions && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_components.__experimentalHStack,
          {
            justify: "right",
            className: "block-editor-link-control__search-actions",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Button,
                {
                  __next40pxDefaultSize: true,
                  variant: "tertiary",
                  onClick: handleCancel,
                  children: (0, import_i18n.__)("Cancel")
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Button,
                {
                  __next40pxDefaultSize: true,
                  variant: "primary",
                  onClick: isDisabled ? noop : handleSubmit,
                  className: "block-editor-link-control__search-submit",
                  "aria-disabled": isDisabled,
                  children: (0, import_i18n.__)("Apply")
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        icon: import_icons.linkOff,
        onClick: onUnlink,
        "aria-describedby": helpTextId,
        showTooltip: true,
        label: (0, import_i18n.__)("Unsync and edit"),
        __next40pxDefaultSize: true
      }
    );
  }
  if (showActions) {
    return void 0;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalInputControlSuffixWrapper, { variant: "control", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      onClick: isDisabled ? noop : onSubmit,
      label: (0, import_i18n.__)("Submit"),
      icon: import_icons.keyboardReturn,
      className: "block-editor-link-control__search-submit",
      "aria-disabled": isDisabled,
      size: "small"
    }
  ) });
}
LinkControl.ViewerFill = import_viewer_slot.ViewerFill;
LinkControl.DEFAULT_LINK_SETTINGS = import_constants.DEFAULT_LINK_SETTINGS;
var DeprecatedExperimentalLinkControl = (props) => {
  (0, import_deprecated.default)("wp.blockEditor.__experimentalLinkControl", {
    since: "6.8",
    alternative: "wp.blockEditor.LinkControl"
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkControl, { ...props });
};
DeprecatedExperimentalLinkControl.ViewerFill = LinkControl.ViewerFill;
DeprecatedExperimentalLinkControl.DEFAULT_LINK_SETTINGS = LinkControl.DEFAULT_LINK_SETTINGS;
var link_control_default = LinkControl;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeprecatedExperimentalLinkControl
});
//# sourceMappingURL=index.cjs.map
