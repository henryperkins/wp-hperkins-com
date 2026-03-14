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

// packages/fields/src/actions/delete-post.tsx
var delete_post_exports = {};
__export(delete_post_exports, {
  default: () => delete_post_default
});
module.exports = __toCommonJS(delete_post_exports);
var import_icons = require("@wordpress/icons");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_patterns = require("@wordpress/patterns");
var import_html_entities = require("@wordpress/html-entities");
var import_utils = require("./utils.cjs");
var import_mutation = require("../mutation/index.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { PATTERN_TYPES } = (0, import_lock_unlock.unlock)(import_patterns.privateApis);
var deletePostAction = {
  id: "delete-post",
  label: (0, import_i18n.__)("Delete"),
  isPrimary: true,
  icon: import_icons.trash,
  isEligible(post) {
    if ((0, import_utils.isTemplateOrTemplatePart)(post)) {
      return (0, import_utils.isTemplateRemovable)(post);
    }
    return post.type === PATTERN_TYPES.user;
  },
  supportsBulk: true,
  hideModalHeader: true,
  modalFocusOnMount: "firstContentElement",
  RenderModal: ({ items, closeModal, onActionPerformed }) => {
    const [isBusy, setIsBusy] = (0, import_element.useState)(false);
    const isResetting = items.every(
      (item) => (0, import_utils.isTemplateOrTemplatePart)(item) && item?.has_theme_file
    );
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: items.length > 1 ? (0, import_i18n.sprintf)(
        // translators: %d: number of items to delete.
        (0, import_i18n._n)(
          "Delete %d item?",
          "Delete %d items?",
          items.length
        ),
        items.length
      ) : (0, import_i18n.sprintf)(
        // translators: %s: The template or template part's title
        (0, import_i18n._x)('Delete "%s"?', "template part"),
        (0, import_utils.getItemTitle)(items[0])
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "right", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            variant: "tertiary",
            onClick: closeModal,
            disabled: isBusy,
            accessibleWhenDisabled: true,
            __next40pxDefaultSize: true,
            children: (0, import_i18n.__)("Cancel")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            variant: "primary",
            onClick: async () => {
              setIsBusy(true);
              const notice = {
                success: {
                  messages: {
                    getMessage: (item) => {
                      return isResetting ? (0, import_i18n.sprintf)(
                        /* translators: %s: The template/part's name. */
                        (0, import_i18n.__)('"%s" reset.'),
                        (0, import_html_entities.decodeEntities)(
                          (0, import_utils.getItemTitle)(item)
                        )
                      ) : (0, import_i18n.sprintf)(
                        /* translators: %s: The template/part's name. */
                        (0, import_i18n._x)(
                          '"%s" deleted.',
                          "template part"
                        ),
                        (0, import_html_entities.decodeEntities)(
                          (0, import_utils.getItemTitle)(item)
                        )
                      );
                    },
                    getBatchMessage: () => {
                      return isResetting ? (0, import_i18n.__)("Items reset.") : (0, import_i18n.__)("Items deleted.");
                    }
                  }
                },
                error: {
                  messages: {
                    getMessage: (error) => {
                      if (error.size === 1) {
                        return [...error][0];
                      }
                      return isResetting ? (0, import_i18n.__)(
                        "An error occurred while reverting the item."
                      ) : (0, import_i18n.__)(
                        "An error occurred while deleting the item."
                      );
                    },
                    getBatchMessage: (errors) => {
                      if (errors.size === 0) {
                        return isResetting ? (0, import_i18n.__)(
                          "An error occurred while reverting the items."
                        ) : (0, import_i18n.__)(
                          "An error occurred while deleting the items."
                        );
                      }
                      if (errors.size === 1) {
                        return isResetting ? (0, import_i18n.sprintf)(
                          /* translators: %s: an error message */
                          (0, import_i18n.__)(
                            "An error occurred while reverting the items: %s"
                          ),
                          [...errors][0]
                        ) : (0, import_i18n.sprintf)(
                          /* translators: %s: an error message */
                          (0, import_i18n.__)(
                            "An error occurred while deleting the items: %s"
                          ),
                          [...errors][0]
                        );
                      }
                      return isResetting ? (0, import_i18n.sprintf)(
                        /* translators: %s: a list of comma separated error messages */
                        (0, import_i18n.__)(
                          "Some errors occurred while reverting the items: %s"
                        ),
                        [...errors].join(
                          ","
                        )
                      ) : (0, import_i18n.sprintf)(
                        /* translators: %s: a list of comma separated error messages */
                        (0, import_i18n.__)(
                          "Some errors occurred while deleting the items: %s"
                        ),
                        [...errors].join(
                          ","
                        )
                      );
                    }
                  }
                }
              };
              await (0, import_mutation.deletePostWithNotices)(items, notice, {
                onActionPerformed
              });
              setIsBusy(false);
              closeModal?.();
            },
            isBusy,
            disabled: isBusy,
            accessibleWhenDisabled: true,
            __next40pxDefaultSize: true,
            children: (0, import_i18n.__)("Delete")
          }
        )
      ] })
    ] });
  }
};
var delete_post_default = deletePostAction;
//# sourceMappingURL=delete-post.cjs.map
