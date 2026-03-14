// packages/editor/src/components/media/metadata-panel.js
import { MediaEditorProvider, MediaForm } from "@wordpress/media-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
import usePostFields from "../post-fields/index.mjs";
import PostCardPanel from "../post-card-panel/index.mjs";
import PostPanelSection from "../post-panel-section/index.mjs";
import { jsx } from "react/jsx-runtime";
function MediaMetadataPanel({ onActionPerformed }) {
  const { media, postType, postId } = useSelect((select) => {
    const _postType = select(editorStore).getCurrentPostType();
    const _postId = select(editorStore).getCurrentPostId();
    const currentPost = select(coreStore).getEditedEntityRecord(
      "postType",
      _postType,
      _postId,
      {
        _embed: "author,wp:attached-to"
      }
    );
    return {
      media: currentPost,
      postType: _postType,
      postId: _postId
    };
  }, []);
  const { editPost } = useDispatch(editorStore);
  const fields = usePostFields({ postType: "attachment" });
  const settings = useMemo(
    () => ({
      fields
    }),
    [fields]
  );
  const handleUpdate = (updates) => {
    editPost(updates);
  };
  return /* @__PURE__ */ jsx(PostPanelSection, { className: "editor-media-metadata-panel", children: /* @__PURE__ */ jsx(
    MediaEditorProvider,
    {
      value: media,
      settings,
      onChange: handleUpdate,
      children: /* @__PURE__ */ jsx(
        MediaForm,
        {
          header: /* @__PURE__ */ jsx(
            PostCardPanel,
            {
              postType,
              postId,
              onActionPerformed
            }
          )
        }
      )
    }
  ) });
}
export {
  MediaMetadataPanel as default
};
//# sourceMappingURL=metadata-panel.mjs.map
