// packages/editor/src/components/media/preview.js
import {
  MediaEditorProvider,
  MediaPreview as BaseMediaPreview
} from "@wordpress/media-editor";
import { useSelect } from "@wordpress/data";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function MediaPreview(props) {
  const { media } = useSelect((select) => {
    const currentPost = select(editorStore).getCurrentPost();
    return {
      media: currentPost
    };
  }, []);
  return /* @__PURE__ */ jsx(MediaEditorProvider, { value: media, children: /* @__PURE__ */ jsx(BaseMediaPreview, { ...props }) });
}
export {
  MediaPreview as default
};
//# sourceMappingURL=preview.mjs.map
