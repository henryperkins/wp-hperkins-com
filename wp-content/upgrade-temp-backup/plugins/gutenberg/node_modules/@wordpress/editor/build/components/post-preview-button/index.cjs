"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-preview-button/index.js
var post_preview_button_exports = {};
__export(post_preview_button_exports, {
  default: () => PostPreviewButton
});
module.exports = __toCommonJS(post_preview_button_exports);
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_hooks = require("@wordpress/hooks");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function writeInterstitialMessage(targetDocument) {
  let markup = (0, import_element.renderToString)(
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-post-preview-button__interstitial-message", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 96 96", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Path,
          {
            className: "outer",
            d: "M48 12c19.9 0 36 16.1 36 36S67.9 84 48 84 12 67.9 12 48s16.1-36 36-36",
            fill: "none"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Path,
          {
            className: "inner",
            d: "M69.5 46.4c0-3.9-1.4-6.7-2.6-8.8-1.6-2.6-3.1-4.9-3.1-7.5 0-2.9 2.2-5.7 5.4-5.7h.4C63.9 19.2 56.4 16 48 16c-11.2 0-21 5.7-26.7 14.4h2.1c3.3 0 8.5-.4 8.5-.4 1.7-.1 1.9 2.4.2 2.6 0 0-1.7.2-3.7.3L40 67.5l7-20.9L42 33c-1.7-.1-3.3-.3-3.3-.3-1.7-.1-1.5-2.7.2-2.6 0 0 5.3.4 8.4.4 3.3 0 8.5-.4 8.5-.4 1.7-.1 1.9 2.4.2 2.6 0 0-1.7.2-3.7.3l11.5 34.3 3.3-10.4c1.6-4.5 2.4-7.8 2.4-10.5zM16.1 48c0 12.6 7.3 23.5 18 28.7L18.8 35c-1.7 4-2.7 8.4-2.7 13zm32.5 2.8L39 78.6c2.9.8 5.9 1.3 9 1.3 3.7 0 7.3-.6 10.6-1.8-.1-.1-.2-.3-.2-.4l-9.8-26.9zM76.2 36c0 3.2-.6 6.9-2.4 11.4L64 75.6c9.5-5.5 15.9-15.8 15.9-27.6 0-5.5-1.4-10.8-3.9-15.3.1 1 .2 2.1.2 3.3z",
            fill: "none"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)("Generating preview\u2026") })
    ] })
  );
  markup += `
		<style>
			body {
				margin: 0;
			}
			.editor-post-preview-button__interstitial-message {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 100vh;
				width: 100vw;
			}
			@-webkit-keyframes paint {
				0% {
					stroke-dashoffset: 0;
				}
			}
			@-moz-keyframes paint {
				0% {
					stroke-dashoffset: 0;
				}
			}
			@-o-keyframes paint {
				0% {
					stroke-dashoffset: 0;
				}
			}
			@keyframes paint {
				0% {
					stroke-dashoffset: 0;
				}
			}
			.editor-post-preview-button__interstitial-message svg {
				width: 192px;
				height: 192px;
				stroke: #555d66;
				stroke-width: 0.75;
			}
			.editor-post-preview-button__interstitial-message svg .outer,
			.editor-post-preview-button__interstitial-message svg .inner {
				stroke-dasharray: 280;
				stroke-dashoffset: 280;
				-webkit-animation: paint 1.5s ease infinite alternate;
				-moz-animation: paint 1.5s ease infinite alternate;
				-o-animation: paint 1.5s ease infinite alternate;
				animation: paint 1.5s ease infinite alternate;
			}
			p {
				text-align: center;
				font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
			}
		</style>
	`;
  markup = (0, import_hooks.applyFilters)("editor.PostPreview.interstitialMarkup", markup);
  targetDocument.write(markup);
  targetDocument.title = (0, import_i18n.__)("Generating preview\u2026");
  targetDocument.close();
}
function PostPreviewButton({
  className,
  textContent,
  forceIsAutosaveable,
  role,
  onPreview
}) {
  const { postId, currentPostLink, previewLink, isSaveable, isViewable } = (0, import_data.useSelect)((select) => {
    const editor = select(import_store.store);
    const core = select(import_core_data.store);
    const postType = core.getPostType(
      editor.getCurrentPostType("type")
    );
    const canView = postType?.viewable ?? false;
    if (!canView) {
      return { isViewable: canView };
    }
    return {
      postId: editor.getCurrentPostId(),
      currentPostLink: editor.getCurrentPostAttribute("link"),
      previewLink: editor.getEditedPostPreviewLink(),
      isSaveable: editor.isEditedPostSaveable(),
      isViewable: canView
    };
  }, []);
  const { __unstableSaveForPreview } = (0, import_data.useDispatch)(import_store.store);
  if (!isViewable) {
    return null;
  }
  const targetId = `wp-preview-${postId}`;
  const openPreviewWindow = async (event) => {
    event.preventDefault();
    const previewWindow = window.open("", targetId);
    previewWindow.focus();
    writeInterstitialMessage(previewWindow.document);
    const link = await __unstableSaveForPreview({ forceIsAutosaveable });
    previewWindow.location = link;
    onPreview?.();
  };
  const href = previewLink || currentPostLink;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      variant: !className ? "tertiary" : void 0,
      className: className || "editor-post-preview",
      href,
      target: targetId,
      accessibleWhenDisabled: true,
      disabled: !isSaveable,
      onClick: openPreviewWindow,
      role,
      size: "compact",
      children: textContent || /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        (0, import_i18n._x)("Preview", "imperative verb"),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.VisuallyHidden, {
          as: "span",
          /* translators: accessibility text */
          children: (0, import_i18n.__)("(opens in a new tab)")
        })
      ] })
    }
  );
}
//# sourceMappingURL=index.cjs.map
