"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-title/index.js
var post_title_exports = {};
__export(post_title_exports, {
  default: () => post_title_default
});
module.exports = __toCommonJS(post_title_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_html_entities = require("@wordpress/html-entities");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_keycodes = require("@wordpress/keycodes");
var import_blocks = require("@wordpress/blocks");
var import_rich_text = require("@wordpress/rich-text");
var import_compose = require("@wordpress/compose");
var import_dom = require("@wordpress/dom");
var import_constants = require("./constants.cjs");
var import_use_post_title_focus = __toESM(require("./use-post-title-focus.cjs"));
var import_use_post_title = __toESM(require("./use-post-title.cjs"));
var import_post_type_support_check = __toESM(require("../post-type-support-check/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = (
  /* eslint-disable jsx-a11y/heading-has-content, jsx-a11y/no-noninteractive-element-to-interactive-role */
  require("react/jsx-runtime")
);
var { useRichText } = (0, import_lock_unlock.unlock)(import_rich_text.privateApis);
var PostTitle = (0, import_element.forwardRef)((_, forwardedRef) => {
  const { placeholder, isEditingContentOnlySection, isPreview } = (0, import_data.useSelect)(
    (select) => {
      const { getSettings, getEditedContentOnlySection } = (0, import_lock_unlock.unlock)(
        select(import_block_editor.store)
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
  const [isSelected, setIsSelected] = (0, import_element.useState)(false);
  const { ref: focusRef } = (0, import_use_post_title_focus.default)(forwardedRef);
  const { title, setTitle: onUpdate } = (0, import_use_post_title.default)();
  const [selection, setSelection] = (0, import_element.useState)({});
  const { clearSelectedBlock, insertBlocks, insertDefaultBlock } = (0, import_data.useDispatch)(import_block_editor.store);
  const decodedPlaceholder = (0, import_html_entities.decodeEntities)(placeholder) || (0, import_i18n.__)("Add title");
  const {
    value,
    onChange,
    ref: richTextRef
  } = useRichText({
    value: title,
    onChange(newValue) {
      onUpdate(newValue.replace(import_constants.REGEXP_NEWLINES, " "));
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
    if (event.keyCode === import_keycodes.ENTER) {
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
    const content = (0, import_blocks.pasteHandler)({
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
        const contentNoHTML = (0, import_dom.__unstableStripHTML)(
          firstBlock.attributes.content
        );
        onUpdate(contentNoHTML);
        onInsertBlockAfter(content.slice(1));
      } else {
        onInsertBlockAfter(content);
      }
    } else {
      const contentNoHTML = (0, import_dom.__unstableStripHTML)(content);
      onChange((0, import_rich_text.insert)(value, (0, import_rich_text.create)({ html: contentNoHTML })));
    }
  }
  const className = (0, import_clsx.default)(import_constants.DEFAULT_CLASSNAMES, {
    "is-selected": isSelected
  });
  const style = isEditingContentOnlySection ? { opacity: 0.2 } : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "h1",
    {
      ref: (0, import_compose.useMergeRefs)([richTextRef, focusRef]),
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
  );
});
var post_title_default = (0, import_element.forwardRef)((_, forwardedRef) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_type_support_check.default, { supportKeys: "title", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostTitle, { ref: forwardedRef }) }));
//# sourceMappingURL=index.cjs.map
