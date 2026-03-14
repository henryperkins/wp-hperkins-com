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

// packages/edit-site/src/components/page-patterns/actions.js
var actions_exports = {};
__export(actions_exports, {
  default: () => PatternsActions
});
module.exports = __toCommonJS(actions_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_add_new_pattern = __toESM(require("../add-new-pattern/index.cjs"));
var import_rename_category_menu_item = __toESM(require("./rename-category-menu-item.cjs"));
var import_delete_category_menu_item = __toESM(require("./delete-category-menu-item.cjs"));
var import_use_pattern_categories = __toESM(require("../sidebar-navigation-screen-patterns/use-pattern-categories.cjs"));
var import_constants = require("../../utils/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PatternsActions({ categoryId, type }) {
  const { patternCategories } = (0, import_use_pattern_categories.default)();
  let patternCategory;
  if (type === import_constants.PATTERN_TYPES.user && !!categoryId) {
    patternCategory = patternCategories.find(
      (category) => category.name === categoryId
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_add_new_pattern.default, {}),
    !!patternCategory?.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.DropdownMenu,
      {
        icon: import_icons.moreVertical,
        label: (0, import_i18n.__)("Actions"),
        toggleProps: {
          className: "edit-site-patterns__button",
          size: "compact"
        },
        children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.MenuGroup, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_rename_category_menu_item.default,
            {
              category: patternCategory,
              onClose
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_delete_category_menu_item.default,
            {
              category: patternCategory,
              onClose
            }
          )
        ] })
      }
    )
  ] });
}
//# sourceMappingURL=actions.cjs.map
