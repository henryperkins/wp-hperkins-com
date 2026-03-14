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

// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menus/leaf-more-menu.js
var leaf_more_menu_exports = {};
__export(leaf_more_menu_exports, {
  default: () => LeafMoreMenu
});
module.exports = __toCommonJS(leaf_more_menu_exports);
var import_icons = require("@wordpress/icons");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_router = require("@wordpress/router");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var POPOVER_PROPS = {
  className: "block-editor-block-settings-menu__popover",
  placement: "bottom-start"
};
var { useHistory, useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function LeafMoreMenu(props) {
  const history = useHistory();
  const { path } = useLocation();
  const { block } = props;
  const { clientId } = block;
  const { moveBlocksDown, moveBlocksUp, removeBlocks } = (0, import_data.useDispatch)(import_block_editor.store);
  const removeLabel = (0, import_i18n.sprintf)(
    /* translators: %s: block name */
    (0, import_i18n.__)("Remove %s"),
    (0, import_block_editor.BlockTitle)({ clientId, maximumLength: 25 })
  );
  const goToLabel = (0, import_i18n.sprintf)(
    /* translators: %s: block name */
    (0, import_i18n.__)("Go to %s"),
    (0, import_block_editor.BlockTitle)({ clientId, maximumLength: 25 })
  );
  const rootClientId = (0, import_data.useSelect)(
    (select) => {
      const { getBlockRootClientId } = select(import_block_editor.store);
      return getBlockRootClientId(clientId);
    },
    [clientId]
  );
  const onGoToPage = (0, import_element.useCallback)(
    (selectedBlock) => {
      const { attributes, name } = selectedBlock;
      if (attributes.kind === "post-type" && attributes.id && attributes.type && history) {
        history.navigate(
          `/${attributes.type}/${attributes.id}?canvas=edit`,
          {
            state: { backPath: path }
          }
        );
      }
      if (name === "core/page-list-item" && attributes.id && history) {
        history.navigate(`/page/${attributes.id}?canvas=edit`, {
          state: { backPath: path }
        });
      }
    },
    [path, history]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.DropdownMenu,
    {
      icon: import_icons.moreVertical,
      label: (0, import_i18n.__)("Options"),
      className: "block-editor-block-settings-menu",
      popoverProps: POPOVER_PROPS,
      noIcons: true,
      ...props,
      children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.MenuGroup, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.MenuItem,
            {
              icon: import_icons.chevronUp,
              onClick: () => {
                moveBlocksUp([clientId], rootClientId);
                onClose();
              },
              children: (0, import_i18n.__)("Move up")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.MenuItem,
            {
              icon: import_icons.chevronDown,
              onClick: () => {
                moveBlocksDown([clientId], rootClientId);
                onClose();
              },
              children: (0, import_i18n.__)("Move down")
            }
          ),
          block.attributes?.type === "page" && block.attributes?.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.MenuItem,
            {
              onClick: () => {
                onGoToPage(block);
                onClose();
              },
              children: goToLabel
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.MenuItem,
          {
            onClick: () => {
              removeBlocks([clientId], false);
              onClose();
            },
            children: removeLabel
          }
        ) })
      ] })
    }
  );
}
//# sourceMappingURL=leaf-more-menu.cjs.map
