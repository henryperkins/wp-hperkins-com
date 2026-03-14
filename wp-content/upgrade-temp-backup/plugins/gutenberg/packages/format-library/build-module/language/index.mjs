// packages/format-library/src/language/index.js
import { __ } from "@wordpress/i18n";
import { RichTextToolbarButton } from "@wordpress/block-editor";
import {
  TextControl,
  SelectControl,
  Button,
  Popover,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { useState } from "@wordpress/element";
import { applyFormat, removeFormat, useAnchor } from "@wordpress/rich-text";
import { language as languageIcon } from "@wordpress/icons";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var name = "core/language";
var title = __("Language");
var language = {
  name,
  title,
  tagName: "bdo",
  className: null,
  attributes: {
    lang: "lang",
    dir: "dir"
  },
  edit: Edit
};
function Edit({ isActive, value, onChange, contentRef }) {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const togglePopover = () => {
    setIsPopoverVisible((state) => !state);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      RichTextToolbarButton,
      {
        icon: languageIcon,
        label: title,
        title,
        onClick: () => {
          if (isActive) {
            onChange(removeFormat(value, name));
          } else {
            togglePopover();
          }
        },
        isActive,
        role: "menuitemcheckbox"
      }
    ),
    isPopoverVisible && /* @__PURE__ */ jsx(
      InlineLanguageUI,
      {
        value,
        onChange,
        onClose: togglePopover,
        contentRef
      }
    )
  ] });
}
function InlineLanguageUI({ value, contentRef, onChange, onClose }) {
  const popoverAnchor = useAnchor({
    editableContentElement: contentRef.current,
    settings: language
  });
  const [lang, setLang] = useState("");
  const [dir, setDir] = useState("ltr");
  return /* @__PURE__ */ jsx(
    Popover,
    {
      className: "block-editor-format-toolbar__language-popover",
      anchor: popoverAnchor,
      onClose,
      children: /* @__PURE__ */ jsxs(
        VStack,
        {
          as: "form",
          spacing: 4,
          className: "block-editor-format-toolbar__language-container-content",
          onSubmit: (event) => {
            event.preventDefault();
            onChange(
              applyFormat(value, {
                type: name,
                attributes: {
                  lang,
                  dir
                }
              })
            );
            onClose();
          },
          children: [
            /* @__PURE__ */ jsx(
              TextControl,
              {
                __next40pxDefaultSize: true,
                label: title,
                value: lang,
                onChange: (val) => setLang(val),
                help: __(
                  'A valid language attribute, like "en" or "fr".'
                )
              }
            ),
            /* @__PURE__ */ jsx(
              SelectControl,
              {
                __next40pxDefaultSize: true,
                label: __("Text direction"),
                value: dir,
                options: [
                  {
                    label: __("Left to right"),
                    value: "ltr"
                  },
                  {
                    label: __("Right to left"),
                    value: "rtl"
                  }
                ],
                onChange: (val) => setDir(val)
              }
            ),
            /* @__PURE__ */ jsx(HStack, { alignment: "right", children: /* @__PURE__ */ jsx(
              Button,
              {
                __next40pxDefaultSize: true,
                variant: "primary",
                type: "submit",
                text: __("Apply")
              }
            ) })
          ]
        }
      )
    }
  );
}
export {
  language
};
//# sourceMappingURL=index.mjs.map
