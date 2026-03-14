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

// packages/format-library/src/image/index.js
var image_exports = {};
__export(image_exports, {
  image: () => image
});
module.exports = __toCommonJS(image_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_rich_text = require("@wordpress/rich-text");
var import_block_editor = require("@wordpress/block-editor");
var import_jsx_runtime = require("react/jsx-runtime");
var ALLOWED_MEDIA_TYPES = ["image"];
var name = "core/image";
var title = (0, import_i18n.__)("Inline image");
function getCurrentImageId(activeObjectAttributes) {
  if (!activeObjectAttributes?.className) {
    return void 0;
  }
  const [, id] = activeObjectAttributes.className.match(/wp-image-(\d+)/) ?? [];
  return id ? parseInt(id, 10) : void 0;
}
var image = {
  name,
  title,
  keywords: [(0, import_i18n.__)("photo"), (0, import_i18n.__)("media")],
  object: true,
  tagName: "img",
  className: null,
  attributes: {
    className: "class",
    style: "style",
    url: "src",
    alt: "alt"
  },
  edit: Edit
};
function InlineUI({ value, onChange, activeObjectAttributes, contentRef }) {
  const { style, alt } = activeObjectAttributes;
  const width = style?.replace(/\D/g, "");
  const [editedWidth, setEditedWidth] = (0, import_element.useState)(width);
  const [editedAlt, setEditedAlt] = (0, import_element.useState)(alt);
  const hasChanged = editedWidth !== width || editedAlt !== alt;
  const popoverAnchor = (0, import_rich_text.useAnchor)({
    editableContentElement: contentRef.current,
    settings: image
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Popover,
    {
      focusOnMount: false,
      anchor: popoverAnchor,
      className: "block-editor-format-toolbar__image-popover",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "form",
        {
          className: "block-editor-format-toolbar__image-container-content",
          onSubmit: (event) => {
            const newReplacements = value.replacements.slice();
            newReplacements[value.start] = {
              type: name,
              attributes: {
                ...activeObjectAttributes,
                style: editedWidth ? `width: ${editedWidth}px;` : "",
                alt: editedAlt
              }
            };
            onChange({
              ...value,
              replacements: newReplacements
            });
            event.preventDefault();
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.__experimentalNumberControl,
              {
                __next40pxDefaultSize: true,
                label: (0, import_i18n.__)("Width"),
                value: editedWidth,
                min: 1,
                onChange: (newWidth) => {
                  setEditedWidth(newWidth);
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.TextareaControl,
              {
                label: (0, import_i18n.__)("Alternative text"),
                value: editedAlt,
                onChange: (newAlt) => {
                  setEditedAlt(newAlt);
                },
                help: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_components.ExternalLink,
                    {
                      href: (
                        // translators: Localized tutorial, if one exists. W3C Web Accessibility Initiative link has list of existing translations.
                        (0, import_i18n.__)(
                          "https://www.w3.org/WAI/tutorials/images/decision-tree/"
                        )
                      ),
                      children: (0, import_i18n.__)(
                        "Describe the purpose of the image."
                      )
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
                  (0, import_i18n.__)("Leave empty if decorative.")
                ] })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalHStack, { justify: "right", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.Button,
              {
                disabled: !hasChanged,
                accessibleWhenDisabled: true,
                variant: "primary",
                type: "submit",
                size: "compact",
                children: (0, import_i18n.__)("Apply")
              }
            ) })
          ] })
        }
      )
    }
  );
}
function Edit({
  value,
  onChange,
  onFocus,
  isObjectActive,
  activeObjectAttributes,
  contentRef
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_block_editor.MediaUploadCheck, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.MediaUpload,
      {
        allowedTypes: ALLOWED_MEDIA_TYPES,
        value: getCurrentImageId(activeObjectAttributes),
        onSelect: ({ id, url, alt, width: imgWidth }) => {
          onChange(
            (0, import_rich_text.insertObject)(value, {
              type: name,
              attributes: {
                className: `wp-image-${id}`,
                style: `width: ${Math.min(
                  imgWidth,
                  150
                )}px;`,
                url,
                alt
              }
            })
          );
          onFocus();
        },
        render: ({ open }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_block_editor.RichTextToolbarButton,
          {
            icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.SVG,
              {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Path, { d: "M4 18.5h16V17H4v1.5zM16 13v1.5h4V13h-4zM5.1 15h7.8c.6 0 1.1-.5 1.1-1.1V6.1c0-.6-.5-1.1-1.1-1.1H5.1C4.5 5 4 5.5 4 6.1v7.8c0 .6.5 1.1 1.1 1.1zm.4-8.5h7V10l-1-1c-.3-.3-.8-.3-1 0l-1.6 1.5-1.2-.7c-.3-.2-.6-.2-.9 0l-1.3 1V6.5zm0 6.1l1.8-1.3 1.3.8c.3.2.7.2.9-.1l1.5-1.4 1.5 1.4v1.5h-7v-.9z" })
              }
            ),
            title: isObjectActive ? (0, import_i18n.__)("Replace image") : title,
            onClick: open,
            isActive: isObjectActive
          }
        )
      }
    ),
    isObjectActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      InlineUI,
      {
        value,
        onChange,
        activeObjectAttributes,
        contentRef
      }
    )
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  image
});
//# sourceMappingURL=index.cjs.map
