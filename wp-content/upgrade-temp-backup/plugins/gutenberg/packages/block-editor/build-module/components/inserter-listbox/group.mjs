// packages/block-editor/src/components/inserter-listbox/group.js
import { forwardRef, useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { speak } from "@wordpress/a11y";
import { jsx } from "react/jsx-runtime";
function InserterListboxGroup(props, ref) {
  const [shouldSpeak, setShouldSpeak] = useState(false);
  useEffect(() => {
    if (shouldSpeak) {
      speak(
        __("Use left and right arrow keys to move through blocks")
      );
    }
  }, [shouldSpeak]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      role: "listbox",
      "aria-orientation": "horizontal",
      onFocus: () => {
        setShouldSpeak(true);
      },
      onBlur: (event) => {
        const focusingOutsideGroup = !event.currentTarget.contains(
          event.relatedTarget
        );
        if (focusingOutsideGroup) {
          setShouldSpeak(false);
        }
      },
      ...props
    }
  );
}
var group_default = forwardRef(InserterListboxGroup);
export {
  group_default as default
};
//# sourceMappingURL=group.mjs.map
