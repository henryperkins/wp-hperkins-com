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

// packages/fields/src/actions/trash-post.tsx
var trash_post_exports = {};
__export(trash_post_exports, {
  default: () => trash_post_default
});
module.exports = __toCommonJS(trash_post_exports);
var import_icons = require("@wordpress/icons");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_notices = require("@wordpress/notices");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var trashPost = {
  id: "move-to-trash",
  label: (0, import_i18n._x)("Trash", "verb"),
  isPrimary: true,
  icon: import_icons.trash,
  isEligible(item) {
    if (item.type === "wp_template_part" || item.type === "wp_block") {
      return false;
    }
    if (item.type === "wp_template" && typeof item.id === "string") {
      return false;
    }
    return !!item.status && !["auto-draft", "trash"].includes(item.status) && item.permissions?.delete;
  },
  supportsBulk: true,
  hideModalHeader: true,
  modalFocusOnMount: "firstContentElement",
  RenderModal: ({ items, closeModal, onActionPerformed }) => {
    const [isBusy, setIsBusy] = (0, import_element.useState)(false);
    const { createSuccessNotice, createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
    const { deleteEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "5", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: items.length === 1 ? (0, import_i18n.sprintf)(
        // translators: %s: The item's title.
        (0, import_i18n.__)(
          'Are you sure you want to move "%s" to the trash?'
        ),
        (0, import_utils.getItemTitle)(items[0])
      ) : (0, import_i18n.sprintf)(
        // translators: %d: The number of items (2 or more).
        (0, import_i18n._n)(
          "Are you sure you want to move %d item to the trash ?",
          "Are you sure you want to move %d items to the trash ?",
          items.length
        ),
        items.length
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "right", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            variant: "tertiary",
            onClick: closeModal,
            disabled: isBusy,
            accessibleWhenDisabled: true,
            children: (0, import_i18n.__)("Cancel")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            variant: "primary",
            onClick: async () => {
              setIsBusy(true);
              const promiseResult = await Promise.allSettled(
                items.map(
                  (item) => deleteEntityRecord(
                    "postType",
                    item.type,
                    item.id.toString(),
                    {},
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
                    /* translators: %s: The item's title. */
                    (0, import_i18n.__)('"%s" moved to the trash.'),
                    (0, import_utils.getItemTitle)(items[0])
                  );
                } else {
                  successMessage = (0, import_i18n.sprintf)(
                    /* translators: %d: The number of items. */
                    (0, import_i18n._n)(
                      "%d item moved to the trash.",
                      "%d items moved to the trash.",
                      items.length
                    ),
                    items.length
                  );
                }
                createSuccessNotice(successMessage, {
                  type: "snackbar",
                  id: "move-to-trash-action"
                });
              } else {
                let errorMessage;
                if (promiseResult.length === 1) {
                  const typedError = promiseResult[0];
                  if (typedError.reason?.message) {
                    errorMessage = typedError.reason.message;
                  } else {
                    errorMessage = (0, import_i18n.__)(
                      "An error occurred while moving the item to the trash."
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
                      "An error occurred while moving the items to the trash."
                    );
                  } else if (errorMessages.size === 1) {
                    errorMessage = (0, import_i18n.sprintf)(
                      /* translators: %s: an error message */
                      (0, import_i18n.__)(
                        "An error occurred while moving the item to the trash: %s"
                      ),
                      [...errorMessages][0]
                    );
                  } else {
                    errorMessage = (0, import_i18n.sprintf)(
                      /* translators: %s: a list of comma separated error messages */
                      (0, import_i18n.__)(
                        "Some errors occurred while moving the items to the trash: %s"
                      ),
                      [...errorMessages].join(",")
                    );
                  }
                }
                createErrorNotice(errorMessage, {
                  type: "snackbar"
                });
              }
              if (onActionPerformed) {
                onActionPerformed(items);
              }
              setIsBusy(false);
              closeModal?.();
            },
            isBusy,
            disabled: isBusy,
            accessibleWhenDisabled: true,
            children: (0, import_i18n._x)("Trash", "verb")
          }
        )
      ] })
    ] });
  }
};
var trash_post_default = trashPost;
//# sourceMappingURL=trash-post.cjs.map
