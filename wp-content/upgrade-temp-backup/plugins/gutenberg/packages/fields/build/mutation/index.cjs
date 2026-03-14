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

// packages/fields/src/mutation/index.ts
var mutation_exports = {};
__export(mutation_exports, {
  deletePostWithNotices: () => deletePostWithNotices,
  editPostWithNotices: () => editPostWithNotices
});
module.exports = __toCommonJS(mutation_exports);
var import_notices = require("@wordpress/notices");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
function getErrorMessagesFromPromises(allSettledResults) {
  const errorMessages = /* @__PURE__ */ new Set();
  if (allSettledResults.length === 1) {
    const typedError = allSettledResults[0];
    if (typedError.reason?.message) {
      errorMessages.add(typedError.reason.message);
    }
  } else {
    const failedPromises = allSettledResults.filter(
      ({ status }) => status === "rejected"
    );
    for (const failedPromise of failedPromises) {
      const typedError = failedPromise;
      if (typedError.reason?.message) {
        errorMessages.add(typedError.reason.message);
      }
    }
  }
  return errorMessages;
}
var deletePostWithNotices = async (posts, notice, callbacks) => {
  const { createSuccessNotice, createErrorNotice } = (0, import_data.dispatch)(import_notices.store);
  const { deleteEntityRecord } = (0, import_data.dispatch)(import_core_data.store);
  const allSettledResults = await Promise.allSettled(
    posts.map((post) => {
      return deleteEntityRecord(
        "postType",
        post.type,
        post.id,
        { force: true },
        { throwOnError: true }
      );
    })
  );
  if (allSettledResults.every(({ status }) => status === "fulfilled")) {
    let successMessage;
    if (allSettledResults.length === 1) {
      successMessage = notice.success.messages.getMessage(posts[0]);
    } else {
      successMessage = notice.success.messages.getBatchMessage(posts);
    }
    createSuccessNotice(successMessage, {
      type: notice.success.type ?? "snackbar",
      id: notice.success.id
    });
    callbacks.onActionPerformed?.(posts);
  } else {
    const errorMessages = getErrorMessagesFromPromises(allSettledResults);
    let errorMessage = "";
    if (allSettledResults.length === 1) {
      errorMessage = notice.error.messages.getMessage(errorMessages);
    } else {
      errorMessage = notice.error.messages.getBatchMessage(errorMessages);
    }
    createErrorNotice(errorMessage, {
      type: notice.error.type ?? "snackbar",
      id: notice.error.id
    });
    callbacks.onActionError?.();
  }
};
var editPostWithNotices = async (postsWithUpdates, notice, callbacks) => {
  const { createSuccessNotice, createErrorNotice } = (0, import_data.dispatch)(import_notices.store);
  const { editEntityRecord, saveEditedEntityRecord } = (0, import_data.dispatch)(import_core_data.store);
  await Promise.allSettled(
    postsWithUpdates.map((post) => {
      return editEntityRecord(
        "postType",
        post.originalPost.type,
        post.originalPost.id,
        {
          ...post.changes
        }
      );
    })
  );
  const allSettledResults = await Promise.allSettled(
    postsWithUpdates.map((post) => {
      return saveEditedEntityRecord(
        "postType",
        post.originalPost.type,
        post.originalPost.id,
        {
          throwOnError: true
        }
      );
    })
  );
  if (allSettledResults.every(({ status }) => status === "fulfilled")) {
    let successMessage;
    if (allSettledResults.length === 1) {
      successMessage = notice.success.messages.getMessage(
        postsWithUpdates[0].originalPost
      );
    } else {
      successMessage = notice.success.messages.getBatchMessage(
        postsWithUpdates.map((post) => post.originalPost)
      );
    }
    createSuccessNotice(successMessage, {
      type: notice.success.type ?? "snackbar",
      id: notice.success.id
    });
    callbacks.onActionPerformed?.(
      postsWithUpdates.map((post) => post.originalPost)
    );
  } else {
    const errorMessages = getErrorMessagesFromPromises(allSettledResults);
    let errorMessage = "";
    if (allSettledResults.length === 1) {
      errorMessage = notice.error.messages.getMessage(errorMessages);
    } else {
      errorMessage = notice.error.messages.getBatchMessage(errorMessages);
    }
    createErrorNotice(errorMessage, {
      type: notice.error.type ?? "snackbar",
      id: notice.error.id
    });
    callbacks.onActionError?.();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deletePostWithNotices,
  editPostWithNotices
});
//# sourceMappingURL=index.cjs.map
