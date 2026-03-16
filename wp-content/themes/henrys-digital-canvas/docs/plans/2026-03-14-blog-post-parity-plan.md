# Blog Post Parity Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the WordPress `blog-post` block to parity with the React `BlogPost.tsx` page, especially for first-paint post lookup, loading and missing-post state UI, and HTML-backed code blocks.

**Architecture:** Keep the PHP render file thin and reuse the existing `blog-index` inline-fallback pattern so the block can render placeholder blog data immediately and then revalidate in `view.js`. Converge markdown fences and HTML `pre > code` nodes onto one code-block shell and one enhancement pass so jump-nav parsing, code highlighting, language labels, and copy feedback stay consistent without adding a build step.

**Tech Stack:** WordPress block PHP, `wp.element`, vanilla JS, vanilla CSS, Playwright smoke tests, `node -c`, `php -l`, WP-CLI

**Context:** Execute this in a dedicated worktree. During implementation, use `@wp-block-development` for block structure, `@wpds` for token-aligned UI decisions, `@smoke-test` for smoke validation, and `@cache-flush` after verification.

---

## File Structure

- Modify: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/render.php`
  - Responsibility: server-side wrapper, `data-config`, inline fallback payload, and the initial loading shell.
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/view.js`
  - Responsibility: config parsing, placeholder-first data lookup, loading and missing-post gating, markdown parsing, HTML code-block upgrades, copy feedback, and fallback alt text.
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/style.css`
  - Responsibility: state-card presentation, unified code-block toolbar and scroll shell, copy success/error states, and any new loading visuals.
- Modify: `wp-content/themes/henrys-digital-canvas/scripts/playwright/browser-smoke.spec.cjs`
  - Responsibility: browser regression coverage for missing-post state cards and HTML-backed code-block enhancement.
- Check only: `wp-content/themes/henrys-digital-canvas/data/blog-posts-fallback.json`
  - Responsibility: fallback dataset that should be embedded inline and used for placeholder hydration.
- Reference only: `/home/azureuser/henry-s-digital-canvas/src/pages/BlogPost.tsx`
  - Responsibility: React source of truth for lookup semantics, section extraction, code-block UI, and copy feedback behavior.

**Known-good slugs for verification:**

- HTML article with multiple code blocks: `github-copilot-cli-a-practical-guide-to-using-copilot-in-your-terminal`
- HTML article with section headings and no code-block edge cases: `clarity-is-a-technical-skill`
- Missing-post route for explicit state testing: `this-slug-should-not-exist`

**Browser smoke prerequisite:** before any Playwright command in this plan, point `BASE_URL` at the dedicated worktree URL instead of relying on the script default.

```bash
: "${BASE_URL:?Set BASE_URL to the dedicated worktree URL before running browser smoke commands}"
```

## Chunk 1: First Paint and State Parity

### Task 1: Add a failing browser regression for the missing-post state card

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/scripts/playwright/browser-smoke.spec.cjs`
- Test: `wp-content/themes/henrys-digital-canvas/scripts/playwright/browser-smoke.spec.cjs`

- [ ] **Step 1: Add explicit blog-post smoke constants near the top of the spec**

```js
const BLOG_CODE_SLUG = process.env.BLOG_CODE_SLUG || 'github-copilot-cli-a-practical-guide-to-using-copilot-in-your-terminal';
const BLOG_MISSING_SLUG = process.env.BLOG_MISSING_SLUG || 'this-slug-should-not-exist';
```

- [ ] **Step 2: Add a focused failing test for the missing-post state card**

```js
test('blog detail missing-post route renders the enhanced state card', async ({ page }) => {
	await page.goto(`/blog/${ BLOG_MISSING_SLUG }/`, { waitUntil: 'networkidle' });

	await expect(page.locator('.hdc-blog-post__state-card')).toHaveCount(1, { timeout: 10000 });
	await expect(page.getByRole('heading', { level: 2, name: 'Post not found' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Back to Blog' })).toBeVisible();
});
```

- [ ] **Step 3: Run the new test and confirm it fails before any block changes**

