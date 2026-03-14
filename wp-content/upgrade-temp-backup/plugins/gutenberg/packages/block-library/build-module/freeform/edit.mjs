// packages/block-library/src/freeform/edit.js
import {
  BlockControls,
  BlockIcon,
  useBlockProps,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import {
  Button,
  Placeholder,
  ToolbarGroup,
  ToolbarButton
} from "@wordpress/components";
import { useState, useRef, RawHTML } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { classic } from "@wordpress/icons";
import ConvertToBlocksButton from "./convert-to-blocks-button.mjs";
import ModalEdit from "./modal.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function FreeformEdit({
  attributes,
  setAttributes,
  clientId
}) {
  const { content } = attributes;
  const [isOpen, setOpen] = useState(false);
  const editButtonRef = useRef(null);
  const canRemove = useSelect(
    (select) => select(blockEditorStore).canRemoveBlock(clientId),
    [clientId]
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    canRemove && /* @__PURE__ */ jsx(BlockControls, { children: /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(ConvertToBlocksButton, { clientId }) }) }),
    /* @__PURE__ */ jsx(BlockControls, { children: /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(
      ToolbarButton,
      {
        ref: editButtonRef,
        onClick: () => setOpen(true),
        children: __("Edit")
      }
    ) }) }),
    /* @__PURE__ */ jsxs("div", { ...useBlockProps(), children: [
      content ? /* @__PURE__ */ jsx(RawHTML, { children: content }) : /* @__PURE__ */ jsx(
        Placeholder,
        {
          icon: /* @__PURE__ */ jsx(BlockIcon, { icon: classic }),
          label: __("Classic"),
          instructions: __(
            "Use the classic editor to add content."
          ),
          children: /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              variant: "primary",
              onClick: () => setOpen(true),
              children: __("Edit contents")
            }
          )
        }
      ),
      isOpen && /* @__PURE__ */ jsx(
        ModalEdit,
        {
          clientId,
          content,
          onClose: () => {
            setOpen(false);
            if (editButtonRef.current) {
              editButtonRef.current.focus();
            }
          },
          onChange: (newContent) => setAttributes({ content: newContent })
        }
      )
    ] })
  ] });
}
export {
  FreeformEdit as default
};
//# sourceMappingURL=edit.mjs.map
