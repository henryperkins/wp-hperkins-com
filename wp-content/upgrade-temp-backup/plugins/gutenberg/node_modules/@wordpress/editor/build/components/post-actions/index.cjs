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

// packages/editor/src/components/post-actions/index.js
var post_actions_exports = {};
__export(post_actions_exports, {
  ActionModal: () => ActionModal,
  default: () => PostActions
});
module.exports = __toCommonJS(post_actions_exports);
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_core_data = require("@wordpress/core-data");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_actions = require("./actions.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Menu, kebabCase } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function PostActions({ postType, postId, onActionPerformed }) {
  const [activeModalAction, setActiveModalAction] = (0, import_element.useState)(null);
  const { item, permissions } = (0, import_data.useSelect)(
    (select) => {
      const { getEditedEntityRecord, getEntityRecordPermissions } = (0, import_lock_unlock.unlock)(select(import_core_data.store));
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
  const itemWithPermissions = (0, import_element.useMemo)(() => {
    return {
      ...item,
      permissions
    };
  }, [item, permissions]);
  const allActions = (0, import_actions.usePostActions)({ postType, onActionPerformed });
  const actions = (0, import_element.useMemo)(() => {
    return allActions.filter((action) => {
      return !action.isEligible || action.isEligible(itemWithPermissions);
    });
  }, [allActions, itemWithPermissions]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, { placement: "bottom-end", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        Menu.TriggerButton,
        {
          render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              size: "small",
              icon: import_icons.moreVertical,
              label: (0, import_i18n.__)("Actions"),
              disabled: !actions.length,
              accessibleWhenDisabled: true,
              className: "editor-all-actions-button"
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.Popover, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        ActionsDropdownMenuGroup,
        {
          actions,
          items: [itemWithPermissions],
          setActiveModalAction
        }
      ) })
    ] }),
    !!activeModalAction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.Item, { onClick, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.ItemLabel, { children: label }) });
}
function ActionModal({ action, items, closeModal }) {
  const label = typeof action.label === "string" ? action.label : action.label(items);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Modal,
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
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(action.RenderModal, { items, closeModal })
    }
  );
}
function ActionsDropdownMenuGroup({ actions, items, setActiveModalAction }) {
  const registry = (0, import_data.useRegistry)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.Group, { children: actions.map((action) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActionModal
});
//# sourceMappingURL=index.cjs.map
