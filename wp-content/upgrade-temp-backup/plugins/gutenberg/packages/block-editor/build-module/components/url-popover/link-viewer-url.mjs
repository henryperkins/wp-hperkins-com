// packages/block-editor/src/components/url-popover/link-viewer-url.js
import clsx from "clsx";
import { ExternalLink } from "@wordpress/components";
import { safeDecodeURI, filterURLForDisplay } from "@wordpress/url";
import { jsx } from "react/jsx-runtime";
function LinkViewerURL({ url, urlLabel, className }) {
  const linkClassName = clsx(
    className,
    "block-editor-url-popover__link-viewer-url"
  );
  if (!url) {
    return /* @__PURE__ */ jsx("span", { className: linkClassName });
  }
  return /* @__PURE__ */ jsx(ExternalLink, { className: linkClassName, href: url, children: urlLabel || filterURLForDisplay(safeDecodeURI(url)) });
}
export {
  LinkViewerURL as default
};
//# sourceMappingURL=link-viewer-url.mjs.map
