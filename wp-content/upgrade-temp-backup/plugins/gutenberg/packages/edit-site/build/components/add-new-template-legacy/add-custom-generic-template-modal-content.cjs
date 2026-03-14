"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-site/src/components/add-new-template-legacy/add-custom-generic-template-modal-content.js
var add_custom_generic_template_modal_content_exports = {};
__export(add_custom_generic_template_modal_content_exports, {
  default: () => add_custom_generic_template_modal_content_default
});
module.exports = __toCommonJS(add_custom_generic_template_modal_content_exports);
var import_change_case = require("change-case");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
function AddCustomGenericTemplateModalContent({ createTemplate, onBack }) {
  const [title, setTitle] = (0, import_element.useState)("");
  const defaultTitle = (0, import_i18n.__)("Custom Template");
  const [isBusy, setIsBusy] = (0, import_element.useState)(false);
  const inputRef = (0, import_element.useRef)();
  (0, import_element.useEffect)(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  async function onCreateTemplate(event) {
    event.preventDefault();
    if (isBusy) {
      return;
    }
    setIsBusy(true);
    try {
      await createTemplate(
        {
          slug: (0, import_change_case.paramCase)(title || defaultTitle) || "wp-custom-template",
          title: title || defaultTitle
        },
        false
      );
    } finally {
      setIsBusy(false);
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", { onSubmit: onCreateTemplate, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 6, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.TextControl,
      {
        __next40pxDefaultSize: true,
        label: (0, import_i18n.__)("Name"),
        value: title,
        onChange: setTitle,
        placeholder: defaultTitle,
        disabled: isBusy,
        ref: inputRef,
        help: (0, import_i18n.__)(
          // eslint-disable-next-line no-restricted-syntax -- 'sidebar' is a common web design term for layouts
          'Describe the template, e.g. "Post with sidebar". A custom template can be manually applied to any post or page.'
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_components.__experimentalHStack,
      {
        className: "edit-site-custom-generic-template__modal-actions",
        justify: "right",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              variant: "tertiary",
              onClick: onBack,
              children: (0, import_i18n.__)("Back")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              variant: "primary",
              type: "submit",
              isBusy,
              "aria-disabled": isBusy,
              children: (0, import_i18n.__)("Create")
            }
          )
        ]
      }
    )
  ] }) });
}
var add_custom_generic_template_modal_content_default = AddCustomGenericTemplateModalContent;
//# sourceMappingURL=add-custom-generic-template-modal-content.cjs.map
