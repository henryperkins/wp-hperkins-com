// packages/editor/src/components/post-taxonomies/check.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
function PostTaxonomiesCheck({ children }) {
  const hasTaxonomies = useSelect((select) => {
    const postType = select(editorStore).getCurrentPostType();
    const taxonomies = select(coreStore).getEntityRecords(
      "root",
      "taxonomy",
      { per_page: -1 }
    );
    return taxonomies?.some(
      (taxonomy) => taxonomy.types.includes(postType)
    );
  }, []);
  if (!hasTaxonomies) {
    return null;
  }
  return children;
}
export {
  PostTaxonomiesCheck as default
};
//# sourceMappingURL=check.mjs.map
