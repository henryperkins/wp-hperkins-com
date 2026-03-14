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

// packages/block-editor/src/components/provider/index.js
var provider_exports = {};
__export(provider_exports, {
  BlockEditorProvider: () => BlockEditorProvider,
  ExperimentalBlockEditorProvider: () => ExperimentalBlockEditorProvider,
  default: () => provider_default
});
module.exports = __toCommonJS(provider_exports);
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_upload_media = require("@wordpress/upload-media");
var import_with_registry_provider = __toESM(require("./with-registry-provider.cjs"));
var import_use_block_sync = __toESM(require("./use-block-sync.cjs"));
var import_store = require("../../store/index.cjs");
var import_block_refs_provider = require("./block-refs-provider.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_keyboard_shortcuts = __toESM(require("../keyboard-shortcuts/index.cjs"));
var import_use_media_upload_settings = __toESM(require("./use-media-upload-settings.cjs"));
var import_private_keys = require("../../store/private-keys.cjs");
var import_selection_context = require("./selection-context.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var noop = () => {
};
var hasLoggedFallback = false;
var isClientSideMediaEnabledCache = null;
function shouldEnableClientSideMediaProcessing() {
  if (isClientSideMediaEnabledCache !== null) {
    return isClientSideMediaEnabledCache;
  }
  if (!window.__clientSideMediaProcessing) {
    isClientSideMediaEnabledCache = false;
    return false;
  }
  if (typeof import_upload_media.detectClientSideMediaSupport !== "function") {
    isClientSideMediaEnabledCache = false;
    return false;
  }
  const detection = (0, import_upload_media.detectClientSideMediaSupport)();
  if (!detection || !detection.supported) {
    if (!hasLoggedFallback) {
      console.info(
        `Client-side media processing unavailable: ${detection.reason}. Using server-side processing.`
      );
      hasLoggedFallback = true;
    }
    isClientSideMediaEnabledCache = false;
    return false;
  }
  isClientSideMediaEnabledCache = true;
  return true;
}
function mediaUpload(registry, settings, {
  allowedTypes,
  additionalData = {},
  filesList,
  onError = noop,
  onFileChange,
  onSuccess,
  onBatchSuccess
}) {
  void registry.dispatch(import_upload_media.store).addItems({
    files: Array.from(filesList),
    onChange: onFileChange,
    onSuccess: (attachments) => {
      settings?.[import_private_keys.mediaUploadOnSuccessKey]?.(attachments);
      onSuccess?.(attachments);
    },
    onBatchSuccess,
    onError: ({ message }) => onError(message),
    additionalData,
    allowedTypes
  });
}
function BlockSyncEffect(props) {
  (0, import_use_block_sync.default)(props);
  return null;
}
var ExperimentalBlockEditorProvider = (0, import_with_registry_provider.default)(
  (props) => {
    const {
      settings: _settings,
      registry,
      stripExperimentalSettings = false
    } = props;
    const mediaUploadSettings = (0, import_use_media_upload_settings.default)(_settings);
    const isClientSideMediaEnabled = shouldEnableClientSideMediaProcessing();
    const isMediaUploadIntercepted = !!_settings?.mediaUpload?.__isMediaUploadInterceptor;
    const settings = (0, import_element.useMemo)(() => {
      if (isClientSideMediaEnabled && _settings?.mediaUpload && !isMediaUploadIntercepted) {
        const interceptor = mediaUpload.bind(
          null,
          registry,
          _settings
        );
        interceptor.__isMediaUploadInterceptor = true;
        return {
          ..._settings,
          mediaUpload: interceptor
        };
      }
      return _settings;
    }, [
      _settings,
      registry,
      isClientSideMediaEnabled,
      isMediaUploadIntercepted
    ]);
    const { __experimentalUpdateSettings } = (0, import_lock_unlock.unlock)(
      (0, import_data.useDispatch)(import_store.store)
    );
    (0, import_element.useEffect)(() => {
      __experimentalUpdateSettings(
        {
          ...settings,
          __internalIsInitialized: true
        },
        {
          stripExperimentalSettings,
          reset: true
        }
      );
    }, [
      settings,
      stripExperimentalSettings,
      __experimentalUpdateSettings
    ]);
    const selectionRef = (0, import_element.useRef)(props.selection);
    selectionRef.current = props.selection;
    const onChangeSelectionRef = (0, import_element.useRef)(props.onChangeSelection ?? noop);
    onChangeSelectionRef.current = props.onChangeSelection ?? noop;
    const selectionContextValue = (0, import_element.useMemo)(
      () => ({
        getSelection: () => selectionRef.current,
        onChangeSelection: (...args) => onChangeSelectionRef.current(...args)
      }),
      []
    );
    const children = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.SlotFillProvider, { passthrough: true, children: [
      !settings?.isPreviewMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_keyboard_shortcuts.default.Register, {}),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_refs_provider.BlockRefsProvider, { children: props.children })
    ] });
    const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_selection_context.SelectionContext.Provider, { value: selectionContextValue, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        BlockSyncEffect,
        {
          clientId: props.clientId,
          value: props.value,
          onChange: props.onChange,
          onInput: props.onInput
        }
      ),
      children
    ] });
    if (isClientSideMediaEnabled && !isMediaUploadIntercepted) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_upload_media.MediaUploadProvider,
        {
          settings: mediaUploadSettings,
          useSubRegistry: false,
          children: content
        }
      );
    }
    return content;
  }
);
var BlockEditorProvider = (props) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExperimentalBlockEditorProvider, { ...props, stripExperimentalSettings: true, children: props.children });
};
var provider_default = BlockEditorProvider;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockEditorProvider,
  ExperimentalBlockEditorProvider
});
//# sourceMappingURL=index.cjs.map
