// packages/block-library/src/utils/html-renderer.js
import clsx from "clsx";
import parse, { attributesToProps, domToReact } from "html-react-parser";
import { safeHTML } from "@wordpress/dom";
import { jsx } from "react/jsx-runtime";
var HtmlRenderer = ({ wrapperProps = {}, html = "" }) => {
  const options = {
    replace: ({ name, type, attribs, parent, children }) => {
      if (type === "tag" && name) {
        const parsedProps = attributesToProps(attribs || {});
        const TagName = name;
        if (!parent) {
          const mergedProps = {
            ...parsedProps,
            ...wrapperProps,
            className: clsx(
              parsedProps.className,
              wrapperProps.className
            ),
            style: {
              ...parsedProps.style || {},
              ...wrapperProps.style || {}
            }
          };
          return /* @__PURE__ */ jsx(TagName, { ...mergedProps, children: domToReact(children, options) });
        }
      }
    }
  };
  const sanitizedContent = safeHTML(html);
  const parsedContent = parse(sanitizedContent, options);
  return parsedContent;
};
var html_renderer_default = HtmlRenderer;
export {
  html_renderer_default as default
};
//# sourceMappingURL=html-renderer.mjs.map
