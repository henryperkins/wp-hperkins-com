// packages/edit-site/src/components/add-new-template-legacy/add-custom-generic-template-modal-content.js
import { paramCase as kebabCase } from "change-case";
import { useState, useEffect, useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  Button,
  TextControl,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { jsx, jsxs } from "react/jsx-runtime";
function AddCustomGenericTemplateModalContent({ createTemplate, onBack }) {
  const [title, setTitle] = useState("");
  const defaultTitle = __("Custom Template");
  const [isBusy, setIsBusy] = useState(false);
  const inputRef = useRef();
  useEffect(() => {
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
          slug: kebabCase(title || defaultTitle) || "wp-custom-template",
          title: title || defaultTitle
        },
        false
      );
    } finally {
      setIsBusy(false);
    }
  }
  return /* @__PURE__ */ jsx("form", { onSubmit: onCreateTemplate, children: /* @__PURE__ */ jsxs(VStack, { spacing: 6, children: [
    /* @__PURE__ */ jsx(
      TextControl,
      {
        __next40pxDefaultSize: true,
        label: __("Name"),
        value: title,
        onChange: setTitle,
        placeholder: defaultTitle,
        disabled: isBusy,
        ref: inputRef,
        help: __(
          // eslint-disable-next-line no-restricted-syntax -- 'sidebar' is a common web design term for layouts
          'Describe the template, e.g. "Post with sidebar". A custom template can be manually applied to any post or page.'
        )
      }
    ),
    /* @__PURE__ */ jsxs(
      HStack,
      {
        className: "edit-site-custom-generic-template__modal-actions",
        justify: "right",
        children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              variant: "tertiary",
              onClick: onBack,
              children: __("Back")
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              variant: "primary",
              type: "submit",
              isBusy,
              "aria-disabled": isBusy,
              children: __("Create")
            }
          )
        ]
      }
    )
  ] }) });
}
var add_custom_generic_template_modal_content_default = AddCustomGenericTemplateModalContent;
export {
  add_custom_generic_template_modal_content_default as default
};
//# sourceMappingURL=add-custom-generic-template-modal-content.mjs.map
