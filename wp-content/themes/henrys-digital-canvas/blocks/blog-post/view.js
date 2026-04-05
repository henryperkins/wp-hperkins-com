( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const useEffect = element.useEffect;
	const useMemo = element.useMemo;
	const useState = element.useState;
	const useRef = element.useRef;
	const createRoot = element.createRoot;
	const legacyRender = element.render;

	const utils = window.hdcSharedUtils || {};
	const renderLucideIcon =
		typeof utils.renderLucideIcon === 'function'
			? utils.renderLucideIcon
			: function () {
				return null;
			};
	const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';
	const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
	const COMMENT_FETCH_PAGE_SIZE = 100;
	const COMMENT_FETCH_MAX_PAGES = 5;
	const COPY_FEEDBACK_DURATION_MS = 1800;
	const PORTFOLIO_ORIGIN = 'https://hperkins.com';

	function ensureString( value, fallback ) {
		if ( typeof value !== 'string' ) {
			return fallback;
		}

		const trimmed = value.trim();
		return trimmed || fallback;
	}

	function ensureArray( value ) {
		return Array.isArray( value ) ? value : [];
	}

	function ensureObject( value ) {
		return value && typeof value === 'object' ? value : {};
	}

	function parseJsonAttribute( section, attributeName ) {
		try {
			const raw = section.getAttribute( attributeName );
			return raw ? JSON.parse( raw ) : null;
		} catch ( error ) {
			return null;
		}
	}

	function parseConfig( section ) {
		const parsed = parseJsonAttribute( section, 'data-config' ) || {};
		const turnstile = ensureObject( parsed.turnstile );

		return {
			slug: ensureString( parsed.slug, '' ),
			showProgress: !! parsed.showProgress,
			showScrollTop: !! parsed.showScrollTop,
			endpointBase: ensureString( parsed.endpointBase, '' ),
			postsEndpoint: ensureString( parsed.postsEndpoint, '' ),
			commentsEndpoint: ensureString( parsed.commentsEndpoint, '' ),
			commentSubmitEndpoint: ensureString( parsed.commentSubmitEndpoint, '' ),
			commentSubmitEnabled: !! parsed.commentSubmitEnabled,
			fallbackUrl: ensureString( parsed.fallbackUrl, '' ),
			blogIndexUrl: ensureString( parsed.blogIndexUrl, '/blog/' ),
			turnstile: {
				action: ensureString( turnstile.action, 'comment' ),
				siteKey: ensureString( turnstile.siteKey, '' ),
				label: ensureString( turnstile.label, 'Verification' ),
				hint: ensureString( turnstile.hint, 'Verification helps protect the thread from spam.' ),
				requiredError: ensureString( turnstile.requiredError, 'Please complete the verification check and try again.' ),
				unavailableError: ensureString( turnstile.unavailableError, 'Verification is unavailable right now. Please use the original WordPress post for now.' ),
				expiredError: ensureString( turnstile.expiredError, 'Verification expired before your comment could be posted. Please try again.' ),
				pendingError: ensureString( turnstile.pendingError, 'Verification is still loading. Please wait a moment and try again.' ),
			},
			inlineFallback: parseJsonAttribute( section, 'data-fallback-payload' ),
		};
	}

	function buildPageMetadataTitle( title ) {
		const normalizedTitle = ensureString( title, '' );
		if ( ! normalizedTitle ) {
			return 'Post Not Found — Henry Perkins';
		}

		return /henry perkins/i.test( normalizedTitle )
			? normalizedTitle
			: normalizedTitle + ' — Henry Perkins';
	}

	function normalizeMetadataLabel( value ) {
		return ensureString( value, '' ).trim().toLowerCase();
	}

	function sanitizeSlug( value ) {
		return String( value || '' )
			.toLowerCase()
			.trim()
			.replace( /[^a-z0-9-]/g, '' );
	}

	function inferSlugFromLocation( explicitSlug ) {
		const cleanedExplicit = sanitizeSlug( explicitSlug );
		if ( cleanedExplicit ) {
			return cleanedExplicit;
		}

		const search = new URLSearchParams( window.location.search );
		const slugFromQuery = sanitizeSlug( search.get( 'slug' ) || '' );
		if ( slugFromQuery ) {
			return slugFromQuery;
		}

		const bodyClassMatch = document.body.className.match( /\bpost-name-([a-z0-9-]+)\b/i );
		if ( bodyClassMatch && bodyClassMatch[1] ) {
			return sanitizeSlug( bodyClassMatch[1] );
		}

		const normalizePathname = utils.normalizePathname
			? utils.normalizePathname
			: function ( value ) {
				const normalized = ensureString( value, '/' ).replace( /\/+$/, '' );
				return normalized || '/';
			};

		const pathname = normalizePathname( window.location.pathname || '/' );
		const segments = pathname.split( '/' ).filter( Boolean );
		const blogIndex = segments.indexOf( 'blog' );

		if ( blogIndex !== -1 && segments[ blogIndex + 1 ] ) {
			return sanitizeSlug( segments[ blogIndex + 1 ] );
		}

		if ( segments.length === 1 && segments[0] !== 'blog' ) {
			return sanitizeSlug( segments[0] );
		}

		return '';
	}

	function parseDateValue( value ) {
		if ( utils.parseDate ) {
			return utils.parseDate( value );
		}

		const parsed = new Date( value || '' );
		return Number.isNaN( parsed.getTime() ) ? new Date( 0 ) : parsed;
	}

	function formatDateLabel( value ) {
		const date = parseDateValue( value );
		if ( Number.isNaN( date.getTime() ) || date.getTime() <= 0 ) {
			return 'Date unavailable';
		}

		return date.toLocaleDateString( undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		} );
	}

	function formatLongDateLabel( value ) {
		const date = parseDateValue( value );
		if ( Number.isNaN( date.getTime() ) || date.getTime() <= 0 ) {
			return 'Date unavailable';
		}

		return date.toLocaleDateString( undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		} );
	}

	function buildPortfolioBlogUrl( slug ) {
		const normalizedSlug = sanitizeSlug( slug );
		if ( ! normalizedSlug ) {
			return PORTFOLIO_ORIGIN;
		}

		return PORTFOLIO_ORIGIN + '/blog/' + normalizedSlug;
	}

	function buildEmailShareUrl( args ) {
		const lines = [ args.description, args.url ].filter( Boolean ).join( '\n\n' );
		return 'mailto:?subject=' + encodeURIComponent( args.title ) + '&body=' + encodeURIComponent( lines );
	}

	function buildLinkedInShareUrl( url ) {
		return 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent( url );
	}

	function hasUpdatedDate( post ) {
		if ( ! post || ! post.modifiedDate ) {
			return false;
		}

		const publishedDate = parseDateValue( post.date );
		const modifiedDate = parseDateValue( post.modifiedDate );

		if ( Number.isNaN( publishedDate.getTime() ) || Number.isNaN( modifiedDate.getTime() ) ) {
			return false;
		}

		return modifiedDate.getTime() > publishedDate.getTime();
	}

	function fetchJson( url ) {
		if ( ! url ) {
			throw new Error( 'Missing URL' );
		}

		return fetch( url, {
			headers: {
				Accept: 'application/json',
			},
		} ).then( function ( response ) {
			if ( ! response.ok ) {
				const error = new Error( 'Request failed with status ' + response.status );
				error.status = response.status;
				throw error;
			}

			return response.json();
		} );
	}

	function isNotFoundError( error ) {
		return !! error && error.status === 404;
	}

	function resolveBlogPayload( payload ) {
		if ( payload && typeof payload === 'object' && Array.isArray( payload.posts ) ) {
			return payload.posts;
		}

		if ( Array.isArray( payload ) ) {
			return payload;
		}

		return [];
	}

	function normalizeRelatedPost( post, index ) {
		if ( ! post || typeof post !== 'object' ) {
			return null;
		}

		const slug = ensureString( post.slug, '' );
		const title = ensureString( post.title, '' );
		if ( ! slug || ! title ) {
			return null;
		}

		return {
			id: post.id ? post.id : null,
			slug: slug,
			title: title,
			excerpt: ensureString( post.excerpt, '' ),
			wordpressPermalink: ensureString( post.wordpressPermalink, '' ),
			featuredImageAlt: ensureString( post.featuredImageAlt, '' ),
			featuredImageUrl: ensureString( post.featuredImageUrl, '' ),
			_key: slug + '-' + String( index ),
		};
	}

	function normalizePost( post, index ) {
		const tags = ensureArray( post && post.tags )
			.map( function ( tag ) {
				return ensureString( String( tag ), '' );
			} )
			.filter( Boolean );
		const contentHtml = ensureString( post && post.contentHtml, '' );
		const content = ensureString( post && post.content, '' );
		const excerpt = ensureString( post && post.excerpt, '' );
		const readingTime = ensureString(
			post && post.readingTime,
			utils.estimateReadingTimeLabel ? utils.estimateReadingTimeLabel( contentHtml || content || excerpt ) : '1 min read'
		);
		const categories = ensureArray( post && post.categories )
			.map( function ( category ) {
				return ensureString( String( category ), '' );
			} )
			.filter( Boolean );
		const relatedPosts = ensureArray( post && post.relatedPosts )
			.map( normalizeRelatedPost )
			.filter( Boolean );

		return {
			id: post && post.id ? post.id : 0,
			slug: ensureString( post && post.slug, 'post-' + String( index + 1 ) ),
			title: ensureString( post && post.title, 'Untitled Post' ),
			excerpt: excerpt,
			date: ensureString( post && post.date, '' ),
			modifiedDate: ensureString( post && post.modifiedDate, '' ),
			tags: tags.length ? tags : [ 'General' ],
			categories: categories,
			readingTime: readingTime,
			content: content,
			contentHtml: contentHtml,
			url: ensureString( post && post.url, '' ),
			authorName: ensureString( post && post.authorName, '' ),
			authorUrl: ensureString( post && post.authorUrl, '' ),
			wordpressPermalink: ensureString( post && post.wordpressPermalink, '' ),
			commentsOpen: !! ( post && post.commentsOpen ),
			discussionUrl: ensureString( post && post.discussionUrl, '' ),
			seoTitle: ensureString( post && post.seoTitle, '' ),
			seoDescription: ensureString( post && post.seoDescription, '' ),
			shareMessage: ensureString( post && post.shareMessage, '' ),
			featuredImageUrl: ensureString( post && post.featuredImageUrl, '' ),
			featuredImageAlt: ensureString( post && post.featuredImageAlt, '' ),
			featuredImageSrcSet: ensureString( post && post.featuredImageSrcSet, '' ),
			relatedPosts: relatedPosts,
		};
	}

	function normalizePosts( posts ) {
		return ensureArray( posts )
			.map( normalizePost )
			.sort( function ( left, right ) {
				return parseDateValue( right.date ).getTime() - parseDateValue( left.date ).getTime();
			} );
	}

	function buildImageAlt( post ) {
		const explicitAlt = ensureString( post && post.featuredImageAlt, '' );
		if ( explicitAlt ) {
			return explicitAlt;
		}

		const title = ensureString( post && post.title, 'Blog post' );
		return 'Featured image for ' + title;
	}

	function slugifyHeading( value ) {
		return String( value || '' )
			.trim()
			.toLowerCase()
			.replace( /[^a-z0-9]+/g, '-' )
			.replace( /^-+|-+$/g, '' );
	}

	function buildHeadingId( label, seen ) {
		const base = slugifyHeading( label ) || 'section';
		const count = seen.get( base ) || 0;
		seen.set( base, count + 1 );
		return count === 0 ? 'blog-' + base : 'blog-' + base + '-' + String( count + 1 );
	}

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

	function normalizeCodeLanguage( value ) {
		if ( ! value ) {
			return null;
		}

		const normalized = String( value )
			.trim()
			.toLowerCase()
			.replace( /^language-/, '' )
			.replace( /^lang-/, '' );

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
					headings.push( {
						id: buildHeadingId( label, seen ),
						label: label,
						level: 2,
					} );
					return;
				}

				if ( line.startsWith( '### ' ) ) {
					const label = line.replace( '### ', '' ).trim();
					headings.push( {
						id: buildHeadingId( label, seen ),
						label: label,
						level: 3,
					} );
				}
			} );
		} );

		return headings;
	}

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

	function enhanceHtmlContent( contentHtml ) {
		const html = ensureString( contentHtml, '' );
		if ( ! html || typeof DOMParser === 'undefined' ) {
			return {
				contentHtml: html,
				sectionItems: [],
			};
		}

		const seen = new Map();
		const parsedDocument = new DOMParser().parseFromString( html, 'text/html' );
		const sectionItems = [];

		parsedDocument.querySelectorAll( 'h2, h3' ).forEach( function ( heading ) {
			const label = ensureString( heading.textContent, '' );
			if ( ! label ) {
				return;
			}

			const existingId = ensureString( heading.getAttribute( 'id' ), '' );
			const id = existingId || buildHeadingId( label, seen );
			if ( ! existingId ) {
				heading.setAttribute( 'id', id );
			}

			heading.classList.add( 'hdc-blog-post__heading-anchor' );
			if ( heading.tagName === 'H3' ) {
				heading.classList.add( 'hdc-blog-post__subheading' );
				return;
			}

			sectionItems.push( {
				href: '#' + id,
				label: label,
			} );
		} );

		return {
			contentHtml: parsedDocument.body.innerHTML,
			sectionItems: sectionItems,
		};
	}

	function renderInline( text, keyPrefix ) {
		const parts = String( text || '' ).split( /(\*\*[^*]+\*\*|`[^`]+`)/g );
		return parts.filter( Boolean ).map( function ( part, index ) {
			if ( part.startsWith( '**' ) && part.endsWith( '**' ) ) {
				return h( 'strong', { key: keyPrefix + '-strong-' + String( index ) }, part.slice( 2, -2 ) );
			}

			if ( part.startsWith( '`' ) && part.endsWith( '`' ) ) {
				return h( 'code', { key: keyPrefix + '-code-' + String( index ) }, part.slice( 1, -1 ) );
			}

			return part;
		} );
	}

	function renderMarkdownBlock( content, keyPrefix, headingQueue ) {
		const lines = String( content || '' ).split( '\n' );
		const elements = [];
		let i = 0;

		while ( i < lines.length ) {
			const line = lines[i];

			if ( line.startsWith( '## ' ) ) {
				const label = line.replace( '## ', '' ).trim();
				const heading = headingQueue.shift();
				elements.push(
					h(
						'h2',
						{
							key: keyPrefix + '-h2-' + String( i ),
							id: heading ? heading.id : undefined,
							className: 'hdc-blog-post__heading-anchor',
						},
						label
					)
				);
				i++;
				continue;
			}

			if ( line.startsWith( '### ' ) ) {
				const label = line.replace( '### ', '' ).trim();
				const heading = headingQueue.shift();
				elements.push(
					h(
						'h3',
						{
							key: keyPrefix + '-h3-' + String( i ),
							id: heading ? heading.id : undefined,
							className: 'hdc-blog-post__heading-anchor hdc-blog-post__subheading',
						},
						label
					)
				);
				i++;
				continue;
			}

			if ( line.startsWith( '> ' ) ) {
				elements.push( h( 'blockquote', { key: keyPrefix + '-quote-' + String( i ) }, renderInline( line.replace( '> ', '' ), keyPrefix + '-quote-inline-' + String( i ) ) ) );
				i++;
				continue;
			}

			if ( line.startsWith( '- ' ) || /^\d+\.\s/.test( line ) ) {
				const ordered = /^\d+\.\s/.test( line );
				const items = [];
				let j = i;
				while ( j < lines.length && ( lines[j].startsWith( '- ' ) || /^\d+\.\s/.test( lines[j] ) ) ) {
					const text = lines[j].replace( /^[-]\s/, '' ).replace( /^\d+\.\s*/, '' );
					items.push( h( 'li', { key: keyPrefix + '-li-' + String( j ) }, renderInline( text, keyPrefix + '-li-inline-' + String( j ) ) ) );
					j++;
				}

				elements.push(
					h(
						ordered ? 'ol' : 'ul',
						{ key: keyPrefix + ( ordered ? '-ol-' : '-ul-' ) + String( i ) },
						items
					)
				);
				i = j;
				continue;
			}

			if ( line.trim() === '' ) {
				elements.push( h( 'br', { key: keyPrefix + '-br-' + String( i ), 'aria-hidden': 'true' } ) );
				i++;
				continue;
			}

			elements.push( h( 'p', { key: keyPrefix + '-p-' + String( i ) }, renderInline( line, keyPrefix + '-p-inline-' + String( i ) ) ) );
			i++;
		}

		return elements;
	}

	function renderContentWithCode( content, headings ) {
		const blocks = parseMarkdownSegments( content );
		const headingQueue = ensureArray( headings ).slice();
		return blocks.filter( Boolean ).map( function ( block, index ) {
			if ( block.type === 'code' ) {
				return renderCodeBlock( block.code, block.language, 'code-' + String( index ) );
			}

			return h(
				'div',
				{ key: 'text-' + String( index ) },
				renderMarkdownBlock( block.content, 'block-' + String( index ), headingQueue )
			);
		} );
	}

	/* ------------------------------------------------------------------ */
	/*  Lightweight syntax highlighter                                     */
	/* ------------------------------------------------------------------ */

	function escapeHtml( str ) {
		return String( str )
			.replace( /&/g, '&amp;' )
			.replace( /</g, '&lt;' )
			.replace( />/g, '&gt;' )
			.replace( /"/g, '&quot;' );
	}

	function normalizeLang( lang ) {
		var key = normalizeCodeLanguage( lang );
		var aliases = {
			jsx: 'javascript',
			typescript: 'javascript',
			tsx: 'javascript',
			markup: 'javascript',
			yaml: 'bash',
			diff: 'bash',
			markdown: 'bash',
		};
		return aliases[ key ] || key;
	}

	function buildHighlightRules( lang ) {
		var jsKeywords = 'async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|if|import|in|instanceof|let|new|null|of|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield|true|false';
		var pyKeywords = 'and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|True|False|None|self|print';
		var bashKeywords = 'if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|echo|export|source|alias|local|readonly|declare|set|unset|shift|trap|eval|exec|test';
		var cssAtRules = '@media|@keyframes|@import|@font-face|@supports|@layer|@container|@property';

		var commonRules = [
			{ type: 'comment', pattern: /\/\/[^\n]*/y },
			{ type: 'comment', pattern: /\/\*[\s\S]*?\*\//y },
			{ type: 'string', pattern: /"(?:[^"\\]|\\.)*"/y },
			{ type: 'string', pattern: /'(?:[^'\\]|\\.)*'/y },
			{ type: 'string', pattern: /`(?:[^`\\]|\\.)*`/y },
			{ type: 'number', pattern: /\b(?:0[xXoObB][\da-fA-F_]+|\d+\.?\d*(?:[eE][+-]?\d+)?)\b/y },
		];

		if ( lang === 'javascript' ) {
			return commonRules.concat( [
				{ type: 'keyword', pattern: new RegExp( '\\b(?:' + jsKeywords + ')\\b', 'y' ) },
				{ type: 'function', pattern: /\b[a-zA-Z_$]\w*(?=\s*\()/y },
				{ type: 'operator', pattern: /=>|\.{3}|[!=<>]=?=?|[+\-*/%&|^~!?:]+/y },
				{ type: 'punctuation', pattern: /[{}[\]();,.]/y },
			] );
		}

		if ( lang === 'python' ) {
			return [
				{ type: 'comment', pattern: /#[^\n]*/y },
				{ type: 'string', pattern: /"""[\s\S]*?"""/y },
				{ type: 'string', pattern: /'''[\s\S]*?'''/y },
				{ type: 'string', pattern: /f?"(?:[^"\\]|\\.)*"/y },
				{ type: 'string', pattern: /f?'(?:[^'\\]|\\.)*'/y },
				{ type: 'number', pattern: /\b(?:0[xXoObB][\da-fA-F_]+|\d+\.?\d*(?:[eE][+-]?\d+)?)\b/y },
				{ type: 'keyword', pattern: new RegExp( '\\b(?:' + pyKeywords + ')\\b', 'y' ) },
				{ type: 'decorator', pattern: /@\w+/y },
				{ type: 'function', pattern: /\b[a-zA-Z_]\w*(?=\s*\()/y },
				{ type: 'operator', pattern: /[!=<>]=?|[+\-*/%&|^~:]+|\*\*/y },
				{ type: 'punctuation', pattern: /[{}[\]();,.]/y },
			];
		}

		if ( lang === 'css' ) {
			return [
				{ type: 'comment', pattern: /\/\*[\s\S]*?\*\//y },
				{ type: 'keyword', pattern: new RegExp( '(?:' + cssAtRules + ')\\b', 'y' ) },
				{ type: 'string', pattern: /"(?:[^"\\]|\\.)*"/y },
				{ type: 'string', pattern: /'(?:[^'\\]|\\.)*'/y },
				{ type: 'number', pattern: /\b\d+\.?\d*(?:%|px|em|rem|vh|vw|fr|s|ms|deg|ch|ex)?\b/y },
				{ type: 'function', pattern: /\b[a-zA-Z-]+(?=\()/y },
				{ type: 'property', pattern: /[a-zA-Z-]+(?=\s*:)/y },
				{ type: 'punctuation', pattern: /[{}();:,]/y },
			];
		}

		if ( lang === 'json' ) {
			return [
				{ type: 'property', pattern: /"(?:[^"\\]|\\.)*"(?=\s*:)/y },
				{ type: 'string', pattern: /"(?:[^"\\]|\\.)*"/y },
				{ type: 'keyword', pattern: /\b(?:true|false|null)\b/y },
				{ type: 'number', pattern: /\b\d+\.?\d*(?:[eE][+-]?\d+)?\b/y },
				{ type: 'punctuation', pattern: /[{}[\]:,]/y },
			];
		}

		if ( lang === 'bash' ) {
			return [
				{ type: 'comment', pattern: /#[^\n]*/y },
				{ type: 'string', pattern: /"(?:[^"\\]|\\.)*"/y },
				{ type: 'string', pattern: /'[^']*'/y },
				{ type: 'variable', pattern: /\$\{?[a-zA-Z_]\w*\}?/y },
				{ type: 'keyword', pattern: new RegExp( '\\b(?:' + bashKeywords + ')\\b', 'y' ) },
				{ type: 'number', pattern: /\b\d+\b/y },
				{ type: 'operator', pattern: /[|&;><]+|&&|\|\|/y },
				{ type: 'punctuation', pattern: /[{}[\]()]/y },
			];
		}

		// Generic fallback
		return commonRules.concat( [
			{ type: 'keyword', pattern: new RegExp( '\\b(?:' + jsKeywords + ')\\b', 'y' ) },
			{ type: 'function', pattern: /\b[a-zA-Z_$]\w*(?=\s*\()/y },
			{ type: 'operator', pattern: /[!=<>]=?=?|[+\-*/%&|^~!?:]+|=>/y },
			{ type: 'punctuation', pattern: /[{}[\]();,.]/y },
		] );
	}

	function tokenize( code, rules ) {
		var tokens = [];
		var pos = 0;
		var len = code.length;

		while ( pos < len ) {
			var bestMatch = null;
			var bestType = '';

			for ( var r = 0; r < rules.length; r++ ) {
				rules[ r ].pattern.lastIndex = pos;
				var m = rules[ r ].pattern.exec( code );
				if ( m && m.index === pos && m[0].length > 0 ) {
					if ( ! bestMatch || m[0].length > bestMatch[0].length ) {
						bestMatch = m;
						bestType = rules[ r ].type;
					}
				}
			}

			if ( bestMatch ) {
				tokens.push( { type: bestType, text: bestMatch[0] } );
				pos += bestMatch[0].length;
			} else {
				var end = pos + 1;
				while ( end < len ) {
					var found = false;
					for ( var r2 = 0; r2 < rules.length; r2++ ) {
						rules[ r2 ].pattern.lastIndex = end;
						var m2 = rules[ r2 ].pattern.exec( code );
						if ( m2 && m2.index === end && m2[0].length > 0 ) {
							found = true;
							break;
						}
					}
					if ( found ) {
						break;
					}
					end++;
				}
				tokens.push( { type: 'plain', text: code.slice( pos, end ) } );
				pos = end;
			}
		}

		return tokens;
	}

	function highlightCodeElement( codeEl, lang ) {
		var text = codeEl.textContent || '';
		if ( ! text.trim() ) {
			return;
		}

		var langKey = normalizeLang( lang );
		if ( ! langKey ) {
			return;
		}

		var rules = buildHighlightRules( langKey );
		var tokens = tokenize( text, rules );
		var html = tokens.map( function ( t ) {
			var escaped = escapeHtml( t.text );
			if ( t.type === 'plain' ) {
				return escaped;
			}
			return '<span class="hdc-token-' + t.type + '">' + escaped + '</span>';
		} ).join( '' );

		codeEl.innerHTML = html;
	}

	/* ------------------------------------------------------------------ */
	/*  Code block shell + copy enhancement                                */
	/* ------------------------------------------------------------------ */

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
					h( 'span', { className: 'hdc-blog-post__code-copy-icon', 'aria-hidden': 'true' }, renderLucideIcon( h, 'copy', { size: 14 } ) ),
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

	function renderCodeBlockDom( doc, code, language ) {
		const normalizedLanguage = normalizeCodeLanguage( language );
		const wrapper = doc.createElement( 'div' );
		wrapper.className = 'hdc-blog-post__code-block';
		wrapper.setAttribute( 'data-language', normalizedLanguage || '' );

		const toolbar = doc.createElement( 'div' );
		toolbar.className = 'hdc-blog-post__code-toolbar';

		const languageEl = doc.createElement( 'span' );
		languageEl.className = 'hdc-blog-post__code-language';
		languageEl.textContent = getCodeLanguageLabel( normalizedLanguage );

		const button = doc.createElement( 'button' );
		button.type = 'button';
		button.className = 'hdc-blog-post__code-copy';
		button.setAttribute( 'aria-label', 'Copy code block' );
		button.setAttribute( 'data-copy-state', 'idle' );

		const buttonIcon = doc.createElement( 'span' );
		buttonIcon.className = 'hdc-blog-post__code-copy-icon';
		buttonIcon.setAttribute( 'aria-hidden', 'true' );
		buttonIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';

		const buttonText = doc.createElement( 'span' );
		buttonText.className = 'hdc-blog-post__code-copy-text';
		buttonText.textContent = 'Copy';

		button.appendChild( buttonIcon );
		button.appendChild( buttonText );
		toolbar.appendChild( languageEl );
		toolbar.appendChild( button );

		const scroll = doc.createElement( 'div' );
		scroll.className = 'hdc-blog-post__code-scroll';

		const pre = doc.createElement( 'pre' );
		pre.className = 'hdc-blog-post__code';

		const codeEl = doc.createElement( 'code' );
		if ( normalizedLanguage ) {
			codeEl.className = 'language-' + normalizedLanguage;
		}
		codeEl.textContent = code;

		pre.appendChild( codeEl );
		scroll.appendChild( pre );
		wrapper.appendChild( toolbar );
		wrapper.appendChild( scroll );

		return wrapper;
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
			const shell = renderCodeBlockDom( document, codeEl.textContent || '', language );
			preEl.replaceWith( shell );
		} );
	}

	function sanitizeCommentHtml( value ) {
		const html = ensureString( value, '' );
		if ( ! html ) {
			return '';
		}

		if ( typeof DOMParser === 'undefined' ) {
			return html
				.replace( /<script[\s\S]*?>[\s\S]*?<\/script>/gi, '' )
				.replace( /<style[\s\S]*?>[\s\S]*?<\/style>/gi, '' )
				.replace( /<(iframe|object|embed|link|meta|base|form|input|button|textarea|select|option)[^>]*\/?>/gi, '' );
		}

		const parsed = new DOMParser().parseFromString( html, 'text/html' );
		parsed.querySelectorAll( 'script, style, iframe, object, embed, link, meta, base, form, input, button, textarea, select, option' ).forEach( function ( node ) {
			node.remove();
		} );

		parsed.querySelectorAll( '*' ).forEach( function ( node ) {
			Array.from( node.attributes ).forEach( function ( attribute ) {
				if ( /^on/i.test( attribute.name ) || 'style' === attribute.name || 'srcdoc' === attribute.name ) {
					node.removeAttribute( attribute.name );
					return;
				}

				if ( ( 'href' === attribute.name || 'src' === attribute.name ) && /^\s*javascript:/i.test( attribute.value ) ) {
					node.setAttribute( attribute.name, '#' );
				}
			} );
		} );

		return parsed.body.innerHTML;
	}

	function htmlToText( value ) {
		const html = ensureString( value, '' );
		if ( ! html ) {
			return '';
		}

		if ( typeof document === 'undefined' ) {
			return html.replace( /<[^>]*>/g, ' ' ).replace( /\s+/g, ' ' ).trim();
		}

		const container = document.createElement( 'div' );
		container.innerHTML = html;
		return ( container.textContent || '' ).replace( /\s+/g, ' ' ).trim();
	}

	function toOptionalText( value ) {
		const normalized = htmlToText( ensureString( value, '' ) );
		return normalized || '';
	}

	function toOptionalUrl( value ) {
		const normalized = ensureString( value, '' );
		return normalized || '';
	}

	function normalizeComment( comment, index ) {
		if ( ! comment || typeof comment !== 'object' ) {
			return null;
		}

		const id = typeof comment.id === 'number' && Number.isFinite( comment.id ) ? comment.id : 0;
		const date = ensureString( comment.date, '' );
		if ( id <= 0 || ! date ) {
			return null;
		}

		const avatarUrls = ensureObject( comment.author_avatar_urls );

		return {
			id: id,
			date: date,
			parentId: typeof comment.parent === 'number' && Number.isFinite( comment.parent ) ? comment.parent : 0,
			link: toOptionalUrl( comment.link ),
			authorName: toOptionalText( comment.author_name ) || 'WordPress reader',
			authorUrl: toOptionalUrl( comment.author_url ),
			authorAvatarUrl: toOptionalUrl( avatarUrls['48'] || avatarUrls['96'] || avatarUrls['24'] ),
			contentHtml: sanitizeCommentHtml( comment.content && comment.content.rendered ? comment.content.rendered : '' ),
			_key: 'comment-' + String( id ) + '-' + String( index ),
		};
	}

	function sortCommentsByThreadPosition( comments ) {
		return ensureArray( comments ).slice().sort( function ( left, right ) {
			const leftDate = parseDateValue( left.date ).getTime();
			const rightDate = parseDateValue( right.date ).getTime();

			if ( leftDate !== rightDate ) {
				return leftDate - rightDate;
			}

			return left.id - right.id;
		} );
	}

	function dedupeComments( comments ) {
		const byId = new Map();
		ensureArray( comments ).forEach( function ( comment ) {
			if ( comment && comment.id ) {
				byId.set( comment.id, comment );
			}
		} );

		return sortCommentsByThreadPosition( Array.from( byId.values() ) );
	}

	function buildCommentTree( comments ) {
		const nodes = sortCommentsByThreadPosition( comments ).map( function ( comment ) {
			return Object.assign( {}, comment, {
				children: [],
			} );
		} );
		const byId = new Map();
		nodes.forEach( function ( node ) {
			byId.set( node.id, node );
		} );
		const roots = [];

		nodes.forEach( function ( node ) {
			if ( ! node.parentId ) {
				roots.push( node );
				return;
			}

			const parentNode = byId.get( node.parentId );
			if ( ! parentNode ) {
				roots.push( node );
				return;
			}

			parentNode.children.push( node );
		} );

		return roots;
	}

	function getAuthorInitials( name ) {
		const words = ensureString( name, '' ).split( /\s+/ ).filter( Boolean );
		if ( ! words.length ) {
			return 'WP';
		}

		return words.slice( 0, 2 ).map( function ( word ) {
			return word.charAt( 0 ).toUpperCase();
		} ).join( '' );
	}

	function loadTurnstileScript() {
		if ( typeof window === 'undefined' ) {
			return Promise.resolve();
		}

		if ( window.turnstile ) {
			return Promise.resolve();
		}

		if ( window.__hdcTurnstileScriptPromise ) {
			return window.__hdcTurnstileScriptPromise;
		}

		window.__hdcTurnstileScriptPromise = new Promise( function ( resolve, reject ) {
			const existingScript = document.getElementById( TURNSTILE_SCRIPT_ID );
			if ( existingScript ) {
				existingScript.addEventListener( 'load', resolve, { once: true } );
				existingScript.addEventListener( 'error', function () {
					reject( new Error( 'Failed to load Turnstile.' ) );
				}, { once: true } );
				return;
			}

			const script = document.createElement( 'script' );
			script.id = TURNSTILE_SCRIPT_ID;
			script.src = TURNSTILE_SCRIPT_SRC;
			script.async = true;
			script.defer = true;
			script.onload = resolve;
			script.onerror = function () {
				reject( new Error( 'Failed to load Turnstile.' ) );
			};
			document.head.appendChild( script );
		} );

		return window.__hdcTurnstileScriptPromise;
	}

	function TurnstileWidget( props ) {
		const groupRef = useRef( null );
		const containerRef = useRef( null );
		const widgetIdRef = useRef( null );

		useEffect(
			function () {
				props.controlRef.current = {
					focus: function () {
						if ( groupRef.current ) {
							groupRef.current.focus();
						}
					},
					reset: function () {
						if ( widgetIdRef.current && window.turnstile ) {
							window.turnstile.reset( widgetIdRef.current );
						}
						props.onTokenChange( '' );
					},
					execute: function () {
						if ( ! widgetIdRef.current || ! window.turnstile ) {
							return false;
						}
						window.turnstile.execute( widgetIdRef.current );
						return true;
					},
				};

				return function () {
					props.controlRef.current = {
						focus: function () {},
						reset: function () {},
						execute: function () {
							return false;
						},
					};
				};
			},
			[ props.controlRef, props.onTokenChange ]
		);

		useEffect(
			function () {
				let isCancelled = false;

				async function renderWidget() {
					try {
						await loadTurnstileScript();
						if ( isCancelled || ! containerRef.current || ! window.turnstile ) {
							return;
						}

						widgetIdRef.current = window.turnstile.render( containerRef.current, {
							sitekey: props.siteKey,
							theme: 'auto',
							size: 'invisible',
							action: props.action,
							callback: function ( token ) {
								props.onTokenChange( token );
							},
							'expired-callback': function () {
								props.onExpired();
								props.onTokenChange( '' );
							},
							'error-callback': function () {
								props.onTokenChange( '' );
								props.onError();
							},
						} );
					} catch ( error ) {
						props.onTokenChange( '' );
						props.onError();
					}
				}

				renderWidget();

				return function () {
					isCancelled = true;
					if ( widgetIdRef.current && window.turnstile ) {
						window.turnstile.remove( widgetIdRef.current );
					}
					widgetIdRef.current = null;
				};
			},
			[ props.action, props.onError, props.onExpired, props.onTokenChange, props.siteKey ]
		);

		return h(
			'div',
			{
				'aria-describedby': props.ariaDescribedBy,
				'aria-invalid': props.invalid ? 'true' : undefined,
				'aria-labelledby': props.ariaLabelledBy,
				'aria-required': 'true',
				className: 'hdc-blog-post__verification-shell',
				ref: groupRef,
				role: 'group',
				tabIndex: -1,
			},
			h( 'div', {
				className: 'hdc-blog-post__turnstile-widget',
				ref: containerRef,
			} )
		);
	}

	function fetchCommentsPage( url ) {
		return fetch( url, {
			headers: {
				Accept: 'application/json',
			},
		} ).then( async function ( response ) {
			let payload = null;
			try {
				payload = await response.json();
			} catch ( parseError ) {
				payload = null;
			}

			if ( ! response.ok ) {
				const error = new Error( 'WordPress comments request failed with status ' + response.status );
				error.status = response.status;
				throw error;
			}

			if ( ! Array.isArray( payload ) ) {
				throw new Error( 'WordPress comments response was not an array' );
			}

			const total = parseInt( response.headers.get( 'x-wp-total' ) || String( payload.length ), 10 );
			const totalPages = parseInt( response.headers.get( 'x-wp-totalpages' ) || '1', 10 );
			const submitEnabled = true;

			return {
				comments: payload,
				submitEnabled: submitEnabled,
				total: Number.isFinite( total ) && total >= 0 ? total : payload.length,
				totalPages: Number.isFinite( totalPages ) && totalPages > 0 ? totalPages : 1,
			};
		} );
	}

	function fetchBlogComments( config, postId ) {
		if ( ! config.commentsEndpoint || ! postId || postId <= 0 ) {
			return Promise.resolve( {
				comments: [],
				isPartial: false,
				submitEnabled: false,
				total: 0,
				totalPages: 0,
			} );
		}

		const firstPageUrl = new URL( config.commentsEndpoint, window.location.origin );
		firstPageUrl.searchParams.set( 'order', 'asc' );
		firstPageUrl.searchParams.set( 'orderby', 'date_gmt' );
		firstPageUrl.searchParams.set( 'page', '1' );
		firstPageUrl.searchParams.set( 'per_page', String( COMMENT_FETCH_PAGE_SIZE ) );
		firstPageUrl.searchParams.set( 'post', String( postId ) );

		return fetchCommentsPage( firstPageUrl.toString() ).then( function ( firstPage ) {
			const reportedTotalPages = firstPage.totalPages;
			const cappedTotalPages = Math.min( reportedTotalPages, COMMENT_FETCH_MAX_PAGES );
			const isPartial = reportedTotalPages > cappedTotalPages;
			let allComments = ensureArray( firstPage.comments ).map( normalizeComment ).filter( Boolean );

			if ( cappedTotalPages <= 1 ) {
				const dedupedComments = dedupeComments( allComments );
				return {
					comments: dedupedComments,
					isPartial: isPartial,
					submitEnabled: firstPage.submitEnabled,
					total: Math.max( firstPage.total, dedupedComments.length ),
					totalPages: reportedTotalPages,
				};
			}

			const pagePromises = [];
			for ( let page = 2; page <= cappedTotalPages; page++ ) {
				const pageUrl = new URL( firstPageUrl.toString() );
				pageUrl.searchParams.set( 'page', String( page ) );
				pagePromises.push( fetchCommentsPage( pageUrl.toString() ) );
			}

			return Promise.all( pagePromises ).then( function ( remainingPages ) {
				remainingPages.forEach( function ( pageResult ) {
					allComments = allComments.concat( ensureArray( pageResult.comments ).map( normalizeComment ).filter( Boolean ) );
				} );

				const dedupedComments = dedupeComments( allComments );
				return {
					comments: dedupedComments,
					isPartial: isPartial,
					submitEnabled: firstPage.submitEnabled,
					total: Math.max( firstPage.total, dedupedComments.length ),
					totalPages: reportedTotalPages,
				};
			} );
		} );
	}

	function submitComment( config, payload ) {
		if ( ! config.commentSubmitEndpoint ) {
			return Promise.reject( new Error( 'Comment submission is temporarily unavailable. Please use the original WordPress post for now.' ) );
		}

		return fetch( config.commentSubmitEndpoint, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( payload ),
		} ).then( async function ( response ) {
			let body = null;
			try {
				body = await response.json();
			} catch ( parseError ) {
				body = null;
			}

			if ( ! response.ok ) {
				throw new Error( body && body.error ? body.error : 'Comment submission failed' );
			}

			return {
				comment: body && body.comment ? normalizeComment( body.comment, 0 ) : null,
				moderationStatus: body && body.moderationStatus === 'approved' ? 'approved' : 'pending',
			};
		} );
	}

	/* ------------------------------------------------------------------ */
	/*  SectionJumpNav with active state tracking                          */
	/* ------------------------------------------------------------------ */

	function SectionJumpNav( props ) {
		function getInitialActiveHref() {
			if ( ! props.items.length ) {
				return '';
			}

			if ( window.location.hash ) {
				var matchedItem = props.items.find( function ( item ) {
					return item.href === window.location.hash;
				} );
				if ( matchedItem ) {
					return matchedItem.href;
				}
			}

			return props.items[0].href;
		}

		const [ activeHref, setActiveHref ] = useState( getInitialActiveHref );

		useEffect(
			function () {
				if ( ! props.items.length ) {
					setActiveHref( '' );
					return;
				}

				setActiveHref( getInitialActiveHref() );

				if ( typeof IntersectionObserver === 'undefined' ) {
					return undefined;
				}

				var headingEls = [];
				props.items.forEach( function ( item ) {
					var id = item.href.replace( /^#/, '' );
					var el = document.getElementById( id );
					if ( el ) {
						headingEls.push( el );
					}
				} );

				if ( ! headingEls.length ) {
					return;
				}

				// Use a rootMargin that accounts for the sticky header and activates in
				// the top third of the viewport.
				var observer = new IntersectionObserver(
					function ( entries ) {
						entries.forEach( function ( entry ) {
							if ( entry.isIntersecting ) {
								setActiveHref( '#' + entry.target.id );
							}
						} );
					},
					{
						rootMargin: '-100px 0px -66% 0px',
						threshold: 0,
					}
				);

				headingEls.forEach( function ( el ) {
					observer.observe( el );
				} );

				function onHashChange() {
					if ( window.location.hash ) {
						setActiveHref( window.location.hash );
						return;
					}

					setActiveHref( props.items[0] ? props.items[0].href : '' );
				}

				window.addEventListener( 'hashchange', onHashChange );

				return function () {
					observer.disconnect();
					window.removeEventListener( 'hashchange', onHashChange );
				};
			},
			[ props.items ]
		);

		if ( ! props.items.length ) {
			return null;
		}

		return h(
			'section',
			{ className: 'hdc-blog-post__jump-nav' },
			h(
				'div',
				{ className: 'hdc-blog-post__jump-nav-panel' },
				h( 'p', { className: 'hdc-blog-post__jump-nav-label' }, 'Jump to article sections' ),
				props.description ? h( 'p', { className: 'hdc-blog-post__jump-nav-description' }, props.description ) : null,
				h(
					'nav',
					{ className: 'hdc-blog-post__jump-nav-nav', 'aria-label': 'Jump to article sections' },
					h(
						'ul',
						{ className: 'hdc-blog-post__jump-nav-list' },
						props.items.map( function ( item ) {
							var isActive = activeHref === item.href;
							return h(
								'li',
								{ className: 'hdc-blog-post__jump-nav-item', key: item.href },
								h(
									'a',
									{
										className: 'hdc-blog-post__jump-nav-link' + ( isActive ? ' hdc-blog-post__jump-nav-link--active' : '' ),
										href: item.href,
										'aria-current': isActive ? 'true' : undefined,
									},
									item.label
								)
							);
						} )
					)
				)
			)
		);
	}

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

	function BlogPostNotFoundState( props ) {
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

	function BlogPostErrorState( props ) {
		return h( BlogPostStateCard, {
			className: 'is-error',
			iconClass: 'is-error',
			iconText: '!',
			title: 'Could not load blog post',
			description: 'The article could not be loaded right now. Try again in a moment.',
			action: h(
				'button',
				{
					type: 'button',
					className: 'hdc-blog-post__state-action',
					onClick: props.onRetry,
				},
				'Try again'
			),
		} );
	}

	function renderInlineSeparated( items, className ) {
		const filteredItems = ensureArray( items ).filter( Boolean );
		if ( ! filteredItems.length ) {
			return null;
		}

		return h(
			'span',
			{ className: className || 'hdc-blog-post__inline-separated' },
			filteredItems.map( function ( item, index ) {
				return h(
					element.Fragment,
					{ key: String( index ) + '-' + String( typeof item === 'string' ? item : 'node' ) },
					index > 0 ? h( 'span', { className: 'hdc-blog-post__inline-dot', 'aria-hidden': 'true' }, '•' ) : null,
					h( 'span', { className: 'hdc-blog-post__inline-separated-item' }, item )
				);
			} )
		);
	}

	function renderCommentMeta( comment ) {
		const authorNode = comment.authorUrl
			? h(
				'a',
				{
					className: 'hdc-blog-post__comment-author-link',
					href: comment.authorUrl,
					rel: 'noopener noreferrer',
					target: '_blank',
				},
				comment.authorName
			)
			: comment.authorName;

		return h(
			'span',
			{ className: 'hdc-blog-post__comment-meta' },
			renderInlineSeparated( [
				authorNode,
				h(
					'time',
					{ dateTime: comment.date },
					formatLongDateLabel( comment.date ) + ' at ' + parseDateValue( comment.date ).toLocaleTimeString( [], {
						hour: 'numeric',
						minute: '2-digit',
					} )
				),
			], 'hdc-blog-post__comment-meta-inline' )
		);
	}

	function renderCommentThreadItem( args ) {
		const comment = args.comment;
		const depth = args.depth || 0;

		return h(
			'li',
			{ key: comment.id },
			h(
				'article',
				{ className: 'hdc-blog-post__comment-card' },
				h(
					'div',
					{ className: 'hdc-blog-post__comment-row' },
					h(
						'div',
						{ className: 'hdc-blog-post__comment-avatar', 'aria-hidden': 'true' },
						comment.authorAvatarUrl
							? h( 'img', {
								alt: '',
								className: 'hdc-blog-post__comment-avatar-image',
								src: comment.authorAvatarUrl,
							} )
							: h( 'span', { className: 'hdc-blog-post__comment-avatar-fallback' }, getAuthorInitials( comment.authorName ) )
					),
					h(
						'div',
						{ className: 'hdc-blog-post__comment-body' },
						h(
							'div',
							{ className: 'hdc-blog-post__comment-head' },
							renderCommentMeta( comment ),
							h(
								'div',
								{ className: 'hdc-blog-post__comment-actions' },
								comment.link
									? h(
										'a',
										{
											className: 'hdc-blog-post__comment-link',
											href: comment.link,
											rel: 'noopener noreferrer',
											target: '_blank',
										},
										'View on WordPress'
									)
									: null,
								args.commentsOpen && typeof args.onReply === 'function'
									? h(
										'button',
										{
											className: 'hdc-blog-post__comment-reply',
											disabled: !! args.isReplyDisabled,
											onClick: function () {
												args.onReply( comment );
											},
											type: 'button',
										},
										renderLucideIcon( h, 'reply', { size: 14 } ),
										h( 'span', null, 'Reply' )
									)
									: null
								)
							),
							h( 'div', {
								className: 'hdc-blog-post__comment-content',
								dangerouslySetInnerHTML: { __html: comment.contentHtml },
							} )
						)
					)
				),
				comment.children.length
					? h(
						'ol',
						{ className: 'hdc-blog-post__comment-children' + ( depth >= 2 ? ' is-deep' : '' ) },
						comment.children.map( function ( childComment ) {
							return renderCommentThreadItem( {
								comment: childComment,
								commentsOpen: args.commentsOpen,
								depth: depth + 1,
								isReplyDisabled: args.isReplyDisabled,
								onReply: args.onReply,
							} );
						} )
					)
					: null
			);
	}

	function BlogPostApp( props ) {
		const config = props.config;
		const initialSlug = inferSlugFromLocation( config.slug );
		const initialPosts = getInlineFallbackPosts( config );
		const initialPost = getInitialPostFromPosts( initialPosts, initialSlug );
		const [ resolvedSlug, setResolvedSlug ] = useState( initialSlug );
		const [ retryCount, setRetryCount ] = useState( 0 );
		const [ state, setState ] = useState( function () {
			return {
				isFetching: !! initialSlug,
				error: '',
				errorType: initialSlug ? '' : 'not-found',
				post: initialPost,
				posts: initialPosts,
				hasPlaceholderData: initialPosts.length > 0,
			};
		} );
		const [ progress, setProgress ] = useState( 0 );
		const [ commentsState, setCommentsState ] = useState( {
			comments: [],
			isLoading: false,
			isError: false,
			isPartial: false,
			submitEnabled: !! config.commentSubmitEnabled,
			total: 0,
			totalPages: 0,
		} );
		const [ commentFormData, setCommentFormData ] = useState( {
			authorEmail: '',
			authorName: '',
			authorUrl: '',
			company: '',
			content: '',
		} );
		const [ commentFieldErrors, setCommentFieldErrors ] = useState( {} );
		const [ commentReplyTarget, setCommentReplyTarget ] = useState( null );
		const [ commentSubmitMessage, setCommentSubmitMessage ] = useState( '' );
		const [ commentSubmitError, setCommentSubmitError ] = useState( '' );
		const [ isCommentSubmitting, setIsCommentSubmitting ] = useState( false );
		const [ isCommentVerificationPending, setIsCommentVerificationPending ] = useState( false );
		const [ commentTurnstileToken, setCommentTurnstileToken ] = useState( '' );
		const [ commentTurnstileError, setCommentTurnstileError ] = useState( '' );
		const rootRef = useRef( null );
		const shareCopyResetTimeoutRef = useRef( null );
		const commentTurnstileControlRef = useRef( {
			focus: function () {},
			reset: function () {},
			execute: function () {
				return false;
			},
		} );
		const pendingCommentSubmissionRef = useRef( null );

		const signature = useMemo( function () {
			return JSON.stringify( config );
		}, [ config ] );

		useEffect(
			function () {
				setResolvedSlug( inferSlugFromLocation( config.slug ) );
			},
			[ signature ]
		);

		useEffect(
			function () {
				const nextPosts = getInlineFallbackPosts( config );
				const nextPost = getInitialPostFromPosts( nextPosts, resolvedSlug );

				setState( function () {
					return {
						isFetching: !! resolvedSlug,
						error: '',
						errorType: resolvedSlug ? '' : 'not-found',
						post: nextPost,
						posts: nextPosts,
						hasPlaceholderData: nextPosts.length > 0,
					};
				} );
			},
			[ resolvedSlug, signature ]
		);

		useEffect(
			function () {
				if ( state.isFetching ) {
					return;
				}

				if ( state.post && state.post.title ) {
					document.title = buildPageMetadataTitle( state.post.seoTitle || state.post.title );
					return;
				}

				if ( 'fetch' === state.errorType ) {
					document.title = 'Post Unavailable — Henry Perkins';
					return;
				}

				document.title = 'Post Not Found — Henry Perkins';
			},
			[ state.errorType, state.isFetching, state.post ]
		);

		useEffect(
			function () {
				return function () {
					if ( shareCopyResetTimeoutRef.current ) {
						window.clearTimeout( shareCopyResetTimeoutRef.current );
					}
					pendingCommentSubmissionRef.current = null;
				};
			},
			[]
		);

		useEffect(
			function () {
				setCommentReplyTarget( null );
				setCommentSubmitMessage( '' );
				setCommentSubmitError( '' );
				setCommentFieldErrors( {} );
				setCommentTurnstileToken( '' );
				setCommentTurnstileError( '' );
				setIsCommentSubmitting( false );
				setIsCommentVerificationPending( false );
				pendingCommentSubmissionRef.current = null;
				setCommentsState( {
					comments: [],
					isLoading: false,
					isError: false,
					isPartial: false,
					submitEnabled: !! config.commentSubmitEnabled,
					total: 0,
					totalPages: 0,
				} );
			},
			[ config.commentSubmitEnabled, resolvedSlug ]
		);

		useEffect(
			function () {
				if ( ! resolvedSlug ) {
					setState( {
						isFetching: false,
						error: 'Post not found.',
						errorType: 'not-found',
						post: null,
						posts: getInlineFallbackPosts( config ),
						hasPlaceholderData: getInlineFallbackPosts( config ).length > 0,
					} );
					return;
				}

				let cancelled = false;

				async function load() {
					const inlinePosts = getInlineFallbackPosts( config );
					setState( function () {
						const nextPost = getInitialPostFromPosts( inlinePosts, resolvedSlug );
						return {
							isFetching: true,
							error: '',
							errorType: '',
							post: nextPost,
							posts: inlinePosts,
							hasPlaceholderData: inlinePosts.length > 0,
						};
					} );

					let fallbackPosts = inlinePosts;
					let listFetchFailed = false;
					try {
						const postsPayload = await fetchJson( config.postsEndpoint );
						fallbackPosts = normalizePosts( resolveBlogPayload( postsPayload ) );
					} catch ( endpointError ) {
						listFetchFailed = true;
						try {
							const fallbackPayload = await fetchJson( config.fallbackUrl );
							fallbackPosts = normalizePosts( resolveBlogPayload( fallbackPayload ) );
							listFetchFailed = false;
						} catch ( fallbackError ) {
							fallbackPosts = [];
						}
					}

					let currentPost = fallbackPosts.find( function ( item ) {
						return item.slug === resolvedSlug;
					} ) || null;
					let detailFetchError = null;

					if ( currentPost ) {
						try {
							const postPayload = await fetchJson( config.endpointBase + encodeURIComponent( resolvedSlug ) );
							currentPost = normalizePost( postPayload, 0 );
						} catch ( postError ) {
							detailFetchError = postError;
							// Keep the list payload result to avoid hard-failing on detail fetches.
						}
					} else {
						try {
							const postPayload = await fetchJson( config.endpointBase + encodeURIComponent( resolvedSlug ) );
							currentPost = normalizePost( postPayload, 0 );
						} catch ( postError ) {
							detailFetchError = postError;
							currentPost = null;
						}
					}

					const hasFetchError = ( listFetchFailed && ! fallbackPosts.length ) || ( detailFetchError && ! isNotFoundError( detailFetchError ) && ! currentPost );

					if ( ! currentPost ) {
						if ( ! cancelled ) {
							setState( {
								isFetching: false,
								error: hasFetchError ? 'Could not load blog post.' : 'Post not found.',
								errorType: hasFetchError ? 'fetch' : 'not-found',
								post: null,
								posts: fallbackPosts,
								hasPlaceholderData: inlinePosts.length > 0,
							} );
						}
						return;
					}

					const relatedSource = fallbackPosts.some( function ( item ) {
						return item.slug === currentPost.slug;
					} )
						? fallbackPosts
						: [ currentPost ].concat( fallbackPosts );

					if ( ! cancelled ) {
						setState( {
							isFetching: false,
							error: '',
							errorType: '',
							post: currentPost,
							posts: normalizePosts( relatedSource ),
							hasPlaceholderData: inlinePosts.length > 0,
						} );
					}
				}

				load();

				return function () {
					cancelled = true;
				};
			},
			[ resolvedSlug, retryCount, signature ]
		);

		useEffect(
			function () {
				if ( ! state.post || ! state.post.id ) {
					return;
				}

				let cancelled = false;
				setCommentsState( function ( currentState ) {
					return Object.assign( {}, currentState, {
						isLoading: true,
						isError: false,
						submitEnabled: !! config.commentSubmitEnabled,
					} );
				} );

				fetchBlogComments( config, state.post.id ).then( function ( result ) {
					if ( cancelled ) {
						return;
					}

					setCommentsState( {
						comments: result.comments,
						isLoading: false,
						isError: false,
						isPartial: result.isPartial,
						submitEnabled: !! config.commentSubmitEnabled && result.submitEnabled,
						total: result.total,
						totalPages: result.totalPages,
					} );
				} ).catch( function () {
					if ( cancelled ) {
						return;
					}

					setCommentsState( {
						comments: [],
						isLoading: false,
						isError: true,
						isPartial: false,
						submitEnabled: false,
						total: 0,
						totalPages: 0,
					} );
				} );

				return function () {
					cancelled = true;
				};
			},
			[ config, state.post ]
		);

		useEffect(
			function () {
				if ( ! config.showProgress && ! config.showScrollTop ) {
					return;
				}

				function handleScroll() {
					const total = document.documentElement.scrollHeight - window.innerHeight;
					const nextProgress = total > 0 ? ( window.scrollY / total ) * 100 : 0;
					setProgress( Math.max( 0, Math.min( 100, nextProgress ) ) );
				}

				handleScroll();
				window.addEventListener( 'scroll', handleScroll, { passive: true } );
				window.addEventListener( 'resize', handleScroll );

				return function () {
					window.removeEventListener( 'scroll', handleScroll );
					window.removeEventListener( 'resize', handleScroll );
				};
			},
			[ config.showProgress, config.showScrollTop ]
		);

		// Code block enhancement: syntax highlighting + copy buttons
		useEffect(
			function () {
				if ( state.isFetching || ! state.post ) {
					return;
				}

				var raf = requestAnimationFrame( function () {
					var container = rootRef.current;
					if ( ! container ) {
						container = document;
					}

					upgradeHtmlArticleCodeBlocks( container );

					var codeBlocks = container.querySelectorAll( '.hdc-blog-post__code-block' );
					codeBlocks.forEach( function ( block ) {
						var codeEl = block.querySelector( '.hdc-blog-post__code code' );
						if ( ! codeEl ) {
							return;
						}

						var lang = block.getAttribute( 'data-language' ) || '';
						highlightCodeElement( codeEl, lang );

						var copyButton = block.querySelector( '.hdc-blog-post__code-copy' );
						if ( ! copyButton || copyButton.dataset.hdcBound === 'true' ) {
							return;
						}

						copyButton.dataset.hdcBound = 'true';
						copyButton.addEventListener( 'click', function () {
							var codeText = codeEl.textContent || '';
							var copyText = copyButton.querySelector( '.hdc-blog-post__code-copy-text' );

							copyCodeWithFallback( codeText ).then( function ( didCopy ) {
								copyButton.setAttribute( 'data-copy-state', didCopy ? 'success' : 'error' );
								copyButton.setAttribute( 'aria-label', didCopy ? 'Code copied' : 'Copy failed' );
								if ( copyText ) {
									copyText.textContent = didCopy ? 'Copied' : 'Error';
								}

								window.clearTimeout( copyButton._hdcCopyResetTimeout || 0 );
								copyButton._hdcCopyResetTimeout = window.setTimeout( function () {
									copyButton.setAttribute( 'data-copy-state', 'idle' );
									copyButton.setAttribute( 'aria-label', 'Copy code block' );
									if ( copyText ) {
										copyText.textContent = 'Copy';
									}
								}, 1800 );
							} );
						} );
					} );
				} );

				return function () {
					cancelAnimationFrame( raf );
				};
			},
			[ state.isFetching, state.post ]
		);

		useEffect(
			function () {
				if ( ! state.post ) {
					return;
				}

				var existing = document.getElementById( 'hdc-blog-post-jsonld' );
				if ( existing ) {
					existing.remove();
				}

				var ld = {
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					headline: state.post.title,
					description: state.post.seoDescription || state.post.excerpt,
					datePublished: state.post.date,
					dateModified: state.post.modifiedDate || state.post.date,
					author: {
						'@type': 'Person',
						name: state.post.authorName || 'Henry Perkins',
						url: state.post.authorUrl || undefined,
					},
					image: state.post.featuredImageUrl
						? [ new URL( state.post.featuredImageUrl, window.location.origin ).href ]
						: undefined,
					mainEntityOfPage: buildPortfolioBlogUrl( state.post.slug ),
					url: buildPortfolioBlogUrl( state.post.slug ),
					keywords: state.post.tags && state.post.tags.length ? state.post.tags.join( ', ' ) : undefined,
					articleSection: state.post.categories && state.post.categories.length ? state.post.categories : undefined,
				};

				var script = document.createElement( 'script' );
				script.type = 'application/ld+json';
				script.id = 'hdc-blog-post-jsonld';
				script.textContent = JSON.stringify( ld );
				document.head.appendChild( script );

				return function () {
					var el = document.getElementById( 'hdc-blog-post-jsonld' );
					if ( el ) {
						el.remove();
					}
				};
			},
			[ state.post ]
		);

		const relatedPosts = useMemo(
			function () {
				if ( ! state.post ) {
					return [];
				}

				if ( state.post.relatedPosts && state.post.relatedPosts.length ) {
					return state.post.relatedPosts.slice( 0, 2 );
				}

				var currentTags = ensureArray( state.post.tags );
				var currentCategories = ensureArray( state.post.categories );

				function getSharedCount( current, candidate ) {
					if ( ! current.length || ! candidate.length ) {
						return 0;
					}

					var set = {};
					current.forEach( function ( value ) {
						set[ value ] = true;
					} );
					return candidate.filter( function ( value ) {
						return set[ value ];
					} ).length;
				}

				return state.posts
					.filter( function ( candidate ) {
						return candidate.slug !== state.post.slug;
					} )
					.map( function ( candidate ) {
						return {
							post: candidate,
							sharedTags: getSharedCount( currentTags, ensureArray( candidate.tags ) ),
							sharedCategories: getSharedCount( currentCategories, ensureArray( candidate.categories ) ),
							publishedAt: parseDateValue( candidate.date ).getTime(),
						};
					} )
					.sort( function ( left, right ) {
						if ( right.sharedTags !== left.sharedTags ) {
							return right.sharedTags - left.sharedTags;
						}

						if ( right.sharedCategories !== left.sharedCategories ) {
							return right.sharedCategories - left.sharedCategories;
						}

						return right.publishedAt - left.publishedAt;
					} )
					.slice( 0, 2 )
					.map( function ( entry ) {
						return entry.post;
					} );
			},
			[ state.posts, state.post ]
		);
		const markdownHeadings = useMemo(
			function () {
				return state.post && ! state.post.contentHtml ? getMarkdownHeadings( state.post.content ) : [];
			},
			[ state.post ]
		);
		const htmlArticleContent = useMemo(
			function () {
				return enhanceHtmlContent( state.post && state.post.contentHtml );
			},
			[ state.post ]
		);
		const articleSectionItems = useMemo(
			function () {
				if ( state.post && state.post.contentHtml ) {
					return htmlArticleContent.sectionItems;
				}

				return markdownHeadings
					.filter( function ( heading ) {
						return heading.level === 2;
					} )
					.map( function ( heading ) {
						return {
							href: '#' + heading.id,
							label: heading.label,
						};
					} );
			},
			[ htmlArticleContent.sectionItems, markdownHeadings, state.post ]
		);
		const hasArticleSectionItems = articleSectionItems.length > 0;
		const progressValue = Math.round( progress );
		const isPostLookupPending = ! state.post && state.isFetching;
		const hasPostLookupError = ! state.post && ! state.isFetching && state.errorType === 'fetch';
		const commentTree = useMemo(
			function () {
				return buildCommentTree( commentsState.comments );
			},
			[ commentsState.comments ]
		);
		const distinctCategories = useMemo(
			function () {
				if ( ! state.post ) {
					return [];
				}

				var tagLabels = {};
				ensureArray( state.post.tags ).forEach( function ( tag ) {
					tagLabels[ normalizeMetadataLabel( tag ) ] = true;
				} );

				return ensureArray( state.post.categories ).filter( function ( category, index, categories ) {
					var normalizedCategory = normalizeMetadataLabel( category );
					if ( ! normalizedCategory ) {
						return false;
					}

					var firstIndex = categories.findIndex( function ( candidate ) {
						return normalizeMetadataLabel( candidate ) === normalizedCategory;
					} );

					return firstIndex === index && ! tagLabels[ normalizedCategory ];
				} );
			},
			[ state.post ]
		);

		const prefersReducedMotion =
			window.matchMedia &&
			typeof window.matchMedia === 'function' &&
			window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

		if ( isPostLookupPending ) {
			return h( BlogPostLoadingState );
		}

		if ( hasPostLookupError ) {
			return h( BlogPostErrorState, {
				blogIndexUrl: config.blogIndexUrl,
				onRetry: function () {
					setRetryCount( function ( currentValue ) {
						return currentValue + 1;
					} );
				},
			} );
		}

		if ( ! state.post ) {
			return h( BlogPostNotFoundState, { blogIndexUrl: config.blogIndexUrl } );
		}

		const post = state.post;
		const authorLabel = post.authorName || 'Henry Perkins';
		const authorLink = post.authorUrl || '';
		const postHasUpdatedDate = hasUpdatedDate( post );
		const shareUrl = buildPortfolioBlogUrl( post.slug || resolvedSlug );
		const metaTitle = post.seoTitle || post.title;
		const shareMessage = post.shareMessage || post.seoDescription || post.excerpt;
		const postMetaSummary = post.seoDescription && post.seoDescription !== post.excerpt ? post.seoDescription : '';
		const articlePreview = ( post.excerpt || '' ).trim() || ( post.seoDescription || '' ).trim() || '';
		const hasWordPressFooterDetails = !! postMetaSummary;
		const shareLinkedInUrl = buildLinkedInShareUrl( shareUrl );
		const shareEmailUrl = buildEmailShareUrl( {
			description: shareMessage,
			title: metaTitle || 'Henry Perkins article',
			url: shareUrl,
		} );
		const categoriesMeta = distinctCategories.length ? 'Filed under ' + distinctCategories.join( ', ' ) : '';
		const discussionHref = post.discussionUrl || post.wordpressPermalink || '';
		const hasWordPressThread = typeof post.id === 'number' && post.id > 0;
		const resolvedRelatedPosts = relatedPosts.reduce( function ( resolved, related ) {
			const isMirroredPost = state.posts.some( function ( candidate ) {
				return candidate.slug !== post.slug && candidate.slug === related.slug;
			} );

			if ( isMirroredPost ) {
				resolved.push( {
					href: config.blogIndexUrl.replace( /\/+$/, '' ) + '/' + related.slug + '/',
					key: related._key || related.slug,
					linkType: 'internal',
					post: related,
				} );
				return resolved;
			}

			if ( related.wordpressPermalink ) {
				resolved.push( {
					href: related.wordpressPermalink,
					key: related._key || related.slug,
					linkType: 'external',
					post: related,
				} );
			}

			return resolved;
		}, [] );
		const isCommentsQuerySettled = ! commentsState.isLoading && ! commentsState.isError;
		const publishedCommentCount = commentsState.total || commentsState.comments.length;
		const shouldShowCommentCount = hasWordPressThread && isCommentsQuerySettled;
		const canSubmitInline = hasWordPressThread && post.commentsOpen === true && isCommentsQuerySettled && commentsState.submitEnabled && !! config.turnstile.siteKey;
		const shouldShowInlineSubmitFallback = hasWordPressThread && post.commentsOpen === true && isCommentsQuerySettled && ! canSubmitInline;
		const discussionStatusDescription = post.commentsOpen === true
			? 'Comments are open on the original WordPress post.'
			: post.commentsOpen === false
				? 'Comments are currently closed on the original WordPress post.'
				: 'Visit the original WordPress post to check discussion availability.';
		const contentNode = post.contentHtml
			? h( 'div', {
				className: 'hdc-blog-post__content prose-custom',
				dangerouslySetInnerHTML: { __html: htmlArticleContent.contentHtml },
			} )
			: h(
				'div',
				{ className: 'hdc-blog-post__content prose-custom' },
				renderContentWithCode( post.content, markdownHeadings )
			);

		function handleShareCopy() {
			if ( shareCopyResetTimeoutRef.current ) {
				window.clearTimeout( shareCopyResetTimeoutRef.current );
			}

			const rootNode = rootRef.current || document;
			const button = rootNode.querySelector( '.hdc-blog-post__share-copy' );
			if ( ! button ) {
				return;
			}

			const textNode = button.querySelector( '.hdc-blog-post__share-copy-text' );
			copyCodeWithFallback( shareUrl ).then( function ( didCopy ) {
				button.setAttribute( 'data-copy-state', didCopy ? 'success' : 'error' );
				button.setAttribute( 'aria-label', didCopy ? 'Article link copied' : 'Copy article link failed' );
				if ( textNode ) {
					textNode.textContent = didCopy ? 'Link copied' : 'Copy failed';
				}

				shareCopyResetTimeoutRef.current = window.setTimeout( function () {
					button.setAttribute( 'data-copy-state', 'idle' );
					button.setAttribute( 'aria-label', 'Copy article link' );
					if ( textNode ) {
						textNode.textContent = 'Copy article link';
					}
					shareCopyResetTimeoutRef.current = null;
				}, COPY_FEEDBACK_DURATION_MS );
			} );
		}

		function validateCommentField( fieldName, value ) {
			const trimmed = ensureString( value, '' );

			if ( 'authorName' === fieldName ) {
				if ( ! trimmed ) {
					return 'Please enter your name.';
				}
				if ( trimmed.length < 2 ) {
					return 'Name must be at least 2 characters';
				}
				return '';
			}

			if ( 'authorEmail' === fieldName ) {
				if ( ! trimmed ) {
					return 'Please enter your email address.';
				}
				if ( ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( trimmed ) ) {
					return 'Invalid email address';
				}
				return '';
			}

			if ( 'authorUrl' === fieldName ) {
				if ( ! trimmed ) {
					return '';
				}
				try {
					const parsed = new URL( trimmed );
					return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? '' : 'Website must be a valid http or https URL';
				} catch ( error ) {
					return 'Website must be a valid http or https URL';
				}
			}

			if ( ! trimmed ) {
				return 'Please add a comment.';
			}
			if ( trimmed.length < 10 ) {
				return 'Comment must be at least 10 characters';
			}

			return '';
		}

		function handleCommentFieldChange( event ) {
			const name = event.target.name;
			const value = event.target.value;
			setCommentFormData( function ( currentState ) {
				return Object.assign( {}, currentState, {
					[ name ]: value,
				} );
			} );

			setCommentFieldErrors( function ( currentState ) {
				if ( ! currentState[ name ] ) {
					return currentState;
				}

				return Object.assign( {}, currentState, {
					[ name ]: validateCommentField( name, value ),
				} );
			} );
		}

		function validateCommentForm() {
			const errors = {
				authorName: validateCommentField( 'authorName', commentFormData.authorName ),
				authorEmail: validateCommentField( 'authorEmail', commentFormData.authorEmail ),
				authorUrl: validateCommentField( 'authorUrl', commentFormData.authorUrl ),
				content: validateCommentField( 'content', commentFormData.content ),
			};
			setCommentFieldErrors( errors );
			return ! errors.authorName && ! errors.authorEmail && ! errors.authorUrl && ! errors.content;
		}

		function completeCommentSubmission( submission, token ) {
			setIsCommentVerificationPending( false );
			setCommentSubmitError( '' );
			setCommentTurnstileError( '' );
			setIsCommentSubmitting( true );

			return submitComment( config, Object.assign( {}, submission, {
				turnstileToken: token,
			} ) ).then( function ( result ) {
				setCommentSubmitMessage( result.moderationStatus === 'approved'
					? 'Your comment is live and now appears in the discussion.'
					: 'Your comment was submitted and is awaiting moderation before it appears here.' );
				setCommentSubmitError( '' );
				setCommentFormData( function ( currentState ) {
					return Object.assign( {}, currentState, {
						company: '',
						content: '',
					} );
				} );
				setCommentReplyTarget( null );
				if ( result.comment && 'approved' === result.moderationStatus ) {
					setCommentsState( function ( currentState ) {
						const nextComments = dedupeComments( currentState.comments.concat( [ result.comment ] ) );
						return Object.assign( {}, currentState, {
							comments: nextComments,
							total: Math.max( currentState.total + 1, nextComments.length ),
							totalPages: Math.max( currentState.totalPages, 1 ),
						} );
					} );
				}
			} ).catch( function ( error ) {
				setCommentSubmitError( error instanceof Error ? error.message : 'Comment submission failed' );
			} ).finally( function () {
				pendingCommentSubmissionRef.current = null;
				setIsCommentSubmitting( false );
				setIsCommentVerificationPending( false );
				setCommentTurnstileToken( '' );
				commentTurnstileControlRef.current.reset();
			} );
		}

		function handleCommentSubmit( event ) {
			event.preventDefault();
			setCommentSubmitMessage( '' );
			setCommentSubmitError( '' );

			if ( ! validateCommentForm() ) {
				return;
			}

			if ( ! config.turnstile.siteKey ) {
				setCommentTurnstileError( config.turnstile.unavailableError );
				return;
			}

			const submission = {
				authorEmail: ensureString( commentFormData.authorEmail, '' ),
				authorName: ensureString( commentFormData.authorName, '' ),
				authorUrl: ensureString( commentFormData.authorUrl, '' ),
				company: ensureString( commentFormData.company, '' ),
				content: ensureString( commentFormData.content, '' ),
				parentId: commentReplyTarget ? commentReplyTarget.id : 0,
				postId: post.id,
			};

			if ( ! commentTurnstileToken ) {
				pendingCommentSubmissionRef.current = submission;
				setIsCommentVerificationPending( true );
				setCommentTurnstileError( '' );
				if ( ! commentTurnstileControlRef.current.execute() ) {
					pendingCommentSubmissionRef.current = null;
					setIsCommentVerificationPending( false );
					setCommentTurnstileError( config.turnstile.pendingError );
				}
				return;
			}

			completeCommentSubmission( submission, commentTurnstileToken );
		}

		return h(
			'div',
			{ ref: rootRef, className: 'hdc-blog-post__root' + ( prefersReducedMotion ? '' : ' hdc-blog-post__root--entering' ) },
			config.showProgress
				? h(
					'div',
					{
						className: 'hdc-blog-post__progress-track',
						'aria-label': 'Reading progress',
						'aria-valuemax': 100,
						'aria-valuemin': 0,
						'aria-valuenow': progressValue,
						role: 'progressbar',
					},
					h( 'div', {
						className: 'hdc-blog-post__progress-fill',
						style: { width: String( progress ) + '%' },
						'aria-hidden': 'true',
					} )
				)
				: null,
			h(
				'article',
				{ className: 'hdc-blog-post__article' },
				h(
					'a',
					{ className: 'hdc-blog-post__back-link', href: config.blogIndexUrl },
					h(
						'span',
						{ className: 'hdc-blog-post__back-link-icon', 'aria-hidden': 'true' },
						renderLucideIcon( h, 'arrow-left', { className: 'hdc-blog-post__back-link-icon-svg', size: 14 } )
					),
					h( 'span', null, 'Back to Blog' )
				),
				h(
					'header',
					{ className: 'hdc-blog-post__header' + ( post.featuredImageUrl ? ' has-image' : '' ) },
					post.featuredImageUrl
						? h(
							'div',
							{ className: 'hdc-blog-post__hero' },
							h( 'img', {
								alt: buildImageAlt( post ),
								className: 'hdc-blog-post__hero-image',
								decoding: 'async',
								fetchPriority: 'high',
								loading: 'eager',
								onError: function ( event ) {
									event.target.style.display = 'none';
								},
								sizes: '(min-width: 1536px) 1280px, (min-width: 1024px) 90vw, 100vw',
								src: post.featuredImageUrl,
								srcSet: post.featuredImageSrcSet || undefined,
							} )
						)
						: null,
					h(
						'div',
						{ className: 'hdc-blog-post__header-card surface-inset-soft' },
						post.tags.length
							? h(
								'div',
								{ className: 'hdc-blog-post__tags' },
								post.tags.map( function ( tag ) {
									return h( 'span', { className: 'hdc-blog-post__tag', key: post.slug + '-tag-' + tag }, tag );
								} )
							)
							: null,
						h( 'h1', { className: 'hdc-blog-post__title' }, post.title ),
						articlePreview ? h( 'p', { className: 'hdc-blog-post__lede' }, articlePreview ) : null,
						h(
							'p',
							{ className: 'hdc-blog-post__meta' },
							h( 'time', { dateTime: post.date }, formatLongDateLabel( post.date ) ),
							post.readingTime
								? h(
									'span',
									{ className: 'hdc-blog-post__meta-icon' },
									h(
										'span',
										{ className: 'hdc-blog-post__meta-icon-glyph', 'aria-hidden': 'true' },
										renderLucideIcon( h, 'clock', { className: 'hdc-blog-post__meta-icon-svg', size: 12 } )
									),
									h( 'span', null, post.readingTime )
								)
								: null,
							renderInlineSeparated( [
								authorLink
									? h( 'span', null, 'By ', h( 'a', { className: 'hdc-blog-post__detail-link', href: authorLink, rel: 'noopener noreferrer', target: '_blank' }, authorLabel ) )
									: 'By ' + authorLabel,
								postHasUpdatedDate && post.modifiedDate
									? h( 'span', null, 'Updated ', h( 'time', { dateTime: post.modifiedDate }, formatLongDateLabel( post.modifiedDate ) ) )
									: null,
								categoriesMeta || null,
							], 'hdc-blog-post__meta-inline' )
						)
					)
				),
				h(
					'div',
					{ className: 'hdc-blog-post__layout' },
					hasArticleSectionItems
						? h(
							'aside',
							{ className: 'hdc-blog-post__aside' },
							h( SectionJumpNav, {
								description: 'Skip directly to the main ideas in this article.',
								items: articleSectionItems,
							} )
						)
						: null,
						h(
							'div',
							{ className: 'hdc-blog-post__content-shell' },
							contentNode,
							h(
								'section',
								{ 'aria-labelledby': 'blog-comments-heading', className: 'hdc-blog-post__comments-section' },
								h(
									'div',
									{ className: 'hdc-blog-post__comments-card surface-inset-soft' },
									h(
										'div',
										{ className: 'hdc-blog-post__comments-header' },
										h(
											'div',
											{ className: 'hdc-blog-post__comments-heading-group' },
											h( 'p', { className: 'hdc-blog-post__eyebrow' }, 'Discussion' ),
											h(
												'div',
												{ className: 'hdc-blog-post__comments-heading-row' },
												h( 'h2', { className: 'hdc-blog-post__details-title', id: 'blog-comments-heading' }, 'Comments' ),
												shouldShowCommentCount
													? h( 'span', { className: 'hdc-blog-post__count-badge' }, publishedCommentCount === 1 ? '1 published comment' : String( publishedCommentCount ) + ' published comments' )
													: null
											),
											h(
												'p',
												{ className: 'hdc-blog-post__details-summary' },
												hasWordPressThread
													? 'Approved WordPress comments appear inline here so readers do not need to leave the article to follow the thread.'
													: 'Discussion for this article still lives on the original WordPress post.'
											)
										),
										discussionHref
											? h(
												'a',
												{
													className: 'hdc-blog-post__share-link',
													href: discussionHref,
													rel: 'noopener noreferrer',
													target: '_blank',
												},
												h( 'span', { className: 'hdc-blog-post__share-link-icon', 'aria-hidden': 'true' }, renderLucideIcon( h, 'message-square', { size: 16 } ) ),
												h( 'span', null, post.commentsOpen ? 'Comment on WordPress' : 'Open original post' )
											)
											: null
									),
									! hasWordPressThread
										? h(
											'div',
											{ className: 'hdc-blog-post__comments-note' },
											h( 'p', null, 'This mirrored article does not have an inline WordPress comment thread available yet.' ),
											h( 'p', null, discussionStatusDescription )
										)
										: null,
									hasWordPressThread && commentsState.isLoading
										? h(
											'div',
											{ className: 'hdc-blog-post__comments-note', role: 'status' },
											renderLucideIcon( h, 'loader-2', { className: 'hdc-blog-post__spinner', size: 16 } ),
											h( 'span', null, 'Loading published comments from WordPress.' )
										)
										: null,
									hasWordPressThread && commentsState.isError
										? h(
											'div',
											{ className: 'hdc-blog-post__comments-note' },
											h( 'p', null, 'Comments are temporarily unavailable here.' ),
											discussionHref ? h( 'p', null, 'Open the original WordPress post to read or join the current discussion.' ) : null
										)
										: null,
									hasWordPressThread && isCommentsQuerySettled && commentsState.isPartial
										? h(
											'div',
											{ className: 'hdc-blog-post__comments-note' },
											h( 'p', null, 'Very large WordPress threads are mirrored here in a capped inline view.' ),
											discussionHref ? h( 'p', null, 'Open the original WordPress post to continue through the full discussion.' ) : null
										)
										: null,
									hasWordPressThread && isCommentsQuerySettled && commentTree.length
										? h(
											'ol',
											{ className: 'hdc-blog-post__comment-list' },
											commentTree.map( function ( comment ) {
												return renderCommentThreadItem( {
													comment: comment,
													commentsOpen: post.commentsOpen === true,
													isReplyDisabled: isCommentSubmitting || isCommentVerificationPending,
													onReply: function (nextReplyTarget ) {
														setCommentReplyTarget( {
															authorName: nextReplyTarget.authorName,
															id: nextReplyTarget.id,
														} );
													},
												} );
											} )
										)
										: null,
									hasWordPressThread && isCommentsQuerySettled && ! commentTree.length
										? h(
											'div',
											{ className: 'hdc-blog-post__comments-note' },
											h( 'p', null, 'No published comments are visible for this article yet.' ),
											canSubmitInline
												? h( 'p', null, 'Be the first to start the discussion here. New comments appear inline after WordPress accepts them.' )
												: h( 'p', null, post.commentsOpen === false ? 'Comments are currently closed on the original WordPress post.' : 'Visit the original WordPress post to check discussion availability.' )
										)
										: null,
									canSubmitInline
										? h(
											'div',
											{ className: 'hdc-blog-post__comment-form' },
											h(
												'div',
												{ className: 'hdc-blog-post__comment-form-header' },
												h(
													'div',
													null,
													h( 'h3', { className: 'hdc-blog-post__share-title' }, 'Join the discussion' ),
													h( 'p', { className: 'hdc-blog-post__share-description' }, commentReplyTarget ? 'Replying to ' + commentReplyTarget.authorName + '. Your comment may appear immediately or after moderation.' : 'New comments appear here once WordPress accepts them. Some submissions may wait for moderation.' )
												),
												commentReplyTarget
													? h(
														'button',
														{
															className: 'hdc-blog-post__state-action',
															disabled: isCommentSubmitting || isCommentVerificationPending,
															onClick: function () {
																setCommentReplyTarget( null );
															},
															type: 'button',
														},
														'Cancel reply'
													)
													: null
											),
											commentReplyTarget
												? h( 'p', { className: 'hdc-blog-post__reply-indicator' }, 'Replying in-thread to ' + commentReplyTarget.authorName )
												: null,
											commentSubmitMessage ? h( 'div', { className: 'hdc-blog-post__submit-message' }, commentSubmitMessage ) : null,
											commentSubmitError ? h( 'p', { className: 'hdc-blog-post__hint hdc-blog-post__hint--error', role: 'alert' }, commentSubmitError ) : null,
											h(
												'form',
												{ className: 'hdc-blog-post__comment-form-grid', onSubmit: handleCommentSubmit },
												h( 'input', { 'aria-hidden': 'true', autoComplete: 'off', className: 'hdc-blog-post__sr-only', name: 'company', onChange: handleCommentFieldChange, tabIndex: -1, type: 'text', value: commentFormData.company } ),
												h(
													'div',
													{ className: 'hdc-blog-post__comment-form-row' },
													h(
														'label',
														{ className: 'hdc-blog-post__field', htmlFor: 'comment-author-name' },
														h( 'span', { className: 'hdc-blog-post__field-label' }, 'Name' ),
														h( 'input', { 'aria-invalid': commentFieldErrors.authorName ? 'true' : undefined, className: 'hdc-blog-post__input', disabled: isCommentSubmitting || isCommentVerificationPending, id: 'comment-author-name', name: 'authorName', onChange: handleCommentFieldChange, placeholder: 'Your name', type: 'text', value: commentFormData.authorName } ),
														commentFieldErrors.authorName ? h( 'span', { className: 'hdc-blog-post__hint hdc-blog-post__hint--error', role: 'alert' }, commentFieldErrors.authorName ) : null
													),
													h(
														'label',
														{ className: 'hdc-blog-post__field', htmlFor: 'comment-author-email' },
														h( 'span', { className: 'hdc-blog-post__field-label' }, 'Email' ),
														h( 'input', { 'aria-invalid': commentFieldErrors.authorEmail ? 'true' : undefined, className: 'hdc-blog-post__input', disabled: isCommentSubmitting || isCommentVerificationPending, id: 'comment-author-email', name: 'authorEmail', onChange: handleCommentFieldChange, placeholder: 'you@example.com', type: 'email', value: commentFormData.authorEmail } ),
														commentFieldErrors.authorEmail
															? h( 'span', { className: 'hdc-blog-post__hint hdc-blog-post__hint--error', role: 'alert' }, commentFieldErrors.authorEmail )
															: h( 'span', { className: 'hdc-blog-post__hint' }, 'Not shown publicly — used for WordPress moderation only.' )
													)
												),
												h(
													'label',
													{ className: 'hdc-blog-post__field', htmlFor: 'comment-author-url' },
													h( 'span', { className: 'hdc-blog-post__field-label' }, 'Website (optional)' ),
													h( 'input', { 'aria-invalid': commentFieldErrors.authorUrl ? 'true' : undefined, className: 'hdc-blog-post__input', disabled: isCommentSubmitting || isCommentVerificationPending, id: 'comment-author-url', name: 'authorUrl', onChange: handleCommentFieldChange, placeholder: 'https://example.com', type: 'url', value: commentFormData.authorUrl } ),
													commentFieldErrors.authorUrl ? h( 'span', { className: 'hdc-blog-post__hint hdc-blog-post__hint--error', role: 'alert' }, commentFieldErrors.authorUrl ) : null
												),
												h(
													'label',
													{ className: 'hdc-blog-post__field', htmlFor: 'comment-content' },
													h( 'span', { className: 'hdc-blog-post__field-label' }, commentReplyTarget ? 'Reply' : 'Comment' ),
													h( 'textarea', { 'aria-invalid': commentFieldErrors.content ? 'true' : undefined, className: 'hdc-blog-post__textarea', disabled: isCommentSubmitting || isCommentVerificationPending, id: 'comment-content', name: 'content', onChange: handleCommentFieldChange, placeholder: commentReplyTarget ? 'Write your reply...' : 'Write a comment that adds to the conversation...', rows: 4, value: commentFormData.content } ),
													commentFieldErrors.content ? h( 'span', { className: 'hdc-blog-post__hint hdc-blog-post__hint--error', role: 'alert' }, commentFieldErrors.content ) : null
												),
												h(
													'div',
													{ className: 'hdc-blog-post__verification-group' },
													h( 'span', { className: 'hdc-blog-post__field-label', id: 'comment-verification-label' }, config.turnstile.label ),
													h( TurnstileWidget, {
														action: config.turnstile.action,
														ariaDescribedBy: commentTurnstileError ? 'comment-verification-hint comment-verification-error' : 'comment-verification-hint',
														ariaLabelledBy: 'comment-verification-label',
														controlRef: commentTurnstileControlRef,
														invalid: !! commentTurnstileError,
														onError: function () {
															pendingCommentSubmissionRef.current = null;
															setIsCommentVerificationPending( false );
															setCommentTurnstileToken( '' );
															setCommentTurnstileError( config.turnstile.unavailableError );
														},
														onExpired: function () {
															pendingCommentSubmissionRef.current = null;
															setIsCommentVerificationPending( false );
															setCommentTurnstileToken( '' );
															setCommentTurnstileError( config.turnstile.expiredError );
														},
														onTokenChange: function ( token ) {
															setCommentTurnstileToken( token );
															if ( ! token ) {
																return;
															}

															setCommentTurnstileError( '' );

															if ( pendingCommentSubmissionRef.current ) {
																const pendingSubmission = pendingCommentSubmissionRef.current;
																pendingCommentSubmissionRef.current = null;
																completeCommentSubmission( pendingSubmission, token );
															}
														},
														siteKey: config.turnstile.siteKey,
													} ),
													h( 'span', { className: 'hdc-blog-post__hint', id: 'comment-verification-hint' }, config.turnstile.hint ),
													commentTurnstileError ? h( 'span', { className: 'hdc-blog-post__hint hdc-blog-post__hint--error', id: 'comment-verification-error', role: 'alert' }, commentTurnstileError ) : null
												),
												h(
													'div',
													{ className: 'hdc-blog-post__comment-form-footer' },
													h( 'p', { className: 'hdc-blog-post__hint' }, 'By posting here, you are submitting to the original WordPress discussion.' ),
													h( 'button', { className: 'hdc-blog-post__submit-button', disabled: isCommentSubmitting || isCommentVerificationPending, type: 'submit' }, isCommentSubmitting ? ( commentReplyTarget ? 'Posting reply...' : 'Posting comment...' ) : ( isCommentVerificationPending ? 'Verifying...' : ( commentReplyTarget ? 'Post reply' : 'Post comment' ) ) )
												)
											)
										)
										: null,
									shouldShowInlineSubmitFallback
										? h(
											'div',
											{ className: 'hdc-blog-post__comments-note' },
											h( 'p', null, 'Inline comment submission is unavailable right now.' ),
											discussionHref ? h( 'p', null, 'Use the original WordPress post to join the discussion.' ) : null
										)
										: null
								)
							),
							h(
								'div',
								{ className: 'hdc-blog-post__details-card' },
								h(
									'div',
									{ className: 'hdc-blog-post__share-panel' },
									h( 'h3', { className: 'hdc-blog-post__share-title' }, 'Share this article' ),
									h( 'p', { className: 'hdc-blog-post__share-description' }, 'Share the canonical hperkins.com version of this article.' ),
									h(
										'div',
										{ className: 'hdc-blog-post__share-actions' },
										h(
											'button',
											{
												'aria-label': 'Copy article link',
												className: 'hdc-blog-post__share-copy',
												'data-copy-state': 'idle',
												onClick: handleShareCopy,
												type: 'button',
											},
											h( 'span', { className: 'hdc-blog-post__share-copy-icon', 'aria-hidden': 'true' }, renderLucideIcon( h, 'share-2', { size: 14 } ) ),
											h( 'span', { className: 'hdc-blog-post__share-copy-text' }, 'Copy article link' )
										),
										h( 'a', { className: 'hdc-blog-post__share-link', href: shareLinkedInUrl, rel: 'noopener noreferrer', target: '_blank' }, h( 'span', { className: 'hdc-blog-post__share-link-icon', 'aria-hidden': 'true' }, renderLucideIcon( h, 'linkedin', { size: 14 } ) ), h( 'span', null, 'Share on LinkedIn' ) ),
										h( 'a', { className: 'hdc-blog-post__share-link', href: shareEmailUrl }, h( 'span', { className: 'hdc-blog-post__share-link-icon', 'aria-hidden': 'true' }, renderLucideIcon( h, 'mail', { size: 14 } ) ), h( 'span', null, 'Email article' ) )
									)
								),
								hasWordPressFooterDetails ? h( 'div', { className: 'hdc-blog-post__discussion-panel' }, h( 'p', { className: 'hdc-blog-post__share-description' }, postMetaSummary ) ) : null
							),
							resolvedRelatedPosts.length
								? h(
									'section',
									{ className: 'hdc-blog-post__related' },
									h( 'h3', { className: 'hdc-blog-post__related-title' }, 'Related Posts' ),
									h(
										'div',
										{ className: 'hdc-blog-post__related-list' },
										resolvedRelatedPosts.map( function ( relatedPost ) {
											return h(
												'a',
												{
													className: 'hdc-blog-post__related-card',
													href: relatedPost.href,
													key: relatedPost.key,
													rel: relatedPost.linkType === 'external' ? 'noopener noreferrer' : undefined,
													target: relatedPost.linkType === 'external' ? '_blank' : undefined,
												},
												h( 'h4', { className: 'hdc-blog-post__related-card-title' }, relatedPost.post.title ),
												h( 'p', { className: 'hdc-blog-post__related-card-excerpt' }, relatedPost.post.excerpt )
											);
										} )
									)
								)
								: null
						)
					)
				),
			config.showScrollTop && progressValue > 20
				? h(
					'div',
					{ className: 'hdc-blog-post__scroll-top-wrap' },
					h(
						'button',
						{
							'aria-label': 'Scroll to top',
							className: 'hdc-blog-post__scroll-top',
							onClick: function () {
								window.scrollTo( {
									behavior: prefersReducedMotion ? 'auto' : 'smooth',
									top: 0,
								} );
							},
							type: 'button',
						},
						h( 'span', { className: 'hdc-blog-post__scroll-top-icon', 'aria-hidden': 'true' }, renderLucideIcon( h, 'chevron-up', { className: 'hdc-blog-post__scroll-top-icon-svg', size: 18 } ) )
					)
				)
				: null
		);
	}

	function mountBlogPost( section ) {
		const rootNode = section.querySelector( '[data-hdc-blog-post-root]' );
		if ( ! rootNode ) {
			return;
		}

		const app = h( BlogPostApp, { config: parseConfig( section ) } );
		if ( typeof createRoot === 'function' ) {
			createRoot( rootNode ).render( app );
		} else {
			legacyRender( app, rootNode );
		}
	}

	document.querySelectorAll( '.hdc-blog-post' ).forEach( mountBlogPost );
} )( window.wp );
