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

// packages/fields/src/actions/permanently-delete-post.tsx
var permanently_delete_post_exports = {};
__export(permanently_delete_post_exports, {
  default: () => permanently_delete_post_default
});
module.exports = __toCommonJS(permanently_delete_post_exports);
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_notices = require("@wordpress/notices");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_html_entities = require("@wordpress/html-entities");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var permanentlyDeletePost = {
  id: "permanently-delete",
  label: (0, import_i18n.__)("Permanently delete"),
  supportsBulk: true,
  icon: import_icons.trash,
  isEligible(item) {
    if ((0, import_utils.isTemplateOrTemplatePart)(item) || item.type === "wp_block") {
      return false;
    }
    const { status, permissions } = item;
    return status === "trash" && permissions?.delete;
  },
  hideModalHeader: true,
  modalFocusOnMount: "firstContentElement",
  RenderModal: ({ items, closeModal, onActionPerformed }) => {
    const [isBusy, setIsBusy] = (0, import_element.useState)(false);
    const { createSuccessNotice, createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
    const { deleteEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: items.length > 1 ? (0, import_i18n.sprintf)(
        // translators: %d: number of items to delete.
        (0, import_i18n._n)(
          "Are you sure you want to permanently delete %d item?",
          "Are you sure you want to permanently delete %d items?",
          items.length
        ),
        items.length
      ) : (0, import_i18n.sprintf)(
        // translators: %s: The post's title
        (0, import_i18n.__)(
          'Are you sure you want to permanently delete "%s"?'
        ),
        (0, import_html_entities.decodeEntities)((0, import_utils.getItemTitle)(items[0]))
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
              const promiseResult = await Promise.allSettled(
                items.map(
                  (post) => deleteEntityRecord(
                    "postType",
                    post.type,
                    post.id,
                    { force: true },
                    { throwOnError: true }
                  )
                )
              );
              if (promiseResult.every(
                ({ status }) => status === "fulfilled"
              )) {
                let successMessage;
                if (promiseResult.length === 1) {
                  successMessage = (0, import_i18n.sprintf)(
                    /* translators: %s: The posts's title. */
                    (0, import_i18n.__)('"%s" permanently deleted.'),
                    (0, import_utils.getItemTitle)(items[0])
                  );
                } else {
                  successMessage = (0, import_i18n.__)(
                    "The items were permanently deleted."
                  );
                }
                createSuccessNotice(successMessage, {
                  type: "snackbar",
                  id: "permanently-delete-post-action"
                });
                onActionPerformed?.(items);
              } else {
                let errorMessage;
                if (promiseResult.length === 1) {
                  const typedError = promiseResult[0];
                  if (typedError.reason?.message) {
                    errorMessage = typedError.reason.message;
                  } else {
                    errorMessage = (0, import_i18n.__)(
                      "An error occurred while permanently deleting the item."
                    );
                  }
                } else {
                  const errorMessages = /* @__PURE__ */ new Set();
                  const failedPromises = promiseResult.filter(
                    ({ status }) => status === "rejected"
                  );
                  for (const failedPromise of failedPromises) {
                    const typedError = failedPromise;
                    if (typedError.reason?.message) {
                      errorMessages.add(
                        typedError.reason.message
                      );
                    }
                  }
                  if (errorMessages.size === 0) {
                    errorMessage = (0, import_i18n.__)(
                      "An error occurred while permanently deleting the items."
                    );
                  } else if (errorMessages.size === 1) {
                    errorMessage = (0, import_i18n.sprintf)(
                      /* translators: %s: an error message */
                      (0, import_i18n.__)(
                        "An error occurred while permanently deleting the items: %s"
                      ),
                      [...errorMessages][0]
                    );
                  } else {
                    errorMessage = (0, import_i18n.sprintf)(
                      /* translators: %s: a list of comma separated error messages */
                      (0, import_i18n.__)(
                        "Some errors occurred while permanently deleting the items: %s"
                      ),
                      [...errorMessages].join(",")
                    );
                  }
                }
                createErrorNotice(errorMessage, {
                  type: "snackbar"
                });
              }
              setIsBusy(false);
              closeModal?.();
            },
            isBusy,
            disabled: isBusy,
            accessibleWhenDisabled: true,
            __next40pxDefaultSize: true,
            children: (0, import_i18n.__)("Delete permanently")
          }
        )
      ] })
    ] });
  }
};
var permanently_delete_post_default = permanentlyDeletePost;
//# sourceMappingURL=permanently-delete-post.cjs.map
