// packages/block-editor/src/components/block-heading-level-dropdown/index.js
import { ToolbarDropdownMenu } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import HeadingLevelIcon from "./heading-level-icon.mjs";
import { jsx } from "react/jsx-runtime";
var HEADING_LEVELS = [1, 2, 3, 4, 5, 6];
var POPOVER_PROPS = {
  className: "block-library-heading-level-dropdown"
};
function HeadingLevelDropdown({
  options = HEADING_LEVELS,
  value,
  onChange
}) {
  const validOptions = options.filter(
    (option) => option === 0 || HEADING_LEVELS.includes(option)
  ).sort((a, b) => a - b);
  return /* @__PURE__ */ jsx(
    ToolbarDropdownMenu,
    {
      popoverProps: POPOVER_PROPS,
      icon: /* @__PURE__ */ jsx(HeadingLevelIcon, { level: value }),
      label: __("Change level"),
      controls: validOptions.map((targetLevel) => {
        const isActive = targetLevel === value;
        return {
          icon: /* @__PURE__ */ jsx(HeadingLevelIcon, { level: targetLevel }),
          title: targetLevel === 0 ? __("Paragraph") : sprintf(
            // translators: %d: heading level e.g: "1", "2", "3"
            __("Heading %d"),
            targetLevel
          ),
          isActive,
          onClick() {
            onChange(targetLevel);
          },
          role: "menuitemradio"
        };
      })
    }
  );
}
export {
  HeadingLevelDropdown as default
};
//# sourceMappingURL=index.mjs.map
