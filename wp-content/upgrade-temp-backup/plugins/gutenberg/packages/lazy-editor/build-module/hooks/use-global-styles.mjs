// packages/lazy-editor/src/hooks/use-global-styles.tsx
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
function useUserGlobalStyles(id) {
  const { userGlobalStyles } = useSelect(
    (select) => {
      const { getEntityRecord, getEditedEntityRecord, canUser } = select(coreStore);
      const userCanEditGlobalStyles = canUser("update", {
        kind: "root",
        name: "globalStyles",
        id
      });
      let record;
      if (
        /*
         * Test that the OPTIONS request for user capabilities is complete
         * before fetching the global styles entity record.
         * This is to avoid fetching the global styles entity unnecessarily.
         */
        typeof userCanEditGlobalStyles === "boolean"
      ) {
        if (userCanEditGlobalStyles) {
          record = getEditedEntityRecord(
            "root",
            "globalStyles",
            id
          );
        } else {
          record = getEntityRecord("root", "globalStyles", id, {
            context: "view"
          });
        }
      }
      return {
        userGlobalStyles: record
      };
    },
    [id]
  );
  return useMemo(() => {
    if (!userGlobalStyles) {
      return {
        user: void 0
      };
    }
    const user = userGlobalStyles;
    return {
      user
    };
  }, [userGlobalStyles]);
}
export {
  useUserGlobalStyles
};
//# sourceMappingURL=use-global-styles.mjs.map
