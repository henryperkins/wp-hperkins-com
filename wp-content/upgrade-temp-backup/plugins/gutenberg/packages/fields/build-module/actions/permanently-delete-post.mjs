// packages/fields/src/actions/permanently-delete-post.tsx
import { store as coreStore } from "@wordpress/core-data";
import { __, _n, sprintf } from "@wordpress/i18n";
import { store as noticesStore } from "@wordpress/notices";
import { trash } from "@wordpress/icons";
import { useState } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import {
  Button,
  __experimentalText as Text,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { decodeEntities } from "@wordpress/html-entities";
import { getItemTitle, isTemplateOrTemplatePart } from "./utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var permanentlyDeletePost = {
  id: "permanently-delete",
  label: __("Permanently delete"),
  supportsBulk: true,
  icon: trash,
  isEligible(item) {
    if (isTemplateOrTemplatePart(item) || item.type === "wp_block") {
      return false;
    }
    const { status, permissions } = item;
    return status === "trash" && permissions?.delete;
  },
  hideModalHeader: true,
  modalFocusOnMount: "firstContentElement",
  RenderModal: ({ items, closeModal, onActionPerformed }) => {
    const [isBusy, setIsBusy] = useState(false);
    const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
    const { deleteEntityRecord } = useDispatch(coreStore);
    return /* @__PURE__ */ jsxs(VStack, { spacing: "5", children: [
      /* @__PURE__ */ jsx(Text, { children: items.length > 1 ? sprintf(
        // translators: %d: number of items to delete.
        _n(
          "Are you sure you want to permanently delete %d item?",
          "Are you sure you want to permanently delete %d items?",
          items.length
        ),
        items.length
      ) : sprintf(
        // translators: %s: The post's title
        __(
          'Are you sure you want to permanently delete "%s"?'
        ),
        decodeEntities(getItemTitle(items[0]))
      ) }),
      /* @__PURE__ */ jsxs(HStack, { justify: "right", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "tertiary",
            onClick: closeModal,
            disabled: isBusy,
            accessibleWhenDisabled: true,
            __next40pxDefaultSize: true,
            children: __("Cancel")
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
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
                  successMessage = sprintf(
                    /* translators: %s: The posts's title. */
                    __('"%s" permanently deleted.'),
                    getItemTitle(items[0])
                  );
                } else {
                  successMessage = __(
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
                    errorMessage = __(
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
                    errorMessage = __(
                      "An error occurred while permanently deleting the items."
                    );
                  } else if (errorMessages.size === 1) {
                    errorMessage = sprintf(
                      /* translators: %s: an error message */
                      __(
                        "An error occurred while permanently deleting the items: %s"
                      ),
                      [...errorMessages][0]
                    );
                  } else {
                    errorMessage = sprintf(
                      /* translators: %s: a list of comma separated error messages */
                      __(
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
            children: __("Delete permanently")
          }
        )
      ] })
    ] });
  }
};
var permanently_delete_post_default = permanentlyDeletePost;
export {
  permanently_delete_post_default as default
};
//# sourceMappingURL=permanently-delete-post.mjs.map
