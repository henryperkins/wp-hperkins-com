// packages/core-data/src/hooks/use-entity-prop.js
import { useCallback, useContext } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { STORE_NAME } from "../name.mjs";
import { DEFAULT_ENTITY_KEY } from "../entities.mjs";
import { EntityContext } from "../entity-context.mjs";
import useEntityId from "./use-entity-id.mjs";
function useEntityProp(kind, name, prop, _id) {
  const providerId = useEntityId(kind, name);
  const id = _id ?? providerId;
  const context = useContext(EntityContext);
  const revisionId = context?.revisionId;
  const { value, fullValue } = useSelect(
    (select) => {
      if (revisionId) {
        const revisions = select(STORE_NAME).getRevisions(
          kind,
          name,
          id,
          {
            per_page: -1,
            context: "edit"
          }
        );
        const entityConfig = select(STORE_NAME).getEntityConfig(
          kind,
          name
        );
        const revKey = entityConfig?.revisionKey || DEFAULT_ENTITY_KEY;
        const revision = revisions?.find(
          (r) => r[revKey] === revisionId
        );
        return revision ? {
          value: revision[prop],
          fullValue: revision[prop]
        } : {};
      }
      const { getEntityRecord, getEditedEntityRecord } = select(STORE_NAME);
      const record = getEntityRecord(kind, name, id);
      const editedRecord = getEditedEntityRecord(kind, name, id);
      return record && editedRecord ? {
        value: editedRecord[prop],
        fullValue: record[prop]
      } : {};
    },
    [kind, name, id, prop, revisionId]
  );
  const { editEntityRecord } = useDispatch(STORE_NAME);
  const setValue = useCallback(
    (newValue) => {
      if (revisionId) {
        return;
      }
      editEntityRecord(kind, name, id, {
        [prop]: newValue
      });
    },
    [editEntityRecord, kind, name, id, prop, revisionId]
  );
  return [value, setValue, fullValue];
}
export {
  useEntityProp as default
};
//# sourceMappingURL=use-entity-prop.mjs.map
