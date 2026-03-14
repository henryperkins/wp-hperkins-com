// packages/editor/src/components/sync-connection-modal/index.js
import { useSelect, select } from "@wordpress/data";
import { useCopyToClipboard } from "@wordpress/compose";
import { serialize } from "@wordpress/blocks";
import {
  store as coreDataStore,
  privateApis as coreDataPrivateApis
} from "@wordpress/core-data";
import {
  privateApis,
  store as blockEditorStore
} from "@wordpress/block-editor";
import {
  Button,
  Modal,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { useState, useEffect, useRef } from "@wordpress/element";
import { __, sprintf, _n } from "@wordpress/i18n";
import { getSyncErrorMessages } from "../../utils/sync-error-messages.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { useRetryCountdown } from "./use-retry-countdown.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { BlockCanvasCover } = unlock(privateApis);
var { retrySyncConnection } = unlock(coreDataPrivateApis);
var INITIAL_DISCONNECTED_DEBOUNCE_MS = 5e3;
var noop = () => {
};
function SyncConnectionModal() {
  const { connectionState, postType } = useSelect((selectFn) => {
    const currentPostType = selectFn(editorStore).getCurrentPostType();
    return {
      connectionState: selectFn(coreDataStore).getSyncConnectionStatus() || null,
      postType: currentPostType ? selectFn(coreDataStore).getPostType(currentPostType) : null
    };
  }, []);
  const { secondsRemaining, markRetrying } = useRetryCountdown(
    connectionState?.retryInMs,
    connectionState?.status
  );
  const copyButtonRef = useCopyToClipboard(() => {
    const blocks = select(blockEditorStore).getBlocks();
    return serialize(blocks);
  });
  const [syncConnectionMessage, setSyncConnectionMessage] = useState(null);
  const debounceTimerRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const connectionStatus = connectionState?.status;
  const connectionErrorCode = connectionState?.error?.code;
  useEffect(() => {
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
          getSyncErrorMessages({ code: connectionErrorCode })
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
    retryCountdownText = sprintf(
      /* translators: %d: number of seconds until retry */
      _n(
        "Retrying connection in %d second\u2026",
        "Retrying connection in %d seconds\u2026",
        secondsRemaining
      ),
      secondsRemaining
    );
  } else if (secondsRemaining === 0) {
    retryCountdownText = __("Retrying\u2026");
  }
  let editPostHref = "edit.php";
  if (postType?.slug) {
    editPostHref = `edit.php?post_type=${postType.slug}`;
  }
  const isRetrying = secondsRemaining === 0;
  return /* @__PURE__ */ jsx(BlockCanvasCover.Fill, { children: /* @__PURE__ */ jsx(
    Modal,
    {
      className: "editor-sync-connection-modal",
      isDismissible: false,
      onRequestClose: noop,
      shouldCloseOnClickOutside: false,
      shouldCloseOnEsc: false,
      size: "medium",
      title,
      children: /* @__PURE__ */ jsxs(VStack, { spacing: 6, children: [
        /* @__PURE__ */ jsx("p", { children: description }),
        retryCountdownText && /* @__PURE__ */ jsx("p", { className: "editor-sync-connection-modal__retry-countdown", children: retryCountdownText }),
        /* @__PURE__ */ jsxs(HStack, { justify: "right", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              href: editPostHref,
              isDestructive: true,
              variant: "tertiary",
              children: sprintf(
                /* translators: %s: Post type name (e.g., "Posts", "Pages"). */
                __("Back to %s"),
                postType?.labels?.name ?? __("Posts")
              )
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              ref: copyButtonRef,
              variant: canRetry ? "secondary" : "primary",
              children: __("Copy Post Content")
            }
          ),
          canRetry && /* @__PURE__ */ jsx(
            Button,
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
              children: __("Retry")
            }
          )
        ] })
      ] })
    }
  ) });
}
export {
  SyncConnectionModal
};
//# sourceMappingURL=index.mjs.map