Run:

```bash
cd wp-content/themes/henrys-digital-canvas && : "${BASE_URL:?Set BASE_URL to the dedicated worktree URL}" && ./scripts/browser_smoke.sh --grep "missing-post route renders the enhanced state card"
```

Expected: FAIL because `.hdc-blog-post__state-card` does not exist yet.

### Task 2: Wire inline fallback payloads into the block and preserve placeholder data while fetching

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/render.php`
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/view.js`
- Test: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/render.php`
- Test: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/view.js`

- [ ] **Step 1: Add inline fallback payload support in `render.php`, matching the `blog-index` pattern**

Insert the same fallback-file read used by `blocks/blog-index/render.php`, then attach it to the block wrapper.

```php
$inline_fallback_path = get_theme_file_path( 'data/blog-posts-fallback.json' );
$inline_fallback_json = '';
if ( file_exists( $inline_fallback_path ) && is_readable( $inline_fallback_path ) ) {
	$inline_fallback_contents = file_get_contents( $inline_fallback_path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( false !== $inline_fallback_contents ) {
		$inline_fallback_json = (string) $inline_fallback_contents;
	}
}
```

Then change the opening `<section>` tag so it includes `data-fallback-payload` when present.

```php
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> data-config="<?php echo esc_attr( wp_json_encode( $config ) ); ?>"<?php if ( '' !== $inline_fallback_json ) : ?> data-fallback-payload="<?php echo esc_attr( $inline_fallback_json ); ?>"<?php endif; ?>>
```

- [ ] **Step 2: Add a JSON-attribute helper and parse the fallback payload in `view.js`**

Add a helper above `parseConfig()` so the block can parse both `data-config` and `data-fallback-payload` safely.

```js
function parseJsonAttribute( section, attributeName ) {
	try {
		const raw = section.getAttribute( attributeName );
		return raw ? JSON.parse( raw ) : null;
	} catch ( error ) {
		return null;
	}
}
```

Then rewrite `parseConfig()` to include:

```js
return {
	slug: ensureString( parsed.slug, '' ),
	showProgress: !! parsed.showProgress,
	showScrollTop: !! parsed.showScrollTop,
	endpointBase: ensureString( parsed.endpointBase, '' ),
	postsEndpoint: ensureString( parsed.postsEndpoint, '' ),
	fallbackUrl: ensureString( parsed.fallbackUrl, '' ),
	blogIndexUrl: ensureString( parsed.blogIndexUrl, '/blog/' ),
	inlineFallback: parseJsonAttribute( section, 'data-fallback-payload' ),
};
```

- [ ] **Step 3: Add explicit initial-state helpers in `view.js` so the block can start from inline posts**

Add these helpers above `BlogPostApp()`.

```js
function getInlineFallbackPosts( config ) {
	if ( ! config || ! config.inlineFallback ) {
		return [];
	}

	return normalizePosts( resolveBlogPayload( config.inlineFallback ) );
}

function getInitialPostFromPosts( posts, slug ) {
	return ensureArray( posts ).find( function ( item ) {
		return item.slug === slug;
	} ) || null;
}
```

- [ ] **Step 4: Replace the current `loading/post/posts` boot state with placeholder-aware lookup state**

Initialize `BlogPostApp()` state from inline fallback data instead of always starting empty.

```js
const initialSlug = inferSlugFromLocation( config.slug );
const initialPosts = getInlineFallbackPosts( config );
const initialPost = getInitialPostFromPosts( initialPosts, initialSlug );

const [ state, setState ] = useState( function () {
	return {
		isFetching: !! initialSlug,
		error: initialSlug ? '' : 'Post not found.',
		post: initialPost,
		posts: initialPosts,
		hasPlaceholderData: initialPosts.length > 0,
	};
} );
```

Keep the existing slug-reset effect dependent on `[ signature ]` only. Add a separate placeholder-reset effect that depends on `[ resolvedSlug, signature ]` and reseeds `post` and `posts` from inline fallback before the network effect runs.

