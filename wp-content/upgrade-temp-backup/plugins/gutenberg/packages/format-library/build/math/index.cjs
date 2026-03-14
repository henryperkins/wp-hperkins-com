var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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

// packages/format-library/src/math/index.js
var math_exports = {};
__export(math_exports, {
  math: () => math
});
module.exports = __toCommonJS(math_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_rich_text = require("@wordpress/rich-text");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_a11y = require("@wordpress/a11y");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Badge } = (0, import_lock_unlock.unlock)(import_components.privateApis);
var name = "core/math";
var title = (0, import_i18n.__)("Math");
function InlineUI({
  value,
  onChange,
  activeAttributes,
  contentRef,
  latexToMathML
}) {
  const [latex, setLatex] = (0, import_element.useState)(
    activeAttributes?.["data-latex"] || ""
  );
  const [error, setError] = (0, import_element.useState)(null);
  const popoverAnchor = (0, import_rich_text.useAnchor)({
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
        (0, import_a11y.speak)(
          (0, import_i18n.sprintf)(
            /* translators: %s: error message returned when parsing LaTeX. */
            (0, import_i18n.__)("Error parsing mathematical expression: %s"),
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Popover,
    {
      placement: "bottom-start",
      offset: 8,
      focusOnMount: false,
      anchor: popoverAnchor,
      className: "block-editor-format-toolbar__math-popover",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { minWidth: "300px", padding: "4px" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 1, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.TextControl,
          {
            __next40pxDefaultSize: true,
            hideLabelFromVision: true,
            label: (0, import_i18n.__)("LaTeX math syntax"),
            value: latex,
            onChange: handleLatexChange,
            placeholder: (0, import_i18n.__)("e.g., x^2, \\frac{a}{b}"),
            autoComplete: "off",
            className: "block-editor-format-toolbar__math-input"
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
  const [latexToMathML, setLatexToMathML] = (0, import_element.useState)();
  (0, import_element.useEffect)(() => {
    import("@wordpress/latex-to-mathml").then((module2) => {
      setLatexToMathML(() => module2.default);
    });
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.RichTextToolbarButton,
      {
        icon: import_icons.math,
        title,
        onClick: () => {
          const newValue = (0, import_rich_text.insertObject)(value, {
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
    isObjectActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  math
});
//# sourceMappingURL=index.cjs.map
