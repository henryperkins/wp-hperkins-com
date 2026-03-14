// packages/fields/src/actions/delete-post.tsx
import { trash } from "@wordpress/icons";
import { __, _x, _n, sprintf } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import {
  Button,
  __experimentalText as Text,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { privateApis as patternsPrivateApis } from "@wordpress/patterns";
import { decodeEntities } from "@wordpress/html-entities";
import {
  getItemTitle,
  isTemplateOrTemplatePart,
  isTemplateRemovable
} from "./utils.mjs";
import { deletePostWithNotices } from "../mutation/index.mjs";
import { unlock } from "../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { PATTERN_TYPES } = unlock(patternsPrivateApis);
var deletePostAction = {
  id: "delete-post",
  label: __("Delete"),
  isPrimary: true,
  icon: trash,
  isEligible(post) {
    if (isTemplateOrTemplatePart(post)) {
      return isTemplateRemovable(post);
    }
    return post.type === PATTERN_TYPES.user;
  },
  supportsBulk: true,
  hideModalHeader: true,
  modalFocusOnMount: "firstContentElement",
  RenderModal: ({ items, closeModal, onActionPerformed }) => {
    const [isBusy, setIsBusy] = useState(false);
    const isResetting = items.every(
      (item) => isTemplateOrTemplatePart(item) && item?.has_theme_file
    );
    return /* @__PURE__ */ jsxs(VStack, { spacing: "5", children: [
      /* @__PURE__ */ jsx(Text, { children: items.length > 1 ? sprintf(
        // translators: %d: number of items to delete.
        _n(
          "Delete %d item?",
          "Delete %d items?",
          items.length
        ),
        items.length
      ) : sprintf(
        // translators: %s: The template or template part's title
        _x('Delete "%s"?', "template part"),
        getItemTitle(items[0])
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
              const notice = {
                success: {
                  messages: {
                    getMessage: (item) => {
                      return isResetting ? sprintf(
                        /* translators: %s: The template/part's name. */
                        __('"%s" reset.'),
                        decodeEntities(
                          getItemTitle(item)
                        )
                      ) : sprintf(
                        /* translators: %s: The template/part's name. */
                        _x(
                          '"%s" deleted.',
                          "template part"
                        ),
                        decodeEntities(
                          getItemTitle(item)
                        )
                      );
                    },
                    getBatchMessage: () => {
                      return isResetting ? __("Items reset.") : __("Items deleted.");
                    }
                  }
                },
                error: {
                  messages: {
                    getMessage: (error) => {
                      if (error.size === 1) {
                        return [...error][0];
                      }
                      return isResetting ? __(
                        "An error occurred while reverting the item."
                      ) : __(
                        "An error occurred while deleting the item."
                      );
                    },
                    getBatchMessage: (errors) => {
                      if (errors.size === 0) {
                        return isResetting ? __(
                          "An error occurred while reverting the items."
                        ) : __(
                          "An error occurred while deleting the items."
                        );
                      }
                      if (errors.size === 1) {
                        return isResetting ? sprintf(
                          /* translators: %s: an error message */
                          __(
                            "An error occurred while reverting the items: %s"
                          ),
                          [...errors][0]
                        ) : sprintf(
                          /* translators: %s: an error message */
                          __(
                            "An error occurred while deleting the items: %s"
                          ),
                          [...errors][0]
                        );
                      }
                      return isResetting ? sprintf(
                        /* translators: %s: a list of comma separated error messages */
                        __(
                          "Some errors occurred while reverting the items: %s"
                        ),
                        [...errors].join(
                          ","
                        )
                      ) : sprintf(
                        /* translators: %s: a list of comma separated error messages */
                        __(
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
              await deletePostWithNotices(items, notice, {
                onActionPerformed
              });
              setIsBusy(false);
              closeModal?.();
            },
            isBusy,
            disabled: isBusy,
            accessibleWhenDisabled: true,
            __next40pxDefaultSize: true,
            children: __("Delete")
          }
        )
      ] })
    ] });
  }
};
var delete_post_default = deletePostAction;
export {
  delete_post_default as default
};
//# sourceMappingURL=delete-post.mjs.map