```js
useEffect(
	function () {
		const nextPosts = getInlineFallbackPosts( config );
		const nextPost = getInitialPostFromPosts( nextPosts, resolvedSlug );

		setState( function ( prev ) {
			return {
				isFetching: !! resolvedSlug,
				error: resolvedSlug ? '' : 'Post not found.',
				post: nextPost,
				posts: nextPosts,
				hasPlaceholderData: nextPosts.length > 0,
			};
		} );
	},
	[ resolvedSlug, signature ]
);
```

- [ ] **Step 5: Rewrite the async load effect so placeholder posts stay visible during revalidation**

Replace the current `setState( { loading: true, ... } )` reset with a placeholder-preserving state update. Use this flow:

```js
setState( function ( prev ) {
	const nextPost = getInitialPostFromPosts( initialPosts, resolvedSlug );
	return {
		isFetching: true,
		error: resolvedSlug ? '' : 'Post not found.',
		post: nextPost,
		posts: initialPosts,
		hasPlaceholderData: initialPosts.length > 0,
	};
} );
```

Then keep the fetch order:

1. list endpoint
2. fallback URL if the endpoint fails
3. detail endpoint for the current slug

But do **not** clear a placeholder post while that work is running.

Delete the current early-return branch that stops when `fallbackPosts.length > 0` but the slug is not found in the list payload. The block must still attempt the detail request for `resolvedSlug`, then settle to the missing-post state only if that detail request also fails.

End the effect with a settled state like this:

```js
setState( {
	isFetching: false,
	error: currentPost ? '' : 'Post not found.',
	post: currentPost,
	posts: normalizePosts( relatedSource ),
	hasPlaceholderData: initialPosts.length > 0,
} );
```

- [ ] **Step 6: Add an explicit pending gate that matches the React page semantics**

After computing memoized article data, add:

```js
const isPostLookupPending = ! state.post && state.isFetching;
```

Then replace the current `if ( state.loading )` branch with `if ( isPostLookupPending )`.

- [ ] **Step 7: Run syntax checks before touching UI markup**

Run:

```bash
php -l wp-content/themes/henrys-digital-canvas/blocks/blog-post/render.php
node -c wp-content/themes/henrys-digital-canvas/blocks/blog-post/view.js
```

Expected: `No syntax errors detected` from PHP and no output from `node -c`.

### Task 3: Replace plain loading and error markup with state-card UI and make the missing-post smoke pass

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/render.php`
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/view.js`
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/style.css`
- Test: `wp-content/themes/henrys-digital-canvas/scripts/playwright/browser-smoke.spec.cjs`

- [ ] **Step 1: Add small local state-card render helpers in `view.js`**

Create a reusable shell plus dedicated loading and error variants above `BlogPostApp()`.

```js
function BlogPostStateCard( props ) {
	return h(
		'div',
		{ className: 'hdc-blog-post__state-card' + ( props.className ? ' ' + props.className : '' ) },
		h( 'span', { className: 'hdc-blog-post__state-icon ' + props.iconClass, 'aria-hidden': 'true' }, props.iconText || '' ),
		h( 'h2', { className: 'hdc-blog-post__state-title' }, props.title ),
		props.description ? h( 'p', { className: 'hdc-blog-post__state-description' }, props.description ) : null,
		props.action || null
	);
}

function BlogPostLoadingState() {
	return h( BlogPostStateCard, {
		className: 'is-loading',
		iconClass: 'is-loading',
		title: 'Loading',
		description: 'Please wait while this article is loaded.',
	} );
}

