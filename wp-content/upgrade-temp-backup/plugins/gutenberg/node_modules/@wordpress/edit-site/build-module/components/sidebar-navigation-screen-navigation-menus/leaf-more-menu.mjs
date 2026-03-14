// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menus/leaf-more-menu.js
import { chevronUp, chevronDown, moreVertical } from "@wordpress/icons";
import { DropdownMenu, MenuItem, MenuGroup } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { BlockTitle, store as blockEditorStore } from "@wordpress/block-editor";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var POPOVER_PROPS = {
  className: "block-editor-block-settings-menu__popover",
  placement: "bottom-start"
};
var { useHistory, useLocation } = unlock(routerPrivateApis);
function LeafMoreMenu(props) {
  const history = useHistory();
  const { path } = useLocation();
  const { block } = props;
  const { clientId } = block;
  const { moveBlocksDown, moveBlocksUp, removeBlocks } = useDispatch(blockEditorStore);
  const removeLabel = sprintf(
    /* translators: %s: block name */
    __("Remove %s"),
    BlockTitle({ clientId, maximumLength: 25 })
  );
  const goToLabel = sprintf(
    /* translators: %s: block name */
    __("Go to %s"),
    BlockTitle({ clientId, maximumLength: 25 })
  );
  const rootClientId = useSelect(
    (select) => {
      const { getBlockRootClientId } = select(blockEditorStore);
      return getBlockRootClientId(clientId);
    },
    [clientId]
  );
  const onGoToPage = useCallback(
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
  return /* @__PURE__ */ jsx(
    DropdownMenu,
    {
      icon: moreVertical,
      label: __("Options"),
      className: "block-editor-block-settings-menu",
      popoverProps: POPOVER_PROPS,
      noIcons: true,
      ...props,
      children: ({ onClose }) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(MenuGroup, { children: [
          /* @__PURE__ */ jsx(
            MenuItem,
            {
              icon: chevronUp,
              onClick: () => {
                moveBlocksUp([clientId], rootClientId);
                onClose();
              },
              children: __("Move up")
            }
          ),
          /* @__PURE__ */ jsx(
            MenuItem,
            {
              icon: chevronDown,
              onClick: () => {
                moveBlocksDown([clientId], rootClientId);
                onClose();
              },
              children: __("Move down")
            }
          ),
          block.attributes?.type === "page" && block.attributes?.id && /* @__PURE__ */ jsx(
            MenuItem,
            {
              onClick: () => {
                onGoToPage(block);
                onClose();
              },
              children: goToLabel
            }
          )
        ] }),
        /* @__PURE__ */ jsx(MenuGroup, { children: /* @__PURE__ */ jsx(
          MenuItem,
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
export {
  LeafMoreMenu as default
};
//# sourceMappingURL=leaf-more-menu.mjs.map
