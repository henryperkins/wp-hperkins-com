// packages/format-library/src/link/index.js
import { __ } from "@wordpress/i18n";
import { useState, useLayoutEffect, useEffect } from "@wordpress/element";
import {
  getTextContent,
  applyFormat,
  removeFormat,
  slice,
  isCollapsed,
  insert,
  create
} from "@wordpress/rich-text";
import { isURL, isEmail, isPhoneNumber } from "@wordpress/url";
import {
  RichTextToolbarButton,
  RichTextShortcut
} from "@wordpress/block-editor";
import { decodeEntities } from "@wordpress/html-entities";
import { link as linkIcon } from "@wordpress/icons";
import { speak } from "@wordpress/a11y";
import InlineLinkUI from "./inline.mjs";
import { isValidHref } from "./utils.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var name = "core/link";
var title = __("Link");
function Edit({
  isActive,
  activeAttributes,
  value,
  onChange,
  onFocus,
  contentRef,
  isVisible = true
}) {
  const [addingLink, setAddingLink] = useState(false);
  const [openedBy, setOpenedBy] = useState(null);
  useEffect(() => {
    if (!isActive) {
      setAddingLink(false);
    }
  }, [isActive]);
  useLayoutEffect(() => {
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
    const text = getTextContent(slice(value));
    if (!isActive && text && isURL(text) && isValidHref(text)) {
      onChange(
        applyFormat(value, {
          type: name,
          attributes: { url: text }
        })
      );
    } else if (!isActive && text && isEmail(text)) {
      onChange(
        applyFormat(value, {
          type: name,
          attributes: { url: `mailto:${text}` }
        })
      );
    } else if (!isActive && text && isPhoneNumber(text)) {
      onChange(
        applyFormat(value, {
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
    onChange(removeFormat(value, name));
    speak(__("Link removed."), "assertive");
  }
  const shouldAutoFocus = !(openedBy?.el?.tagName === "A" && openedBy?.action === "click");
  const hasSelection = !isCollapsed(value);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    hasSelection && /* @__PURE__ */ jsx(
      RichTextShortcut,
      {
        type: "primary",
        character: "k",
        onUse: addLink
      }
    ),
    /* @__PURE__ */ jsx(
      RichTextShortcut,
      {
        type: "primaryShift",
        character: "k",
        onUse: onRemoveFormat
      }
    ),
    isVisible && /* @__PURE__ */ jsx(
      RichTextToolbarButton,
      {
        name: "link",
        icon: linkIcon,
        title: isActive ? __("Link") : title,
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
    isVisible && addingLink && /* @__PURE__ */ jsx(
      InlineLinkUI,
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
    if (!isURL(pastedText) || !/^https?:/.test(pastedText)) {
      return value;
    }
    window.console.log("Created link:\n\n", pastedText);
    const format = {
      type: name,
      attributes: {
        url: decodeEntities(pastedText)
      }
    };
    if (isCollapsed(value)) {
      return insert(
        value,
        applyFormat(
          create({ text: plainText }),
          format,
          0,
          plainText.length
        )
      );
    }
    return applyFormat(value, format);
  },
  edit: Edit
};
export {
  link
};
//# sourceMappingURL=index.mjs.map