function BlogPostErrorState( props ) {
	return h( BlogPostStateCard, {
		className: 'is-error',
		iconClass: 'is-error',
		iconText: '!',
		title: 'Post not found',
		description: 'This article may have been removed or the URL is incorrect.',
		action: h(
			'a',
			{ className: 'hdc-blog-post__state-action', href: props.blogIndexUrl },
			'Back to Blog'
		),
	} );
}
```

- [ ] **Step 2: Replace both UI branches in `BlogPostApp()` with the new helpers**

Change:

```js
if ( state.loading ) {
	return h( 'p', { className: 'hdc-blog-post__status' }, 'Loading post…' );
}
```

to:

```js
if ( isPostLookupPending ) {
	return h( BlogPostLoadingState );
}
```

And replace the current error branch with:

```js
if ( state.error || ! state.post ) {
	return h( BlogPostErrorState, { blogIndexUrl: config.blogIndexUrl } );
}
```

- [ ] **Step 3: Update the server-rendered loading shell in `render.php` so it matches the client shape**

Replace the current paragraph with:

```php
<div class="hdc-blog-post__state-card is-loading" data-hdc-blog-post-loading>
	<span class="hdc-blog-post__state-icon is-loading" aria-hidden="true"></span>
	<h2 class="hdc-blog-post__state-title"><?php esc_html_e( 'Loading', 'henrys-digital-canvas' ); ?></h2>
	<p class="hdc-blog-post__state-description"><?php esc_html_e( 'Please wait while this article is loaded.', 'henrys-digital-canvas' ); ?></p>
</div>
```

- [ ] **Step 4: Replace the old status and error CSS with token-based state-card styling**

Add this block near the top of `style.css`, then delete the old `.hdc-blog-post__status`, `.hdc-blog-post__error-wrap`, and `.hdc-blog-post__error-title` rules once the new card is working.

```css
.hdc-blog-post__state-card {
	align-items: center;
	background: hsl(var(--card));
	border: 1px solid hsl(var(--border));
	border-radius: var(--radius-surface);
	display: grid;
	gap: 0.75rem;
	justify-items: center;
	padding: 2rem 1.25rem;
	text-align: center;
}

.hdc-blog-post__state-icon {
	align-items: center;
	border-radius: var(--radius-pill);
	display: inline-flex;
	height: 2.75rem;
	justify-content: center;
	width: 2.75rem;
}

.hdc-blog-post__state-icon.is-loading {
	border: 2px solid hsl(var(--border));
	border-top-color: hsl(var(--primary));
	animation: hdc-blog-post-spin 0.8s linear infinite;
}

.hdc-blog-post__state-icon.is-error {
	background: hsl(var(--destructive) / 0.12);
	color: hsl(var(--destructive));
	font-size: 1.25rem;
	font-weight: 700;
	line-height: 1;
}

.hdc-blog-post__state-title {
	color: hsl(var(--foreground));
	font-family: "Playfair Display", Georgia, serif;
	font-size: 1.45rem;
	margin: 0;
}

.hdc-blog-post__state-description {
	color: hsl(var(--text-meta));
	font-size: 0.95rem;
	line-height: 1.65;
	margin: 0;
	max-width: 32rem;
}

.hdc-blog-post__state-action {
	align-items: center;
	border: 1px solid hsl(var(--border));
	border-radius: var(--radius-control);
	color: hsl(var(--foreground));
	display: inline-flex;
	font-size: 0.9rem;
	font-weight: 600;
	min-height: 2.5rem;
	padding: 0.6rem 0.95rem;
	text-decoration: none;
}

@keyframes hdc-blog-post-spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
	.hdc-blog-post__state-icon.is-loading {
		animation: none;
	}
}
```

- [ ] **Step 5: Run the missing-post smoke again and confirm it now passes**

Run:

```bash
cd wp-content/themes/henrys-digital-canvas && : "${BASE_URL:?Set BASE_URL to the dedicated worktree URL}" && ./scripts/browser_smoke.sh --grep "missing-post route renders the enhanced state card"
```

Expected: PASS.

- [ ] **Step 6: Run route and API smoke to confirm the new state shell did not break routing**

Run:

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:route && npm run smoke:api
```

Expected: both smoke suites pass.

- [ ] **Step 7: Commit the working state-parity chunk**

If the human explicitly requested commits in the execution session, stage only the files in this chunk and create a checkpoint commit after the smoke tests pass. Otherwise skip git writes.

## Chunk 2: Shared Code Blocks, Drift Cleanup, and Verification

