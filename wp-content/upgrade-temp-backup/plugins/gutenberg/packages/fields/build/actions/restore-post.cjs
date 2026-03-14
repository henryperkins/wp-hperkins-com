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

// packages/fields/src/actions/restore-post.tsx
var restore_post_exports = {};
__export(restore_post_exports, {
  default: () => restore_post_default
});
module.exports = __toCommonJS(restore_post_exports);
var import_icons = require("@wordpress/icons");
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_notices = require("@wordpress/notices");
var import_utils = require("./utils.cjs");
var restorePost = {
  id: "restore",
  label: (0, import_i18n.__)("Restore"),
  isPrimary: true,
  icon: import_icons.backup,
  supportsBulk: true,
  isEligible(item) {
    return !(0, import_utils.isTemplateOrTemplatePart)(item) && item.type !== "wp_block" && item.status === "trash" && item.permissions?.update;
  },
  async callback(posts, { registry, onActionPerformed }) {
    const { createSuccessNotice, createErrorNotice } = registry.dispatch(import_notices.store);
    const { editEntityRecord, saveEditedEntityRecord } = registry.dispatch(import_core_data.store);
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
        successMessage = (0, import_i18n.sprintf)(
          /* translators: %s: The number of posts. */
          (0, import_i18n.__)('"%s" has been restored.'),
          (0, import_utils.getItemTitle)(posts[0])
        );
      } else if (posts[0].type === "page") {
        successMessage = (0, import_i18n.sprintf)(
          /* translators: %d: The number of posts. */
          (0, import_i18n.__)("%d pages have been restored."),
          posts.length
        );
      } else {
        successMessage = (0, import_i18n.sprintf)(
          /* translators: %d: The number of posts. */
          (0, import_i18n.__)("%d posts have been restored."),
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
          errorMessage = (0, import_i18n.__)(
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
          errorMessage = (0, import_i18n.__)(
            "An error occurred while restoring the posts."
          );
        } else if (errorMessages.size === 1) {
          errorMessage = (0, import_i18n.sprintf)(
            /* translators: %s: an error message */
            (0, import_i18n.__)("An error occurred while restoring the posts: %s"),
            [...errorMessages][0]
          );
        } else {
          errorMessage = (0, import_i18n.sprintf)(
            /* translators: %s: a list of comma separated error messages */
            (0, import_i18n.__)(
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
//# sourceMappingURL=restore-post.cjs.map
