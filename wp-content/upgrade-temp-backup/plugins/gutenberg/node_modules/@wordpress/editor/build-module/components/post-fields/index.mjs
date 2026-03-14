// packages/editor/src/components/post-fields/index.ts
import { useEffect } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { unlock } from "../../lock-unlock.mjs";
import { store as editorStore } from "../../store/index.mjs";
function usePostFields({
  postType
}) {
  const { registerPostTypeSchema } = unlock(useDispatch(editorStore));
  useEffect(() => {
    registerPostTypeSchema(postType);
  }, [registerPostTypeSchema, postType]);
  const { fields } = useSelect(
    (select) => {
      const { getEntityFields } = unlock(select(editorStore));
      return {
        fields: getEntityFields("postType", postType)
      };
    },
    [postType]
  );
  return fields;
}
var post_fields_default = usePostFields;
export {
  post_fields_default as default
};
//# sourceMappingURL=index.mjs.map
