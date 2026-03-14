// packages/editor/src/components/post-type-support-check/index.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
function checkSupport(supports = {}, key) {
  if (supports[key] !== void 0) {
    return !!supports[key];
  }
  const [topKey, subKey] = key.split(".");
  const [subProperties] = Array.isArray(supports[topKey]) ? supports[topKey] : [];
  return Array.isArray(subProperties) ? subProperties.includes(subKey) : !!subProperties?.[subKey];
}
function PostTypeSupportCheck({ children, supportKeys }) {
  const postType = useSelect((select) => {
    const { getEditedPostAttribute } = select(editorStore);
    const { getPostType } = select(coreStore);
    return getPostType(getEditedPostAttribute("type"));
  }, []);
  let isSupported = !!postType;
  if (postType) {
    isSupported = (Array.isArray(supportKeys) ? supportKeys : [supportKeys]).some((key) => checkSupport(postType.supports, key));
  }
  if (!isSupported) {
    return null;
  }
  return children;
}
var post_type_support_check_default = PostTypeSupportCheck;
export {
  post_type_support_check_default as default
};
//# sourceMappingURL=index.mjs.map
