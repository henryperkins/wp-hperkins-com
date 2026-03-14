// packages/block-editor/src/components/media-upload/check.js
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
function MediaUploadCheck({ fallback = null, children }) {
  const hasUploadPermissions = useSelect((select) => {
    const { getSettings } = select(blockEditorStore);
    return !!getSettings().mediaUpload;
  }, []);
  return hasUploadPermissions ? children : fallback;
}
var check_default = MediaUploadCheck;
export {
  MediaUploadCheck,
  check_default as default
};
//# sourceMappingURL=check.mjs.map
