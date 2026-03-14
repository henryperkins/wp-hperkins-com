// packages/editor/src/dataviews/api.js
import { dispatch } from "@wordpress/data";
import { unlock } from "../lock-unlock.mjs";
import { store as editorStore } from "../store/index.mjs";
function registerEntityAction(kind, name, config) {
  const { registerEntityAction: _registerEntityAction } = unlock(
    dispatch(editorStore)
  );
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    _registerEntityAction(kind, name, config);
  }
}
function unregisterEntityAction(kind, name, actionId) {
  const { unregisterEntityAction: _unregisterEntityAction } = unlock(
    dispatch(editorStore)
  );
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    _unregisterEntityAction(kind, name, actionId);
  }
}
function registerEntityField(kind, name, config) {
  const { registerEntityField: _registerEntityField } = unlock(
    dispatch(editorStore)
  );
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    _registerEntityField(kind, name, config);
  }
}
function unregisterEntityField(kind, name, fieldId) {
  const { unregisterEntityField: _unregisterEntityField } = unlock(
    dispatch(editorStore)
  );
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    _unregisterEntityField(kind, name, fieldId);
  }
}
export {
  registerEntityAction,
  registerEntityField,
  unregisterEntityAction,
  unregisterEntityField
};
//# sourceMappingURL=api.mjs.map
