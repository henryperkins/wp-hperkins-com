// packages/block-editor/src/components/global-styles/advanced-panel.js
import {
  TextareaControl,
  Notice,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { default as transformStyles } from "../../utils/transform-styles/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function validateCSS(css) {
  if (typeof css === "string" && /<\/?\w/.test(css)) {
    return false;
  }
  return true;
}
function AdvancedPanel({
  value,
  onChange,
  inheritedValue = value,
  help
}) {
  const [cssError, setCSSError] = useState(null);
  const customCSS = inheritedValue?.css;
  function handleOnChange(newValue) {
    onChange({
      ...value,
      css: newValue
    });
    if (!validateCSS(newValue)) {
      setCSSError(
        __("The custom CSS is invalid. Do not use <> markup.")
      );
      return;
    }
    if (cssError) {
      setCSSError(null);
    }
  }
  function handleOnBlur(event) {
    const cssValue = event?.target?.value;
    if (!cssValue || !validateCSS(cssValue)) {
      return;
    }
    const [transformed] = transformStyles(
      [{ css: cssValue }],
      ".for-validation-only"
    );
    setCSSError(
      transformed === null ? __("There is an error with your CSS structure.") : null
    );
  }
  return /* @__PURE__ */ jsxs(VStack, { spacing: 3, children: [
    cssError && /* @__PURE__ */ jsx(Notice, { status: "error", onRemove: () => setCSSError(null), children: cssError }),
    /* @__PURE__ */ jsx(
      TextareaControl,
      {
        label: __("Additional CSS"),
        value: customCSS,
        onChange: (newValue) => handleOnChange(newValue),
        onBlur: handleOnBlur,
        className: "block-editor-global-styles-advanced-panel__custom-css-input",
        spellCheck: false,
        help
      }
    )
  ] });
}
export {
  AdvancedPanel as default,
  validateCSS
};
//# sourceMappingURL=advanced-panel.mjs.map
