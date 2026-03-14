// packages/format-library/src/math/index.js
import { __, sprintf } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import { insertObject, useAnchor } from "@wordpress/rich-text";
import { RichTextToolbarButton } from "@wordpress/block-editor";
import {
  Popover,
  TextControl,
  __experimentalVStack as VStack,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { math as icon } from "@wordpress/icons";
import { speak } from "@wordpress/a11y";
import { unlock } from "../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Badge } = unlock(componentsPrivateApis);
var name = "core/math";
var title = __("Math");
function InlineUI({
  value,
  onChange,
  activeAttributes,
  contentRef,
  latexToMathML
}) {
  const [latex, setLatex] = useState(
    activeAttributes?.["data-latex"] || ""
  );
  const [error, setError] = useState(null);
  const popoverAnchor = useAnchor({
    editableContentElement: contentRef.current,
    settings: math
  });
  const handleLatexChange = (newLatex) => {
    let mathML = "";
    setLatex(newLatex);
    if (newLatex) {
      try {
        mathML = latexToMathML(newLatex, { displayMode: false });
        setError(null);
      } catch (err) {
        setError(err.message);
        speak(
          sprintf(
            /* translators: %s: error message returned when parsing LaTeX. */
            __("Error parsing mathematical expression: %s"),
            err.message
          )
        );
        return;
      }
    }
    const newReplacements = value.replacements.slice();
    newReplacements[value.start] = {
      type: name,
      attributes: {
        "data-latex": newLatex
      },
      innerHTML: mathML
    };
    onChange({
      ...value,
      replacements: newReplacements
    });
  };
  return /* @__PURE__ */ jsx(
    Popover,
    {
      placement: "bottom-start",
      offset: 8,
      focusOnMount: false,
      anchor: popoverAnchor,
      className: "block-editor-format-toolbar__math-popover",
      children: /* @__PURE__ */ jsx("div", { style: { minWidth: "300px", padding: "4px" }, children: /* @__PURE__ */ jsxs(VStack, { spacing: 1, children: [
        /* @__PURE__ */ jsx(
          TextControl,
          {
            __next40pxDefaultSize: true,
            hideLabelFromVision: true,
            label: __("LaTeX math syntax"),
            value: latex,
            onChange: handleLatexChange,
            placeholder: __("e.g., x^2, \\frac{a}{b}"),
            autoComplete: "off",
            className: "block-editor-format-toolbar__math-input"
          }
        ),
        error && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            Badge,
            {
              intent: "error",
              className: "wp-block-math__error",
              children: sprintf(
                /* translators: %s: error message returned when parsing LaTeX. */
                __("Error: %s"),
                error
              )
            }
          ),
          /* @__PURE__ */ jsx("style", { children: ".wp-block-math__error .components-badge__content{white-space:normal}" })
        ] })
      ] }) })
    }
  );
}
function Edit({
  value,
  onChange,
  onFocus,
  isObjectActive,
  activeObjectAttributes,
  contentRef
}) {
  const [latexToMathML, setLatexToMathML] = useState();
  useEffect(() => {
    import("@wordpress/latex-to-mathml").then((module) => {
      setLatexToMathML(() => module.default);
    });
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      RichTextToolbarButton,
      {
        icon,
        title,
        onClick: () => {
          const newValue = insertObject(value, {
            type: name,
            attributes: {
              "data-latex": ""
            },
            innerHTML: ""
          });
          newValue.start = newValue.end - 1;
          onChange(newValue);
          onFocus();
        },
        isActive: isObjectActive
      }
    ),
    isObjectActive && /* @__PURE__ */ jsx(
      InlineUI,
      {
        value,
        onChange,
        activeAttributes: activeObjectAttributes,
        contentRef,
        latexToMathML
      }
    )
  ] });
}
var math = {
  name,
  title,
  tagName: "math",
  className: null,
  attributes: {
    "data-latex": "data-latex"
  },
  contentEditable: false,
  edit: Edit
};
export {
  math
};
//# sourceMappingURL=index.mjs.map
