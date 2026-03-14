// packages/block-library/src/term-description/edit.js
import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { useTermDescription } from "./use-term-description.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
function TermDescriptionEdit({
  context: { termId, taxonomy }
}) {
  const { termDescription } = useTermDescription(termId, taxonomy);
  const blockProps = useBlockProps();
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { ...blockProps, children: termDescription ? /* @__PURE__ */ jsx(
    "div",
    {
      dangerouslySetInnerHTML: { __html: termDescription }
    }
  ) : /* @__PURE__ */ jsx("div", { className: "wp-block-term-description__placeholder", children: /* @__PURE__ */ jsx("span", { children: __("Term Description") }) }) }) });
}
export {
  TermDescriptionEdit as default
};
//# sourceMappingURL=edit.mjs.map
