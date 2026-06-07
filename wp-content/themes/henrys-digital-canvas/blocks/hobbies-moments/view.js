( function ( wp ) {
	if ( ! wp || ! wp.element ) {
		return;
	}

	const element = wp.element;
	const h = element.createElement;
	const useEffect = element.useEffect;
	const useMemo = element.useMemo;
	const useState = element.useState;
	const createRoot = element.createRoot;
	const legacyRender = element.render;
	const Fragment = element.Fragment;

	const STORY_PREVIEW_CHAR_LIMIT = 150;
	const TIMEFRAME_ORDER = [ 'now', 'recently', 'next' ];
	const VALID_CATEGORIES = [ 'dev', 'music', 'learning' ];
	const VALID_TIMEFRAMES = [ 'now', 'recently', 'next' ];

	const TIMEFRAME_META = {
		now: { label: 'Current' },
		recently: { label: 'Recent' },
		next: { label: 'Next up' },
	};

	const CATEGORY_TOKENS = {
		dev: {
			artifactKind: 'dev-fragment',
			detailTone: 'default',
			statusByTimeframe: {
				now: 'watch mode',
				recently: 'saved output',
				next: 'queued run',
			},
		},
		music: {
			artifactKind: 'music-fragment',
			detailTone: 'media-rich',
			statusByTimeframe: {
				now: 'in rotation',
				recently: 'saved take',
				next: 'queued session',
			},
		},
		learning: {
			artifactKind: 'learning-fragment',
			detailTone: 'editorial',
			statusByTimeframe: {
				now: 'active notes',
				recently: 'saved note',
				next: 'next rabbit hole',
			},
		},
	};

	const TERMINAL_STORY_BEATS = [
		{
			cmd: 'ls ~/desktop',
			out: 'notes.txt  old_photos/  letter_from_dad.txt  README.md',
			tone: 'muted',
		},
		{
			cmd: 'cat README.md',
			out: "Don't open letter_from_dad.txt until you're ready.",
			tone: 'muted',
		},
		{
			cmd: 'cat notes.txt',
			out: 'Milk, eggs, call Mom back, return library book (3 weeks late),\nfinish the thing you keep avoiding.',
			tone: 'muted',
		},
		{
			cmd: 'ls old_photos/',
			out: 'summer_2019.jpg  birthday_party.jpg  last_thanksgiving.jpg  us.jpg',
			tone: 'muted',
		},
		{
			cmd: 'open us.jpg',
			out: "[ a blurry photo of two people laughing at a kitchen table.\n  you don't remember who took it. ]",
			tone: 'warm',
		},
		{
			cmd: 'cat letter_from_dad.txt',
			out: "Hey kid,\n\nI know things have been weird. I'm not great at this.\nBut I drove past your old school today and I thought of\nthe time you fell off the monkey bars and didn't cry.\nYou just got back up and said \"I meant to do that.\"\n\nI guess what I'm saying is - I see you still doing that.\nAnd I'm proud of you.\n\n- Dad",
			tone: 'warm',
			italic: true,
		},
		{
			cmd: 'mkdir keep_forever',
			out: null,
			tone: 'success',
		},
		{
			cmd: 'cp letter_from_dad.txt keep_forever/',
			out: null,
			tone: 'success',
		},
		{
			cmd: 'echo "thanks dad"',
			out: 'thanks dad',
			tone: 'success',
		},
	];

	const MOONLIGHT_WHITE_KEY_COUNT = 26;
	const MOONLIGHT_BLACK_KEY_LEFTS = [
		12, 48, 84, 138, 174, 228, 264, 300, 354, 390, 426, 480, 516, 552, 606,
	];

	const SECTION_CONFIGS = [
		{
			category: 'dev',
			id: 'development',
			eyebrow: 'Toolmaking',
			title: 'Development',
			description:
				'Small tools, terminal experiments, and the kind of tinkering that still fits after dinner.',
			sectionClassName: 'hobbies-section-dev',
			transitionClassName: 'hobbies-transition-dev-music',
			gridMode: 'dense',
		},
		{
			category: 'music',
			id: 'music',
			eyebrow: 'Listening',
			title: 'Music',
			description:
				'Piano practice, loop sessions, and the listening habits that slowly sharpen taste.',
			sectionClassName: 'hobbies-section-music',
			transitionClassName: 'hobbies-transition-music-learning',
			gridMode: 'roomy',
		},
		{
			category: 'learning',
			id: 'learning',
			eyebrow: 'Study',
			title: 'Learning',
			description:
				'Weekly notes, rabbit holes, and the rituals that turn curiosity into memory.',
			sectionClassName: 'hobbies-section-learning',
			gridMode: 'calm',
		},
	];

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
			parsed = JSON.parse(
				section.getAttribute( 'data-config' ) || '{}'
			);
		} catch ( error ) {
			parsed = {};
		}

		let inlineFallback = null;
		try {
			const raw = section.getAttribute( 'data-fallback-payload' );
			if ( raw ) {
				inlineFallback = JSON.parse( raw );
			}
		} catch ( parseError ) {
			inlineFallback = null;
		}

		return {
			heading: ensureString( parsed.heading, 'Hobbies' ),
			description: ensureString(
				parsed.description,
				'Side projects, piano sessions, and learning notes — the after-hours practices that sharpen how I work.'
			),
			endpoint: ensureString( parsed.endpoint, '' ),
			fallbackUrl: ensureString( parsed.fallbackUrl, '' ),
			imageBaseUrl: ensureString( parsed.imageBaseUrl, '' ).replace(
				/\/$/,
				''
			),
			inlineFallback,
		};
	}

	function resolveThemeImagePath( value, imageBaseUrl ) {
		if ( typeof value !== 'string' || value === '' ) {
			return value;
		}

		if ( value.indexOf( '/images/' ) === 0 && imageBaseUrl ) {
			return imageBaseUrl + '/' + value.slice( '/images/'.length );
		}

		return value;
	}

	function resolveSrcSet( srcSet, imageBaseUrl ) {
		if ( typeof srcSet !== 'string' ) {
			return srcSet;
		}

		return srcSet
			.split( ',' )
			.map( function ( candidate ) {
				const trimmed = candidate.trim();
				if ( trimmed === '' ) {
					return trimmed;
				}

				const parts = trimmed.split( /\s+/ );
				parts[ 0 ] = resolveThemeImagePath( parts[ 0 ], imageBaseUrl );
				return parts.join( ' ' );
			} )
			.filter( Boolean )
			.join( ', ' );
	}

	function normalizeMedia( media, imageBaseUrl ) {
		if ( ! media || typeof media !== 'object' ) {
			return null;
		}

		const normalized = Object.assign( {}, media );
		normalized.src = resolveThemeImagePath( normalized.src, imageBaseUrl );
		normalized.poster = resolveThemeImagePath(
			normalized.poster,
			imageBaseUrl
		);

		if ( Array.isArray( normalized.sources ) ) {
			normalized.sources = normalized.sources.map( function ( source ) {
				return Object.assign( {}, source, {
					srcSet: resolveSrcSet( source.srcSet, imageBaseUrl ),
				} );
			} );
		}

		return normalized;
	}

	function normalizeMoment( moment, imageBaseUrl ) {
		if ( ! moment || typeof moment !== 'object' ) {
			return null;
		}

		const category =
			VALID_CATEGORIES.indexOf( moment.category ) !== -1
				? moment.category
				: '';
		const timeframe =
			VALID_TIMEFRAMES.indexOf( moment.timeframe ) !== -1
				? moment.timeframe
				: '';
		const id = ensureString( moment.id, '' );
		const title = ensureString( moment.title, '' );

		if ( ! id || ! title || ! category || ! timeframe ) {
			return null;
		}

		return {
			id,
			title,
			category,
			detailExperience: ensureString( moment.detailExperience, '' ),
			timeframe,
			story: ensureString( moment.story, '' ),
			takeaway: ensureString( moment.takeaway, '' ),
			media: normalizeMedia( moment.media, imageBaseUrl ),
		};
	}

	function normalizeMomentsPayload( payload, imageBaseUrl ) {
		const rawItems =
			payload &&
			typeof payload === 'object' &&
			Array.isArray( payload.items )
				? payload.items
				: payload;
		return ensureArray( rawItems )
			.map( function ( item ) {
				return normalizeMoment( item, imageBaseUrl );
			} )
			.filter( Boolean );
	}

	function fetchJson( url ) {
		return fetch( url, {
			headers: {
				Accept: 'application/json',
			},
		} ).then( function ( response ) {
			if ( ! response.ok ) {
				throw new Error(
					'Request failed with status ' + response.status
				);
			}

			return response.json();
		} );
	}

	function toStoryPreview( story ) {
		if ( story.length <= STORY_PREVIEW_CHAR_LIMIT ) {
			return story;
		}

		const preview = story.slice( 0, STORY_PREVIEW_CHAR_LIMIT ).trimEnd();
		const wordBoundaryIndex = preview.lastIndexOf( ' ' );
		const wordSafePreview =
			wordBoundaryIndex > 0
				? preview.slice( 0, wordBoundaryIndex ).trimEnd()
				: preview;
		const safePreview =
			wordSafePreview.endsWith( ',' ) || wordSafePreview.endsWith( ';' )
				? wordSafePreview.slice( 0, -1 ).trimEnd()
				: wordSafePreview;

		return safePreview + '…';
	}

	function buildCategorySections( moments ) {
		return SECTION_CONFIGS.map( function ( category ) {
			const allItems = moments
				.filter( function ( moment ) {
					return moment.category === category.category;
				} )
				.sort( function ( a, b ) {
					return (
						TIMEFRAME_ORDER.indexOf( a.timeframe ) -
						TIMEFRAME_ORDER.indexOf( b.timeframe )
					);
				} );

			return Object.assign( {}, category, {
				headingId: 'hobbies-heading-' + category.id,
				items: allItems.filter( function ( moment ) {
					return moment.timeframe !== 'next';
				} ),
				totalCount: allItems.length,
				upcomingItems: allItems.filter( function ( moment ) {
					return moment.timeframe === 'next';
				} ),
			} );
		} );
	}

	function countLabel( section ) {
		const noun = section.totalCount === 1 ? 'moment' : 'moments';
		return section.upcomingItems.length > 0
			? section.totalCount + ' total ' + noun
			: section.totalCount + ' ' + noun;
	}

	function panelIdForMoment( id ) {
		return 'hobbies-moment-' + id.replace( /[^a-zA-Z0-9_-]/g, '-' );
	}

	function renderHero( config ) {
		return h(
			'div',
			{ className: 'hobbies-page-hero' },
			h(
				'div',
				{
					className:
						'hobbies-hero-backdrop hero-backdrop-hobbies-after-hours',
				},
				h(
					'div',
					{
						className:
							'app-container max-w-5xl hobbies-hero-content',
					},
					h(
						'p',
						{ className: 'hobbies-hero-eyebrow' },
						'After-hours practice'
					),
					h(
						'h1',
						{ className: 'hobbies-hero-title' },
						config.heading || 'Hobbies'
					),
					h(
						'p',
						{ className: 'hobbies-hero-description' },
						config.description
					),
					h(
						'p',
						{ className: 'hobbies-hero-supporting' },
						'Late-night, reflective, hands-on, and a little obsessive. Same frame, different medium.'
					)
				)
			)
		);
	}

	function renderJumpNav( sections ) {
		return h(
			'div',
			{
				className:
					'hobbies-jump-nav-shell sticky top-layout-header z-layer-sticky',
			},
			h(
				'div',
				{ className: 'hobbies-jump-nav app-container max-w-5xl' },
				h( 'p', null, 'Browse by medium' ),
				h(
					'nav',
					{ 'aria-label': 'Browse hobbies by medium' },
					h(
						'ul',
						null,
						sections.map( function ( section ) {
							return h(
								'li',
								{ key: section.id },
								h(
									'a',
									{ href: '#' + section.id },
									section.title
								)
							);
						} )
					)
				)
			)
		);
	}

	function renderArtifactFragment( kind ) {
		if ( kind === 'dev-fragment' ) {
			return h(
				'div',
				{
					className: 'hobbies-artifact-fragment hobbies-artifact-dev',
					'aria-hidden': 'true',
				},
				h(
					'div',
					{ className: 'hobbies-artifact-dev-toolbar' },
					h( 'span' ),
					h( 'span' ),
					h( 'span' )
				),
				h(
					'div',
					{ className: 'hobbies-artifact-dev-screen' },
					h( 'span', { className: 'hobbies-artifact-dev-line' } ),
					h( 'span', {
						className:
							'hobbies-artifact-dev-line hobbies-artifact-dev-line-short',
					} ),
					h( 'span', { className: 'hobbies-artifact-dev-line' } )
				),
				h(
					'div',
					{ className: 'hobbies-artifact-dev-prompt' },
					h(
						'span',
						{ className: 'hobbies-artifact-dev-host' },
						'~/after-hours'
					),
					h( 'span', { className: 'hobbies-artifact-dev-cursor' } )
				)
			);
		}

		if ( kind === 'music-fragment' ) {
			return h(
				'div',
				{
					className:
						'hobbies-artifact-fragment hobbies-artifact-music',
					'aria-hidden': 'true',
				},
				h( 'div', { className: 'hobbies-artifact-music-glow' } ),
				h( 'div', { className: 'hobbies-artifact-music-band' } ),
				h( 'div', {
					className:
						'hobbies-artifact-music-wave hobbies-artifact-music-wave-a',
				} ),
				h( 'div', {
					className:
						'hobbies-artifact-music-wave hobbies-artifact-music-wave-b',
				} )
			);
		}

		return h(
			'div',
			{
				className:
					'hobbies-artifact-fragment hobbies-artifact-learning',
				'aria-hidden': 'true',
			},
			h( 'div', { className: 'hobbies-artifact-learning-tab' } ),
			h( 'span', { className: 'hobbies-artifact-learning-line' } ),
			h( 'span', {
				className:
					'hobbies-artifact-learning-line hobbies-artifact-learning-line-short',
			} ),
			h( 'span', { className: 'hobbies-artifact-learning-line' } )
		);
	}

	function renderPianoPreview() {
		const whiteKeys = Array.from( { length: 14 }, function ( _, index ) {
			return h( 'span', {
				key: 'white-' + index,
				className: 'hobbies-piano-white-key',
				'data-active': index === 2 || index === 7 ? 'true' : undefined,
			} );
		} );
		const blackKeys = Array.from( { length: 9 }, function ( _, index ) {
			return h( 'span', {
				key: 'black-' + index,
				className: 'hobbies-piano-black-key',
				'data-active': index === 3 ? 'true' : undefined,
			} );
		} );

		return h(
			'div',
			{ className: 'hobbies-piano-preview', 'aria-hidden': 'true' },
			h( 'div', { className: 'hobbies-piano-preview-glow' } ),
			h(
				'div',
				{ className: 'hobbies-piano-preview-title' },
				'Moonlight study'
			),
			h(
				'div',
				{ className: 'hobbies-piano-keyboard' },
				h(
					'div',
					{ className: 'hobbies-piano-white-keys' },
					whiteKeys
				),
				h( 'div', { className: 'hobbies-piano-black-keys' }, blackKeys )
			)
		);
	}

	function renderTerminalPreview() {
		return h(
			'div',
			{ className: 'hobbies-terminal-preview', 'aria-hidden': 'true' },
			h(
				'div',
				{ className: 'terminal-story-toolbar' },
				h( 'span' ),
				h( 'span' ),
				h( 'span' )
			),
			h(
				'p',
				{ className: 'terminal-story-line' },
				h( 'span', { className: 'terminal-story-path' }, '~/memory' ),
				h( 'span', { className: 'terminal-story-symbol' }, '$' ),
				h(
					'span',
					{ className: 'terminal-story-command' },
					'open letter.txt'
				),
				h( 'span', { className: 'terminal-story-cursor' } )
			),
			h(
				'p',
				{ className: 'terminal-story-output-muted' },
				'timing makes the story feel discovered'
			)
		);
	}

	function renderTerminalPrompt( command ) {
		return h(
			'div',
			{ className: 'terminal-story-line' },
			h( 'span', { className: 'terminal-story-path' }, '~/life' ),
			h( 'span', { className: 'terminal-story-symbol' }, ' $ ' ),
			command
				? h( 'span', { className: 'terminal-story-command' }, command )
				: null,
			! command
				? h( 'span', {
						className: 'terminal-story-cursor',
						'aria-hidden': 'true',
				  } )
				: null
		);
	}

	function terminalStoryOutputClassName( beat ) {
		const classes = [ 'terminal-story-output-block' ];
		if ( beat.tone ) {
			classes.push( 'terminal-story-output-' + beat.tone );
		}
		if ( beat.italic ) {
			classes.push( 'terminal-story-output-italic' );
		}
		return classes.join( ' ' );
	}

	function renderTerminalStoryDetail() {
		return h(
			'div',
			{
				className: 'terminal-story-shell',
				'data-finished': 'true',
				'data-story-state': 'transcript',
				'aria-label': 'Interactive terminal story',
			},
			h(
				'div',
				{ className: 'terminal-story-frame' },
				h(
					'div',
					{ className: 'terminal-story-toolbar' },
					h(
						'div',
						{
							className: 'terminal-story-status',
							'aria-live': 'off',
						},
						'transcript ready'
					),
					h(
						'div',
						{ className: 'terminal-story-controls' },
						h(
							'button',
							{
								type: 'button',
								className: 'terminal-story-advance',
								disabled: true,
							},
							'Complete'
						),
						h(
							'button',
							{
								type: 'button',
								className: 'terminal-story-toggle',
								disabled: true,
								'aria-label': 'Sound unavailable',
							},
							'Muted'
						)
					)
				),
				h(
					'p',
					{ className: 'terminal-story-helper' },
					'A small memory recovered from the desktop, command by command.'
				),
				h(
					'div',
					{
						className: 'terminal-story-output-pane',
						'aria-label': 'Terminal story output',
						'data-has-transcript': 'true',
					},
					TERMINAL_STORY_BEATS.map( function ( beat, index ) {
						return h(
							'div',
							{
								key: beat.cmd + '-' + index,
								className: 'terminal-story-row',
							},
							renderTerminalPrompt( beat.cmd ),
							beat.out
								? h(
										'pre',
										{
											className:
												terminalStoryOutputClassName(
													beat
												),
										},
										beat.out
								  )
								: null
						);
					} ),
					renderTerminalPrompt( '' )
				)
			)
		);
	}

	function renderMoonlightKeyboard() {
		const whiteKeys = Array.from(
			{ length: MOONLIGHT_WHITE_KEY_COUNT },
			function ( _, index ) {
				return h( 'div', {
					key: 'white-' + index,
					className: 'hobbies-moonlight-white-key',
					'data-active':
						index === 9 || index === 16 ? 'true' : 'false',
				} );
			}
		);

		const blackKeys = MOONLIGHT_BLACK_KEY_LEFTS.map(
			function ( left, index ) {
				return h( 'div', {
					key: 'black-' + index,
					className: 'hobbies-moonlight-black-key',
					'data-active': index === 5 ? 'true' : 'false',
					style: { left: left + 'px' },
				} );
			}
		);

		return h(
			'div',
			{ className: 'hobbies-moonlight-keyboard-shell' },
			h(
				'div',
				{
					className: 'hobbies-moonlight-keyboard',
					style: { width: MOONLIGHT_WHITE_KEY_COUNT * 18 + 'px' },
				},
				h(
					'div',
					{ className: 'hobbies-moonlight-white-keys' },
					whiteKeys
				),
				blackKeys
			)
		);
	}

	function renderMoonlightStudyDetail() {
		return h(
			'div',
			{
				className: 'hobbies-moonlight-study',
				role: 'region',
				'aria-label': 'Moonlight Sonata study',
				'data-embedded': 'true',
			},
			h(
				'div',
				{ className: 'hobbies-moonlight-header' },
				h(
					'p',
					{ className: 'hobbies-moonlight-eyebrow' },
					'Ludwig van Beethoven'
				),
				h(
					'h4',
					{ className: 'hobbies-moonlight-title' },
					'Moonlight Sonata'
				),
				h(
					'p',
					{ className: 'hobbies-moonlight-subtitle' },
					'Op. 27 No. 2 - Adagio sostenuto'
				),
				h(
					'p',
					{ className: 'hobbies-moonlight-lede' },
					'A quiet pass through the triplets, keys glowing as the phrase moves.'
				)
			),
			renderMoonlightKeyboard(),
			h(
				'div',
				{ className: 'hobbies-moonlight-controls' },
				h(
					'button',
					{
						type: 'button',
						className:
							'hobbies-moonlight-control hobbies-moonlight-control-play',
						'data-state': 'idle',
						'aria-label': 'Play Moonlight Sonata study',
					},
					h(
						'svg',
						{
							width: '18',
							height: '18',
							viewBox: '0 0 18 18',
							fill: 'currentColor',
							'aria-hidden': 'true',
						},
						h( 'polygon', { points: '5,2 16,9 5,16' } )
					)
				)
			),
			h(
				'div',
				{ className: 'hobbies-moonlight-progress-shell' },
				h(
					'div',
					{ className: 'hobbies-moonlight-progress-track' },
					h( 'div', {
						className: 'hobbies-moonlight-progress-fill',
						style: { width: '0%' },
					} )
				),
				h(
					'div',
					{ className: 'hobbies-moonlight-status-row' },
					h( 'span', null, '0:00' ),
					h( 'span', null, 'PRESS PLAY' ),
					h( 'span', null, '5:47' )
				)
			)
		);
	}

	function renderDetailExperience( item ) {
		if ( item.detailExperience === 'terminal-story' ) {
			return h(
				'div',
				{ className: 'hobbies-card-detail-experience' },
				h(
					'p',
					{ className: 'hobbies-card-status' },
					'Interactive version'
				),
				renderTerminalStoryDetail()
			);
		}

		if ( item.detailExperience === 'moonlight-sonata' ) {
			return h(
				'div',
				{ className: 'hobbies-card-detail-experience' },
				h(
					'p',
					{ className: 'hobbies-card-status' },
					'Interactive study'
				),
				renderMoonlightStudyDetail()
			);
		}

		return null;
	}

	function renderMedia( media, item, mode ) {
		if ( ! media || ! media.type || ! media.src ) {
			return null;
		}

		if ( media.type === 'image' ) {
			return h(
				'picture',
				{ className: 'hobbies-card-artifact-frame' },
				ensureArray( media.sources ).map( function ( source, index ) {
					return h( 'source', {
						key: 'source-' + index,
						srcSet: source.srcSet,
						sizes: media.sizes,
						type: source.type,
					} );
				} ),
				h( 'img', {
					src: media.src,
					alt: ensureString(
						media.alt,
						ensureString( item.title, '' )
					),
					width: media.width || undefined,
					height: media.height || undefined,
					sizes: media.sizes || undefined,
					className: 'hobbies-card-artifact-media-element',
					loading: 'lazy',
					decoding: 'async',
				} )
			);
		}

		if ( mode === 'preview' ) {
			const kind = media.type === 'audio' ? 'Audio' : 'Video';
			const note =
				media.type === 'audio'
					? 'Open details to play.'
					: 'Open details to watch.';
			return h(
				'div',
				{
					className: 'hobbies-card-media-placeholder',
					role: 'img',
					'aria-label':
						item.title +
						' ' +
						media.type +
						' available in expanded details',
				},
				h(
					'span',
					{ className: 'hobbies-card-media-placeholder-label' },
					kind + ' available'
				),
				h(
					'span',
					{ className: 'hobbies-card-media-placeholder-note' },
					note
				)
			);
		}

		if ( media.type === 'audio' ) {
			return h(
				'audio',
				{
					controls: true,
					preload: 'none',
					className: 'hobbies-card-artifact-media-element',
				},
				h( 'source', {
					src: media.src,
					type: ensureString( media.mimeType, '' ) || undefined,
				} )
			);
		}

		if ( media.type === 'video' ) {
			return h(
				'video',
				{
					controls: true,
					preload: 'metadata',
					poster: media.poster || undefined,
					width: media.width || undefined,
					height: media.height || undefined,
					className: 'hobbies-card-artifact-media-element',
					playsInline: true,
				},
				h( 'source', {
					src: media.src,
					type: ensureString( media.mimeType, '' ) || undefined,
				} )
			);
		}

		return null;
	}

	function renderArtifact( item, tokens, mode ) {
		const previewExperience =
			mode === 'preview' ? item.detailExperience : '';
		let content = null;

		if ( previewExperience === 'moonlight-sonata' ) {
			content = renderPianoPreview();
		} else if ( previewExperience === 'terminal-story' ) {
			content = renderTerminalPreview();
		} else {
			content =
				renderMedia( item.media, item, mode ) ||
				renderArtifactFragment( tokens.artifactKind );
		}

		return h(
			'div',
			{ className: 'hobbies-card-artifact-wrap' },
			h(
				'div',
				{
					className: 'hobbies-card-artifact',
					'data-mode': mode,
					'data-experience': previewExperience || undefined,
				},
				content
			)
		);
	}

	function renderDetailPanel( item, tokens ) {
		const showDetailArtifact =
			item.media &&
			( item.media.type !== 'image' || item.detailExperience );
		return h(
			'div',
			{
				className: 'hobbies-card-detail',
				'data-detail-tone': tokens.detailTone,
			},
			showDetailArtifact
				? renderArtifact( item, tokens, 'detail' )
				: null,
			h(
				'div',
				{ className: 'hobbies-card-detail-stack' },
				h(
					'div',
					{ className: 'hobbies-card-detail-story' },
					h( 'p', null, item.story )
				),
				h(
					'div',
					{ className: 'hobbies-card-detail-takeaway' },
					h( 'p', null, item.takeaway )
				),
				renderDetailExperience( item )
			)
		);
	}

	function renderCard( item, index, openIds, toggleOpenId ) {
		const isOpen = openIds.has( item.id );
		const tokens = CATEGORY_TOKENS[ item.category ];
		const panelId = panelIdForMoment( item.id );
		const titleId = panelId + '-title';
		const timeframeLabel = TIMEFRAME_META[ item.timeframe ].label;
		const statusLabel = tokens.statusByTimeframe[ item.timeframe ];

		return h(
			'div',
			{ className: 'hobbies-moment-grid-item', key: item.id },
			h(
				'article',
				{
					'data-category': item.category,
					'data-open': isOpen ? 'true' : 'false',
				},
				h(
					'div',
					{
						className: 'hobbies-card-shell',
						'data-category': item.category,
						'data-open': isOpen ? 'true' : 'false',
						style: { animationDelay: index * 70 + 'ms' },
					},
					h(
						'div',
						{ className: 'hobbies-card-body' },
						h(
							'div',
							{ className: 'hobbies-card-meta' },
							h(
								'span',
								{ className: 'hobbies-card-badge' },
								timeframeLabel
							),
							h(
								'span',
								{ className: 'hobbies-card-status' },
								statusLabel
							)
						),
						h(
							'div',
							{ className: 'hobbies-card-header' },
							h(
								'h3',
								{ className: 'hobbies-card-title' },
								h(
									'button',
									{
										type: 'button',
										className: 'hobbies-disclosure-button',
										'aria-expanded': isOpen
											? 'true'
											: 'false',
										'aria-controls': panelId,
										'aria-labelledby': titleId,
										'data-open': isOpen ? 'true' : 'false',
										onClick() {
											toggleOpenId( item.id );
										},
									},
									h( 'span', { id: titleId }, item.title ),
									h(
										'span',
										{ 'aria-hidden': 'true' },
										isOpen ? 'Hide details' : 'Read more'
									)
								)
							)
						),
						renderArtifact( item, tokens, 'preview' ),
						h(
							'div',
							{ className: 'hobbies-card-copy' },
							h(
								'div',
								{ className: 'hobbies-card-glimpse' },
								h( 'p', null, toStoryPreview( item.story ) )
							),
							h(
								'p',
								{ className: 'hobbies-card-preview-takeaway' },
								h(
									'span',
									{
										className:
											'hobbies-card-preview-takeaway-label',
									},
									'Takeaway'
								),
								h(
									'span',
									{
										className:
											'hobbies-card-preview-takeaway-copy',
									},
									item.takeaway
								)
							)
						),
						h(
							'div',
							{ className: 'hobbies-card-footer' },
							h(
								'p',
								{ className: 'hobbies-card-footer-label' },
								'Captured after-hours practice'
							),
							h(
								'span',
								{
									className: 'hobbies-card-footer-status',
									'aria-hidden': 'true',
								},
								isOpen ? 'Expanded' : 'Preview'
							)
						),
						h(
							'div',
							{
								id: panelId,
								role: 'region',
								'aria-labelledby': titleId,
								hidden: ! isOpen,
								className:
									'hobbies-card-panel' +
									( isOpen ? '' : ' hidden' ),
							},
							isOpen ? renderDetailPanel( item, tokens ) : null
						)
					)
				)
			)
		);
	}

	function renderNextNote( section ) {
		if ( section.upcomingItems.length === 0 ) {
			return null;
		}

		return h(
			'div',
			{ className: 'hobbies-next-note-shell' },
			h(
				'div',
				{ className: 'hobbies-next-note' },
				h(
					'div',
					{ className: 'hobbies-next-note-head' },
					h(
						'span',
						{ className: 'hobbies-next-note-badge' },
						'Next up'
					),
					h(
						'p',
						{ className: 'hobbies-next-note-copy' },
						'A lighter note for the experiments I am still lining up.'
					)
				),
				h(
					'div',
					{ className: 'hobbies-next-note-grid' },
					section.upcomingItems.map( function ( item ) {
						return h(
							'div',
							{
								key: item.id,
								className: 'hobbies-next-note-item',
							},
							h(
								'p',
								{ className: 'hobbies-note-title' },
								item.title
							),
							h(
								'p',
								{ className: 'hobbies-note-story' },
								item.story
							),
							h(
								'p',
								{ className: 'hobbies-note-takeaway' },
								item.takeaway
							)
						);
					} )
				)
			)
		);
	}

	function renderSection( section, sectionIndex, openIds, toggleOpenId ) {
		return h(
			Fragment,
			{ key: section.id },
			h(
				'section',
				{
					id: section.id,
					'aria-labelledby': section.headingId,
					'data-background-ready': 'true',
					className:
						'hobbies-section scroll-mt-anchor ' +
						section.sectionClassName +
						( sectionIndex === 0 ? ' hobbies-section-first' : '' ),
				},
				h(
					'div',
					{
						className:
							'hobbies-section-content app-container max-w-5xl',
					},
					h(
						'div',
						{ className: 'hobbies-section-intro' },
						h(
							'div',
							{ className: 'hobbies-section-copy' },
							h(
								'p',
								{ className: 'hobbies-section-eyebrow' },
								section.eyebrow
							),
							h(
								'h2',
								{
									id: section.headingId,
									className: 'hobbies-section-title',
								},
								section.title
							),
							h(
								'p',
								{ className: 'hobbies-section-description' },
								section.description
							)
						),
						h(
							'span',
							{ className: 'hobbies-section-count' },
							countLabel( section )
						)
					),
					h(
						'div',
						{
							className:
								'hobbies-moments-grid hobbies-moments-grid--' +
								section.gridMode,
						},
						section.items.map( function ( item, index ) {
							return renderCard(
								item,
								index,
								openIds,
								toggleOpenId
							);
						} )
					),
					renderNextNote( section )
				)
			),
			section.transitionClassName
				? h( 'div', {
						'aria-hidden': 'true',
						className: section.transitionClassName,
				  } )
				: null
		);
	}

	function HobbiesMomentsApp( props ) {
		const config = props.config;
		const [ state, setState ] = useState( {
			loading: true,
			error: '',
			items: [],
		} );
		const [ openIds, setOpenIds ] = useState( function () {
			return new Set();
		} );

		const signature = useMemo(
			function () {
				return JSON.stringify( config );
			},
			[ config ]
		);
		const requestConfig = useMemo(
			function () {
				return JSON.parse( signature );
			},
			[ signature ]
		);

		useEffect( function () {
			document.title = 'Hobbies — Henry Perkins';
		}, [] );

		useEffect(
			function () {
				let cancelled = false;

				async function load() {
					setState( {
						loading: true,
						error: '',
						items: [],
					} );

					try {
						const payload = await fetchJson(
							requestConfig.endpoint
						);
						if ( ! cancelled ) {
							setState( {
								loading: false,
								error: '',
								items: normalizeMomentsPayload(
									payload,
									requestConfig.imageBaseUrl
								),
							} );
						}
						return;
					} catch ( endpointError ) {}

					try {
						const payload = await fetchJson(
							requestConfig.fallbackUrl
						);
						if ( ! cancelled ) {
							setState( {
								loading: false,
								error: '',
								items: normalizeMomentsPayload(
									payload,
									requestConfig.imageBaseUrl
								),
							} );
						}
						return;
					} catch ( fallbackError ) {}

					if ( requestConfig.inlineFallback ) {
						if ( ! cancelled ) {
							setState( {
								loading: false,
								error: '',
								items: normalizeMomentsPayload(
									requestConfig.inlineFallback,
									requestConfig.imageBaseUrl
								),
							} );
						}
						return;
					}

					if ( ! cancelled ) {
						setState( {
							loading: false,
							error: 'The hobbies feed is temporarily unavailable.',
							items: [],
						} );
					}
				}

				load();

				return function () {
					cancelled = true;
				};
			},
			[ requestConfig ]
		);

		const sections = useMemo(
			function () {
				return buildCategorySections( state.items );
			},
			[ state.items ]
		);

		function toggleOpenId( id ) {
			setOpenIds( function ( previous ) {
				const next = new Set( previous );
				if ( next.has( id ) ) {
					next.delete( id );
				} else {
					next.add( id );
				}
				return next;
			} );
		}

		return h(
			'div',
			{ className: 'hobbies-page-shell' },
			renderHero( config ),
			renderJumpNav( sections ),
			state.loading
				? h(
						'div',
						{
							className:
								'hobbies-route-status app-container max-w-5xl',
						},
						'Loading moments…'
				  )
				: null,
			state.error
				? h(
						'div',
						{
							className:
								'hobbies-route-status app-container max-w-5xl',
						},
						state.error
				  )
				: null,
			! state.loading && ! state.error
				? sections.map( function ( section, index ) {
						return renderSection(
							section,
							index,
							openIds,
							toggleOpenId
						);
				  } )
				: null,
			! state.loading && ! state.error
				? h(
						'div',
						{
							className:
								'hobbies-closing-shell app-container max-w-5xl',
						},
						h(
							'div',
							{ className: 'hobbies-closing-note' },
							h(
								'p',
								{ className: 'hobbies-section-eyebrow' },
								'Closing note'
							),
							h(
								'p',
								{ className: 'hobbies-closing-copy' },
								'What I practice when nobody is asking for output.'
							)
						)
				  )
				: null
		);
	}

	function mountHobbiesMoments( section ) {
		const rootNode = section.querySelector(
			'[data-hdc-hobbies-moments-root]'
		);
		if ( ! rootNode ) {
			return;
		}

		const app = h( HobbiesMomentsApp, { config: parseConfig( section ) } );
		if ( createRoot ) {
			createRoot( rootNode ).render( app );
			return;
		}

		legacyRender( app, rootNode );
	}

	function boot() {
		document
			.querySelectorAll( '.hdc-hobbies-moments' )
			.forEach( mountHobbiesMoments );
	}

	if ( window.__HDC_HOBBIES_MOMENTS_TESTS__ ) {
		Object.assign( window.__HDC_HOBBIES_MOMENTS_TESTS__, {
			CATEGORY_TOKENS,
			renderDetailPanel,
			renderDetailExperience,
			renderTerminalStoryDetail,
			renderMoonlightStudyDetail,
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', boot );
	} else {
		boot();
	}
} )( window.wp );
