// packages/core-data/src/private-actions.js
import apiFetch from "@wordpress/api-fetch";
import { STORE_NAME } from "./name.mjs";
function receiveRegisteredPostMeta(postType, registeredPostMeta) {
  return {
    type: "RECEIVE_REGISTERED_POST_META",
    postType,
    registeredPostMeta
  };
}
var editMediaEntity = (recordId, edits = {}, { __unstableFetch = apiFetch, throwOnError = false } = {}) => async ({ dispatch, resolveSelect }) => {
  if (!recordId) {
    return;
  }
  const kind = "postType";
  const name = "attachment";
  const configs = await resolveSelect.getEntitiesConfig(kind);
  const entityConfig = configs.find(
    (config) => config.kind === kind && config.name === name
  );
  if (!entityConfig) {
    return;
  }
  const lock = await dispatch.__unstableAcquireStoreLock(
    STORE_NAME,
    ["entities", "records", kind, name, recordId],
    { exclusive: true }
  );
  let updatedRecord;
  let error;
  let hasError = false;
  try {
    dispatch({
      type: "SAVE_ENTITY_RECORD_START",
      kind,
      name,
      recordId
    });
    try {
      const path = `${entityConfig.baseURL}/${recordId}/edit`;
      const newRecord = await __unstableFetch({
        path,
        method: "POST",
        data: {
          ...edits
        }
      });
      if (newRecord) {
        dispatch.receiveEntityRecords(
          kind,
          name,
          [newRecord],
          void 0,
          true,
          void 0,
          void 0
        );
        updatedRecord = newRecord;
      }
    } catch (e) {
      error = e;
      hasError = true;
    }
    dispatch({
      type: "SAVE_ENTITY_RECORD_FINISH",
      kind,
      name,
      recordId,
      error
    });
    if (hasError && throwOnError) {
      throw error;
    }
    return updatedRecord;
  } finally {
    dispatch.__unstableReleaseStoreLock(lock);
  }
};
function receiveEditorSettings(settings) {
  return {
    type: "RECEIVE_EDITOR_SETTINGS",
    settings
  };
}
function receiveEditorAssets(assets) {
  return {
    type: "RECEIVE_EDITOR_ASSETS",
    assets
  };
}
var setCollaborationSupported = (supported) => ({ dispatch }) => {
  dispatch({ type: "SET_COLLABORATION_SUPPORTED", supported });
};
export {
  editMediaEntity,
  receiveEditorAssets,
  receiveEditorSettings,
  receiveRegisteredPostMeta,
  setCollaborationSupported
};
//# sourceMappingURL=private-actions.mjs.map
