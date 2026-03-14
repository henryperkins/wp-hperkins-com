// packages/fields/src/mutation/index.ts
import { store as noticesStore } from "@wordpress/notices";
import { store as coreStore } from "@wordpress/core-data";
import { dispatch } from "@wordpress/data";
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
  const { createSuccessNotice, createErrorNotice } = dispatch(noticesStore);
  const { deleteEntityRecord } = dispatch(coreStore);
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
  const { createSuccessNotice, createErrorNotice } = dispatch(noticesStore);
  const { editEntityRecord, saveEditedEntityRecord } = dispatch(coreStore);
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
export {
  deletePostWithNotices,
  editPostWithNotices
};
//# sourceMappingURL=index.mjs.map
