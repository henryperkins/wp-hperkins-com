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

// packages/editor/src/utils/sync-error-messages.js
var sync_error_messages_exports = {};
__export(sync_error_messages_exports, {
  getSyncErrorMessages: () => getSyncErrorMessages
});
module.exports = __toCommonJS(sync_error_messages_exports);
var import_i18n = require("@wordpress/i18n");
var ERROR_MESSAGES = {
  "authentication-failed": {
    title: (0, import_i18n.__)("Unable to connect"),
    description: (0, import_i18n.__)(
      "Real-time collaboration couldn't verify your permissions. Check that you have access to edit this post, or contact your site administrator."
    ),
    canRetry: false
  },
  "connection-expired": {
    title: (0, import_i18n.__)("Connection expired"),
    description: (0, import_i18n.__)(
      "Your connection to real-time collaboration has timed out. Editing is paused to prevent conflicts with other editors."
    ),
    canRetry: true
  },
  "connection-limit-exceeded": {
    title: (0, import_i18n.__)("Too many editors connected"),
    description: (0, import_i18n.__)(
      "Real-time collaboration has reached its connection limit. Try again later or contact your site administrator."
    ),
    canRetry: true
  },
  "unknown-error": {
    title: (0, import_i18n.__)("Connection lost"),
    description: (0, import_i18n.__)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getSyncErrorMessages
});
//# sourceMappingURL=sync-error-messages.cjs.map