### Task 4: Add a failing browser regression for HTML-backed code blocks

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/scripts/playwright/browser-smoke.spec.cjs`
- Test: `wp-content/themes/henrys-digital-canvas/scripts/playwright/browser-smoke.spec.cjs`

- [ ] **Step 1: Add a targeted HTML code-block regression test**

```js
test('blog detail enhances HTML code blocks with a toolbar and copy affordance', async ({ page }) => {
	await page.goto(`/blog/${ BLOG_CODE_SLUG }/`, { waitUntil: 'networkidle' });

	await expect
		.poll(async () => page.locator('.hdc-blog-post__code-toolbar').count(), { timeout: 10000 })
		.toBeGreaterThan(0);
	await expect(page.locator('.hdc-blog-post__code-copy').first()).toHaveCount(1);
	await expect(page.locator('.hdc-blog-post__code-language').first()).not.toHaveText('');
});
```

- [ ] **Step 2: Run the code-block test and confirm it fails first**

Run:

```bash
cd wp-content/themes/henrys-digital-canvas && : "${BASE_URL:?Set BASE_URL to the dedicated worktree URL}" && ./scripts/browser_smoke.sh --grep "HTML code blocks with a toolbar and copy affordance"
```

Expected: FAIL because HTML-backed posts still render plain `pre > code` markup.

### Task 5: Refactor markdown parsing so fenced code blocks and jump-nav extraction share one source of truth

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/view.js`
- Test: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/view.js`

- [ ] **Step 1: Replace the raw regex split with an explicit segment parser**

Add a segment parser lifted from the React page and keep the return shape simple.

```js
function parseMarkdownSegments( content ) {
	const segments = [];
	const textBuffer = [];
	const codeBuffer = [];
	let inCodeBlock = false;
	let currentLanguage = null;

	function flushTextBuffer() {
		if ( textBuffer.length === 0 ) {
			return;
		}

		segments.push( {
			type: 'text',
			content: textBuffer.join( '\n' ),
		} );
		textBuffer.length = 0;
	}

	function flushCodeBuffer() {
		segments.push( {
			type: 'code',
			code: codeBuffer.join( '\n' ),
			language: currentLanguage,
		} );
		codeBuffer.length = 0;
	}

	String( content || '' ).split( '\n' ).forEach( function ( line ) {
		if ( line.startsWith( '```' ) ) {
			if ( inCodeBlock ) {
				flushCodeBuffer();
				inCodeBlock = false;
				currentLanguage = null;
			} else {
				flushTextBuffer();
				inCodeBlock = true;
				currentLanguage = normalizeCodeLanguage( line.slice( 3 ) );
			}
			return;
		}

		if ( inCodeBlock ) {
			codeBuffer.push( line );
			return;
		}

		textBuffer.push( line );
	} );

	if ( inCodeBlock ) {
		flushCodeBuffer();
	} else {
		flushTextBuffer();
	}

	return segments;
}
```

- [ ] **Step 2: Rewrite `getMarkdownHeadings()` so it only scans text segments**

Use the segment parser instead of raw line-by-line scanning.

```js
function getMarkdownHeadings( content ) {
	const seen = new Map();
	const headings = [];

	parseMarkdownSegments( content ).forEach( function ( segment ) {
		if ( segment.type !== 'text' ) {
			return;
		}

		segment.content.split( '\n' ).forEach( function ( line ) {
			if ( line.startsWith( '## ' ) ) {
				const label = line.replace( '## ', '' ).trim();
				headings.push( { id: buildHeadingId( label, seen ), label: label, level: 2 } );
				return;
			}

			if ( line.startsWith( '### ' ) ) {
				const label = line.replace( '### ', '' ).trim();
				headings.push( { id: buildHeadingId( label, seen ), label: label, level: 3 } );
			}
		} );
	} );

	return headings;
}
```

- [ ] **Step 3: Update `renderContentWithCode()` to iterate over `parseMarkdownSegments()` output**

This removes the old `split( /(```[\s\S]*?```)/g )` path and gives markdown and heading extraction one shared parser.

- [ ] **Step 4: Keep syntax highlighting aligned with the new language normalization map**

Either expand `highlightCodeElement()` / `buildHighlightRules()` so the normalized values `markup`, `tsx`, `yaml`, `diff`, and `markdown` resolve to valid highlighting behavior, or explicitly remap those normalized values to the closest supported tokenizer before highlighting. Do not leave the new alias map ahead of the highlighter’s capabilities.

- [ ] **Step 5: Syntax-check the parser refactor before touching HTML code blocks**

Run:

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/blog-post/view.js
```

