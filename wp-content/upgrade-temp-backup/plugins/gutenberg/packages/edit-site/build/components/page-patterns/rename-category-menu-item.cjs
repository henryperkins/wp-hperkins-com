"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-site/src/components/page-patterns/rename-category-menu-item.js
var rename_category_menu_item_exports = {};
__export(rename_category_menu_item_exports, {
  default: () => RenameCategoryMenuItem
});
module.exports = __toCommonJS(rename_category_menu_item_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_patterns = require("@wordpress/patterns");
var import_use_pattern_categories = __toESM(require("../sidebar-navigation-screen-patterns/use-pattern-categories.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { RenamePatternCategoryModal } = (0, import_lock_unlock.unlock)(import_patterns.privateApis);
function RenameCategoryMenuItem({ category, onClose }) {
  const [isModalOpen, setIsModalOpen] = (0, import_element.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuItem, { onClick: () => setIsModalOpen(true), children: (0, import_i18n.__)("Rename") }),
    isModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  const existingCategories = (0, import_use_pattern_categories.default)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
//# sourceMappingURL=rename-category-menu-item.cjs.map
