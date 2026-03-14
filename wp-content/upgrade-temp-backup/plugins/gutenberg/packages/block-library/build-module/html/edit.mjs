// packages/block-library/src/html/edit.js
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import {
  BlockControls,
  BlockIcon,
  InspectorControls,
  useBlockProps
} from "@wordpress/block-editor";
import {
  ToolbarButton,
  ToolbarGroup,
  Placeholder,
  Button,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { code } from "@wordpress/icons";
import Preview from "./preview.mjs";
import HTMLEditModal from "./modal.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function HTMLEdit({ attributes, setAttributes, isSelected }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const blockProps = useBlockProps({
    className: "block-library-html__edit"
  });
  if (!attributes.content?.trim()) {
    return /* @__PURE__ */ jsxs("div", { ...blockProps, children: [
      /* @__PURE__ */ jsx(
        Placeholder,
        {
          icon: /* @__PURE__ */ jsx(BlockIcon, { icon: code }),
          label: __("Custom HTML"),
          instructions: __(
            "Add custom HTML code and preview how it looks."
          ),
          children: /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              variant: "primary",
              onClick: () => setIsModalOpen(true),
              children: __("Edit HTML")
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        HTMLEditModal,
        {
          isOpen: isModalOpen,
          onRequestClose: () => setIsModalOpen(false),
          content: attributes.content,
          setAttributes
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { ...blockProps, children: [
    /* @__PURE__ */ jsx(BlockControls, { children: /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(ToolbarButton, { onClick: () => setIsModalOpen(true), children: __("Edit code") }) }) }),
    /* @__PURE__ */ jsx(InspectorControls, { children: /* @__PURE__ */ jsx(
      VStack,
      {
        className: "block-editor-block-inspector-edit-contents",
        expanded: true,
        children: /* @__PURE__ */ jsx(
          Button,
          {
            className: "block-editor-block-inspector-edit-contents__button",
            __next40pxDefaultSize: true,
            variant: "secondary",
            onClick: () => setIsModalOpen(true),
            children: __("Edit code")
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx(Preview, { content: attributes.content, isSelected }),
    /* @__PURE__ */ jsx(
      HTMLEditModal,
      {
        isOpen: isModalOpen,
        onRequestClose: () => setIsModalOpen(false),
        content: attributes.content,
        setAttributes
      }
    )
  ] });
}
export {
  HTMLEdit as default
};
//# sourceMappingURL=edit.mjs.map
