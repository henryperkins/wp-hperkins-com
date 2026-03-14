"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/sync-connection-modal/index.js
var sync_connection_modal_exports = {};
__export(sync_connection_modal_exports, {
  SyncConnectionModal: () => SyncConnectionModal
});
module.exports = __toCommonJS(sync_connection_modal_exports);
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_blocks = require("@wordpress/blocks");
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_sync_error_messages = require("../../utils/sync-error-messages.cjs");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_use_retry_countdown = require("./use-retry-countdown.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { BlockCanvasCover } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var { retrySyncConnection } = (0, import_lock_unlock.unlock)(import_core_data.privateApis);
var INITIAL_DISCONNECTED_DEBOUNCE_MS = 5e3;
var noop = () => {
};
function SyncConnectionModal() {
  const { connectionState, postType } = (0, import_data.useSelect)((selectFn) => {
    const currentPostType = selectFn(import_store.store).getCurrentPostType();
    return {
      connectionState: selectFn(import_core_data.store).getSyncConnectionStatus() || null,
      postType: currentPostType ? selectFn(import_core_data.store).getPostType(currentPostType) : null
    };
  }, []);
  const { secondsRemaining, markRetrying } = (0, import_use_retry_countdown.useRetryCountdown)(
    connectionState?.retryInMs,
    connectionState?.status
  );
  const copyButtonRef = (0, import_compose.useCopyToClipboard)(() => {
    const blocks = (0, import_data.select)(import_block_editor.store).getBlocks();
    return (0, import_blocks.serialize)(blocks);
  });
  const [syncConnectionMessage, setSyncConnectionMessage] = (0, import_element.useState)(null);
  const debounceTimerRef = (0, import_element.useRef)(null);
  const hasInitializedRef = (0, import_element.useRef)(false);
  const connectionStatus = connectionState?.status;
  const connectionErrorCode = connectionState?.error?.code;
  (0, import_element.useEffect)(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (connectionStatus === "connected") {
      hasInitializedRef.current = true;
      setSyncConnectionMessage(null);
    } else if (connectionStatus === "disconnected") {
      const showModal = () => {
        hasInitializedRef.current = true;
        setSyncConnectionMessage(
          (0, import_sync_error_messages.getSyncErrorMessages)({ code: connectionErrorCode })
        );
      };
      if (hasInitializedRef.current) {
        showModal();
      } else {
        debounceTimerRef.current = setTimeout(
          showModal,
          INITIAL_DISCONNECTED_DEBOUNCE_MS
        );
      }
    }
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [connectionStatus, connectionErrorCode]);
  if (!syncConnectionMessage) {
    return null;
  }
  const { title, description, canRetry } = syncConnectionMessage;
  let retryCountdownText;
  if (secondsRemaining > 0) {
    retryCountdownText = (0, import_i18n.sprintf)(
      /* translators: %d: number of seconds until retry */
      (0, import_i18n._n)(
        "Retrying connection in %d second\u2026",
        "Retrying connection in %d seconds\u2026",
        secondsRemaining
      ),
      secondsRemaining
    );
  } else if (secondsRemaining === 0) {
    retryCountdownText = (0, import_i18n.__)("Retrying\u2026");
  }
  let editPostHref = "edit.php";
  if (postType?.slug) {
    editPostHref = `edit.php?post_type=${postType.slug}`;
  }
  const isRetrying = secondsRemaining === 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockCanvasCover.Fill, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Modal,
    {
      className: "editor-sync-connection-modal",
      isDismissible: false,
      onRequestClose: noop,
      shouldCloseOnClickOutside: false,
      shouldCloseOnEsc: false,
      size: "medium",
      title,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 6, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description }),
        retryCountdownText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "editor-sync-connection-modal__retry-countdown", children: retryCountdownText }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "right", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              href: editPostHref,
              isDestructive: true,
              variant: "tertiary",
              children: (0, import_i18n.sprintf)(
                /* translators: %s: Post type name (e.g., "Posts", "Pages"). */
                (0, import_i18n.__)("Back to %s"),
                postType?.labels?.name ?? (0, import_i18n.__)("Posts")
              )
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              ref: copyButtonRef,
              variant: canRetry ? "secondary" : "primary",
              children: (0, import_i18n.__)("Copy Post Content")
            }
          ),
          canRetry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              "aria-disabled": isRetrying,
              isBusy: isRetrying,
              variant: "primary",
              onClick: () => {
                if (isRetrying) {
                  return;
                }
                markRetrying();
                retrySyncConnection();
              },
              children: (0, import_i18n.__)("Retry")
            }
          )
        ] })
      ] })
    }
  ) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SyncConnectionModal
});
//# sourceMappingURL=index.cjs.map
