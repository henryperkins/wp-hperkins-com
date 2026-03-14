// packages/fields/src/actions/duplicate-pattern.tsx
import { _x } from "@wordpress/i18n";
import { privateApis as patternsPrivateApis } from "@wordpress/patterns";
import { unlock } from "../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { CreatePatternModalContents, useDuplicatePatternProps } = unlock(patternsPrivateApis);
var duplicatePattern = {
  id: "duplicate-pattern",
  label: _x("Duplicate", "action label"),
  isEligible: (item) => item.type !== "wp_template_part",
  modalHeader: _x("Duplicate pattern", "action label"),
  modalFocusOnMount: "firstContentElement",
  RenderModal: ({ items, closeModal }) => {
    const [item] = items;
    const duplicatedProps = useDuplicatePatternProps({
      pattern: item,
      onSuccess: () => closeModal?.()
    });
    return /* @__PURE__ */ jsx(
      CreatePatternModalContents,
      {
        onClose: closeModal,
        confirmLabel: _x("Duplicate", "action label"),
        ...duplicatedProps
      }
    );
  }
};
var duplicate_pattern_default = duplicatePattern;
export {
  duplicate_pattern_default as default
};
//# sourceMappingURL=duplicate-pattern.mjs.map
