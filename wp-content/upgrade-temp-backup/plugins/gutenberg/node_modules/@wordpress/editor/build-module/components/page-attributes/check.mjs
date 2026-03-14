// packages/editor/src/components/page-attributes/check.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
function PageAttributesCheck({ children }) {
  const supportsPageAttributes = useSelect((select) => {
    const { getEditedPostAttribute } = select(editorStore);
    const { getPostType } = select(coreStore);
    const postType = getPostType(getEditedPostAttribute("type"));
    return !!postType?.supports?.["page-attributes"];
  }, []);
  if (!supportsPageAttributes) {
    return null;
  }
  return children;
}
var check_default = PageAttributesCheck;
export {
  PageAttributesCheck,
  check_default as default
};
//# sourceMappingURL=check.mjs.map
