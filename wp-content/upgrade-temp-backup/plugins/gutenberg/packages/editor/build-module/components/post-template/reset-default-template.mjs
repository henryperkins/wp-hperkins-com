// packages/editor/src/components/post-template/reset-default-template.js
import { MenuItem } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import {
  useAllowSwitchingTemplates,
  useCurrentTemplateSlug,
  useEditedPostContext
} from "./hooks.mjs";
import { jsx } from "react/jsx-runtime";
function ResetDefaultTemplate({ onClick }) {
  const currentTemplateSlug = useCurrentTemplateSlug();
  const allowSwitchingTemplate = useAllowSwitchingTemplates();
  const { postType, postId } = useEditedPostContext();
  const { editEntityRecord } = useDispatch(coreStore);
  if (!currentTemplateSlug || !allowSwitchingTemplate) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    MenuItem,
    {
      onClick: () => {
        editEntityRecord(
          "postType",
          postType,
          postId,
          { template: "" },
          { undoIgnore: true }
        );
        onClick();
      },
      children: __("Use default template")
    }
  );
}
export {
  ResetDefaultTemplate as default
};
//# sourceMappingURL=reset-default-template.mjs.map
