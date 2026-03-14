// packages/editor/src/components/post-actions/index.js
import { useRegistry, useSelect } from "@wordpress/data";
import { useState, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  privateApis as componentsPrivateApis,
  Button,
  Modal
} from "@wordpress/components";
import { moreVertical } from "@wordpress/icons";
import { store as coreStore } from "@wordpress/core-data";
import { unlock } from "../../lock-unlock.mjs";
import { usePostActions } from "./actions.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Menu, kebabCase } = unlock(componentsPrivateApis);
function PostActions({ postType, postId, onActionPerformed }) {
  const [activeModalAction, setActiveModalAction] = useState(null);
  const { item, permissions } = useSelect(
    (select) => {
      const { getEditedEntityRecord, getEntityRecordPermissions } = unlock(select(coreStore));
      return {
        item: getEditedEntityRecord("postType", postType, postId),
        permissions: getEntityRecordPermissions(
          "postType",
          postType,
          postId
        )
      };
    },
    [postId, postType]
  );
  const itemWithPermissions = useMemo(() => {
    return {
      ...item,
      permissions
    };
  }, [item, permissions]);
  const allActions = usePostActions({ postType, onActionPerformed });
  const actions = useMemo(() => {
    return allActions.filter((action) => {
      return !action.isEligible || action.isEligible(itemWithPermissions);
    });
  }, [allActions, itemWithPermissions]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Menu, { placement: "bottom-end", children: [
      /* @__PURE__ */ jsx(
        Menu.TriggerButton,
        {
          render: /* @__PURE__ */ jsx(
            Button,
            {
              size: "small",
              icon: moreVertical,
              label: __("Actions"),
              disabled: !actions.length,
              accessibleWhenDisabled: true,
              className: "editor-all-actions-button"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(Menu.Popover, { children: /* @__PURE__ */ jsx(
        ActionsDropdownMenuGroup,
        {
          actions,
          items: [itemWithPermissions],
          setActiveModalAction
        }
      ) })
    ] }),
    !!activeModalAction && /* @__PURE__ */ jsx(
      ActionModal,
      {
        action: activeModalAction,
        items: [itemWithPermissions],
        closeModal: () => setActiveModalAction(null)
      }
    )
  ] });
}
function DropdownMenuItemTrigger({ action, onClick, items }) {
  const label = typeof action.label === "string" ? action.label : action.label(items);
  return /* @__PURE__ */ jsx(Menu.Item, { onClick, children: /* @__PURE__ */ jsx(Menu.ItemLabel, { children: label }) });
}
function ActionModal({ action, items, closeModal }) {
  const label = typeof action.label === "string" ? action.label : action.label(items);
  return /* @__PURE__ */ jsx(
    Modal,
    {
      title: action.modalHeader || label,
      __experimentalHideHeader: !!action.hideModalHeader,
      onRequestClose: closeModal ?? (() => {
      }),
      focusOnMount: "firstContentElement",
      size: "medium",
      overlayClassName: `editor-action-modal editor-action-modal__${kebabCase(
        action.id
      )}`,
      children: /* @__PURE__ */ jsx(action.RenderModal, { items, closeModal })
    }
  );
}
function ActionsDropdownMenuGroup({ actions, items, setActiveModalAction }) {
  const registry = useRegistry();
  return /* @__PURE__ */ jsx(Menu.Group, { children: actions.map((action) => {
    return /* @__PURE__ */ jsx(
      DropdownMenuItemTrigger,
      {
        action,
        onClick: () => {
          if ("RenderModal" in action) {
            setActiveModalAction(action);
            return;
          }
          action.callback(items, { registry });
        },
        items
      },
      action.id
    );
  }) });
}
export {
  ActionModal,
  PostActions as default
};
//# sourceMappingURL=index.mjs.map
