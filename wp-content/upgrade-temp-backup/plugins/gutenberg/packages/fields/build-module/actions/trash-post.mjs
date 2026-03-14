// packages/fields/src/actions/trash-post.tsx
import { trash } from "@wordpress/icons";
import { useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { __, _n, sprintf, _x } from "@wordpress/i18n";
import { store as noticesStore } from "@wordpress/notices";
import { useState } from "@wordpress/element";
import {
  Button,
  __experimentalText as Text,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { getItemTitle } from "./utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var trashPost = {
  id: "move-to-trash",
  label: _x("Trash", "verb"),
  isPrimary: true,
  icon: trash,
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
    const [isBusy, setIsBusy] = useState(false);
    const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
    const { deleteEntityRecord } = useDispatch(coreStore);
    return /* @__PURE__ */ jsxs(VStack, { spacing: "5", children: [
      /* @__PURE__ */ jsx(Text, { children: items.length === 1 ? sprintf(
        // translators: %s: The item's title.
        __(
          'Are you sure you want to move "%s" to the trash?'
        ),
        getItemTitle(items[0])
      ) : sprintf(
        // translators: %d: The number of items (2 or more).
        _n(
          "Are you sure you want to move %d item to the trash ?",
          "Are you sure you want to move %d items to the trash ?",
          items.length
        ),
        items.length
      ) }),
      /* @__PURE__ */ jsxs(HStack, { justify: "right", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            variant: "tertiary",
            onClick: closeModal,
            disabled: isBusy,
            accessibleWhenDisabled: true,
            children: __("Cancel")
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
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
                  successMessage = sprintf(
                    /* translators: %s: The item's title. */
                    __('"%s" moved to the trash.'),
                    getItemTitle(items[0])
                  );
                } else {
                  successMessage = sprintf(
                    /* translators: %d: The number of items. */
                    _n(
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
                    errorMessage = __(
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
                    errorMessage = __(
                      "An error occurred while moving the items to the trash."
                    );
                  } else if (errorMessages.size === 1) {
                    errorMessage = sprintf(
                      /* translators: %s: an error message */
                      __(
                        "An error occurred while moving the item to the trash: %s"
                      ),
                      [...errorMessages][0]
                    );
                  } else {
                    errorMessage = sprintf(
                      /* translators: %s: a list of comma separated error messages */
                      __(
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
            children: _x("Trash", "verb")
          }
        )
      ] })
    ] });
  }
};
var trash_post_default = trashPost;
export {
  trash_post_default as default
};
//# sourceMappingURL=trash-post.mjs.map
