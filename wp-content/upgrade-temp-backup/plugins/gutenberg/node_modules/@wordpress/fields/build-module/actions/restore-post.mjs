// packages/fields/src/actions/restore-post.tsx
import { backup } from "@wordpress/icons";
import { store as coreStore } from "@wordpress/core-data";
import { __, sprintf } from "@wordpress/i18n";
import { store as noticesStore } from "@wordpress/notices";
import { getItemTitle, isTemplateOrTemplatePart } from "./utils.mjs";
var restorePost = {
  id: "restore",
  label: __("Restore"),
  isPrimary: true,
  icon: backup,
  supportsBulk: true,
  isEligible(item) {
    return !isTemplateOrTemplatePart(item) && item.type !== "wp_block" && item.status === "trash" && item.permissions?.update;
  },
  async callback(posts, { registry, onActionPerformed }) {
    const { createSuccessNotice, createErrorNotice } = registry.dispatch(noticesStore);
    const { editEntityRecord, saveEditedEntityRecord } = registry.dispatch(coreStore);
    await Promise.allSettled(
      posts.map((post) => {
        return editEntityRecord("postType", post.type, post.id, {
          status: "draft"
        });
      })
    );
    const promiseResult = await Promise.allSettled(
      posts.map((post) => {
        return saveEditedEntityRecord("postType", post.type, post.id, {
          throwOnError: true
        });
      })
    );
    if (promiseResult.every(({ status }) => status === "fulfilled")) {
      let successMessage;
      if (posts.length === 1) {
        successMessage = sprintf(
          /* translators: %s: The number of posts. */
          __('"%s" has been restored.'),
          getItemTitle(posts[0])
        );
      } else if (posts[0].type === "page") {
        successMessage = sprintf(
          /* translators: %d: The number of posts. */
          __("%d pages have been restored."),
          posts.length
        );
      } else {
        successMessage = sprintf(
          /* translators: %d: The number of posts. */
          __("%d posts have been restored."),
          posts.length
        );
      }
      createSuccessNotice(successMessage, {
        type: "snackbar",
        id: "restore-post-action"
      });
      if (onActionPerformed) {
        onActionPerformed(posts);
      }
    } else {
      let errorMessage;
      if (promiseResult.length === 1) {
        const typedError = promiseResult[0];
        if (typedError.reason?.message) {
          errorMessage = typedError.reason.message;
        } else {
          errorMessage = __(
            "An error occurred while restoring the post."
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
            errorMessages.add(typedError.reason.message);
          }
        }
        if (errorMessages.size === 0) {
          errorMessage = __(
            "An error occurred while restoring the posts."
          );
        } else if (errorMessages.size === 1) {
          errorMessage = sprintf(
            /* translators: %s: an error message */
            __("An error occurred while restoring the posts: %s"),
            [...errorMessages][0]
          );
        } else {
          errorMessage = sprintf(
            /* translators: %s: a list of comma separated error messages */
            __(
              "Some errors occurred while restoring the posts: %s"
            ),
            [...errorMessages].join(",")
          );
        }
      }
      createErrorNotice(errorMessage, {
        type: "snackbar"
      });
    }
  }
};
var restore_post_default = restorePost;
export {
  restore_post_default as default
};
//# sourceMappingURL=restore-post.mjs.map
