// packages/block-library/src/math/edit.js
import { __, sprintf } from "@wordpress/i18n";
import {
  useBlockProps,
  store as blockEditorStore
} from "@wordpress/block-editor";
import {
  TextareaControl,
  Popover,
  __experimentalVStack as VStack,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { useState, useEffect, useRef } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { speak } from "@wordpress/a11y";
import { unlock } from "../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Badge } = unlock(componentsPrivateApis);
function MathEdit({ attributes, setAttributes, isSelected }) {
  const { latex, mathML } = attributes;
  const [blockRef, setBlockRef] = useState();
  const [error, setError] = useState(null);
  const [latexToMathML, setLatexToMathML] = useState();
  const initialLatex = useRef(latex);
  const { __unstableMarkNextChangeAsNotPersistent } = useDispatch(blockEditorStore);
  useEffect(() => {
    import("@wordpress/latex-to-mathml").then((module) => {
      setLatexToMathML(() => module.default);
      if (initialLatex.current) {
        __unstableMarkNextChangeAsNotPersistent();
        setAttributes({
          mathML: module.default(initialLatex.current, {
            displayMode: true
          })
        });
      }
    });
  }, [
    initialLatex,
    setAttributes,
    __unstableMarkNextChangeAsNotPersistent
  ]);
  const blockProps = useBlockProps({
    ref: setBlockRef,
    position: "relative"
  });
  return /* @__PURE__ */ jsxs("div", { ...blockProps, children: [
    mathML ? /* @__PURE__ */ jsx(
      "math",
      {
        display: "block",
        dangerouslySetInnerHTML: { __html: mathML }
      }
    ) : "\u200B",
    isSelected && /* @__PURE__ */ jsx(
      Popover,
      {
        placement: "bottom-start",
        offset: 8,
        anchor: blockRef,
        focusOnMount: false,
        __unstableSlotName: "__unstable-block-tools-after",
        children: /* @__PURE__ */ jsx("div", { style: { padding: "4px", minWidth: "300px" }, children: /* @__PURE__ */ jsxs(VStack, { spacing: 1, children: [
          /* @__PURE__ */ jsx(
            TextareaControl,
            {
              __next40pxDefaultSize: true,
              label: __("LaTeX math syntax"),
              hideLabelFromVision: true,
              value: latex,
              className: "wp-block-math__textarea-control",
              onChange: (newLatex) => {
                if (!latexToMathML) {
                  setAttributes({ latex: newLatex });
                  return;
                }
                let newMathML = "";
                try {
                  newMathML = latexToMathML(newLatex, {
                    displayMode: true
                  });
                  setError(null);
                } catch (err) {
                  setError(err.message);
                  speak(
                    sprintf(
                      /* translators: %s: error message returned when parsing LaTeX. */
                      __(
                        "Error parsing mathematical expression: %s"
                      ),
                      err.message
                    )
                  );
                }
                setAttributes({
                  mathML: newMathML,
                  latex: newLatex
                });
              },
              placeholder: __("e.g., x^2, \\frac{a}{b}")
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
    )
  ] });
}
export {
  MathEdit as default
};
//# sourceMappingURL=edit.mjs.map
