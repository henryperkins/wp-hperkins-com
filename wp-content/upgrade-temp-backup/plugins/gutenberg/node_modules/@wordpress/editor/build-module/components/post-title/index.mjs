// packages/editor/src/components/post-title/index.js
import clsx from "clsx";
import { __ } from "@wordpress/i18n";
import { forwardRef, useState } from "@wordpress/element";
import { decodeEntities } from "@wordpress/html-entities";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { ENTER } from "@wordpress/keycodes";
import { pasteHandler } from "@wordpress/blocks";
import {
  privateApis as richTextPrivateApis,
  create,
  insert
} from "@wordpress/rich-text";
import { useMergeRefs } from "@wordpress/compose";
import { __unstableStripHTML as stripHTML } from "@wordpress/dom";
import { DEFAULT_CLASSNAMES, REGEXP_NEWLINES } from "./constants.mjs";
import usePostTitleFocus from "./use-post-title-focus.mjs";
import usePostTitle from "./use-post-title.mjs";
import PostTypeSupportCheck from "../post-type-support-check/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { useRichText } = unlock(richTextPrivateApis);
var PostTitle = forwardRef((_, forwardedRef) => {
  const { placeholder, isEditingContentOnlySection, isPreview } = useSelect(
    (select) => {
      const { getSettings, getEditedContentOnlySection } = unlock(
        select(blockEditorStore)
      );
      const { titlePlaceholder, isPreviewMode } = getSettings();
      return {
        placeholder: titlePlaceholder,
        isEditingContentOnlySection: !!getEditedContentOnlySection(),
        isPreview: isPreviewMode
      };
    },
    []
  );
  const [isSelected, setIsSelected] = useState(false);
  const { ref: focusRef } = usePostTitleFocus(forwardedRef);
  const { title, setTitle: onUpdate } = usePostTitle();
  const [selection, setSelection] = useState({});
  const { clearSelectedBlock, insertBlocks, insertDefaultBlock } = useDispatch(blockEditorStore);
  const decodedPlaceholder = decodeEntities(placeholder) || __("Add title");
  const {
    value,
    onChange,
    ref: richTextRef
  } = useRichText({
    value: title,
    onChange(newValue) {
      onUpdate(newValue.replace(REGEXP_NEWLINES, " "));
    },
    placeholder: decodedPlaceholder,
    selectionStart: selection.start,
    selectionEnd: selection.end,
    onSelectionChange(newStart, newEnd) {
      setSelection((sel) => {
        const { start, end } = sel;
        if (start === newStart && end === newEnd) {
          return sel;
        }
        return {
          start: newStart,
          end: newEnd
        };
      });
    },
    __unstableDisableFormats: false
  });
  function onInsertBlockAfter(blocks) {
    insertBlocks(blocks, 0);
  }
  function onSelect() {
    setIsSelected(true);
    clearSelectedBlock();
  }
  function onUnselect() {
    setIsSelected(false);
    setSelection({});
  }
  function onEnterPress() {
    insertDefaultBlock(void 0, void 0, 0);
  }
  function onKeyDown(event) {
    if (event.keyCode === ENTER) {
      event.preventDefault();
      onEnterPress();
    }
  }
  function onPaste(event) {
    const clipboardData = event.clipboardData;
    let plainText = "";
    let html = "";
    try {
      plainText = clipboardData.getData("text/plain");
      html = clipboardData.getData("text/html");
    } catch (error) {
      return;
    }
    const content = pasteHandler({
      HTML: html,
      plainText
    });
    event.preventDefault();
    if (!content.length) {
      return;
    }
    if (typeof content !== "string") {
      const [firstBlock] = content;
      if (!title && (firstBlock.name === "core/heading" || firstBlock.name === "core/paragraph")) {
        const contentNoHTML = stripHTML(
          firstBlock.attributes.content
        );
        onUpdate(contentNoHTML);
        onInsertBlockAfter(content.slice(1));
      } else {
        onInsertBlockAfter(content);
      }
    } else {
      const contentNoHTML = stripHTML(content);
      onChange(insert(value, create({ html: contentNoHTML })));
    }
  }
  const className = clsx(DEFAULT_CLASSNAMES, {
    "is-selected": isSelected
  });
  const style = isEditingContentOnlySection ? { opacity: 0.2 } : void 0;
  return (
    /* eslint-disable jsx-a11y/heading-has-content, jsx-a11y/no-noninteractive-element-to-interactive-role */
    /* @__PURE__ */ jsx(
      "h1",
      {
        ref: useMergeRefs([richTextRef, focusRef]),
        contentEditable: !isEditingContentOnlySection && !isPreview,
        className,
        "aria-label": decodedPlaceholder,
        role: "textbox",
        "aria-multiline": "true",
        onFocus: onSelect,
        onBlur: onUnselect,
        onKeyDown,
        onPaste,
        style
      }
    )
  );
});
var post_title_default = forwardRef((_, forwardedRef) => /* @__PURE__ */ jsx(PostTypeSupportCheck, { supportKeys: "title", children: /* @__PURE__ */ jsx(PostTitle, { ref: forwardedRef }) }));
export {
  post_title_default as default
};
//# sourceMappingURL=index.mjs.map