Expected: no output.

### Task 6: Unify markdown and HTML code blocks under one shell, copy behavior, and language-label system

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/view.js`
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/style.css`
- Test: `wp-content/themes/henrys-digital-canvas/scripts/playwright/browser-smoke.spec.cjs`

- [ ] **Step 1: Add React-like language alias and label helpers to `view.js`**

Replace the current narrow alias logic with this pair.

```js
const codeLanguageAliases = {
	bash: 'bash',
	css: 'css',
	diff: 'diff',
	html: 'markup',
	js: 'javascript',
	json: 'json',
	jsx: 'jsx',
	md: 'markdown',
	plaintext: 'text',
	py: 'python',
	sh: 'bash',
	shell: 'bash',
	svg: 'markup',
	text: 'text',
	ts: 'typescript',
	tsx: 'tsx',
	xml: 'markup',
	yaml: 'yaml',
	yml: 'yaml',
	zsh: 'bash',
};

const codeLanguageLabels = {
	bash: 'Bash',
	css: 'CSS',
	diff: 'Diff',
	javascript: 'JS',
	json: 'JSON',
	jsx: 'JSX',
	markdown: 'MD',
	markup: 'HTML',
	python: 'Python',
	text: 'Code',
	typescript: 'TS',
	tsx: 'TSX',
	yaml: 'YAML',
};
```

Add helpers:

```js
function normalizeCodeLanguage( value ) {
	if ( ! value ) {
		return null;
	}

	const normalized = String( value ).trim().toLowerCase().replace( /^language-/, '' ).replace( /^lang-/, '' );
	if ( ! normalized ) {
		return null;
	}

	return codeLanguageAliases[ normalized ] || normalized;
}

function getCodeLanguageLabel( language ) {
	if ( ! language ) {
		return 'Code';
	}

	return codeLanguageLabels[ language ] || language.toUpperCase();
}
```

- [ ] **Step 2: Add copy fallback helpers and a single code-block shell factory**

Create DOM-based helpers that both markdown-rendered and HTML-upgraded code blocks can share.

```js
function copyCodeWithFallback( value ) {
	if ( typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText ) {
		return navigator.clipboard.writeText( value ).then( function () {
			return true;
		} ).catch( function () {
			return false;
		} );
	}

	if ( typeof document === 'undefined' ) {
		return Promise.resolve( false );
	}

	const textarea = document.createElement( 'textarea' );
	textarea.value = value;
	textarea.setAttribute( 'readonly', 'true' );
	textarea.style.position = 'fixed';
	textarea.style.inset = '0';
	textarea.style.opacity = '0';
	textarea.style.pointerEvents = 'none';
	document.body.appendChild( textarea );
	textarea.select();
	textarea.setSelectionRange( 0, value.length );

	try {
		return Promise.resolve( document.execCommand( 'copy' ) );
	} finally {
		textarea.remove();
	}
}
```

Then render markdown code blocks with a single wrapper shape:

