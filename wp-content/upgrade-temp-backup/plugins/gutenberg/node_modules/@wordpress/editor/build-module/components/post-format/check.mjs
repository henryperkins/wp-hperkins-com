// packages/editor/src/components/post-format/check.js
import { useSelect } from "@wordpress/data";
import PostTypeSupportCheck from "../post-type-support-check/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function PostFormatCheck({ children }) {
  const disablePostFormats = useSelect(
    (select) => select(editorStore).getEditorSettings().disablePostFormats,
    []
  );
  if (disablePostFormats) {
    return null;
  }
  return /* @__PURE__ */ jsx(PostTypeSupportCheck, { supportKeys: "post-formats", children });
}
export {
  PostFormatCheck as default
};
//# sourceMappingURL=check.mjs.map
