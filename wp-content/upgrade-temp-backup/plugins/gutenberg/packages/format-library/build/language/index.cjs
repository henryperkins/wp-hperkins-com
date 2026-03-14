var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/format-library/src/language/index.js
var language_exports = {};
__export(language_exports, {
  language: () => language
});
module.exports = __toCommonJS(language_exports);
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_rich_text = require("@wordpress/rich-text");
var import_icons = require("@wordpress/icons");
var import_jsx_runtime = require("react/jsx-runtime");
var name = "core/language";
var title = (0, import_i18n.__)("Language");
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
  const [isPopoverVisible, setIsPopoverVisible] = (0, import_element.useState)(false);
  const togglePopover = () => {
    setIsPopoverVisible((state) => !state);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.RichTextToolbarButton,
      {
        icon: import_icons.language,
        label: title,
        title,
        onClick: () => {
          if (isActive) {
            onChange((0, import_rich_text.removeFormat)(value, name));
          } else {
            togglePopover();
          }
        },
        isActive,
        role: "menuitemcheckbox"
      }
    ),
    isPopoverVisible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  const popoverAnchor = (0, import_rich_text.useAnchor)({
    editableContentElement: contentRef.current,
    settings: language
  });
  const [lang, setLang] = (0, import_element.useState)("");
  const [dir, setDir] = (0, import_element.useState)("ltr");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Popover,
    {
      className: "block-editor-format-toolbar__language-popover",
      anchor: popoverAnchor,
      onClose,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        import_components.__experimentalVStack,
        {
          as: "form",
          spacing: 4,
          className: "block-editor-format-toolbar__language-container-content",
          onSubmit: (event) => {
            event.preventDefault();
            onChange(
              (0, import_rich_text.applyFormat)(value, {
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
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.TextControl,
              {
                __next40pxDefaultSize: true,
                label: title,
                value: lang,
                onChange: (val) => setLang(val),
                help: (0, import_i18n.__)(
                  'A valid language attribute, like "en" or "fr".'
                )
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.SelectControl,
              {
                __next40pxDefaultSize: true,
                label: (0, import_i18n.__)("Text direction"),
                value: dir,
                options: [
                  {
                    label: (0, import_i18n.__)("Left to right"),
                    value: "ltr"
                  },
                  {
                    label: (0, import_i18n.__)("Right to left"),
                    value: "rtl"
                  }
                ],
                onChange: (val) => setDir(val)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalHStack, { alignment: "right", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Button,
              {
                __next40pxDefaultSize: true,
                variant: "primary",
                type: "submit",
                text: (0, import_i18n.__)("Apply")
              }
            ) })
          ]
        }
      )
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  language
});
//# sourceMappingURL=index.cjs.map
