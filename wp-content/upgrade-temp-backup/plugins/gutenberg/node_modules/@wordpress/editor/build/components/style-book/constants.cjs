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

// packages/editor/src/components/style-book/constants.ts
var constants_exports = {};
__export(constants_exports, {
  STYLE_BOOK_ALL_BLOCKS_SUBCATEGORIES: () => STYLE_BOOK_ALL_BLOCKS_SUBCATEGORIES,
  STYLE_BOOK_CATEGORIES: () => STYLE_BOOK_CATEGORIES,
  STYLE_BOOK_COLOR_GROUPS: () => STYLE_BOOK_COLOR_GROUPS,
  STYLE_BOOK_IFRAME_STYLES: () => STYLE_BOOK_IFRAME_STYLES,
  STYLE_BOOK_PREVIEW_CATEGORIES: () => STYLE_BOOK_PREVIEW_CATEGORIES,
  STYLE_BOOK_THEME_SUBCATEGORIES: () => STYLE_BOOK_THEME_SUBCATEGORIES
});
module.exports = __toCommonJS(constants_exports);
var import_i18n = require("@wordpress/i18n");
var STYLE_BOOK_COLOR_GROUPS = [
  {
    slug: "theme-colors",
    title: (0, import_i18n.__)("Theme Colors"),
    origin: "theme",
    type: "colors"
  },
  {
    slug: "theme-gradients",
    title: (0, import_i18n.__)("Theme Gradients"),
    origin: "theme",
    type: "gradients"
  },
  {
    slug: "custom-colors",
    title: (0, import_i18n.__)("Custom Colors"),
    origin: "custom",
    type: "colors"
  },
  {
    slug: "custom-gradients",
    title: (0, import_i18n.__)("Custom Gradients"),
    origin: "custom",
    // User.
    type: "gradients"
  },
  {
    slug: "duotones",
    title: (0, import_i18n.__)("Duotones"),
    origin: "theme",
    type: "duotones"
  },
  {
    slug: "default-colors",
    title: (0, import_i18n.__)("Default Colors"),
    origin: "default",
    type: "colors"
  },
  {
    slug: "default-gradients",
    title: (0, import_i18n.__)("Default Gradients"),
    origin: "default",
    type: "gradients"
  }
];
var STYLE_BOOK_THEME_SUBCATEGORIES = [
  {
    slug: "site-identity",
    title: (0, import_i18n.__)("Site Identity"),
    blocks: ["core/site-logo", "core/site-title", "core/site-tagline"]
  },
  {
    slug: "design",
    title: (0, import_i18n.__)("Design"),
    blocks: ["core/navigation", "core/avatar", "core/post-time-to-read"],
    exclude: ["core/home-link", "core/navigation-link"]
  },
  {
    slug: "posts",
    title: (0, import_i18n.__)("Posts"),
    blocks: [
      "core/post-title",
      "core/post-excerpt",
      "core/post-author",
      "core/post-author-name",
      "core/post-author-biography",
      "core/post-date",
      "core/post-terms",
      "core/term-description",
      "core/query-title",
      "core/query-no-results",
      "core/query-pagination",
      "core/query-numbers"
    ]
  },
  {
    slug: "comments",
    title: (0, import_i18n.__)("Comments"),
    blocks: [
      "core/comments-title",
      "core/comments-pagination",
      "core/comments-pagination-numbers",
      "core/comments",
      "core/comments-author-name",
      "core/comment-content",
      "core/comment-date",
      "core/comment-edit-link",
      "core/comment-reply-link",
      "core/comment-template",
      "core/post-comments-count",
      "core/post-comments-link"
    ]
  }
];
var STYLE_BOOK_CATEGORIES = [
  {
    slug: "overview",
    title: (0, import_i18n.__)("Overview"),
    blocks: []
  },
  {
    slug: "text",
    title: (0, import_i18n.__)("Text"),
    blocks: [
      "core/post-content",
      "core/home-link",
      "core/navigation-link"
    ]
  },
  {
    slug: "colors",
    title: (0, import_i18n.__)("Colors"),
    blocks: []
  },
  {
    slug: "theme",
    title: (0, import_i18n.__)("Theme"),
    subcategories: STYLE_BOOK_THEME_SUBCATEGORIES
  },
  {
    slug: "media",
    title: (0, import_i18n.__)("Media"),
    blocks: ["core/post-featured-image"]
  },
  {
    slug: "widgets",
    title: (0, import_i18n.__)("Widgets"),
    blocks: []
  },
  {
    slug: "embed",
    title: (0, import_i18n.__)("Embeds"),
    include: []
  }
];
var STYLE_BOOK_ALL_BLOCKS_SUBCATEGORIES = [
  ...STYLE_BOOK_THEME_SUBCATEGORIES,
  {
    slug: "media",
    title: (0, import_i18n.__)("Media"),
    blocks: ["core/post-featured-image"]
  },
  {
    slug: "widgets",
    title: (0, import_i18n.__)("Widgets"),
    blocks: []
  },
  {
    slug: "embed",
    title: (0, import_i18n.__)("Embeds"),
    include: []
  }
];
var STYLE_BOOK_PREVIEW_CATEGORIES = [
  {
    slug: "overview",
    title: (0, import_i18n.__)("Overview"),
    blocks: []
  },
  {
    slug: "text",
    title: (0, import_i18n.__)("Text"),
    blocks: [
      "core/post-content",
      "core/home-link",
      "core/navigation-link"
    ]
  },
  {
    slug: "colors",
    title: (0, import_i18n.__)("Colors"),
    blocks: []
  },
  {
    slug: "blocks",
    title: (0, import_i18n.__)("All Blocks"),
    blocks: [],
    subcategories: STYLE_BOOK_ALL_BLOCKS_SUBCATEGORIES
  }
];
var ROOT_CONTAINER = `
	.is-root-container {
		display: flow-root;
	}
`;
var STYLE_BOOK_IFRAME_STYLES = `
	body {
		position: relative;
		padding: 32px !important;
	}

	${ROOT_CONTAINER}

	.editor-style-book__examples {
		max-width: 1200px;
		margin: 0 auto;
	}

	.editor-style-book__example {
	    max-width: 900px;
		border-radius: 2px;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 40px;
		padding: 16px;
		width: 100%;
		box-sizing: border-box;
		scroll-margin-top: 32px;
		scroll-margin-bottom: 32px;
		margin: 0 auto 40px auto;
	}

	.editor-style-book__example.is-selected {
		box-shadow: 0 0 0 1px var(--wp-components-color-accent, var(--wp-admin-theme-color, #007cba));
	}

	.editor-style-book__example.is-disabled-example {
		pointer-events: none;
	}

	.editor-style-book__example:focus:not(:disabled) {
		box-shadow: 0 0 0 var(--wp-admin-border-width-focus) var(--wp-components-color-accent, var(--wp-admin-theme-color, #007cba));
		outline: 3px solid transparent;
	}

	.editor-style-book__duotone-example > div:first-child {
		display: flex;
		aspect-ratio: 16 / 9;
		grid-row: span 1;
		grid-column: span 2;
	}
	.editor-style-book__duotone-example img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.editor-style-book__duotone-example > div:not(:first-child) {
		height: 20px;
		border: 1px solid color-mix( in srgb, currentColor 10%, transparent );
	}

	.editor-style-book__color-example {
		border: 1px solid color-mix( in srgb, currentColor 10%, transparent );
	}

	.editor-style-book__subcategory-title,
	.editor-style-book__example-title {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
		font-size: 13px;
		font-weight: normal;
		line-height: normal;
		margin: 0;
		text-align: left;
		padding-top: 8px;
		border-top: 1px solid color-mix( in srgb, currentColor 10%, transparent );
		color: color-mix( in srgb, currentColor 60%, transparent );
	}

	.editor-style-book__subcategory-title {
		font-size: 16px;
		margin-bottom: 40px;
    	padding-bottom: 8px;
	}

	.editor-style-book__example-preview {
		width: 100%;
	}

	.editor-style-book__example-preview .block-editor-block-list__insertion-point,
	.editor-style-book__example-preview .block-list-appender {
		display: none;
	}
	:where(.is-root-container > .wp-block:first-child) {
		margin-top: 0;
	}
	:where(.is-root-container > .wp-block:last-child) {
		margin-bottom: 0;
	}
`;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  STYLE_BOOK_ALL_BLOCKS_SUBCATEGORIES,
  STYLE_BOOK_CATEGORIES,
  STYLE_BOOK_COLOR_GROUPS,
  STYLE_BOOK_IFRAME_STYLES,
  STYLE_BOOK_PREVIEW_CATEGORIES,
  STYLE_BOOK_THEME_SUBCATEGORIES
});
//# sourceMappingURL=constants.cjs.map
