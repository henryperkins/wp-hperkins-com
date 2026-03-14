// packages/core-data/src/hooks/use-entity-id.js
import { useContext } from "@wordpress/element";
import { EntityContext } from "../entity-context.mjs";
function useEntityId(kind, name) {
  const context = useContext(EntityContext);
  return context?.[kind]?.[name];
}
export {
  useEntityId as default
};
//# sourceMappingURL=use-entity-id.mjs.map
