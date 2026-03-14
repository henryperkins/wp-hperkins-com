// packages/editor/src/components/editor-notices/index.js
import deprecated from "@wordpress/deprecated";
import { InlineNotices } from "@wordpress/notices";
import TemplateValidationNotice from "../template-validation-notice/index.mjs";
import { jsx } from "react/jsx-runtime";
function EditorNotices() {
  deprecated("wp.editor.EditorNotices", {
    since: "7.0",
    version: "7.2",
    alternative: "wp.notices.InlineNotices"
  });
  return /* @__PURE__ */ jsx(
    InlineNotices,
    {
      pinnedNoticesClassName: "components-editor-notices__pinned",
      dismissibleNoticesClassName: "components-editor-notices__dismissible",
      children: /* @__PURE__ */ jsx(TemplateValidationNotice, {})
    }
  );
}
var editor_notices_default = EditorNotices;
export {
  EditorNotices,
  editor_notices_default as default
};
//# sourceMappingURL=index.mjs.map