```js
function renderCodeBlock( code, language, key ) {
	const normalizedLanguage = normalizeCodeLanguage( language );
	const languageLabel = getCodeLanguageLabel( normalizedLanguage );

	return h(
		'div',
		{ key: key, className: 'hdc-blog-post__code-block', 'data-language': normalizedLanguage || '' },
		h(
			'div',
			{ className: 'hdc-blog-post__code-toolbar' },
			h( 'span', { className: 'hdc-blog-post__code-language' }, languageLabel ),
			h(
				'button',
				{
					type: 'button',
					className: 'hdc-blog-post__code-copy',
					'aria-label': 'Copy code block',
					'data-copy-state': 'idle',
				},
				h( 'span', { className: 'hdc-blog-post__code-copy-text' }, 'Copy' )
			)
		),
		h(
			'div',
			{ className: 'hdc-blog-post__code-scroll' },
			h(
				'pre',
				{ className: 'hdc-blog-post__code' },
				h( 'code', { className: normalizedLanguage ? 'language-' + normalizedLanguage : undefined }, code )
			)
		)
	);
}
```

- [ ] **Step 3: Upgrade HTML `pre > code` nodes before the highlighter runs**

Add a DOM transform that finds raw HTML code blocks inside the rendered article and replaces them with the same shell as markdown code blocks.

```js
function getLanguageFromClassNames( value ) {
	if ( ! value ) {
		return null;
	}

	return value.split( /\s+/ ).reduce( function ( found, className ) {
		if ( found ) {
			return found;
		}

		if ( className.indexOf( 'language-' ) === 0 || className.indexOf( 'lang-' ) === 0 ) {
			return normalizeCodeLanguage( className );
		}

		return null;
	}, null );
}

function upgradeHtmlArticleCodeBlocks( container ) {
	container.querySelectorAll( '.hdc-blog-post__content pre' ).forEach( function ( preEl ) {
		if ( preEl.closest( '.hdc-blog-post__code-block' ) ) {
			return;
		}

		const codeEl = preEl.querySelector( 'code' );
		if ( ! codeEl ) {
			return;
		}

		const language = getLanguageFromClassNames( codeEl.getAttribute( 'class' ) || preEl.getAttribute( 'class' ) || '' );
		const wrapper = document.createElement( 'div' );
		wrapper.innerHTML = '';
		const shell = renderCodeBlockDom( document, codeEl.textContent || '', language );
		preEl.replaceWith( shell );
	} );
}
```

`renderCodeBlockDom()` should build the same class structure as `renderCodeBlock()` above so the browser smoke can assert one shared DOM shape.

- [ ] **Step 4: Replace the current bottom-right copy-button mutation with copy-state wiring on the shared shell**

Break the enhancement rewrite into these sub-steps:

- First, update the enhancement effect so it calls `upgradeHtmlArticleCodeBlocks( container )` before any highlighting work.
- Next, replace the old `.hdc-blog-post__code` query with a `.hdc-blog-post__code-block` query and highlight the nested `code` node in each block.
- Then, attach a click handler to `.hdc-blog-post__code-copy` that calls `copyCodeWithFallback()` with the nested code text.
- After that, set `data-copy-state="success"` or `data-copy-state="error"` and change the button `aria-label` to `Code copied` or `Copy failed`.
- Finally, restore `data-copy-state="idle"` and `aria-label="Copy code block"` after 1800 ms, and remove the old bottom-right button implementation entirely.

Do **not** keep the old bottom-right absolute-position button implementation.

- [ ] **Step 5: Replace the old code-block CSS with a toolbar-first layout**

Delete the old `.hdc-blog-post__code-lang` and bottom-right copy-button positioning rules. Add this structure instead.

