// packages/editor/src/components/post-author/combobox.js
import { debounce } from "@wordpress/compose";
import { useState } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { ComboboxControl } from "@wordpress/components";
import { store as editorStore } from "../../store/index.mjs";
import { useAuthorsQuery } from "./hook.mjs";
import { jsx } from "react/jsx-runtime";
function PostAuthorCombobox() {
  const [fieldValue, setFieldValue] = useState();
  const { editPost } = useDispatch(editorStore);
  const { authorId, authorOptions, isLoading } = useAuthorsQuery(fieldValue);
  const handleSelect = (postAuthorId) => {
    if (!postAuthorId) {
      return;
    }
    editPost({ author: postAuthorId });
  };
  return /* @__PURE__ */ jsx(
    ComboboxControl,
    {
      __next40pxDefaultSize: true,
      label: __("Author"),
      options: authorOptions,
      value: authorId,
      onFilterValueChange: debounce(setFieldValue, 300),
      onChange: handleSelect,
      allowReset: false,
      hideLabelFromVision: true,
      isLoading
    }
  );
}
export {
  PostAuthorCombobox as default
};
//# sourceMappingURL=combobox.mjs.map
