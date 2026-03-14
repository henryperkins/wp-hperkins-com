// packages/editor/src/components/post-template/create-new-template.js
import { MenuItem } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { useState } from "@wordpress/element";
import CreateNewTemplateModal from "./create-new-template-modal.mjs";
import { useAllowSwitchingTemplates } from "./hooks.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function CreateNewTemplate() {
  const { canCreateTemplates } = useSelect((select) => {
    const { canUser } = select(coreStore);
    return {
      canCreateTemplates: canUser("create", {
        kind: "postType",
        name: "wp_template"
      })
    };
  }, []);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const allowSwitchingTemplate = useAllowSwitchingTemplates();
  if (!canCreateTemplates || !allowSwitchingTemplate) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      MenuItem,
      {
        onClick: () => {
          setIsCreateModalOpen(true);
        },
        children: __("Create new template")
      }
    ),
    isCreateModalOpen && /* @__PURE__ */ jsx(
      CreateNewTemplateModal,
      {
        onClose: () => {
          setIsCreateModalOpen(false);
        }
      }
    )
  ] });
}
export {
  CreateNewTemplate as default
};
//# sourceMappingURL=create-new-template.mjs.map
