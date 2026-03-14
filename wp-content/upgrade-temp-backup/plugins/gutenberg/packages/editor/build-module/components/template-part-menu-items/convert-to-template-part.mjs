// packages/editor/src/components/template-part-menu-items/convert-to-template-part.js
import { useDispatch, useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { MenuItem } from "@wordpress/components";
import { createBlock } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { store as noticesStore } from "@wordpress/notices";
import { symbolFilled } from "@wordpress/icons";
import { store as coreStore } from "@wordpress/core-data";
import { CreateTemplatePartModal } from "@wordpress/fields";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function ConvertToTemplatePart({ clientIds, blocks }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { replaceBlocks } = useDispatch(blockEditorStore);
  const { createSuccessNotice } = useDispatch(noticesStore);
  const { isBlockBasedTheme, canCreate } = useSelect((select) => {
    return {
      isBlockBasedTheme: select(coreStore).getCurrentTheme()?.is_block_theme,
      canCreate: select(blockEditorStore).canInsertBlockType(
        "core/template-part"
      )
    };
  }, []);
  if (!isBlockBasedTheme || !canCreate) {
    return null;
  }
  const onConvert = async (templatePart) => {
    replaceBlocks(
      clientIds,
      createBlock("core/template-part", {
        slug: templatePart.slug,
        theme: templatePart.theme
      })
    );
    createSuccessNotice(__("Template part created."), {
      type: "snackbar"
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      MenuItem,
      {
        icon: symbolFilled,
        onClick: () => {
          setIsModalOpen(true);
        },
        "aria-expanded": isModalOpen,
        "aria-haspopup": "dialog",
        children: __("Create template part")
      }
    ),
    isModalOpen && /* @__PURE__ */ jsx(
      CreateTemplatePartModal,
      {
        closeModal: () => {
          setIsModalOpen(false);
        },
        blocks,
        onCreate: onConvert
      }
    )
  ] });
}
export {
  ConvertToTemplatePart as default
};
//# sourceMappingURL=convert-to-template-part.mjs.map
