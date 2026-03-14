// packages/edit-site/src/components/page-patterns/rename-category-menu-item.js
import { MenuItem } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { privateApis as patternsPrivateApis } from "@wordpress/patterns";
import usePatternCategories from "../sidebar-navigation-screen-patterns/use-pattern-categories.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { RenamePatternCategoryModal } = unlock(patternsPrivateApis);
function RenameCategoryMenuItem({ category, onClose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(MenuItem, { onClick: () => setIsModalOpen(true), children: __("Rename") }),
    isModalOpen && /* @__PURE__ */ jsx(
      RenameModal,
      {
        category,
        onClose: () => {
          setIsModalOpen(false);
          onClose();
        }
      }
    )
  ] });
}
function RenameModal({ category, onClose }) {
  const normalizedCategory = {
    id: category.id,
    slug: category.slug,
    name: category.label
  };
  const existingCategories = usePatternCategories();
  return /* @__PURE__ */ jsx(
    RenamePatternCategoryModal,
    {
      category: normalizedCategory,
      existingCategories,
      onClose,
      overlayClassName: "edit-site-list__rename-modal",
      focusOnMount: "firstContentElement",
      size: "small"
    }
  );
}
export {
  RenameCategoryMenuItem as default
};
//# sourceMappingURL=rename-category-menu-item.mjs.map
