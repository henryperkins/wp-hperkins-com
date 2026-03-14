// packages/core-data/src/entity-provider.js
import { useContext, useMemo } from "@wordpress/element";
import { EntityContext } from "./entity-context.mjs";
import { jsx } from "react/jsx-runtime";
function EntityProvider({
  kind,
  type: name,
  id,
  revisionId,
  children
}) {
  const parent = useContext(EntityContext);
  const childContext = useMemo(
    () => ({
      ...parent,
      ...kind && {
        [kind]: {
          ...parent?.[kind],
          [name]: id
        }
      },
      ...revisionId !== void 0 && { revisionId }
    }),
    [parent, kind, name, id, revisionId]
  );
  return /* @__PURE__ */ jsx(EntityContext.Provider, { value: childContext, children });
}
export {
  EntityProvider as default
};
//# sourceMappingURL=entity-provider.mjs.map