```css
.hdc-blog-post__code-block {
	background: hsl(var(--secondary));
	border: 1px solid hsl(var(--border));
	border-radius: var(--radius-control);
	margin: 1rem 0;
	overflow: hidden;
}

.hdc-blog-post__code-toolbar {
	align-items: center;
	border-bottom: 1px solid hsl(var(--border));
	display: flex;
	justify-content: space-between;
	gap: 0.75rem;
	padding: 0.65rem 0.8rem;
}

.hdc-blog-post__code-language {
	color: hsl(var(--text-meta));
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.hdc-blog-post__code-scroll {
	overflow: auto;
}

.hdc-blog-post__code {
	background: transparent;
	border: 0;
	margin: 0;
	padding: 0.9rem 1rem 1rem;
}

.hdc-blog-post__code-copy {
	align-items: center;
	background: hsl(var(--background));
	border: 1px solid hsl(var(--border));
	border-radius: var(--radius-control);
	color: hsl(var(--text-meta));
	cursor: pointer;
	display: inline-flex;
	font-size: 0.78rem;
	font-weight: 600;
	gap: 0.35rem;
	min-height: 2rem;
	padding: 0.35rem 0.7rem;
}

.hdc-blog-post__code-copy[data-copy-state='success'] {
	background: hsl(var(--primary) / 0.1);
	border-color: hsl(var(--primary) / 0.45);
	color: hsl(var(--foreground));
}

.hdc-blog-post__code-copy[data-copy-state='error'] {
	background: hsl(var(--destructive) / 0.1);
	border-color: hsl(var(--destructive) / 0.35);
	color: hsl(var(--destructive));
}
```

Keep the existing token color rules for syntax tokens unless a selector must change.

- [ ] **Step 6: Fix the fallback featured-image alt copy while `view.js` is open**

Change:

```js
return title + ' featured image';
```

to:

```js
return 'Featured image for ' + title;
```

- [ ] **Step 7: Run syntax checks and the targeted browser smoke until it passes**

Run:

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/blog-post/view.js
cd wp-content/themes/henrys-digital-canvas && : "${BASE_URL:?Set BASE_URL to the dedicated worktree URL}" && ./scripts/browser_smoke.sh --grep "HTML code blocks with a toolbar and copy affordance"
```

Expected: no syntax errors, then PASS for the code-block smoke.

- [ ] **Step 8: Commit the code-block parity chunk**

If the human explicitly requested commits in the execution session, stage only the files in this chunk and create a checkpoint commit after the targeted browser smoke passes. Otherwise skip git writes.

### Task 7: Full verification, cache flush, and parity handoff

**Files:**
- Test: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/render.php`
- Test: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/view.js`
- Test: `wp-content/themes/henrys-digital-canvas/blocks/blog-post/style.css`
- Reference: `wp-content/themes/henrys-digital-canvas/docs/plans/2026-03-14-blog-post-parity-design.md`

- [ ] **Step 1: Run route and API smoke from the theme directory**

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:route && npm run smoke:api
```

Expected: both suites pass.

- [ ] **Step 2: Run focused browser smoke for the blog routes**

```bash
cd wp-content/themes/henrys-digital-canvas && : "${BASE_URL:?Set BASE_URL to the dedicated worktree URL}" && ./scripts/browser_smoke.sh --grep "blog"
```

Expected: the blog progress, missing-post state card, and HTML code-block tests pass.

- [ ] **Step 3: Flush caches after the block changes are verified**

```bash
wp --path="/home/hperkins-wp/htdocs/wp.hperkins.com" cache flush
```

Expected: `Success: The cache was flushed.`

- [ ] **Step 4: Do two manual browser checks before closing the task**

1. Load `/blog/github-copilot-cli-a-practical-guide-to-using-copilot-in-your-terminal/` and confirm at least one HTML-backed code block shows the new toolbar, language label, and copy control.
2. Load `/blog/clarity-is-a-technical-skill/` and confirm the article body and jump-nav render without a visible loading flash, and the hero image fallback alt copy reads `Featured image for Clarity Is a Technical Skill` when no explicit alt text exists.

- [ ] **Step 5: Re-run the parity checker on `blog-post`**

Run:

```bash
./codex/scripts/parity-check.sh blog-post
```

Expected: `PARITY` or `MINOR_DRIFT`.

- [ ] **Step 6: Only create a final cleanup commit if verification required a follow-up code change**

Only do a final git commit if the human explicitly requested commits in the execution session and verification required a follow-up code change. Otherwise stop after parity verification and report the clean file set.

- [ ] **Step 7: Purge cache-enabler page cache if the environment exposes it**

After `wp cache flush`, also clear Cache Enabler page cache using the project’s normal admin or operational path before signing off. If there is no CLI hook available in the execution environment, document that this final purge must be completed manually in wp-admin.
