#!/usr/bin/env node
/**
 * Standalone render-contract tests for blocks/hobbies-moments/view.js.
 * Run from the theme dir: node tests/hobbies-moments-view-test.cjs
 */

const assert = require( 'assert' );
const fs = require( 'fs' );
const path = require( 'path' );
const vm = require( 'vm' );

const VIEW_SOURCE_PATH = path.resolve(
	__dirname,
	'../blocks/hobbies-moments/view.js'
);
const VIEW_SOURCE = fs.readFileSync( VIEW_SOURCE_PATH, 'utf8' );

function createElement( type, props, ...children ) {
	return {
		type,
		props: props || {},
		children: children.flat(),
	};
}

function loadHooks() {
	const testHooks = {};
	const context = {
		console,
		fetch: () =>
			Promise.reject(
				new Error( 'fetch is not available in this unit test' )
			),
		document: {
			readyState: 'loading',
			addEventListener() {},
			querySelectorAll() {
				return [];
			},
		},
		window: {
			__HDC_HOBBIES_MOMENTS_TESTS__: testHooks,
			wp: {
				element: {
					createElement,
					Fragment: 'Fragment',
					createRoot: null,
					render() {},
					useEffect() {},
					useMemo( callback ) {
						return callback();
					},
					useState( initial ) {
						return [
							typeof initial === 'function' ? initial() : initial,
							function () {},
						];
					},
				},
			},
		},
	};
	context.window.document = context.document;

	vm.runInNewContext( VIEW_SOURCE, context, {
		filename: VIEW_SOURCE_PATH,
	} );

	return testHooks;
}

function collectText( node ) {
	if ( node === null || node === undefined || node === false ) {
		return '';
	}
	if ( typeof node === 'string' || typeof node === 'number' ) {
		return String( node );
	}
	if ( Array.isArray( node ) ) {
		return node.map( collectText ).join( ' ' );
	}

	return collectText( node.children || [] );
}

function hasClass( node, className ) {
	if ( node === null || node === undefined || node === false ) {
		return false;
	}
	if ( Array.isArray( node ) ) {
		return node.some( ( child ) => hasClass( child, className ) );
	}
	if ( typeof node !== 'object' ) {
		return false;
	}

	const classes = String(
		node.props && node.props.className ? node.props.className : ''
	).split( /\s+/ );
	return (
		classes.includes( className ) ||
		hasClass( node.children || [], className )
	);
}

function findByClass( node, className ) {
	if ( node === null || node === undefined || node === false ) {
		return null;
	}
	if ( Array.isArray( node ) ) {
		for ( const child of node ) {
			const match = findByClass( child, className );
			if ( match ) {
				return match;
			}
		}
		return null;
	}
	if ( typeof node !== 'object' ) {
		return null;
	}

	const classes = String(
		node.props && node.props.className ? node.props.className : ''
	).split( /\s+/ );
	if ( classes.includes( className ) ) {
		return node;
	}

	return findByClass( node.children || [], className );
}

function hasType( node, type ) {
	if ( node === null || node === undefined || node === false ) {
		return false;
	}
	if ( Array.isArray( node ) ) {
		return node.some( ( child ) => hasType( child, type ) );
	}
	if ( typeof node !== 'object' ) {
		return false;
	}

	return node.type === type || hasType( node.children || [], type );
}

const hooks = loadHooks();

assert.strictEqual(
	typeof hooks.renderDetailPanel,
	'function',
	'view.js should expose renderDetailPanel to the test harness'
);
assert.ok(
	hooks.CATEGORY_TOKENS,
	'view.js should expose category tokens to the test harness'
);

const terminalPanel = hooks.renderDetailPanel(
	{
		id: 'dev-fake-terminal-toy',
		title: 'Build a playful terminal toy',
		category: 'dev',
		detailExperience: 'terminal-story',
		story: 'Story copy.',
		takeaway: 'Pacing can make interface copy hit like narrative.',
		media: null,
	},
	hooks.CATEGORY_TOKENS.dev
);
const terminalText = collectText( terminalPanel );
assert.match(
	terminalText,
	/Interactive version/,
	'terminal detail should label the special interactive section'
);
assert.ok(
	hasClass( terminalPanel, 'terminal-story-shell' ),
	'terminal detail should render the terminal story shell'
);
assert.ok(
	hasClass( terminalPanel, 'terminal-story-output-pane' ),
	'terminal detail should render the terminal story output pane'
);
assert.match(
	terminalText,
	/cat letter_from_dad\.txt/,
	'terminal detail should include the scripted story transcript'
);

const moonlightPanel = hooks.renderDetailPanel(
	{
		id: 'music-midnight-piano-loop',
		title: 'Chasing a tone at midnight',
		category: 'music',
		detailExperience: 'moonlight-sonata',
		story: 'Story copy.',
		takeaway: 'The best music makes everything else disappear.',
		media: null,
	},
	hooks.CATEGORY_TOKENS.music
);
const moonlightText = collectText( moonlightPanel );
const moonlightStudy = findByClass( moonlightPanel, 'hobbies-moonlight-study' );
assert.match(
	moonlightText,
	/Interactive study/,
	'moonlight detail should label the special study section'
);
assert.ok( moonlightStudy, 'moonlight detail should render the study shell' );
assert.strictEqual(
	moonlightStudy.props.role,
	'region',
	'embedded moonlight study should be exposed as a region'
);
assert.strictEqual(
	moonlightStudy.props[ 'aria-label' ],
	'Moonlight Sonata study',
	'embedded moonlight study should keep the React aria-label'
);
assert.ok(
	hasClass( moonlightPanel, 'hobbies-moonlight-controls' ),
	'moonlight detail should render the study controls'
);
assert.match(
	moonlightText,
	/PRESS PLAY/,
	'moonlight detail should include the idle playback status'
);

const audioPanel = hooks.renderDetailPanel(
	{
		id: 'music-audio-loop',
		title: 'Audio loop',
		category: 'music',
		detailExperience: '',
		story: 'Story copy.',
		takeaway: 'Takeaway copy.',
		media: {
			type: 'audio',
			src: 'https://example.test/audio.mp3',
			mimeType: 'audio/mpeg',
		},
	},
	hooks.CATEGORY_TOKENS.music
);
assert.ok(
	hasType( audioPanel, 'audio' ),
	'detail audio media should render an audio element'
);

const videoPanel = hooks.renderDetailPanel(
	{
		id: 'music-video-loop',
		title: 'Video loop',
		category: 'music',
		detailExperience: '',
		story: 'Story copy.',
		takeaway: 'Takeaway copy.',
		media: {
			type: 'video',
			src: 'https://example.test/video.mp4',
			mimeType: 'video/mp4',
		},
	},
	hooks.CATEGORY_TOKENS.music
);
assert.ok(
	hasType( videoPanel, 'video' ),
	'detail video media should render a video element'
);

assert.ok(
	! /\[\s*signature\s*,\s*config\s*\]/.test( VIEW_SOURCE ),
	'hobbies data-loading effect should not depend on the config object reference'
);
assert.ok(
	/const requestConfig = useMemo/.test( VIEW_SOURCE ) &&
		/\[\s*signature\s*\]/.test( VIEW_SOURCE ),
	'hobbies data-loading effect should derive request config from the stable signature'
);
assert.ok(
	/\[\s*requestConfig\s*\]/.test( VIEW_SOURCE ),
	'hobbies data-loading effect should depend on the memoized request config'
);

process.stdout.write( 'ok - hobbies moment detail experiences render\n' );
