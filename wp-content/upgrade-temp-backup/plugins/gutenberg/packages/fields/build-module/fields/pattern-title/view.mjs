// packages/fields/src/fields/pattern-title/view.tsx
import { __ } from "@wordpress/i18n";
import { Icon, lockSmall } from "@wordpress/icons";
import { Tooltip } from "@wordpress/components";
import { privateApis as patternPrivateApis } from "@wordpress/patterns";
import { BaseTitleView } from "../title/view.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { PATTERN_TYPES } = unlock(patternPrivateApis);
function PatternTitleView({ item }) {
  return /* @__PURE__ */ jsx(BaseTitleView, { item, className: "fields-field__pattern-title", children: item.type === PATTERN_TYPES.theme && /* @__PURE__ */ jsx(
    Tooltip,
    {
      placement: "top",
      text: __("This pattern cannot be edited."),
      children: /* @__PURE__ */ jsx(Icon, { icon: lockSmall, size: 24 })
    }
  ) });
}
export {
  PATTERN_TYPES,
  PatternTitleView as default
};
//# sourceMappingURL=view.mjs.map
