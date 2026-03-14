// packages/editor/src/components/post-title/post-title-raw.js
import clsx from "clsx";
import { TextareaControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { useState, forwardRef } from "@wordpress/element";
import { DEFAULT_CLASSNAMES, REGEXP_NEWLINES } from "./constants.mjs";
import usePostTitleFocus from "./use-post-title-focus.mjs";
import usePostTitle from "./use-post-title.mjs";
import { jsx } from "react/jsx-runtime";
function PostTitleRaw(_, forwardedRef) {
  const { placeholder } = useSelect((select) => {
    const { getSettings } = select(blockEditorStore);
    const { titlePlaceholder } = getSettings();
    return {
      placeholder: titlePlaceholder
    };
  }, []);
  const [isSelected, setIsSelected] = useState(false);
  const { title, setTitle: onUpdate } = usePostTitle();
  const { ref: focusRef } = usePostTitleFocus(forwardedRef);
  function onChange(value) {
    onUpdate(value.replace(REGEXP_NEWLINES, " "));
  }
  function onSelect() {
    setIsSelected(true);
  }
  function onUnselect() {
    setIsSelected(false);
  }
  const className = clsx(DEFAULT_CLASSNAMES, {
    "is-selected": isSelected,
    "is-raw-text": true
  });
  const decodedPlaceholder = decodeEntities(placeholder) || __("Add title");
  return /* @__PURE__ */ jsx(
    TextareaControl,
    {
      ref: focusRef,
      value: title,
      onChange,
      onFocus: onSelect,
      onBlur: onUnselect,
      label: placeholder,
      className,
      placeholder: decodedPlaceholder,
      hideLabelFromVision: true,
      autoComplete: "off",
      dir: "auto",
      rows: 1
    }
  );
}
var post_title_raw_default = forwardRef(PostTitleRaw);
export {
  post_title_raw_default as default
};
//# sourceMappingURL=post-title-raw.mjs.map
