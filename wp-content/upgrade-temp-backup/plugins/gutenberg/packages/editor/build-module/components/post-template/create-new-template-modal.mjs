// packages/editor/src/components/post-template/create-new-template-modal.js
import { paramCase as kebabCase } from "change-case";
import { useSelect, useDispatch } from "@wordpress/data";
import { useState } from "@wordpress/element";
import { serialize, createBlock } from "@wordpress/blocks";
import {
  Modal,
  TextControl,
  Button,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { unlock } from "../../lock-unlock.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_TITLE = __("Custom Template");
function CreateNewTemplateModal({ onClose }) {
  const { defaultBlockTemplate, onNavigateToEntityRecord } = useSelect(
    (select) => {
      const { getEditorSettings, getCurrentTemplateId } = select(editorStore);
      return {
        defaultBlockTemplate: getEditorSettings().defaultBlockTemplate,
        onNavigateToEntityRecord: getEditorSettings().onNavigateToEntityRecord,
        getTemplateId: getCurrentTemplateId
      };
    }
  );
  const { createTemplate } = unlock(useDispatch(editorStore));
  const [title, setTitle] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const cancel = () => {
    setTitle("");
    onClose();
  };
  const submit = async (event) => {
    event.preventDefault();
    if (isBusy) {
      return;
    }
    setIsBusy(true);
    const newTemplateContent = defaultBlockTemplate ?? serialize([
      createBlock(
        "core/group",
        {
          tagName: "header",
          layout: { inherit: true }
        },
        [
          createBlock("core/site-title"),
          createBlock("core/site-tagline")
        ]
      ),
      createBlock("core/separator"),
      createBlock(
        "core/group",
        {
          tagName: "main"
        },
        [
          createBlock(
            "core/group",
            {
              layout: { inherit: true }
            },
            [createBlock("core/post-title")]
          ),
          createBlock("core/post-content", {
            layout: { inherit: true }
          })
        ]
      )
    ]);
    const newTemplate = await createTemplate({
      slug: kebabCase(title || DEFAULT_TITLE) || "wp-custom-template",
      content: newTemplateContent,
      title: title || DEFAULT_TITLE,
      status: "publish"
    });
    setIsBusy(false);
    onNavigateToEntityRecord({
      postId: newTemplate.id,
      postType: "wp_template"
    });
    cancel();
  };
  return /* @__PURE__ */ jsx(
    Modal,
    {
      title: __("Create custom template"),
      onRequestClose: cancel,
      focusOnMount: "firstContentElement",
      size: "small",
      overlayClassName: "editor-post-template__create-template-modal",
      children: /* @__PURE__ */ jsx(
        "form",
        {
          className: "editor-post-template__create-form",
          onSubmit: submit,
          children: /* @__PURE__ */ jsxs(VStack, { spacing: "3", children: [
            /* @__PURE__ */ jsx(
              TextControl,
              {
                __next40pxDefaultSize: true,
                label: __("Name"),
                value: title,
                onChange: setTitle,
                placeholder: DEFAULT_TITLE,
                disabled: isBusy,
                help: __(
                  // eslint-disable-next-line no-restricted-syntax -- 'sidebar' is a common web design term for layouts
                  'Describe the template, e.g. "Post with sidebar". A custom template can be manually applied to any post or page.'
                )
              }
            ),
            /* @__PURE__ */ jsxs(HStack, { justify: "right", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  __next40pxDefaultSize: true,
                  variant: "tertiary",
                  onClick: cancel,
                  children: __("Cancel")
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
            ] })
          ] })
        }
      )
    }
  );
}
export {
  CreateNewTemplateModal as default
};
//# sourceMappingURL=create-new-template-modal.mjs.map
