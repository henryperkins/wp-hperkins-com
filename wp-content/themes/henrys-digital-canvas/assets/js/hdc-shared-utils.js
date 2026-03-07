( function ( global ) {
	const LUCIDE_ICON_NODES = {
		activity: [
			[
				'path',
				{
					d: 'M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2',
				},
			],
		],
		'arrow-left': [
			[ 'path', { d: 'm12 19-7-7 7-7' } ],
			[ 'path', { d: 'M19 12H5' } ],
		],
		briefcase: [
			[ 'path', { d: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' } ],
			[ 'rect', { width: '20', height: '14', x: '2', y: '6', rx: '2' } ],
		],
		calendar: [
			[ 'path', { d: 'M8 2v4' } ],
			[ 'path', { d: 'M16 2v4' } ],
			[ 'rect', { width: '18', height: '18', x: '3', y: '4', rx: '2' } ],
			[ 'path', { d: 'M3 10h18' } ],
		],
		code: [
			[ 'path', { d: 'm16 18 6-6-6-6' } ],
			[ 'path', { d: 'm8 6-6 6 6 6' } ],
		],
		clock: [
			[ 'circle', { cx: '12', cy: '12', r: '10' } ],
			[ 'path', { d: 'M12 6v6l4 2' } ],
		],
		'chevron-up': [
			[ 'path', { d: 'm18 15-6-6-6 6' } ],
		],
		'folder-open': [
			[ 'path', { d: 'm6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2' } ],
		],
		sparkles: [
			[ 'path', { d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' } ],
			[ 'path', { d: 'M20 3v4' } ],
			[ 'path', { d: 'M22 5h-4' } ],
			[ 'path', { d: 'M4 17v2' } ],
			[ 'path', { d: 'M5 18H3' } ],
		],
		wrench: [
			[ 'path', { d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' } ],
		],
		award: [
			[ 'path', { d: 'm15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526' } ],
			[ 'circle', { cx: '12', cy: '8', r: '6' } ],
		],
		'external-link': [
			[ 'path', { d: 'M15 3h6v6' } ],
			[ 'path', { d: 'M10 14 21 3' } ],
			[ 'path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' } ],
		],
		'file-text': [
			[ 'path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' } ],
			[ 'path', { d: 'M14 2v6h6' } ],
			[ 'path', { d: 'M16 13H8' } ],
			[ 'path', { d: 'M16 17H8' } ],
			[ 'path', { d: 'M10 9H8' } ],
		],
		github: [
			[
				'path',
				{
					d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4',
				},
			],
			[ 'path', { d: 'M9 18c-4.51 2-5-2-7-2' } ],
		],
		'graduation-cap': [
			[
				'path',
				{
					d: 'M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z',
				},
			],
			[ 'path', { d: 'M22 10v6' } ],
			[ 'path', { d: 'M6 12.5V16a6 3 0 0 0 12 0v-3.5' } ],
		],
		heart: [
			[
				'path',
				{
					d: 'M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5',
				},
			],
		],
		home: [
			[ 'path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8' } ],
			[
				'path',
				{
					d: 'M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
				},
			],
		],
		house: [
			[ 'path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8' } ],
			[
				'path',
				{
					d: 'M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
				},
			],
		],
		layers: [
			[
				'path',
				{
					d: 'M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z',
				},
			],
			[
				'path',
				{
					d: 'M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12',
				},
			],
			[
				'path',
				{
					d: 'M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17',
				},
			],
		],
		'layers-3': [
			[
				'path',
				{
					d: 'M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z',
				},
			],
			[
				'path',
				{
					d: 'M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12',
				},
			],
			[
				'path',
				{
					d: 'M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17',
				},
			],
		],
		linkedin: [
			[ 'path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' } ],
			[ 'rect', { width: '4', height: '12', x: '2', y: '9' } ],
			[ 'circle', { cx: '4', cy: '4', r: '2' } ],
		],
		mail: [
			[ 'path', { d: 'm22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7' } ],
			[ 'rect', { x: '2', y: '4', width: '20', height: '16', rx: '2' } ],
		],
		printer: [
			[ 'path', { d: 'M6 9V2h12v7' } ],
			[ 'path', { d: 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' } ],
			[ 'rect', { x: '6', y: '14', width: '12', height: '8' } ],
			[ 'circle', { cx: '18', cy: '12', r: '1' } ],
		],
		rocket: [
			[ 'path', { d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' } ],
			[ 'path', { d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09' } ],
			[ 'path', { d: 'M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z' } ],
			[ 'path', { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05' } ],
		],
		send: [
			[ 'path', { d: 'M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z' } ],
			[ 'path', { d: 'm21.854 2.147-10.94 10.939' } ],
		],
		star: [
			[
				'path',
				{
					d: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
				},
			],
		],
		'git-fork': [
			[ 'circle', { cx: '12', cy: '18', r: '3' } ],
			[ 'circle', { cx: '6', cy: '6', r: '3' } ],
			[ 'circle', { cx: '18', cy: '6', r: '3' } ],
			[ 'path', { d: 'M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9' } ],
			[ 'path', { d: 'M12 12v3' } ],
		],
		'trending-up': [
			[ 'path', { d: 'M16 7h6v6' } ],
			[ 'path', { d: 'm22 7-8.5 8.5-5-5L2 17' } ],
		],
		users: [
			[ 'path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' } ],
			[ 'path', { d: 'M16 3.128a4 4 0 0 1 0 7.744' } ],
			[ 'path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' } ],
			[ 'circle', { cx: '9', cy: '7', r: '4' } ],
		],
	};

	function decodeHtml( value ) {
		if ( typeof value !== 'string' ) {
			return '';
		}

		const div = document.createElement( 'div' );
		div.innerHTML = value;
		return ( div.textContent || '' ).trim();
	}

	function normalizePathname( value ) {
		if ( ! value ) {
			return '/';
		}

		let normalized = String( value ).trim();
		if ( ! normalized.startsWith( '/' ) ) {
			normalized = '/' + normalized;
		}

		normalized = normalized.replace( /\/+$/, '' );
		return normalized || '/';
	}

	function parseDate( value ) {
		if ( ! value ) {
			return new Date( 0 );
		}

		let normalized = String( value );
		if ( /^\d{4}-\d{2}-\d{2}$/.test( normalized ) ) {
			normalized += 'T12:00:00';
		}

		const date = new Date( normalized );
		return Number.isNaN( date.getTime() ) ? new Date( 0 ) : date;
	}

	function estimateReadingTimeLabel( htmlOrText, wordsPerMinute ) {
		const wpm = Number.isFinite( Number( wordsPerMinute ) ) && Number( wordsPerMinute ) > 0 ? Number( wordsPerMinute ) : 220;
		const text = decodeHtml( String( htmlOrText || '' ) );
		const words = text.split( /\s+/ ).filter( Boolean ).length;
		const minutes = Math.max( 1, Math.round( words / wpm ) );
		return minutes + ' min read';
	}

	function getIconName( value ) {
		if ( typeof value !== 'string' ) {
			return '';
		}
		return value.trim().toLowerCase();
	}

	function getLucideIconNode( iconName ) {
		const normalized = getIconName( iconName );
		return LUCIDE_ICON_NODES[ normalized ] || null;
	}

	function renderLucideIcon( createElement, iconName, options ) {
		if ( typeof createElement !== 'function' ) {
			return null;
		}

		const iconNode = getLucideIconNode( iconName );
		if ( ! iconNode ) {
			return null;
		}

		const settings = options && typeof options === 'object' ? options : {};
		const requestedSize = Number( settings.size );
		const size = Number.isFinite( requestedSize ) && requestedSize > 0 ? requestedSize : 16;
		const className = typeof settings.className === 'string' ? settings.className.trim() : '';
		const title = typeof settings.title === 'string' ? settings.title.trim() : '';
		const extraProps = settings.props && typeof settings.props === 'object' ? settings.props : {};
		const svgProps = Object.assign(
			{
				xmlns: 'http://www.w3.org/2000/svg',
				width: size,
				height: size,
				viewBox: '0 0 24 24',
				fill: 'none',
				stroke: 'currentColor',
				strokeWidth: 2,
				strokeLinecap: 'round',
				strokeLinejoin: 'round',
				focusable: 'false',
			},
			extraProps
		);

		if ( className ) {
			svgProps.className = className;
		}

		if ( title ) {
			svgProps.role = 'img';
		} else {
			svgProps['aria-hidden'] = 'true';
		}

		const children = [];
		if ( title ) {
			children.push( createElement( 'title', { key: 'title' }, title ) );
		}

		iconNode.forEach( function ( node, index ) {
			if ( ! Array.isArray( node ) || node.length !== 2 ) {
				return;
			}
			const tag = node[ 0 ];
			const attrs = node[ 1 ] && typeof node[ 1 ] === 'object' ? node[ 1 ] : {};
			children.push( createElement( tag, Object.assign( { key: getIconName( iconName ) + '-' + String( index ) }, attrs ) ) );
		} );

		return createElement( 'svg', svgProps, children );
	}

	global.hdcSharedUtils = {
		decodeHtml: decodeHtml,
		normalizePathname: normalizePathname,
		parseDate: parseDate,
		estimateReadingTimeLabel: estimateReadingTimeLabel,
		getLucideIconNode: getLucideIconNode,
		renderLucideIcon: renderLucideIcon,
	};
} )( window );
