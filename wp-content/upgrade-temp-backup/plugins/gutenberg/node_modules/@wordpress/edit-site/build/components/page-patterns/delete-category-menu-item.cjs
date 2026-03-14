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

// packages/edit-site/src/components/page-patterns/delete-category-menu-item.js
var delete_category_menu_item_exports = {};
__export(delete_category_menu_item_exports, {
  default: () => DeleteCategoryMenuItem
});
module.exports = __toCommonJS(delete_category_menu_item_exports);
var import_components = require("@wordpress/components");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_html_entities = require("@wordpress/html-entities");
var import_i18n = require("@wordpress/i18n");
var import_notices = require("@wordpress/notices");
var import_router = require("@wordpress/router");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_constants = require("../../utils/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function DeleteCategoryMenuItem({ category, onClose }) {
  const [isModalOpen, setIsModalOpen] = (0, import_element.useState)(false);
  const history = useHistory();
  const { createSuccessNotice, createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  const { deleteEntityRecord, invalidateResolution } = (0, import_data.useDispatch)(import_core_data.store);
  const onDelete = async () => {
    try {
      await deleteEntityRecord(
        "taxonomy",
        "wp_pattern_category",
        category.id,
        { force: true },
        { throwOnError: true }
      );
      invalidateResolution("getUserPatternCategories");
      invalidateResolution("getEntityRecords", [
        "postType",
        import_constants.PATTERN_TYPES.user,
        { per_page: -1 }
      ]);
      createSuccessNotice(
        (0, import_i18n.sprintf)(
          /* translators: %s: The pattern category's name */
          (0, import_i18n._x)('"%s" deleted.', "pattern category"),
          category.label
        ),
        { type: "snackbar", id: "pattern-category-delete" }
      );
      onClose?.();
      history.navigate(
        `/pattern?categoryId=${import_constants.PATTERN_DEFAULT_CATEGORY}`
      );
    } catch (error) {
      const errorMessage = error.message && error.code !== "unknown_error" ? error.message : (0, import_i18n.__)(
        "An error occurred while deleting the pattern category."
      );
      createErrorNotice(errorMessage, {
        type: "snackbar",
        id: "pattern-category-delete"
      });
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuItem, { isDestructive: true, onClick: () => setIsModalOpen(true), children: (0, import_i18n.__)("Delete") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalConfirmDialog,
      {
        isOpen: isModalOpen,
        onConfirm: onDelete,
        onCancel: () => setIsModalOpen(false),
        confirmButtonText: (0, import_i18n.__)("Delete"),
        className: "edit-site-patterns__delete-modal",
        title: (0, import_i18n.sprintf)(
          // translators: %s: The pattern category's name.
          (0, import_i18n._x)('Delete "%s"?', "pattern category"),
          (0, import_html_entities.decodeEntities)(category.label)
        ),
        size: "medium",
        __experimentalHideHeader: false,
        children: (0, import_i18n.sprintf)(
          // translators: %s: The pattern category's name.
          (0, import_i18n.__)(
            'Are you sure you want to delete the category "%s"? The patterns will not be deleted.'
          ),
          (0, import_html_entities.decodeEntities)(category.label)
        )
      }
    )
  ] });
}
//# sourceMappingURL=delete-category-menu-item.cjs.map
