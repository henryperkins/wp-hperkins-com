// packages/editor/src/utils/sync-error-messages.js
import { __ } from "@wordpress/i18n";
var ERROR_MESSAGES = {
  "authentication-failed": {
    title: __("Unable to connect"),
    description: __(
      "Real-time collaboration couldn't verify your permissions. Check that you have access to edit this post, or contact your site administrator."
    ),
    canRetry: false
  },
  "connection-expired": {
    title: __("Connection expired"),
    description: __(
      "Your connection to real-time collaboration has timed out. Editing is paused to prevent conflicts with other editors."
    ),
    canRetry: true
  },
  "connection-limit-exceeded": {
    title: __("Too many editors connected"),
    description: __(
      "Real-time collaboration has reached its connection limit. Try again later or contact your site administrator."
    ),
    canRetry: true
  },
  "unknown-error": {
    title: __("Connection lost"),
    description: __(
      "The connection to real-time collaboration was interrupted. Editing is paused to prevent conflicts with other editors."
    ),
    canRetry: true
  }
};
function getSyncErrorMessages(error) {
  if (ERROR_MESSAGES[error?.code]) {
    return ERROR_MESSAGES[error.code];
  }
  return ERROR_MESSAGES["unknown-error"];
}
export {
  getSyncErrorMessages
};
//# sourceMappingURL=sync-error-messages.mjs.map
