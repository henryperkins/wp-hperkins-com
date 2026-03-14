// packages/block-editor/src/components/provider/index.js
import { useDispatch } from "@wordpress/data";
import { useEffect, useMemo, useRef } from "@wordpress/element";
import { SlotFillProvider } from "@wordpress/components";
import {
  MediaUploadProvider,
  store as uploadStore,
  detectClientSideMediaSupport
} from "@wordpress/upload-media";
import withRegistryProvider from "./with-registry-provider.mjs";
import useBlockSync from "./use-block-sync.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { BlockRefsProvider } from "./block-refs-provider.mjs";
import { unlock } from "../../lock-unlock.mjs";
import KeyboardShortcuts from "../keyboard-shortcuts/index.mjs";
import useMediaUploadSettings from "./use-media-upload-settings.mjs";
import { mediaUploadOnSuccessKey } from "../../store/private-keys.mjs";
import { SelectionContext } from "./selection-context.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
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
  if (typeof detectClientSideMediaSupport !== "function") {
    isClientSideMediaEnabledCache = false;
    return false;
  }
  const detection = detectClientSideMediaSupport();
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
  void registry.dispatch(uploadStore).addItems({
    files: Array.from(filesList),
    onChange: onFileChange,
    onSuccess: (attachments) => {
      settings?.[mediaUploadOnSuccessKey]?.(attachments);
      onSuccess?.(attachments);
    },
    onBatchSuccess,
    onError: ({ message }) => onError(message),
    additionalData,
    allowedTypes
  });
}
function BlockSyncEffect(props) {
  useBlockSync(props);
  return null;
}
var ExperimentalBlockEditorProvider = withRegistryProvider(
  (props) => {
    const {
      settings: _settings,
      registry,
      stripExperimentalSettings = false
    } = props;
    const mediaUploadSettings = useMediaUploadSettings(_settings);
    const isClientSideMediaEnabled = shouldEnableClientSideMediaProcessing();
    const isMediaUploadIntercepted = !!_settings?.mediaUpload?.__isMediaUploadInterceptor;
    const settings = useMemo(() => {
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
    const { __experimentalUpdateSettings } = unlock(
      useDispatch(blockEditorStore)
    );
    useEffect(() => {
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
    const selectionRef = useRef(props.selection);
    selectionRef.current = props.selection;
    const onChangeSelectionRef = useRef(props.onChangeSelection ?? noop);
    onChangeSelectionRef.current = props.onChangeSelection ?? noop;
    const selectionContextValue = useMemo(
      () => ({
        getSelection: () => selectionRef.current,
        onChangeSelection: (...args) => onChangeSelectionRef.current(...args)
      }),
      []
    );
    const children = /* @__PURE__ */ jsxs(SlotFillProvider, { passthrough: true, children: [
      !settings?.isPreviewMode && /* @__PURE__ */ jsx(KeyboardShortcuts.Register, {}),
      /* @__PURE__ */ jsx(BlockRefsProvider, { children: props.children })
    ] });
    const content = /* @__PURE__ */ jsxs(SelectionContext.Provider, { value: selectionContextValue, children: [
      /* @__PURE__ */ jsx(
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
      return /* @__PURE__ */ jsx(
        MediaUploadProvider,
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
  return /* @__PURE__ */ jsx(ExperimentalBlockEditorProvider, { ...props, stripExperimentalSettings: true, children: props.children });
};
var provider_default = BlockEditorProvider;
export {
  BlockEditorProvider,
  ExperimentalBlockEditorProvider,
  provider_default as default
};
//# sourceMappingURL=index.mjs.map
