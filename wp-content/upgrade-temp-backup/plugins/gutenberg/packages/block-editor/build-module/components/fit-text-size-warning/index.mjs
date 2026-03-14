// packages/block-editor/src/components/fit-text-size-warning/index.js
import { useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Notice } from "@wordpress/components";
import { speak } from "@wordpress/a11y";
import { jsx } from "react/jsx-runtime";
function FitTextSizeWarning() {
  const message = __(
    "The text may be too small to read. Consider using a larger container or less text."
  );
  useEffect(() => {
    speak(message);
  }, [message]);
  return /* @__PURE__ */ jsx("div", { className: "block-editor-fit-text-size-warning", children: /* @__PURE__ */ jsx(
    Notice,
    {
      spokenMessage: null,
      status: "warning",
      isDismissible: false,
      children: message
    }
  ) });
}
export {
  FitTextSizeWarning as default
};
//# sourceMappingURL=index.mjs.map
