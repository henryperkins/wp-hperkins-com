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

	function parseConfig( section ) {
		let parsed = {};
		try {
			parsed = JSON.parse( section.getAttribute( 'data-config' ) || '{}' );
		} catch ( error ) {
			parsed = {};
		}

		return {
			slug: ensureString( parsed.slug, '' ),
			showProgress: !! parsed.showProgress,
			showScrollTop: !! parsed.showScrollTop,
			endpointBase: ensureString( parsed.endpointBase, '' ),
			postsEndpoint: ensureString( parsed.postsEndpoint, '' ),
			fallbackUrl: ensureString( parsed.fallbackUrl, '' ),
			blogIndexUrl: ensureString( parsed.blogIndexUrl, '/blog/' ),
		};
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
			return ensureString( value, '' );
		}

		return date.toLocaleDateString( undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		} );
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
				throw new Error( 'Request failed with status ' + response.status );
			}

			return response.json();
		} );
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

		return {
			slug: ensureString( post && post.slug, 'post-' + String( index + 1 ) ),
			title: ensureString( post && post.title, 'Untitled Post' ),
			excerpt: excerpt,
			date: ensureString( post && post.date, '' ),
			tags: tags.length ? tags : [ 'General' ],
			readingTime: readingTime,
			content: content,
			contentHtml: contentHtml,
			featuredImageUrl: ensureString( post && post.featuredImageUrl, '' ),
			featuredImageAlt: ensureString( post && post.featuredImageAlt, '' ),
			featuredImageSrcSet: ensureString( post && post.featuredImageSrcSet, '' ),
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
		return title + ' featured image';
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

	function getMarkdownHeadings( content ) {
		const seen = new Map();
		const headings = [];

		String( content || '' )
			.split( '\n' )
			.forEach( function ( line ) {
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

		return headings;
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
		const blocks = String( content || '' ).split( /(```[\s\S]*?```)/g );
		const headingQueue = ensureArray( headings ).slice();
		return blocks.filter( Boolean ).map( function ( block, index ) {
			if ( block.startsWith( '```' ) && block.endsWith( '```' ) ) {
				const lines = block.split( '\n' );
				const lang = lines[0].replace( '```', '' ).trim();
				const code = lines.slice( 1, -1 ).join( '\n' );

				return h(
					'pre',
					{ key: 'code-' + String( index ), className: 'hdc-blog-post__code', 'data-lang': lang || undefined },
					lang ? h( 'span', { className: 'hdc-blog-post__code-lang' }, lang ) : null,
					h( 'code', {}, code )
				);
			}

			return h(
				'div',
				{ key: 'text-' + String( index ) },
				renderMarkdownBlock( block, 'block-' + String( index ), headingQueue )
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
		var key = String( lang || '' ).toLowerCase().trim();
		var aliases = {
			js: 'javascript', jsx: 'javascript', tsx: 'javascript',
			ts: 'javascript', typescript: 'javascript',
			py: 'python',
			sh: 'bash', shell: 'bash', zsh: 'bash',
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
	/*  Code block copy button (DOM-based)                                 */
	/* ------------------------------------------------------------------ */

	function addCopyButton( preEl ) {
		if ( preEl.querySelector( '.hdc-blog-post__code-copy' ) ) {
			return;
		}

		var codeEl = preEl.querySelector( 'code' );
		if ( ! codeEl ) {
			return;
		}

		var btn = document.createElement( 'button' );
		btn.type = 'button';
		btn.className = 'hdc-blog-post__code-copy';
		btn.setAttribute( 'aria-label', 'Copy code block' );
		btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="hdc-blog-post__code-copy-icon" data-icon="copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';

		var checkSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="hdc-blog-post__code-copy-icon" data-icon="check"><path d="M20 6 9 17l-5-5"/></svg>';
		var copySvg = btn.innerHTML;
		var timeout = 0;

		btn.addEventListener( 'click', function () {
			var text = codeEl.textContent || '';
			if ( ! navigator.clipboard ) {
				return;
			}

			navigator.clipboard.writeText( text ).then( function () {
				btn.innerHTML = checkSvg;
				btn.classList.add( 'is-copied' );
				btn.setAttribute( 'aria-label', 'Code copied' );
				clearTimeout( timeout );
				timeout = setTimeout( function () {
					btn.innerHTML = copySvg;
					btn.classList.remove( 'is-copied' );
					btn.setAttribute( 'aria-label', 'Copy code block' );
				}, 2000 );
			} );
		} );

		preEl.appendChild( btn );
	}

	/* ------------------------------------------------------------------ */
	/*  SectionJumpNav with active state tracking                          */
	/* ------------------------------------------------------------------ */

	function SectionJumpNav( props ) {
		const [ activeHref, setActiveHref ] = useState( '' );

		useEffect(
			function () {
				if ( ! props.items.length ) {
					return;
				}

				if ( typeof IntersectionObserver === 'undefined' ) {
					return;
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
					}
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

	function BlogPostApp( props ) {
		const config = props.config;
		const [ resolvedSlug, setResolvedSlug ] = useState( inferSlugFromLocation( config.slug ) );
		const [ state, setState ] = useState( {
			loading: true,
			error: '',
			post: null,
			posts: [],
		} );
		const [ progress, setProgress ] = useState( 0 );
		const rootRef = useRef( null );

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
				if ( state.loading ) {
					return;
				}

				if ( state.post && state.post.title ) {
					document.title = state.post.title + ' — Henry Perkins';
					return;
				}

				document.title = 'Post Not Found — Henry Perkins';
			},
			[ state.loading, state.post ]
		);

		useEffect(
			function () {
				if ( ! resolvedSlug ) {
					setState( {
						loading: false,
						error: 'Post not found.',
						post: null,
						posts: [],
					} );
					return;
				}

				let cancelled = false;

				async function load() {
					setState( {
						loading: true,
						error: '',
						post: null,
						posts: [],
					} );

					let fallbackPosts = [];
					try {
						const postsPayload = await fetchJson( config.postsEndpoint );
						fallbackPosts = normalizePosts( resolveBlogPayload( postsPayload ) );
					} catch ( endpointError ) {
						try {
							const fallbackPayload = await fetchJson( config.fallbackUrl );
							fallbackPosts = normalizePosts( resolveBlogPayload( fallbackPayload ) );
						} catch ( fallbackError ) {
							fallbackPosts = [];
						}
					}

					let currentPost = fallbackPosts.find( function ( item ) {
						return item.slug === resolvedSlug;
					} ) || null;

					if ( ! currentPost && fallbackPosts.length > 0 ) {
						if ( ! cancelled ) {
							setState( {
								loading: false,
								error: 'Post not found.',
								post: null,
								posts: fallbackPosts,
							} );
						}
						return;
					}

					if ( currentPost ) {
						try {
							const postPayload = await fetchJson( config.endpointBase + encodeURIComponent( resolvedSlug ) );
							currentPost = normalizePost( postPayload, 0 );
						} catch ( postError ) {
							// Keep the list payload result to avoid hard-failing on detail fetches.
						}
					} else {
						try {
							const postPayload = await fetchJson( config.endpointBase + encodeURIComponent( resolvedSlug ) );
							currentPost = normalizePost( postPayload, 0 );
						} catch ( postError ) {
							currentPost = null;
						}
					}

					if ( ! currentPost ) {
						if ( ! cancelled ) {
							setState( {
								loading: false,
								error: 'Post not found.',
								post: null,
								posts: fallbackPosts,
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
							loading: false,
							error: '',
							post: currentPost,
							posts: normalizePosts( relatedSource ),
						} );
					}
				}

				load();

				return function () {
					cancelled = true;
				};
			},
			[ resolvedSlug, signature ]
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
				if ( state.loading || ! state.post ) {
					return;
				}

				// Small delay to ensure DOM has rendered
				var raf = requestAnimationFrame( function () {
					var container = rootRef.current;
					if ( ! container ) {
						container = document;
					}

					var codeBlocks = container.querySelectorAll( '.hdc-blog-post__code' );
					codeBlocks.forEach( function ( pre ) {
						var codeEl = pre.querySelector( 'code' );
						if ( ! codeEl ) {
							return;
						}

						// Determine language from data attribute or lang label
						var lang = pre.getAttribute( 'data-lang' ) || '';
						if ( ! lang ) {
							var langSpan = pre.querySelector( '.hdc-blog-post__code-lang' );
							lang = langSpan ? ( langSpan.textContent || '' ).trim() : '';
						}

						highlightCodeElement( codeEl, lang );
						addCopyButton( pre );
					} );
				} );

				return function () {
					cancelAnimationFrame( raf );
				};
			},
			[ state.loading, state.post ]
		);

		const relatedPosts = useMemo(
			function () {
				if ( ! state.post ) {
					return [];
				}

				return state.posts
					.filter( function ( candidate ) {
						return candidate.slug !== state.post.slug;
					} )
					.slice( 0, 2 );
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

		const prefersReducedMotion =
			window.matchMedia &&
			typeof window.matchMedia === 'function' &&
			window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

		if ( state.loading ) {
			return h( 'p', { className: 'hdc-blog-post__status' }, 'Loading post…' );
		}

		if ( state.error || ! state.post ) {
			return h(
				'div',
				{ className: 'hdc-blog-post__error-wrap' },
				h( 'h2', { className: 'hdc-blog-post__error-title' }, 'Post not found' ),
				h( 'p', { className: 'hdc-blog-post__error' }, 'This article may have been removed or the URL is incorrect.' ),
					h(
						'a',
						{
							className: 'hdc-blog-post__back-link',
							href: config.blogIndexUrl,
						},
						h(
							'span',
							{ className: 'hdc-blog-post__back-link-icon', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'arrow-left', { className: 'hdc-blog-post__back-link-icon-svg', size: 14 } )
						),
						h( 'span', null, 'Back to Blog' )
					)
				);
			}

		const post = state.post;
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
						{
							className: 'hdc-blog-post__back-link',
							href: config.blogIndexUrl,
						},
						h(
							'span',
							{ className: 'hdc-blog-post__back-link-icon', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'arrow-left', { className: 'hdc-blog-post__back-link-icon-svg', size: 14 } )
						),
						h( 'span', null, 'Back to Blog' )
					),
					h(
						'header',
						{ className: 'hdc-blog-post__header' },
						post.featuredImageUrl
							? h(
								'div',
								{ className: 'hdc-blog-post__hero' },
								h( 'img', {
									className: 'hdc-blog-post__hero-image',
									src: post.featuredImageUrl,
									srcSet: post.featuredImageSrcSet || undefined,
									sizes: '(min-width: 1536px) 1280px, (min-width: 1024px) 90vw, 100vw',
									alt: buildImageAlt( post ),
									loading: 'eager',
									decoding: 'async',
									fetchPriority: 'high',
									onError: function ( e ) {
										e.target.style.display = 'none';
									},
								} )
							)
							: null,
						h(
							'div',
							{ className: 'hdc-blog-post__tags' },
							post.tags.map( function ( tag ) {
								return h( 'span', { className: 'hdc-blog-post__tag', key: post.slug + '-tag-' + tag }, tag );
							} )
						),
						h( 'h1', { className: 'hdc-blog-post__title' }, post.title ),
						h(
							'p',
							{ className: 'hdc-blog-post__meta' },
							h( 'time', { dateTime: post.date }, formatDateLabel( post.date ) ),
							post.readingTime
								? h(
									'span',
									{ className: 'hdc-blog-post__meta-icon' },
									h(
										'span',
										{ className: 'hdc-blog-post__meta-icon-glyph', 'aria-hidden': 'true' },
										renderLucideIcon( h, 'clock', { className: 'hdc-blog-post__meta-icon-svg', size: 12 } )
									),
									h( 'span', {}, post.readingTime )
								)
								: null
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
							relatedPosts.length
								? h(
									'section',
									{ className: 'hdc-blog-post__related' },
									h( 'h3', { className: 'hdc-blog-post__related-title' }, 'Related Posts' ),
									h(
										'div',
										{ className: 'hdc-blog-post__related-list' },
										relatedPosts.map( function ( related ) {
											return h(
												'a',
												{
													className: 'hdc-blog-post__related-card',
													href: config.blogIndexUrl.replace( /\/+$/, '' ) + '/' + encodeURIComponent( related.slug ) + '/',
													key: related.slug,
												},
												h( 'h4', { className: 'hdc-blog-post__related-card-title' }, related.title ),
												h( 'p', { className: 'hdc-blog-post__related-card-excerpt' }, related.excerpt )
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
								type: 'button',
								className: 'hdc-blog-post__scroll-top',
								onClick: function () {
									window.scrollTo( {
										top: 0,
										behavior: prefersReducedMotion ? 'auto' : 'smooth',
									} );
								},
								'aria-label': 'Scroll to top',
							},
							h(
								'span',
								{ className: 'hdc-blog-post__scroll-top-icon', 'aria-hidden': 'true' },
								renderLucideIcon( h, 'chevron-up', { className: 'hdc-blog-post__scroll-top-icon-svg', size: 18 } )
							)
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
