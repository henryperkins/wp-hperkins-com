// packages/edit-site/src/components/block-editor/use-navigate-to-entity-record.js
import { useSelect, useRegistry } from "@wordpress/data";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { useCallback } from "@wordpress/element";
import { addQueryArgs } from "@wordpress/url";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "@wordpress/editor";
import { unlock } from "../../lock-unlock.mjs";
import { DEFAULT_DEVICE_TYPE } from "./use-viewport-sync.mjs";
var { useHistory, useLocation } = unlock(routerPrivateApis);
var VALID_VIEWPORTS = ["desktop", "tablet", "mobile"];
function useNavigateToEntityRecord() {
  const history = useHistory();
  const location = useLocation();
  const { query, path } = location;
  const registry = useRegistry();
  const currentDeviceType = useSelect(
    (select) => select(editorStore).getDeviceType(),
    []
  );
  const onNavigateToEntityRecord = useCallback(
    (params) => {
      const currentPostType = registry.select(editorStore).getCurrentPostType();
      const currentPostId = registry.select(editorStore).getCurrentPostId();
      const entityEdits = registry.select(coreStore).getEntityRecordEdits(
        "postType",
        currentPostType,
        currentPostId
      );
      const externalClientId = entityEdits?.selection?.selectionStart?.clientId;
      const urlUpdates = { ...query };
      if (externalClientId) {
        urlUpdates.selectedBlock = externalClientId;
      }
      const requestedViewport = typeof params.viewport === "string" ? params.viewport.toLowerCase() : void 0;
      const isValidRequestedViewport = VALID_VIEWPORTS.includes(requestedViewport);
      if (isValidRequestedViewport) {
        const currentViewportLower = (currentDeviceType || DEFAULT_DEVICE_TYPE).toLowerCase();
        if (currentViewportLower === DEFAULT_DEVICE_TYPE.toLowerCase()) {
          delete urlUpdates.viewport;
        } else {
          urlUpdates.viewport = currentViewportLower;
        }
      }
      const hasUpdatesToSave = externalClientId || isValidRequestedViewport;
      if (hasUpdatesToSave) {
        history.navigate(addQueryArgs(path, urlUpdates), {
          replace: true
        });
      }
      const queryArgs = {
        canvas: "edit",
        focusMode: true
      };
      if (isValidRequestedViewport) {
        queryArgs.viewport = requestedViewport;
      }
      const url = addQueryArgs(
        `/${params.postType}/${params.postId}`,
        queryArgs
      );
      history.navigate(url);
    },
    [history, path, query, registry, currentDeviceType]
  );
  return onNavigateToEntityRecord;
}
export {
  useNavigateToEntityRecord as default
};
//# sourceMappingURL=use-navigate-to-entity-record.mjs.map
