var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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

// packages/format-library/src/link/index.js
var link_exports = {};
__export(link_exports, {
  link: () => link
});
module.exports = __toCommonJS(link_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_rich_text = require("@wordpress/rich-text");
var import_url = require("@wordpress/url");
var import_block_editor = require("@wordpress/block-editor");
var import_html_entities = require("@wordpress/html-entities");
var import_icons = require("@wordpress/icons");
var import_a11y = require("@wordpress/a11y");
var import_inline = __toESM(require("./inline.cjs"));
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var name = "core/link";
var title = (0, import_i18n.__)("Link");
function Edit({
  isActive,
  activeAttributes,
  value,
  onChange,
  onFocus,
  contentRef,
  isVisible = true
}) {
  const [addingLink, setAddingLink] = (0, import_element.useState)(false);
  const [openedBy, setOpenedBy] = (0, import_element.useState)(null);
  (0, import_element.useEffect)(() => {
    if (!isActive) {
      setAddingLink(false);
    }
  }, [isActive]);
  (0, import_element.useLayoutEffect)(() => {
    const editableContentElement = contentRef.current;
    if (!editableContentElement) {
      return;
    }
    function handleClick(event) {
      const link2 = event.target.closest("[contenteditable] a");
      if (!link2 || // other formats (e.g. bold) may be nested within the link.
      !isActive) {
        return;
      }
      setAddingLink(true);
      setOpenedBy({
        el: link2,
        action: "click"
      });
    }
    editableContentElement.addEventListener("click", handleClick);
    return () => {
      editableContentElement.removeEventListener("click", handleClick);
    };
  }, [contentRef, isActive]);
  function addLink(target) {
    const text = (0, import_rich_text.getTextContent)((0, import_rich_text.slice)(value));
    if (!isActive && text && (0, import_url.isURL)(text) && (0, import_utils.isValidHref)(text)) {
      onChange(
        (0, import_rich_text.applyFormat)(value, {
          type: name,
          attributes: { url: text }
        })
      );
    } else if (!isActive && text && (0, import_url.isEmail)(text)) {
      onChange(
        (0, import_rich_text.applyFormat)(value, {
          type: name,
          attributes: { url: `mailto:${text}` }
        })
      );
    } else if (!isActive && text && (0, import_url.isPhoneNumber)(text)) {
      onChange(
        (0, import_rich_text.applyFormat)(value, {
          type: name,
          attributes: { url: `tel:${text.replace(/\D/g, "")}` }
        })
      );
    } else {
      if (target) {
        setOpenedBy({
          el: target,
          action: null
          // We don't need to distinguish between click or keyboard here
        });
      }
      setAddingLink(true);
    }
  }
  function stopAddingLink() {
    setAddingLink(false);
    if (openedBy?.el?.tagName === "BUTTON") {
      openedBy.el.focus();
    } else {
      onFocus();
    }
    setOpenedBy(null);
  }
  function onFocusOutside() {
    setAddingLink(false);
    setOpenedBy(null);
  }
  function onRemoveFormat() {
    onChange((0, import_rich_text.removeFormat)(value, name));
    (0, import_a11y.speak)((0, import_i18n.__)("Link removed."), "assertive");
  }
  const shouldAutoFocus = !(openedBy?.el?.tagName === "A" && openedBy?.action === "click");
  const hasSelection = !(0, import_rich_text.isCollapsed)(value);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    hasSelection && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.RichTextShortcut,
      {
        type: "primary",
        character: "k",
        onUse: addLink
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.RichTextShortcut,
      {
        type: "primaryShift",
        character: "k",
        onUse: onRemoveFormat
      }
    ),
    isVisible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.RichTextToolbarButton,
      {
        name: "link",
        icon: import_icons.link,
        title: isActive ? (0, import_i18n.__)("Link") : title,
        onClick: (event) => {
          addLink(event.currentTarget);
        },
        isActive: isActive || addingLink,
        shortcutType: "primary",
        shortcutCharacter: "k",
        "aria-haspopup": "true",
        "aria-expanded": addingLink
      }
    ),
    isVisible && addingLink && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_inline.default,
      {
        stopAddingLink,
        onFocusOutside,
        isActive,
        activeAttributes,
        value,
        onChange,
        contentRef,
        focusOnMount: shouldAutoFocus ? "firstElement" : false
      }
    )
  ] });
}
var link = {
  name,
  title,
  tagName: "a",
  className: null,
  attributes: {
    url: "href",
    type: "data-type",
    id: "data-id",
    _id: "id",
    target: "target",
    rel: "rel",
    class: "class"
  },
  __unstablePasteRule(value, { html, plainText }) {
    const pastedText = (html || plainText).replace(/<[^>]+>/g, "").trim();
    if (!(0, import_url.isURL)(pastedText) || !/^https?:/.test(pastedText)) {
      return value;
    }
    window.console.log("Created link:\n\n", pastedText);
    const format = {
      type: name,
      attributes: {
        url: (0, import_html_entities.decodeEntities)(pastedText)
      }
    };
    if ((0, import_rich_text.isCollapsed)(value)) {
      return (0, import_rich_text.insert)(
        value,
        (0, import_rich_text.applyFormat)(
          (0, import_rich_text.create)({ text: plainText }),
          format,
          0,
          plainText.length
        )
      );
    }
    return (0, import_rich_text.applyFormat)(value, format);
  },
  edit: Edit
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  link
});
//# sourceMappingURL=index.cjs.map
