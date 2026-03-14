"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-library/src/math/edit.js
var edit_exports = {};
__export(edit_exports, {
  default: () => MathEdit
});
module.exports = __toCommonJS(edit_exports);
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_a11y = require("@wordpress/a11y");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Badge } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function MathEdit({ attributes, setAttributes, isSelected }) {
  const { latex, mathML } = attributes;
  const [blockRef, setBlockRef] = (0, import_element.useState)();
  const [error, setError] = (0, import_element.useState)(null);
  const [latexToMathML, setLatexToMathML] = (0, import_element.useState)();
  const initialLatex = (0, import_element.useRef)(latex);
  const { __unstableMarkNextChangeAsNotPersistent } = (0, import_data.useDispatch)(import_block_editor.store);
  (0, import_element.useEffect)(() => {
    import("@wordpress/latex-to-mathml").then((module2) => {
      setLatexToMathML(() => module2.default);
      if (initialLatex.current) {
        __unstableMarkNextChangeAsNotPersistent();
        setAttributes({
          mathML: module2.default(initialLatex.current, {
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
  const blockProps = (0, import_block_editor.useBlockProps)({
    ref: setBlockRef,
    position: "relative"
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ...blockProps, children: [
    mathML ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "math",
      {
        display: "block",
        dangerouslySetInnerHTML: { __html: mathML }
      }
    ) : "\u200B",
    isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Popover,
      {
        placement: "bottom-start",
        offset: 8,
        anchor: blockRef,
        focusOnMount: false,
        __unstableSlotName: "__unstable-block-tools-after",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: "4px", minWidth: "300px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 1, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.TextareaControl,
            {
              __next40pxDefaultSize: true,
              label: (0, import_i18n.__)("LaTeX math syntax"),
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
                  (0, import_a11y.speak)(
                    (0, import_i18n.sprintf)(
                      /* translators: %s: error message returned when parsing LaTeX. */
                      (0, import_i18n.__)(
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
              placeholder: (0, import_i18n.__)("e.g., x^2, \\frac{a}{b}")
            }
          ),
          error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Badge,
              {
                intent: "error",
                className: "wp-block-math__error",
                children: (0, import_i18n.sprintf)(
                  /* translators: %s: error message returned when parsing LaTeX. */
                  (0, import_i18n.__)("Error: %s"),
                  error
                )
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: ".wp-block-math__error .components-badge__content{white-space:normal}" })
          ] })
        ] }) })
      }
    )
  ] });
}
//# sourceMappingURL=edit.cjs.map
