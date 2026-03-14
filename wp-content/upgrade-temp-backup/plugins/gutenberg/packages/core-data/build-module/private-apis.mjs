// packages/core-data/src/private-apis.js
import { useEntityRecordsWithPermissions } from "./hooks/use-entity-records.mjs";
import { RECEIVE_INTERMEDIATE_RESULTS } from "./utils/index.mjs";
import {
  useActiveCollaborators,
  useResolvedSelection,
  useLastPostSave
} from "./hooks/use-post-editor-awareness-state.mjs";
import { lock } from "./lock-unlock.mjs";
import { retrySyncConnection } from "./sync.mjs";
var privateApis = {};
lock(privateApis, {
  useEntityRecordsWithPermissions,
  RECEIVE_INTERMEDIATE_RESULTS,
  retrySyncConnection,
  useActiveCollaborators,
  useResolvedSelection,
  useLastPostSave
});
export {
  privateApis
};
//# sourceMappingURL=private-apis.mjs.map
