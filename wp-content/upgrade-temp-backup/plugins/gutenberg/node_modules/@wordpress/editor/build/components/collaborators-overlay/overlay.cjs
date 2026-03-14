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

// packages/editor/src/components/collaborators-overlay/overlay.tsx
var overlay_exports = {};
__export(overlay_exports, {
  Overlay: () => Overlay
});
module.exports = __toCommonJS(overlay_exports);
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_use_block_highlighting = require("./use-block-highlighting.cjs");
var import_use_render_cursors = require("./use-render-cursors.cjs");
var import_collaborator_styles = require("./collaborator-styles.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Avatar } = (0, import_lock_unlock.unlock)(import_components.privateApis);
var COLLABORATORS_OVERLAY_STYLES = `
.block-canvas-cover {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 20000;
}
.block-canvas-cover .collaborators-overlay-full {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
.block-canvas-cover .collaborators-overlay-fixed {
	position: fixed;
	width: 100%;
	height: 100%;
}
.collaborators-overlay-user {
	position: absolute;
}
.collaborators-overlay-user-cursor {
	position: absolute;
	width: 2px;
	border-radius: 1px;
	outline: 1px solid #fff;
	box-shadow: ${import_collaborator_styles.ELEVATION_X_SMALL};
	animation: collaborators-overlay-cursor-blink 1s infinite;
}

/* \u2500\u2500 Avatar component (compiled from packages/components/src/avatar/styles.scss) \u2500\u2500 */
.components-avatar {
	display: inline-flex;
	align-items: center;
	border-radius: 9999px;
	overflow: clip;
	flex-shrink: 0;
	background-color: var(--wp-components-color-accent, var(--wp-admin-theme-color, #3858e9));
	box-shadow: 0 0 0 var(--wp-admin-border-width-focus, 2px) #fff, ${import_collaborator_styles.ELEVATION_X_SMALL};
}
.components-avatar__image {
	box-sizing: border-box;
	position: relative;
	width: 32px;
	height: 32px;
	border-radius: 9999px;
	border: 0;
	background-color: var(--wp-components-color-accent, var(--wp-admin-theme-color, #3858e9));
	overflow: clip;
	flex-shrink: 0;
	font-size: 0;
	color: #fff;
}
.is-small > .components-avatar__image {
	width: 24px;
	height: 24px;
}
.has-src > .components-avatar__image {
	background-image: var(--components-avatar-url);
	background-size: cover;
	background-position: center;
}
.has-avatar-border-color > .components-avatar__image {
	border: var(--wp-admin-border-width-focus, 2px) solid var(--components-avatar-outline-color);
	box-shadow: inset 0 0 0 var(--wp-admin-border-width-focus, 2px) #fff;
	background-clip: padding-box;
}
.components-avatar:not(.has-src) > .components-avatar__image {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 11px;
	font-weight: 499;
	border: 0;
	box-shadow: none;
	background-clip: border-box;
}
.components-avatar:not(.has-src).has-avatar-border-color > .components-avatar__image {
	background-color: var(--components-avatar-outline-color);
}
.components-avatar__name {
	font-size: 13px;
	line-height: 20px;
	color: #fff;
	min-width: 0;
	padding-bottom: 2px;
	overflow: hidden;
	opacity: 0;
	white-space: nowrap;
	transition: opacity 0.15s cubic-bezier(0.15, 0, 0.15, 1);
}
.components-avatar.has-badge {
	display: inline-grid;
	grid-template-columns: min-content 0fr;
	column-gap: 0;
	padding-inline-end: 0;
	transition:
		grid-template-columns 0.3s cubic-bezier(0.15, 0, 0.15, 1),
		column-gap 0.3s cubic-bezier(0.15, 0, 0.15, 1),
		padding-inline-end 0.3s cubic-bezier(0.15, 0, 0.15, 1);
}
.components-avatar.has-badge:hover {
	grid-template-columns: min-content 1fr;
	column-gap: 4px;
	padding-inline-end: 8px;
	transition-timing-function: cubic-bezier(0.85, 0, 0.85, 1);
}
.components-avatar.has-badge:hover .components-avatar__name {
	opacity: 1;
	transition-timing-function: cubic-bezier(0.85, 0, 0.85, 1);
}
.components-avatar.has-badge.has-avatar-border-color {
	background-color: var(--components-avatar-outline-color);
}
/* \u2500\u2500 end Avatar \u2500\u2500 */

/* Overlay-specific positioning applied to the Avatar cursor label. */
.collaborators-overlay-user-label.components-avatar {
	position: absolute;
	transform: translate(-11px, -100%);
	margin-top: -4px;
	pointer-events: auto;
	overflow: visible;
	width: max-content;
}

@keyframes collaborators-overlay-cursor-blink {
	0%, 45% { opacity: 1; }
	55%, 95% { opacity: 0; }
	100% { opacity: 1; }
}
.collaborators-overlay-cursor-highlighted .collaborators-overlay-user-cursor {
	animation: collaborators-overlay-cursor-highlight 0.6s ease-in-out 3;
}
.collaborators-overlay-cursor-highlighted .collaborators-overlay-user-label {
	animation: collaborators-overlay-label-highlight 0.6s ease-in-out 3;
}
@keyframes collaborators-overlay-cursor-highlight {
	0%, 100% {
		transform: scale(1);
		filter: drop-shadow(0 0 0 transparent);
	}
	50% {
		transform: scale(1.2);
		filter: drop-shadow(0 0 8px currentColor);
	}
}
@keyframes collaborators-overlay-label-highlight {
	0%, 100% {
		transform: translate(-11px, -100%) scale(1);
		filter: drop-shadow(0 0 0 transparent);
	}
	50% {
		transform: translate(-11px, -100%) scale(1.1);
		filter: drop-shadow(0 0 6px currentColor);
	}
}
.block-editor-block-list__block.is-collaborator-selected:not(:focus)::after {
	content: "";
	position: absolute;
	pointer-events: none;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	outline-color: var(--collaborator-outline-color);
	outline-style: solid;
	outline-width: calc(var(--wp-admin-border-width-focus) / var(--wp-block-editor-iframe-zoom-out-scale, 1));
	outline-offset: calc(-1 * var(--wp-admin-border-width-focus) / var(--wp-block-editor-iframe-zoom-out-scale, 1));
	box-shadow: inset 0 0 0 calc(var(--wp-admin-border-width-focus, 2px) + 1px) #fff, 0 0 0 1px #fff, ${import_collaborator_styles.ELEVATION_X_SMALL};
	z-index: 1;
}
@media (prefers-reduced-motion: reduce) {
	.components-avatar.has-badge,
	.components-avatar__name,
	.collaborators-overlay-user-label,
	.collaborators-overlay-user-cursor {
		transition: none;
		animation: none;
	}
}
`;
function Overlay({
  blockEditorDocument,
  postId,
  postType
}) {
  const [overlayElement, setOverlayElement] = (0, import_element.useState)(null);
  const { cursors, rerenderCursorsAfterDelay } = (0, import_use_render_cursors.useRenderCursors)(
    overlayElement,
    blockEditorDocument ?? null,
    postId ?? null,
    postType ?? null
  );
  const resizeObserverRef = (0, import_compose.useResizeObserver)(rerenderCursorsAfterDelay);
  (0, import_element.useEffect)(rerenderCursorsAfterDelay, [rerenderCursorsAfterDelay]);
  const mergedRef = (0, import_compose.useMergeRefs)([
    setOverlayElement,
    resizeObserverRef
  ]);
  (0, import_use_block_highlighting.useBlockHighlighting)(
    blockEditorDocument ?? null,
    postId ?? null,
    postType ?? null
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "collaborators-overlay-full", ref: mergedRef, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: COLLABORATORS_OVERLAY_STYLES }),
    cursors.map((cursor) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        className: "collaborators-overlay-user",
        style: {
          left: `${cursor.x}px`,
          top: `${cursor.y}px`
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "div",
            {
              className: "collaborators-overlay-user-cursor",
              style: {
                backgroundColor: cursor.color,
                height: `${cursor.height}px`
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Avatar,
            {
              className: "collaborators-overlay-user-label",
              badge: true,
              size: "small",
              src: cursor.avatarUrl,
              name: cursor.userName,
              borderColor: cursor.color
            }
          )
        ]
      },
      cursor.clientId
    ))
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Overlay
});
//# sourceMappingURL=overlay.cjs.map
