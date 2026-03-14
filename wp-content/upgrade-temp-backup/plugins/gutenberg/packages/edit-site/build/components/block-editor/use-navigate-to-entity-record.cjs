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

// packages/edit-site/src/components/block-editor/use-navigate-to-entity-record.js
var use_navigate_to_entity_record_exports = {};
__export(use_navigate_to_entity_record_exports, {
  default: () => useNavigateToEntityRecord
});
module.exports = __toCommonJS(use_navigate_to_entity_record_exports);
var import_data = require("@wordpress/data");
var import_router = require("@wordpress/router");
var import_element = require("@wordpress/element");
var import_url = require("@wordpress/url");
var import_core_data = require("@wordpress/core-data");
var import_editor = require("@wordpress/editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_use_viewport_sync = require("./use-viewport-sync.cjs");
var { useHistory, useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var VALID_VIEWPORTS = ["desktop", "tablet", "mobile"];
function useNavigateToEntityRecord() {
  const history = useHistory();
  const location = useLocation();
  const { query, path } = location;
  const registry = (0, import_data.useRegistry)();
  const currentDeviceType = (0, import_data.useSelect)(
    (select) => select(import_editor.store).getDeviceType(),
    []
  );
  const onNavigateToEntityRecord = (0, import_element.useCallback)(
    (params) => {
      const currentPostType = registry.select(import_editor.store).getCurrentPostType();
      const currentPostId = registry.select(import_editor.store).getCurrentPostId();
      const entityEdits = registry.select(import_core_data.store).getEntityRecordEdits(
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
        const currentViewportLower = (currentDeviceType || import_use_viewport_sync.DEFAULT_DEVICE_TYPE).toLowerCase();
        if (currentViewportLower === import_use_viewport_sync.DEFAULT_DEVICE_TYPE.toLowerCase()) {
          delete urlUpdates.viewport;
        } else {
          urlUpdates.viewport = currentViewportLower;
        }
      }
      const hasUpdatesToSave = externalClientId || isValidRequestedViewport;
      if (hasUpdatesToSave) {
        history.navigate((0, import_url.addQueryArgs)(path, urlUpdates), {
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
      const url = (0, import_url.addQueryArgs)(
        `/${params.postType}/${params.postId}`,
        queryArgs
      );
      history.navigate(url);
    },
    [history, path, query, registry, currentDeviceType]
  );
  return onNavigateToEntityRecord;
}
//# sourceMappingURL=use-navigate-to-entity-record.cjs.map
