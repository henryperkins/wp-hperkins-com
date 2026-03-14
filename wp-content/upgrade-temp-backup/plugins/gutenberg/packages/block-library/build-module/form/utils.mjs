// packages/block-library/src/form/utils.js
import { __ } from "@wordpress/i18n";
var formSubmissionNotificationSuccess = [
  "core/form-submission-notification",
  {
    type: "success"
  },
  [
    [
      "core/paragraph",
      {
        content: '<mark style="background-color:rgba(0, 0, 0, 0);color:#345C00" class="has-inline-color">' + __("Your form has been submitted successfully") + "</mark>"
      }
    ]
  ]
];
var formSubmissionNotificationError = [
  "core/form-submission-notification",
  {
    type: "error"
  },
  [
    [
      "core/paragraph",
      {
        content: '<mark style="background-color:rgba(0, 0, 0, 0);color:#CF2E2E" class="has-inline-color">' + __("There was an error submitting your form.") + "</mark>"
      }
    ]
  ]
];
export {
  formSubmissionNotificationError,
  formSubmissionNotificationSuccess
};
//# sourceMappingURL=utils.mjs.map
