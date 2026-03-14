// packages/editor/src/components/post-text-editor/index.js
import Textarea from "react-autosize-textarea";
import { __ } from "@wordpress/i18n";
import { store as coreStore } from "@wordpress/core-data";
import { useDispatch, useSelect } from "@wordpress/data";
import { useInstanceId } from "@wordpress/compose";
import { VisuallyHidden } from "@wordpress/components";
import { store as editorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function PostTextEditor() {
  const instanceId = useInstanceId(PostTextEditor);
  const { value, type, id } = useSelect((select) => {
    const { getCurrentPostType, getCurrentPostId, getEditedPostContent } = select(editorStore);
    return {
      value: getEditedPostContent(),
      type: getCurrentPostType(),
      id: getCurrentPostId()
    };
  }, []);
  const { editEntityRecord } = useDispatch(coreStore);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      VisuallyHidden,
      {
        as: "label",
        htmlFor: `post-content-${instanceId}`,
        children: __("Type text or HTML")
      }
    ),
    /* @__PURE__ */ jsx(
      Textarea,
      {
        autoComplete: "off",
        dir: "auto",
        value,
        onChange: (event) => {
          editEntityRecord("postType", type, id, {
            content: event.target.value,
            blocks: void 0,
            selection: void 0
          });
        },
        className: "editor-post-text-editor",
        id: `post-content-${instanceId}`,
        placeholder: __("Start writing with text or HTML")
      }
    )
  ] });
}
export {
  PostTextEditor as default
};
//# sourceMappingURL=index.mjs.map
