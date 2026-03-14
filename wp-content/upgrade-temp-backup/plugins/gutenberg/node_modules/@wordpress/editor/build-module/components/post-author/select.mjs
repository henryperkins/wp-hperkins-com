// packages/editor/src/components/post-author/select.js
import { __ } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import { SelectControl } from "@wordpress/components";
import { store as editorStore } from "../../store/index.mjs";
import { useAuthorsQuery } from "./hook.mjs";
import { jsx } from "react/jsx-runtime";
function PostAuthorSelect() {
  const { editPost } = useDispatch(editorStore);
  const { authorId, authorOptions } = useAuthorsQuery();
  const setAuthorId = (value) => {
    const author = Number(value);
    editPost({ author });
  };
  return /* @__PURE__ */ jsx(
    SelectControl,
    {
      __next40pxDefaultSize: true,
      className: "post-author-selector",
      label: __("Author"),
      options: authorOptions,
      onChange: setAuthorId,
      value: authorId,
      hideLabelFromVision: true
    }
  );
}
export {
  PostAuthorSelect as default
};
//# sourceMappingURL=select.mjs.map
