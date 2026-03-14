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

// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menu/more-menu.js
var more_menu_exports = {};
__export(more_menu_exports, {
  default: () => ScreenNavigationMoreMenu
});
module.exports = __toCommonJS(more_menu_exports);
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_router = require("@wordpress/router");
var import_rename_modal = __toESM(require("./rename-modal.cjs"));
var import_delete_confirm_dialog = __toESM(require("./delete-confirm-dialog.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useHistory } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var POPOVER_PROPS = {
  position: "bottom right"
};
function ScreenNavigationMoreMenu(props) {
  const { onDelete, onSave, onDuplicate, menuTitle, menuId } = props;
  const [renameModalOpen, setRenameModalOpen] = (0, import_element.useState)(false);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = (0, import_element.useState)(false);
  const history = useHistory();
  const closeModals = () => {
    setRenameModalOpen(false);
    setDeleteConfirmDialogOpen(false);
  };
  const openRenameModal = () => setRenameModalOpen(true);
  const openDeleteConfirmDialog = () => setDeleteConfirmDialogOpen(true);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.DropdownMenu,
      {
        className: "sidebar-navigation__more-menu",
        label: (0, import_i18n.__)("Actions"),
        icon: import_icons.moreVertical,
        popoverProps: POPOVER_PROPS,
        children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.MenuGroup, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.MenuItem,
            {
              onClick: () => {
                openRenameModal();
                onClose();
              },
              children: (0, import_i18n.__)("Rename")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.MenuItem,
            {
              onClick: () => {
                history.navigate(
                  `/wp_navigation/${menuId}?canvas=edit`
                );
              },
              children: (0, import_i18n.__)("Edit")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.MenuItem,
            {
              onClick: () => {
                onDuplicate();
                onClose();
              },
              children: (0, import_i18n.__)("Duplicate")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.MenuItem,
            {
              isDestructive: true,
              onClick: () => {
                openDeleteConfirmDialog();
                onClose();
              },
              children: (0, import_i18n.__)("Delete")
            }
          )
        ] })
      }
    ),
    deleteConfirmDialogOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_delete_confirm_dialog.default,
      {
        onClose: closeModals,
        onConfirm: onDelete
      }
    ),
    renameModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_rename_modal.default,
      {
        onClose: closeModals,
        menuTitle,
        onSave
      }
    )
  ] });
}
//# sourceMappingURL=more-menu.cjs.map
