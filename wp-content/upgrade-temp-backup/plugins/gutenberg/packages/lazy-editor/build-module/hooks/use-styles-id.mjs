// packages/lazy-editor/src/hooks/use-styles-id.tsx
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
function useStylesId({ templateId } = {}) {
  const { globalStylesId, stylesId } = useSelect(
    (select) => {
      const coreDataSelect = select(coreStore);
      const template = templateId ? coreDataSelect.getEntityRecord(
        "postType",
        "wp_template",
        templateId
      ) : null;
      return {
        globalStylesId: coreDataSelect.__experimentalGetCurrentGlobalStylesId(),
        stylesId: template?.styles_id
      };
    },
    [templateId]
  );
  return stylesId || globalStylesId;
}
export {
  useStylesId
};
//# sourceMappingURL=use-styles-id.mjs.map
