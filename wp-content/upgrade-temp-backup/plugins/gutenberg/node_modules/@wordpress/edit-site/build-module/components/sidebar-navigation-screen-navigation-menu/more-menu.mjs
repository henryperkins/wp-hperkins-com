// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menu/more-menu.js
import { DropdownMenu, MenuItem, MenuGroup } from "@wordpress/components";
import { moreVertical } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import RenameModal from "./rename-modal.mjs";
import DeleteConfirmDialog from "./delete-confirm-dialog.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useHistory } = unlock(routerPrivateApis);
var POPOVER_PROPS = {
  position: "bottom right"
};
function ScreenNavigationMoreMenu(props) {
  const { onDelete, onSave, onDuplicate, menuTitle, menuId } = props;
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const history = useHistory();
  const closeModals = () => {
    setRenameModalOpen(false);
    setDeleteConfirmDialogOpen(false);
  };
  const openRenameModal = () => setRenameModalOpen(true);
  const openDeleteConfirmDialog = () => setDeleteConfirmDialogOpen(true);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      DropdownMenu,
      {
        className: "sidebar-navigation__more-menu",
        label: __("Actions"),
        icon: moreVertical,
        popoverProps: POPOVER_PROPS,
        children: ({ onClose }) => /* @__PURE__ */ jsxs(MenuGroup, { children: [
          /* @__PURE__ */ jsx(
            MenuItem,
            {
              onClick: () => {
                openRenameModal();
                onClose();
              },
              children: __("Rename")
            }
          ),
          /* @__PURE__ */ jsx(
            MenuItem,
            {
              onClick: () => {
                history.navigate(
                  `/wp_navigation/${menuId}?canvas=edit`
                );
              },
              children: __("Edit")
            }
          ),
          /* @__PURE__ */ jsx(
            MenuItem,
            {
              onClick: () => {
                onDuplicate();
                onClose();
              },
              children: __("Duplicate")
            }
          ),
          /* @__PURE__ */ jsx(
            MenuItem,
            {
              isDestructive: true,
              onClick: () => {
                openDeleteConfirmDialog();
                onClose();
              },
              children: __("Delete")
            }
          )
        ] })
      }
    ),
    deleteConfirmDialogOpen && /* @__PURE__ */ jsx(
      DeleteConfirmDialog,
      {
        onClose: closeModals,
        onConfirm: onDelete
      }
    ),
    renameModalOpen && /* @__PURE__ */ jsx(
      RenameModal,
      {
        onClose: closeModals,
        menuTitle,
        onSave
      }
    )
  ] });
}
export {
  ScreenNavigationMoreMenu as default
};
//# sourceMappingURL=more-menu.mjs.map
