# Work Showcase Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the WordPress `work-showcase` block to functional + visual parity with the React `Work.tsx` page by adding the Refine UI (role + signals filters), saved-view restore, active-facet chip rail, "Showing X of Y" header, keyboard shortcuts, engineering-signal degradation messaging, repo-card structural fixes, surface-tone CSS, and a curated-data refresh.

**Architecture:** All changes are block-local except (a) one new Lucide icon node added to the shared utils, and (b) two reusable surface-tone aliases added to `design-system.css` while reusing the existing `.surface-inset-soft` utility. The block is hand-written `wp.element.createElement` (no JSX, no build step for `view.js`) so the existing patterns are extended in place rather than rewritten. URL state continues to use `window.history.replaceState` and the existing `buildWorkSearchParams` / `readInitialWorkState` helpers. localStorage is accessed via try/catch, mirroring the `site-shell` block.

**Tech Stack:** WordPress 6.9.4, PHP 8.5, vanilla JS (`wp.element.createElement` / Preact-style `h`), CSS with `--wpds-*` design tokens, MariaDB 11.8. No build pipeline for this block's `view.js`. Verification via `node -c`, `php -l`, `npm run smoke:route`, `npm run smoke:api`, and a parity-checker re-run.

**Source design doc:** `wp-content/themes/henrys-digital-canvas/docs/plans/2026-05-02-work-showcase-parity-design.md`

**React source root:** `/home/dev/henry-s-digital-canvas/src/`

**Site working dir:** `/home/dev/wp-hperkins-com`. Theme dir (where `npm run smoke:*` lives): `wp-content/themes/henrys-digital-canvas`.

---

## File Map

| File | Change |
|------|--------|
| `wp-content/themes/henrys-digital-canvas/assets/js/hdc-shared-utils.js` | Add `sliders-horizontal` icon node |
| `wp-content/themes/henrys-digital-canvas/assets/css/design-system.css` | Add `.surface-learning-paper` and `.surface-ember-veil`; confirm/reuse existing `.surface-inset-soft` |
| `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js` | New constants/parsers, Refine UI, signals notices, repo-card adjustments, copy fixes, surface-tone classes, keyboard shortcuts, localStorage |
| `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/style.css` | Refine button/panel chrome, active-facet chip rail, drop redundant card chrome where utility classes take over |
| `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/render.php` | Add `data-contrast-probe="hero-meta-work"` on the hero meta paragraph |
| `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repos.json` | Refresh from `src/data/repos.ts` |
| `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repo-case-study-details.json` | Refresh from `src/data/repo-case-study-details.ts` |

---

## Verification Note (TDD adaptation)

This codebase has no JS unit-test harness for blocks; verification uses `node -c` (syntax), `npm run smoke:route` / `smoke:api` (HTTP/REST), and a parity-checker re-run at the end. Each task therefore follows: implement → syntax check → (smoke after each phase) → commit. Browser visual verification is deferred to the final verification phase — Playwright MCP is unavailable in the current session, so document the manual checks needed and mention this gap to the user.

Run smoke commands from the theme dir:

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:route
cd wp-content/themes/henrys-digital-canvas && npm run smoke:api
```

---

## Phase 1: Refine UI, URL state, and active-facet chip rail

### Task 1: Add the `sliders-horizontal` icon to the shared registry

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/assets/js/hdc-shared-utils.js` (insert between `'share-2'` ending around line 287 and the next entry — alphabetical position before `'sparkles'` if present, otherwise just after `'share-2'`)

- [ ] **Step 1: Locate insertion point**

Open `assets/js/hdc-shared-utils.js`. Find the entry that closes `'share-2': [ ... ],`. The new entry goes immediately after.

- [ ] **Step 2: Add the icon node**

Insert the following block right after the `'share-2'` entry's closing `],`:

```js
		'sliders-horizontal': [
			[ 'line', { x1: '21', x2: '14', y1: '4', y2: '4' } ],
			[ 'line', { x1: '10', x2: '3', y1: '4', y2: '4' } ],
			[ 'line', { x1: '21', x2: '12', y1: '12', y2: '12' } ],
			[ 'line', { x1: '8', x2: '3', y1: '12', y2: '12' } ],
			[ 'line', { x1: '21', x2: '16', y1: '20', y2: '20' } ],
			[ 'line', { x1: '12', x2: '3', y1: '20', y2: '20' } ],
			[ 'line', { x1: '14', x2: '14', y1: '2', y2: '6' } ],
			[ 'line', { x1: '8', x2: '8', y1: '10', y2: '14' } ],
			[ 'line', { x1: '16', x2: '16', y1: '18', y2: '22' } ],
		],
```

- [ ] **Step 3: Syntax check**

```bash
node -c wp-content/themes/henrys-digital-canvas/assets/js/hdc-shared-utils.js
```

Expected: no output (syntax OK).

- [ ] **Step 4: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/assets/js/hdc-shared-utils.js
git commit -m "feat(shared-utils): add sliders-horizontal icon for work refine button"
```

---

### Task 2: Extend URL state, parsers, and constants in view.js

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js`

- [ ] **Step 1: Add missing SIGNAL constants near `ROLE_ORDER`**

Locate the existing `ROLE_ORDER` constant (search for `const ROLE_ORDER`). `SIGNAL_LABEL_MAP` may already exist in this file; do **not** add it twice. Add only the missing constants immediately after `ROLE_ORDER` / the existing signal label map block:

```js
	const SIGNAL_ORDER = [ 'tested', 'typed', 'ci', 'docs', 'observability' ];
	const WORK_LAST_REFINE_VIEW_STORAGE_KEY = 'work-last-refine-view';
```

If `SIGNAL_LABEL_MAP` is missing in your checkout, add this block once, directly next to `SIGNAL_ORDER`:

```js
	const SIGNAL_LABEL_MAP = {
		tested: 'Tested',
		typed: 'Typed',
		ci: 'CI',
		docs: 'Docs',
		observability: 'Observability',
	};
```

- [ ] **Step 2: Add `parseWorkRole` and `parseWorkSignals` helpers**

Find the existing `parseWorkPage` function. Add immediately after it:

```js
	function parseWorkRole( value, validRoles ) {
		const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
		if ( ! normalized ) {
			return null;
		}
		const match = validRoles.find( function ( role ) {
			return role.toLowerCase() === normalized;
		} );
		return match || null;
	}

	function parseWorkSignals( value ) {
		if ( ! value || typeof value !== 'string' ) {
			return [];
		}
		const requested = new Set(
			value
				.split( ',' )
				.map( function ( token ) {
					return token.trim().toLowerCase();
				} )
				.filter( Boolean )
		);
		return SIGNAL_ORDER.filter( function ( signal ) {
			return requested.has( signal );
		} );
	}

	function getNormalizedWorkSignals( signals ) {
		const requested = new Set( ( signals || [] ).map( String ) );
		return SIGNAL_ORDER.filter( function ( signal ) {
			return requested.has( signal );
		} );
	}

	function getWorkSignalsKey( signals ) {
		return getNormalizedWorkSignals( signals ).join( ',' );
	}

	function buildSavedRefineViewSummary( savedView ) {
		if ( ! savedView ) {
			return '';
		}
		const parts = [];
		if ( savedView.role ) {
			parts.push( savedView.role );
		}
		if ( savedView.signals && savedView.signals.length > 0 ) {
			parts.push(
				savedView.signals
					.map( function ( signal ) {
						return SIGNAL_LABEL_MAP[ signal ] || signal;
					} )
					.join( ', ' )
			);
		}
		return parts.join( ', ' );
	}

	function readSavedWorkRefineView() {
		if ( typeof window === 'undefined' ) {
			return null;
		}
		try {
			if ( ! window.localStorage ) {
				return null;
			}
			const raw = window.localStorage.getItem( WORK_LAST_REFINE_VIEW_STORAGE_KEY );
			if ( ! raw ) {
				return null;
			}
			const parsed = JSON.parse( raw );
			const role = parseWorkRole(
				typeof parsed.role === 'string' ? parsed.role : null,
				ROLE_ORDER
			);
			const signals = Array.isArray( parsed.signals )
				? parseWorkSignals( parsed.signals.join( ',' ) )
				: parseWorkSignals( typeof parsed.signals === 'string' ? parsed.signals : null );
			if ( ! role && signals.length === 0 ) {
				return null;
			}
			return { role: role, signals: signals };
		} catch ( error ) {
			return null;
		}
	}

	function isEditableTarget( target ) {
		if ( ! target || ! target.tagName ) {
			return false;
		}
		if ( target.isContentEditable ) {
			return true;
		}
		return [ 'INPUT', 'SELECT', 'TEXTAREA' ].indexOf( target.tagName ) !== -1;
	}
```

Current `view.js` already has `getSignalBadges( repo )`. If your checkout does not, add the function below near the other top-level repo helpers; otherwise leave the existing implementation in place, or only update its `repo.signals` branch to return `getNormalizedWorkSignals( repo.signals )` if needed:

```js
	function getSignalBadges( repo ) {
		if ( Array.isArray( repo.signals ) && repo.signals.length > 0 ) {
			return getNormalizedWorkSignals( repo.signals );
		}

		const inferred = [];
		if ( repo.language === 'TypeScript' ) {
			inferred.push( 'typed' );
		}
		const hasDocsTopic = ( repo.topics || [] ).some( function ( topic ) {
			const lower = String( topic || '' ).toLowerCase();
			return lower === 'documentation' || lower === 'docs' || lower === 'runbook' || lower === 'operations';
		} );
		if ( hasDocsTopic ) {
			inferred.push( 'docs' );
		}
		if ( repo.origin === 'github' ) {
			inferred.push( 'ci' );
		}
		return Array.from( new Set( inferred ) );
	}
```

- [ ] **Step 3: Extend `buildWorkSearchParams` to write `role` and `signals`**

Find `function buildWorkSearchParams( options )`. Replace it with:

```js
	function buildWorkSearchParams( options ) {
		const params = new URLSearchParams();
		if ( options.filter !== DEFAULT_FILTER ) {
			params.set( 'language', options.filter );
		}
		if ( options.sort !== DEFAULT_SORT ) {
			params.set( 'sort', options.sort );
		}
		if ( options.view !== DEFAULT_VIEW ) {
			params.set( 'view', options.view );
		}
		if ( options.view === 'grid' && options.page > 1 ) {
			params.set( 'page', String( options.page ) );
		}
		if ( options.role ) {
			params.set( 'role', options.role );
		}
		const normalizedSignals = getNormalizedWorkSignals( options.signals || [] );
		if ( normalizedSignals.length > 0 ) {
			params.set( 'signals', normalizedSignals.join( ',' ) );
		}
		return params;
	}
```

- [ ] **Step 4: Extend `readInitialWorkState` to read `role` and `signals`**

Find `function readInitialWorkState()`. Replace it with:

```js
	function readInitialWorkState() {
		if ( typeof window === 'undefined' || ! window.location ) {
			return {
				filter: DEFAULT_FILTER,
				sort: DEFAULT_SORT,
				view: DEFAULT_VIEW,
				page: 1,
				role: null,
				signals: [],
			};
		}

		const params = new URLSearchParams( window.location.search );
		return {
			filter: parseWorkFilter( params.get( 'language' ) ),
			sort: parseWorkSort( params.get( 'sort' ) ),
			view: parseWorkView( params.get( 'view' ) ),
			page: parseWorkPage( params.get( 'page' ) ),
			role: parseWorkRole( params.get( 'role' ), ROLE_ORDER ),
			signals: parseWorkSignals( params.get( 'signals' ) ),
		};
	}
```

- [ ] **Step 5: Syntax check**

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
```

Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
git commit -m "feat(work-showcase): add role/signals URL parsers and storage helpers"
```

---

### Task 3: Add `activeRole`/`activeSignals` state and gate sections on `hasActiveBrowseFilters`

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js` (inside `WorkShowcaseApp`)

- [ ] **Step 1: Add new state hooks**

Inside `WorkShowcaseApp`, after the existing `const [ showPendingRepos, setShowPendingRepos ] = useState( false );` line, add:

```js
			const [ activeRole, setActiveRole ] = useState( initialState.role );
			const [ activeSignals, setActiveSignals ] = useState( initialState.signals );
			const [ isRefineOpen, setIsRefineOpen ] = useState(
				Boolean( initialState.role ) || initialState.signals.length > 0
			);
			const [ savedRefineView, setSavedRefineView ] = useState( function () {
				if ( initialState.role || initialState.signals.length > 0 ) {
					return { role: initialState.role, signals: initialState.signals };
				}
				return readSavedWorkRefineView();
			} );
```

- [ ] **Step 2: Derive flags and the saved-view summary**

Find the existing `const activeFilter = useMemo(...)` block. Below it (after the `useEffect` that syncs filter back), add:

```js
			const activeSignalsKey = useMemo(
				function () {
					return getWorkSignalsKey( activeSignals );
				},
				[ activeSignals ]
			);
			const hasActiveLanguageFilter = activeFilter !== DEFAULT_FILTER;
			const hasActiveRoleFilter = activeRole !== null;
			const hasActiveSignalFilters = activeSignals.length > 0;
			const hasActiveBrowseFilters =
				hasActiveLanguageFilter || hasActiveRoleFilter || hasActiveSignalFilters;
			const savedRefineViewSummary = buildSavedRefineViewSummary( savedRefineView );
			const canRestoreLastView =
				! hasActiveRoleFilter &&
				! hasActiveSignalFilters &&
				savedRefineView !== null &&
				savedRefineViewSummary.length > 0;
```

- [ ] **Step 3: Extend the `filtered` memo with role + signals filtering**

Find the existing `const filtered = useMemo(...)`. Replace with:

```js
			const filtered = useMemo(
				function () {
					return repos
						.filter( function ( repo ) {
							if ( activeFilter !== DEFAULT_FILTER && normalizeLanguage( repo.language ) !== activeFilter ) {
								return false;
							}
							if ( activeRole !== null && repo.role !== activeRole ) {
								return false;
							}
							if ( activeSignals.length > 0 ) {
								const repoSignals = getSignalBadges( repo );
								for ( let i = 0; i < activeSignals.length; i++ ) {
									if ( repoSignals.indexOf( activeSignals[ i ] ) === -1 ) {
										return false;
									}
								}
							}
							return true;
						} )
						.sort( function ( a, b ) {
							if ( effectiveSort === 'stars' ) {
								if ( b.stars !== a.stars ) {
									return b.stars - a.stars;
								}
								return a.name.localeCompare( b.name );
							}
							return compareReposByUpdatedAtDesc( a, b );
						} );
				},
				[ repos, activeFilter, activeRole, activeSignalsKey, effectiveSort ]
			);
```

- [ ] **Step 4: Gate `showFeaturedCaseStudies` and `showRoleGroups` on `!hasActiveBrowseFilters`**

Find the existing assignments. Replace:

```js
			const showFeaturedCaseStudies = view === 'grid' && activeFilter === DEFAULT_FILTER && featuredCaseStudies.length > 0;
```

with:

```js
			const showFeaturedCaseStudies = view === 'grid' && ! hasActiveBrowseFilters && featuredCaseStudies.length > 0;
```

And:

```js
			const showRoleGroups = view === 'grid' && activeFilter === DEFAULT_FILTER && reposByRole.length > 0;
```

with:

```js
			const showRoleGroups = view === 'grid' && ! hasActiveBrowseFilters && reposByRole.length > 0;
```

- [ ] **Step 5: Extend the URL-sync `useEffect` dependency list**

Find the `useEffect` whose body calls `buildWorkSearchParams({ filter: activeFilter, page: ..., sort: sort, view: view })` (it writes `window.history.replaceState`). Replace its body with:

```js
			useEffect(
				function () {
					if ( typeof window === 'undefined' || ! window.location ) {
						return;
					}

					const nextParams = buildWorkSearchParams( {
						filter: activeFilter,
						page: view === 'grid' ? safePage : 1,
						sort: sort,
						view: view,
						role: activeRole,
						signals: activeSignals,
					} );
					const nextSearch = nextParams.toString();
					const currentUrl = new URL( window.location.href );
					if ( currentUrl.search.replace( /^\?/, '' ) === nextSearch ) {
						return;
					}

					currentUrl.search = nextSearch;
					window.history.replaceState( window.history.state, '', currentUrl.toString() );
				},
				[ activeFilter, safePage, sort, view, activeRole, activeSignalsKey ]
			);
```

- [ ] **Step 6: Syntax check**

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
```

- [ ] **Step 7: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
git commit -m "feat(work-showcase): add activeRole/activeSignals state and filter gating"
```

---

### Task 4: Add Refine handlers and clear handlers

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js` (inside `WorkShowcaseApp`)

- [ ] **Step 1: Add the `rememberSavedRefineView` and handler functions**

Find the existing `function handleFilterChange( value )` definition. Insert before it:

```js
			function rememberSavedRefineView( nextRole, nextSignals ) {
				const normalizedSignals = getNormalizedWorkSignals( nextSignals );
				if ( ! nextRole && normalizedSignals.length === 0 ) {
					return;
				}
				const nextSavedView = { role: nextRole || null, signals: normalizedSignals };
				if ( typeof window !== 'undefined' && window.localStorage ) {
					try {
						window.localStorage.setItem(
							WORK_LAST_REFINE_VIEW_STORAGE_KEY,
							JSON.stringify( nextSavedView )
						);
					} catch ( error ) {
						/* localStorage may be disabled — ignore */
					}
				}
				setSavedRefineView( nextSavedView );
			}

			function handleRoleChange( value ) {
				const nextRole = value && ROLE_ORDER.indexOf( value ) !== -1 ? value : null;
				if ( nextRole === activeRole ) {
					return;
				}
				rememberSavedRefineView( nextRole, activeSignals );
				setActiveRole( nextRole );
				setPage( 1 );
				setShowPendingRepos( false );
			}

			function handleSignalsChange( nextSignals ) {
				const normalized = getNormalizedWorkSignals( nextSignals );
				if ( getWorkSignalsKey( normalized ) === activeSignalsKey ) {
					return;
				}
				rememberSavedRefineView( activeRole, normalized );
				setActiveSignals( normalized );
				setPage( 1 );
				setShowPendingRepos( false );
			}

			function handleClearLanguage() {
				setFilter( DEFAULT_FILTER );
				setPage( 1 );
				setShowPendingRepos( false );
			}

			function handleClearRole() {
				rememberSavedRefineView( null, activeSignals );
				setActiveRole( null );
				setPage( 1 );
				setShowPendingRepos( false );
			}

			function handleClearSignals() {
				rememberSavedRefineView( activeRole, [] );
				setActiveSignals( [] );
				setPage( 1 );
				setShowPendingRepos( false );
			}

			function handleClearAllFilters() {
				if ( ! hasActiveBrowseFilters ) {
					return;
				}
				setFilter( DEFAULT_FILTER );
				setActiveRole( null );
				setActiveSignals( [] );
				setPage( 1 );
				setShowPendingRepos( false );
			}

			function handleRestoreLastView() {
				if ( ! savedRefineView ) {
					return;
				}
				setActiveRole( savedRefineView.role );
				setActiveSignals( getNormalizedWorkSignals( savedRefineView.signals ) );
				setPage( 1 );
				setIsRefineOpen( true );
				setShowPendingRepos( false );
			}
```

- [ ] **Step 2: Syntax check**

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
```

- [ ] **Step 3: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
git commit -m "feat(work-showcase): add refine + clear handlers with savedRefineView write-through"
```

---

### Task 5: Rebuild `FiltersBar` to render the Refine drawer + active-facet rail

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js` (`FiltersBar` function)

- [ ] **Step 1: Replace the existing `FiltersBar` function**

Find `function FiltersBar( props ) {` and replace the entire function (down to its closing `}`) with:

```js
	function FiltersBar( props ) {
		const activeFacetActions = [
			props.value !== DEFAULT_FILTER
				? { label: 'Language: ' + props.value, onClear: props.onClearLanguage }
				: null,
			props.activeRole
				? { label: 'Role: ' + props.activeRole, onClear: props.onClearRole }
				: null,
			props.activeSignals.length > 0
				? {
					label:
						'Signals: ' +
						props.activeSignals
							.map( function ( signal ) {
								return SIGNAL_LABEL_MAP[ signal ] || signal;
							} )
							.join( ', ' ),
					onClear: props.onClearSignals,
				}
				: null,
		].filter( Boolean );
		const activeRefineFilterCount =
			( props.activeRole ? 1 : 0 ) + ( props.activeSignals.length > 0 ? 1 : 0 );
		const refineButtonLabel =
			activeRefineFilterCount > 0 ? 'Refine (' + activeRefineFilterCount + ')' : 'Refine';
		const summaryLabel = 'Showing ' + props.matchingRepoCount + ' of ' + props.totalRepoCount;

		return h(
			'section',
			{ className: classNames( 'hdc-work-filters', 'surface-learning-paper' ) },
			h(
				'div',
				{ className: 'hdc-work-filters-row' },
				h(
					'div',
					{ className: 'hdc-work-filter-language' },
					h( 'span', { className: 'hdc-work-control-label' }, 'Language' ),
					h(
						'div',
						{
							className: 'hdc-work-chip-rail',
							role: 'group',
							'aria-label': 'Filter by language',
						},
						props.languages.map( function ( option ) {
							return h(
								'button',
								{
									type: 'button',
									key: option,
									className: classNames( 'hdc-work-chip', props.value === option && 'is-active' ),
									onClick: function () {
										props.onFilterChange( option );
									},
									'aria-pressed': props.value === option ? 'true' : 'false',
								},
								option
							);
						} )
					)
				),
				h(
					'div',
					{ className: 'hdc-work-filters-actions' },
					props.canRestoreLastView
						? h(
							'button',
							{
								type: 'button',
								className: 'hdc-work-button is-outline',
								onClick: props.onRestoreLastView,
								'aria-label': 'Restore your last view: ' + props.savedViewSummary,
							},
							'Your last view'
						)
						: null,
					h(
						'button',
						{
							type: 'button',
							className: classNames(
								'hdc-work-button',
								'is-outline',
								'hdc-work-refine-button',
								props.isRefineOpen && 'is-open'
							),
							onClick: function () {
								props.onRefineOpenChange( ! props.isRefineOpen );
							},
							'aria-expanded': props.isRefineOpen ? 'true' : 'false',
						},
						h(
							'span',
							{ className: 'hdc-work-refine-icon', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'sliders-horizontal', {
								className: 'hdc-work-refine-icon-svg',
								size: 14,
							} )
						),
						h( 'span', null, refineButtonLabel ),
						h(
							'span',
							{ className: 'hdc-work-refine-chevron', 'aria-hidden': 'true' },
							renderLucideIcon( h, 'chevron-down', {
								className: 'hdc-work-refine-chevron-svg',
								size: 14,
							} )
						)
					),
					h(
						'div',
						{ className: 'hdc-work-view-toggle', role: 'group', 'aria-label': 'Choose repository view' },
						h(
							'button',
							{
								type: 'button',
								className: classNames( 'hdc-work-view-button', props.view === 'grid' && 'is-active' ),
								onClick: function () {
									props.onViewChange( 'grid' );
								},
								'aria-pressed': props.view === 'grid' ? 'true' : 'false',
							},
							'Grid view'
						),
						h(
							'button',
							{
								type: 'button',
								className: classNames( 'hdc-work-view-button', props.view === 'timeline' && 'is-active' ),
								onClick: function () {
									props.onViewChange( 'timeline' );
								},
								'aria-pressed': props.view === 'timeline' ? 'true' : 'false',
							},
							'Timeline view'
						)
					),
					props.view === 'grid'
						? h(
							'label',
							{ className: 'hdc-work-control hdc-work-control-sort' },
							h( 'span', { className: 'hdc-work-control-label' }, 'Sort' ),
							h(
								'select',
								{
									className: 'hdc-work-select',
									value: props.sort,
									onChange: function ( event ) {
										props.onSortChange( event.target.value );
									},
									'aria-label': 'Sort projects',
								},
								h( 'option', { value: 'stars' }, 'Sort by Stars' ),
								h( 'option', { value: 'updated' }, 'Sort by Updated' )
							)
						)
						: h(
							'p',
							{ className: 'hdc-work-control-note' },
							'Timeline is always newest-first.'
						)
				)
			),
			props.isRefineOpen
				? h(
					'div',
					{
						className: 'hdc-work-refine-panel',
						role: 'region',
						'aria-label': 'Refine work view',
					},
					h(
						'div',
						{ className: 'hdc-work-refine-section' },
						h( 'p', { className: 'hdc-work-refine-section-label' }, 'Role' ),
						h(
							'div',
							{
								className: 'hdc-work-refine-roles',
								role: 'group',
								'aria-label': 'Filter by role',
							},
							[ null ].concat( ROLE_ORDER ).map( function ( role ) {
								const value = role || '';
								const label = role || 'All roles';
								const isActive = ( role || null ) === props.activeRole;
								return h(
									'button',
									{
										type: 'button',
										key: 'role-' + ( value || 'all' ),
										className: classNames( 'hdc-work-chip', isActive && 'is-active' ),
										onClick: function () {
											props.onRoleChange( role || null );
										},
										'aria-pressed': isActive ? 'true' : 'false',
									},
									label
								);
							} )
						)
					),
					h(
						'fieldset',
						{ className: 'hdc-work-refine-section hdc-work-refine-signals' },
						h( 'legend', { className: 'hdc-work-refine-section-label' }, 'Signals' ),
						h(
							'div',
							{ className: 'hdc-work-refine-signal-grid' },
							SIGNAL_ORDER.map( function ( signal ) {
								const checked = props.activeSignals.indexOf( signal ) !== -1;
								return h(
									'button',
									{
										type: 'button',
										key: 'signal-' + signal,
										className: classNames( 'hdc-work-chip', checked && 'is-active' ),
										onClick: function () {
											const next = checked
												? props.activeSignals.filter( function ( entry ) {
													return entry !== signal;
												} )
												: props.activeSignals.concat( [ signal ] );
											props.onSignalsChange( next );
										},
										'aria-pressed': checked ? 'true' : 'false',
									},
									SIGNAL_LABEL_MAP[ signal ]
								);
							} )
						)
					)
				)
				: null,
			h(
				'div',
				{
					className: 'hdc-work-filters-active',
					'data-contrast-probe': 'work-filters-active',
				},
				h(
					'div',
					{ className: 'hdc-work-filters-active-row' },
					h(
						'p',
						{
							'aria-live': 'polite',
							'aria-atomic': 'true',
							className: 'hdc-work-filters-summary',
						},
						summaryLabel
					),
					activeFacetActions.length > 0
						? h(
							'div',
							{ className: 'hdc-work-filters-facet-row' },
							activeFacetActions
								.map( function ( facet ) {
									return h(
										'button',
										{
											type: 'button',
											key: 'facet-' + facet.label,
											className: 'hdc-work-button is-outline hdc-work-facet-pill',
											onClick: facet.onClear,
										},
										facet.label
									);
								} )
								.concat( [
									h(
										'button',
										{
											type: 'button',
											key: 'facet-clear-all',
											className: 'hdc-work-button is-link',
											onClick: props.onClearAllFilters,
										},
										'Clear all'
									),
								] )
						)
						: null
				)
			),
			props.showDetailsUnavailableMessage
				? h(
					'p',
					{ className: 'hdc-work-hint' },
					'Case-study details are temporarily unavailable. Showing standard repository data.'
				)
				: null
		);
	}
```

- [ ] **Step 2: Update the `FiltersBar` invocation in the render to pass new props**

Find the existing `h( FiltersBar, { languages: ..., onFilterChange: ..., onSortChange: ..., onViewChange: ..., showDetailsUnavailableMessage: ..., sort: ..., value: ..., view: ... } )` block in the render. Replace with:

```js
							h( FiltersBar, {
								activeRole: activeRole,
								activeSignals: activeSignals,
								canRestoreLastView: canRestoreLastView,
								isRefineOpen: isRefineOpen,
								languages: languages,
								matchingRepoCount: filtered.length,
								onClearAllFilters: handleClearAllFilters,
								onClearLanguage: handleClearLanguage,
								onClearRole: handleClearRole,
								onClearSignals: handleClearSignals,
								onFilterChange: handleFilterChange,
								onRefineOpenChange: setIsRefineOpen,
								onRestoreLastView: handleRestoreLastView,
								onRoleChange: handleRoleChange,
								onSignalsChange: handleSignalsChange,
								onSortChange: handleSortChange,
								onViewChange: handleViewChange,
								savedViewSummary: savedRefineViewSummary,
								showDetailsUnavailableMessage: detailsUnavailable,
								sort: sort,
								totalRepoCount: repos.length,
								value: activeFilter,
								view: view,
							} ),
```

- [ ] **Step 3: Syntax check**

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
```

- [ ] **Step 4: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
git commit -m "feat(work-showcase): rebuild filters bar with refine drawer and active-facet rail"
```

---

### Task 6: Add CSS for the Refine button, panel, and active-facet rail

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/style.css`

- [ ] **Step 1: Append new styles**

Append to the end of `style.css`:

```css
/* ---- Refine drawer + active-facet chip rail ---- */

.hdc-work-filters-row {
	display: flex;
	flex-wrap: wrap;
	align-items: flex-end;
	gap: var(--wpds-spacing-md, 1rem);
	justify-content: space-between;
}

.hdc-work-filters-actions {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--wpds-spacing-sm, 0.625rem);
}

.hdc-work-refine-button {
	display: inline-flex;
	align-items: center;
	gap: 0.4rem;
}

.hdc-work-refine-button .hdc-work-refine-chevron {
	display: inline-flex;
	transition: transform 0.18s ease;
}

.hdc-work-refine-button.is-open .hdc-work-refine-chevron {
	transform: rotate(180deg);
}

.hdc-work-refine-panel {
	margin-top: var(--wpds-spacing-md, 1rem);
	padding-top: var(--wpds-spacing-md, 1rem);
	border-top: 1px solid hsl(var(--border) / 0.7);
	display: flex;
	flex-direction: column;
	gap: var(--wpds-spacing-md, 1rem);
}

.hdc-work-refine-section-label {
	margin: 0 0 0.4rem 0;
	font-size: 0.72rem;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: hsl(var(--text-meta));
}

.hdc-work-refine-roles,
.hdc-work-refine-signal-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 0.55rem;
}

.hdc-work-refine-signals {
	border: 0;
	margin: 0;
	padding: 0;
}

.hdc-work-filters-active {
	margin-top: var(--wpds-spacing-md, 1rem);
	padding: 0.75rem 0.85rem;
	border: 1px solid hsl(var(--border) / 0.7);
	border-radius: var(--radius);
	background: hsl(var(--surface-2) / 0.6);
}

.hdc-work-filters-active-row {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.75rem;
	justify-content: space-between;
}

.hdc-work-filters-summary {
	margin: 0;
	font-size: 0.92rem;
	color: hsl(var(--foreground));
}

.hdc-work-filters-facet-row {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem;
}

.hdc-work-facet-pill {
	font-size: 0.78rem;
}
```

- [ ] **Step 2: Verify the CSS is valid (no syntax errors)**

```bash
node -e "const fs=require('fs'); const css=fs.readFileSync('wp-content/themes/henrys-digital-canvas/blocks/work-showcase/style.css','utf8'); const open=(css.match(/{/g)||[]).length; const close=(css.match(/}/g)||[]).length; if (open!==close) { console.error('BRACE MISMATCH', open, close); process.exit(1); } console.log('braces match:', open);"
```

Expected: `braces match: <number>` (open === close).

- [ ] **Step 3: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/style.css
git commit -m "feat(work-showcase): style refine button, panel, and active-facet chip rail"
```

---

### Task 7: Per-facet empty-state actions and contextual description

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js` (the EmptyState invocation in `WorkShowcaseApp`)

- [ ] **Step 1: Replace the EmptyState block in the render**

Find the existing `filtered.length === 0 ? h( EmptyState, { title: 'No projects found', description: 'No repositories matched that language filter.', action: ... } )` block and replace it with:

```js
							filtered.length === 0
								? ( function () {
									const emptyStateActions = [
										hasActiveRoleFilter
											? { label: 'Clear role', onClick: handleClearRole }
											: null,
										hasActiveSignalFilters
											? { label: 'Clear signals', onClick: handleClearSignals }
											: null,
										hasActiveLanguageFilter
											? { label: 'Clear language', onClick: handleClearLanguage }
											: null,
									].filter( Boolean );
									return h( EmptyState, {
										title: 'No projects found',
										description: hasActiveBrowseFilters
											? 'No repositories matched the current filters.'
											: 'No repositories are available right now.',
										action:
											emptyStateActions.length > 0
												? h(
													'div',
													{ className: 'hdc-work-empty-actions' },
													emptyStateActions.map( function ( action ) {
														return h(
															'button',
															{
																type: 'button',
																key: 'empty-' + action.label,
																className: 'hdc-work-button is-link',
																onClick: action.onClick,
															},
															action.label
														);
													} )
												)
												: h(
													'button',
													{
														type: 'button',
														className: 'hdc-work-button is-link',
														onClick: handleClearAllFilters,
													},
													'View all projects'
												),
									} );
								} )()
								: h(
```

(Make sure the existing `: h( Fragment, null, ... )` chain still follows after the closing `)()`.)

- [ ] **Step 2: Add a small CSS rule for the actions row**

Append to `blocks/work-showcase/style.css`:

```css
.hdc-work-empty-actions {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.75rem;
}
```

- [ ] **Step 3: Syntax check**

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
```

- [ ] **Step 4: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js wp-content/themes/henrys-digital-canvas/blocks/work-showcase/style.css
git commit -m "feat(work-showcase): per-facet empty-state actions and contextual description"
```

---

### Task 8: Global keyboard shortcuts (`/`, `r`, `Escape`)

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js` (inside `WorkShowcaseApp`, near the existing reveal-observer effect)

- [ ] **Step 1: Add a `useEffect` for keyboard shortcuts**

Before inserting the keyboard shortcut effect, update the existing reveal-observer `useEffect` dependency list from `[ loading, error, page, view, activeFilter ]` to `[ loading, error, page, view, activeFilter, activeRole, activeSignalsKey ]`. Role/signals filters can render new `.hdc-reveal` cards, and the observer must rerun for those cards.

Then insert this `useEffect` immediately after the reveal-observer `useEffect`:

```js
			useEffect(
				function () {
					function handleKeyDown( event ) {
						if ( event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey ) {
							return;
						}
						if (
							event.target instanceof HTMLElement &&
							event.target.closest( "[role='dialog']" )
						) {
							return;
						}
						if ( isEditableTarget( event.target ) ) {
							return;
						}

						if ( event.key === '/' ) {
							event.preventDefault();
							const node = document.querySelector(
								"[aria-label='Filter by language'] [aria-pressed='true']"
							);
							if ( node && typeof node.focus === 'function' ) {
								node.focus();
							}
							return;
						}

						if ( event.key && event.key.toLowerCase() === 'r' ) {
							event.preventDefault();
							setIsRefineOpen( true );
							return;
						}

						if ( event.key === 'Escape' && hasActiveBrowseFilters ) {
							event.preventDefault();
							handleClearAllFilters();
						}
					}

					document.addEventListener( 'keydown', handleKeyDown );
					return function () {
						document.removeEventListener( 'keydown', handleKeyDown );
					};
				},
				[ hasActiveBrowseFilters, sort, view ]
			);
```

- [ ] **Step 2: Syntax check**

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
```

- [ ] **Step 3: Run smoke tests**

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:route
cd wp-content/themes/henrys-digital-canvas && npm run smoke:api
```

Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
git commit -m "feat(work-showcase): add global keyboard shortcuts for /, r, Escape"
```

---

## Phase 2: Engineering Signals notices and source-aware fallback labels

### Task 9: Add degradation-message helpers to view.js

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js`

- [ ] **Step 1: Add three helpers near the other top-level utilities**

Locate `function getRepoRecord(...)`. Insert immediately before it:

```js
	function getGitHubSignalSourceLabel( source ) {
		if ( source === 'fallback-ratelimit' ) {
			return 'Rate limited';
		}
		if ( source === 'fallback-offline' ) {
			return 'Offline';
		}
		if ( source === 'fallback-error' ) {
			return 'Unavailable';
		}
		return null;
	}

	function getGitHubSignalDegradationMessage( source, messages ) {
		if ( source === 'fallback-ratelimit' ) {
			return messages.rateLimit || null;
		}
		if ( source === 'fallback-offline' ) {
			return messages.offline || null;
		}
		if ( source === 'fallback-error' ) {
			return messages.error || null;
		}
		return null;
	}

	function getPreferredGitHubSignalDegradedSource( sources ) {
		const list = Array.isArray( sources ) ? sources : [];
		const priority = [ 'fallback-ratelimit', 'fallback-offline', 'fallback-error' ];
		for ( let i = 0; i < priority.length; i++ ) {
			if ( list.indexOf( priority[ i ] ) !== -1 ) {
				return priority[ i ];
			}
		}
		return null;
	}
```

- [ ] **Step 2: Syntax check**

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
```

- [ ] **Step 3: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
git commit -m "feat(work-showcase): add github signal degradation helpers"
```

---

### Task 10: Render the engineering-signal notice and switch generic Unavailable to source labels

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js` (`SignalsPanel`)

- [ ] **Step 1: Compute the notice and degradation strings near the top of `SignalsPanel`**

Inside `SignalsPanel`, after the `var hasTrackedPublicGitHubRepos = ...` line, add:

```js
		var preferredSignalDegradedSource = getPreferredGitHubSignalDegradedSource( [
			props.contributorStatsSource,
			props.languageSummarySource,
			props.ciStatusSource,
			props.repoProofSource,
		] );
		var engineeringSignalNotice = preferredSignalDegradedSource
			? getGitHubSignalDegradationMessage( preferredSignalDegradedSource, {
				rateLimit:
					'Some engineering signals are temporarily unavailable due to GitHub rate limiting. Repository browse data may still be live.',
				offline:
					"Some engineering signals are temporarily unavailable because you're offline. Repository browse data may still be cached.",
				error:
					'Some engineering signals are temporarily unavailable right now. Repository browse data may still be live.',
			} )
			: null;
		var contributorStatsUnavailableMessage = getGitHubSignalDegradationMessage(
			props.contributorStatsSource,
			{
				rateLimit: 'GitHub contributor commit stats are temporarily unavailable due to rate limiting.',
				offline: "You're offline, so GitHub contributor commit stats are temporarily unavailable.",
				error: 'GitHub contributor commit stats are temporarily unavailable right now.',
			}
		);
		var languageSummaryUnavailableMessage = getGitHubSignalDegradationMessage(
			props.languageSummarySource,
			{
				rateLimit: 'GitHub byte totals are temporarily unavailable due to rate limiting.',
				offline: "You're offline, so GitHub byte totals are temporarily unavailable.",
				error: 'GitHub byte totals are temporarily unavailable right now.',
			}
		);
		var languageSummaryFallbackReason = getGitHubSignalDegradationMessage(
			props.languageSummarySource,
			{
				rateLimit:
					'GitHub byte totals are temporarily rate limited. Showing repo-size-weighted fallback data instead.',
				offline:
					"You're offline, so GitHub byte totals are unavailable. Showing repo-size-weighted fallback data instead.",
				error:
					'GitHub byte totals are temporarily unavailable. Showing repo-size-weighted fallback data instead.',
			}
		);
		var deliveryDegradedSource = getPreferredGitHubSignalDegradedSource( [
			props.ciStatusSource,
			props.repoProofSource,
		] );
		var deliveryDegradationMessages = [
			getGitHubSignalDegradationMessage( props.ciStatusSource, {
				rateLimit: 'CI status is temporarily unavailable due to GitHub rate limiting.',
				offline: "CI status is temporarily unavailable because you're offline.",
				error: 'CI status is temporarily unavailable right now.',
			} ),
			getGitHubSignalDegradationMessage( props.repoProofSource, {
				rateLimit:
					'Community-health and release signals are temporarily unavailable due to GitHub rate limiting.',
				offline:
					"Community-health and release signals are temporarily unavailable because you're offline.",
				error: 'Community-health and release signals are temporarily unavailable right now.',
			} ),
		].filter( Boolean );
```

- [ ] **Step 2: Switch generic `'Unavailable'` strings to source-aware labels**

In the existing `commitValue` ternary (the path that currently ends in `: 'Unavailable'` for the non-live branch), change `'Unavailable'` (in the contributor-stats-source-not-live branch only) to:

```js
( getGitHubSignalSourceLabel( props.contributorStatsSource ) || 'Unavailable' )
```

In `primaryLanguageLabel`, change the trailing `: 'Unavailable'` (in the languageSummarySource-not-live branch) to:

```js
( getGitHubSignalSourceLabel( props.languageSummarySource ) || 'Unavailable' )
```

In `deliveryValue`, replace the trailing `: 'Unavailable'` (where neither CI nor proofs are live) with:

```js
( deliveryDegradedSource
	? ( getGitHubSignalSourceLabel( deliveryDegradedSource ) || 'Unavailable' )
	: 'Unavailable' )
```

(Re-read the existing ternaries carefully and only swap the literal `'Unavailable'` in the degraded-source branches; do not touch the `'Loading...'` / `'Pending'` / `'N/A'` branches.)

- [ ] **Step 3: Render the notice paragraph and delivery degradation messages**

In the `SignalsPanel` JSX-equivalent return, find the call to `h( SectionIntro, { title: 'Engineering Signals', ... } )`. Insert immediately after that call (and before the `h( 'div', { className: 'hdc-work-stats-grid' }, ... )` block):

```js
				engineeringSignalNotice
					? h(
						'p',
						{ className: 'hdc-work-signal-notice' },
						engineeringSignalNotice
					)
					: null,
```

Within the `'Delivery health'` `StatCard` body (the branch that already renders `deliveryItems`, `latestRelease`, `deliveryCoverageItems`), append after `deliveryCoverageItems`:

```js
									deliveryDegradationMessages.length > 0
										? deliveryDegradationMessages.map( function ( message ) {
											return h(
												'p',
												{ key: 'delivery-msg-' + message, className: 'hdc-work-stat-meta' },
												message
											);
										} )
										: null
```

- [ ] **Step 4: Wire the language fallback reason into the language stat body**

Locate the `'Top language by code volume'` `StatCard` body. The block currently builds `languageSummaryItems` higher up. Update that array construction so that, when size-weighted fallback applies, the first element is `languageSummaryFallbackReason || 'Showing repo-size-weighted fallback data instead of GitHub byte totals'`. Use the existing detection (the empty-byte-totals + non-empty `languageBreakdown` from `fallbackLanguageRepos` path).

Concretely, find the `var languageSummaryItems = ...` assignment in `SignalsPanel`. Replace with:

```js
		var isUsingSizeWeightedLanguageFallback =
			props.languageByteTotals.filter( function ( entry ) {
				return entry && entry.bytes > 0;
			} ).length === 0 && languageBreakdown.length > 0;
		var languageSummaryItems = isUsingSizeWeightedLanguageFallback
			? [
				languageSummaryFallbackReason ||
					'Showing repo-size-weighted fallback data instead of GitHub byte totals',
				'Fallback weighted by repo size across ' +
					reposWithPositiveSize.length +
					' active repos',
				substantialRepos.length > 0
					? 'Excludes repos under ' + LANGUAGE_FALLBACK_MIN_REPO_SIZE_KB + ' KB'
					: null,
			].filter( Boolean )
			: [
				props.analyzedRepoCount > 0
					? 'Across ' + formatWholeNumber( props.analyzedRepoCount ) + ' active repos'
					: null,
				props.byteDataIncomplete ? 'Some byte totals are still incomplete' : null,
				props.failedLanguageRequestCount > 0
					? props.failedLanguageRequestCount + ' language requests failed'
					: null,
			].filter( Boolean );
```

(If your existing block has a slightly different identifier for the "no GitHub byte totals" / fallback path — e.g. it uses a different var name for `reposWithPositiveSize` — keep that name. The intent is to compute the boolean once and rebuild the items array.)

- [ ] **Step 5: Replace the language-empty fallback span to use `languageSummaryUnavailableMessage`**

Within the language StatCard body, the path that currently renders `'Byte-weighted language totals are unavailable right now.'` should be replaced with:

```js
								h(
									'span',
									{ className: 'hdc-work-stat-meta' },
									props.languageSummaryIsLoading
										? 'Loading byte-weighted language totals from GitHub.'
										: ( languageSummaryUnavailableMessage ||
											'Byte-weighted language totals are unavailable right now.' )
								)
```

- [ ] **Step 6: Add a small style for `.hdc-work-signal-notice`**

Append to `blocks/work-showcase/style.css`:

```css
.hdc-work-signal-notice {
	margin: 0;
	color: hsl(var(--text-meta));
	font-size: 0.85rem;
}
```

- [ ] **Step 7: Syntax check**

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
```

- [ ] **Step 8: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js wp-content/themes/henrys-digital-canvas/blocks/work-showcase/style.css
git commit -m "feat(work-showcase): engineering-signal notice + source-aware fallback labels"
```

---

## Phase 3: Repo card structural rebuild and small copy fixes

### Task 11: Drop the LanguageBadge double-border, promote title to h3, fix focus styles

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js` (`RepoCard`)
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/style.css`

- [ ] **Step 1: Replace the badge nesting in `RepoCard`**

Find this line in `RepoCard`:

```js
							h( Badge, { variant: 'secondary' }, h( LanguageBadge, { language: repo.language } ) ),
```

Replace with:

```js
							h( LanguageBadge, { language: repo.language } ),
```

- [ ] **Step 2: Promote the title heading from h4 to h3 and class the link**

Find this block in `RepoCard`:

```js
						h(
							'h4',
							{ className: 'hdc-work-repo-title' },
							h(
								'a',
								{
									className: 'hdc-work-inline-link',
									href: getWorkDetailUrl( repo.name ),
								},
								getRepoDisplayName( repo )
							)
						)
```

Replace with:

```js
						h(
							'h3',
							{ className: 'hdc-work-repo-title' },
							h(
								'a',
								{
									className: 'hdc-work-repo-title-link',
									href: getWorkDetailUrl( repo.name ),
								},
								getRepoDisplayName( repo )
							)
						)
```

- [ ] **Step 3: Add focus-ring style for the title link**

Append to `blocks/work-showcase/style.css`:

```css
.hdc-work-repo-title-link {
	color: inherit;
	text-decoration: none;
	border-radius: var(--radius);
}

.hdc-work-repo-title-link:hover {
	color: hsl(var(--link));
}

.hdc-work-repo-title-link:focus-visible {
	outline: 2px solid hsl(var(--ring));
	outline-offset: 2px;
}
```

- [ ] **Step 4: Syntax check**

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
```

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js wp-content/themes/henrys-digital-canvas/blocks/work-showcase/style.css
git commit -m "fix(work-showcase): drop language-badge double border and promote title to h3"
```

---

### Task 12: Add featured cover width/height attrs and the "Loading…" / library copy fixes

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js`

- [ ] **Step 1: Pass width and height to the featured cover img**

Inside `FeaturedCaseStudies`, locate the `<img>` (rendered via `h( 'img', { ... } )`) for the cover image. Add `width: visualSet.cover.width` and `height: visualSet.cover.height` to the props object, guarded by their presence:

```js
								h( 'img', {
									className: 'hdc-work-featured-image',
									src: visualSet.cover.src,
									srcSet: visualSet.cover.srcSet,
									sizes: visualSet.cover.sizes,
									alt: visualSet.cover.alt,
									loading: 'lazy',
									width: visualSet.cover.width || undefined,
									height: visualSet.cover.height || undefined,
								} )
```

(If the existing call uses different field names, preserve them and only add `width` and `height`.)

- [ ] **Step 2: Fix the Repository Library empty-state copy**

Search for:

```js
'These repositories are indexed, but detailed summaries are still being curated.'
```

Replace with:

```js
'These repositories are available, but detailed summaries are still being curated.'
```

- [ ] **Step 3: Normalize the "Syncing from GitHub" ellipsis to ASCII (matches React)**

Search for:

```js
'Syncing from GitHub…'
```

Replace with:

```js
'Syncing from GitHub...'
```

(Note: the React source uses three ASCII dots. Be sure to update any other occurrences of `…` that should match React's ASCII style. Leave intentional Unicode ellipses elsewhere alone.)

- [ ] **Step 4: Syntax check**

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
```

- [ ] **Step 5: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
git commit -m "fix(work-showcase): featured cover dimensions, library copy, ellipsis normalization"
```

---

### Task 13: Add `data-contrast-probe` attributes

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/render.php`
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js`

- [ ] **Step 1: Add the hero meta probe in render.php**

Open `render.php` and locate the hero meta paragraph rendered by SSR (or the meta wrapper). Add the attribute `data-contrast-probe="hero-meta-work"` on the element matching the React tag (most likely the source-label paragraph the SSR pre-renders before the JS app mounts).

If render.php does not currently render a hero meta paragraph (the JS app is the only renderer), instead add the attribute in `view.js` on the source label paragraph: find the line `h( 'p', { className: 'hdc-work-source-label', 'aria-live': 'polite' }, loading ? 'Syncing from GitHub...' : sourceLabel )` and change to:

```js
								h(
									'p',
									{
										className: 'hdc-work-source-label',
										'aria-live': 'polite',
										'data-contrast-probe': 'hero-meta-work',
									},
									loading ? 'Syncing from GitHub...' : sourceLabel
								),
```

- [ ] **Step 2: Add the signals heading probe**

In `SignalsPanel`, find the `h( SectionIntro, { title: 'Engineering Signals', ... } )` call. Replace `title: 'Engineering Signals'` with:

```js
				title: h( 'span', { 'data-contrast-probe': 'ember-heading-work' }, 'Engineering Signals' ),
```

- [ ] **Step 3: Add the featured meta probe**

In `FeaturedCaseStudies`, find the card date/meta `<time>` element rendered next to the role/private badges (`className: 'hdc-work-meta-time'`). Add `'data-contrast-probe': 'ember-meta-work-featured'` to that `<time>` props object. React probes the featured-card metadata, not the section intro paragraph.

- [ ] **Step 4: Add the pending repos body probe**

In `PendingReposPanel`, find the description paragraph (the one inside the panel body explaining the pending list). Add `'data-contrast-probe': 'ember-body-work-pending'` to its props.

- [ ] **Step 5: Validate PHP syntax**

```bash
php -l wp-content/themes/henrys-digital-canvas/blocks/work-showcase/render.php
```

Expected: `No syntax errors detected`.

- [ ] **Step 6: Syntax check view.js**

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
```

- [ ] **Step 7: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/render.php wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
git commit -m "chore(work-showcase): add data-contrast-probe attributes for audit pipeline"
```

---

## Phase 4: Surface tones, signal stat density, and reveal polish

### Task 14: Add reusable surface-tone utility classes

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/assets/css/design-system.css`

- [ ] **Step 1: Add only missing surface-tone aliases**

First search `design-system.css` for `.surface-inset-soft`. It already exists in the current theme and is used by other blocks, so do **not** append a second global `.surface-inset-soft` definition. Add only the missing `.surface-learning-paper` and `.surface-ember-veil` aliases, preferably near the existing surface utilities. If either class already exists in your checkout, leave it unchanged.

Append or insert only this CSS:

```css
/* ---- Reusable WPDS surface tones (parity with React shadcn surfaces) ---- */

.surface-learning-paper {
	background-image: linear-gradient(
		180deg,
		hsl(var(--wpds-surface-paper, var(--surface-2)) / 0.55),
		hsl(var(--wpds-surface-paper, var(--surface-2)) / 0.25)
	);
	border: 1px solid hsl(var(--wpds-border-paper, var(--border)) / 0.7);
}

.surface-ember-veil {
	background-image: linear-gradient(
		180deg,
		hsl(var(--wpds-overlay-ember-start, var(--ember-tint, var(--surface-2))) / 0.5),
		hsl(var(--wpds-overlay-ember-end, var(--ember-tint, var(--surface-2))) / 0.18)
	);
	border: 1px solid hsl(var(--wpds-border-ember, var(--border)) / 0.6);
}
```

Then confirm the existing `.surface-inset-soft` remains present exactly once.

- [ ] **Step 2: Verify CSS braces balance**

```bash
node -e "const fs=require('fs'); const css=fs.readFileSync('wp-content/themes/henrys-digital-canvas/assets/css/design-system.css','utf8'); const open=(css.match(/{/g)||[]).length; const close=(css.match(/}/g)||[]).length; if (open!==close) { console.error('BRACE MISMATCH', open, close); process.exit(1); } console.log('braces match:', open);"
```

- [ ] **Step 3: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/assets/css/design-system.css
git commit -m "feat(design-system): add learning-paper and ember-veil surface aliases"
```

---

### Task 15: Apply surface-tone classes to work-showcase markup

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js`

- [ ] **Step 1: Apply `surface-ember-veil` to signals, featured, and pending panels**

In `SignalsPanel`, find the outer `h( 'section', { className: classNames( 'hdc-work-signals', 'hdc-reveal' ), ... } )` call. Change the className to:

```js
classNames( 'hdc-work-signals', 'surface-ember-veil', 'hdc-reveal' )
```

In `FeaturedCaseStudies`, add `'surface-ember-veil'` to each featured card article (`classNames( 'hdc-work-featured-card', ... )`). Do not put this class on the outer `.hdc-work-section`; React applies `emberVeil` at the featured card surface level.

In `PendingReposPanel`, find the outer wrapper section and add `'surface-ember-veil'` to its `classNames( ... )` list.

- [ ] **Step 2: Apply `surface-inset-soft` to each StatCard**

Find the `function StatCard( props )` definition. Locate where its outer wrapper element is defined (the one rendering `props.label` + `props.value`). Add `'surface-inset-soft'` to its `classNames( ... )` list.

If `StatCard` does not currently use `classNames` (it uses a literal class string), wrap the existing class with `classNames( 'hdc-work-stat-card', 'surface-inset-soft' )`.

- [ ] **Step 3: Apply `surface-learning-paper` to filters, role cards, repo cards, and timeline cards**

In `FiltersBar`, the outer section already gets `'surface-learning-paper'` from Task 5 — confirm it's still present.

In `RoleGroups` (the function rendering the focus-area cards), add `'surface-learning-paper'` to each role card's outer className.

In `RepoCard`, add `'surface-learning-paper'` to the outer `<article>` className.

In `BuildTimeline`, add `'surface-learning-paper'` to each timeline-entry card's className.

- [ ] **Step 4: Trim redundant inline backgrounds in style.css**

If any of the affected selectors in `style.css` (e.g. `.hdc-work-signals { border: ...; background: ... }`) define a background that is now overridden by the utility class, remove the redundant background to avoid double-paint. Leave borders if the utility border is the same value.

(Concretely: search `style.css` for `.hdc-work-signals`, `.hdc-work-featured`, `.hdc-work-pending`, `.hdc-work-stat-card`, `.hdc-work-role-card`, `.hdc-work-repo-card`, `.hdc-work-timeline-entry`. For each, if the rule sets `background: hsl(var(--surface-2))` or similar, delete that single property; do not delete the rule.)

- [ ] **Step 5: Syntax check**

```bash
node -c wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js
```

- [ ] **Step 6: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/view.js wp-content/themes/henrys-digital-canvas/blocks/work-showcase/style.css
git commit -m "feat(work-showcase): apply learning-paper / ember-veil / inset-soft surfaces"
```

---

## Phase 5: Curated data refresh

### Task 16: Refresh `repos.json` from `src/data/repos.ts`

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repos.json`

- [ ] **Step 1: Read `src/data/repos.ts` and convert to JSON**

The TS source is `/home/dev/henry-s-digital-canvas/src/data/repos.ts`. The exported array literal contains all repo objects after the `RepoData[]` annotation. For each object, capture every field literal (string, number, bool, array of strings).

A small script can do the conversion. Run from the repo root:

```bash
cat > /tmp/repos-ts-to-json.js <<'EOF'
const fs = require('fs');
const path = require('path');

const tsPath = '/home/dev/henry-s-digital-canvas/src/data/repos.ts';
const src = fs.readFileSync(tsPath, 'utf8');

// Find the array start: looks like "export const repos: RepoData[] = [" or "export const REPOS: RepoData[] = ["
const arrayStart = src.indexOf('= [', src.search(/export\s+const\s+\w+\s*:\s*RepoData\[\]/));
if (arrayStart === -1) {
	console.error('Could not locate repos array in', tsPath);
	process.exit(1);
}

// Walk forward to find the matching closing ];
let depth = 0;
let i = arrayStart + 2;
let end = -1;
while (i < src.length) {
	const ch = src[i];
	if (ch === '[') depth++;
	else if (ch === ']') {
		depth--;
		if (depth === 0) { end = i + 1; break; }
	}
	i++;
}
if (end === -1) {
	console.error('Could not locate end of array');
	process.exit(1);
}

let body = src.slice(arrayStart + 2, end); // includes leading [ and trailing ]
// Strip TypeScript "as const" / "satisfies" suffixes if present
body = body.replace(/\s+as\s+const\b/g, '');

// Quote bare keys: identifier: -> "identifier":
body = body.replace(/([{,\s])([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":');

// Convert single-quoted strings to double-quoted strings (carefully)
body = body.replace(/'([^'\\\n]*(?:\\.[^'\\\n]*)*)'/g, function (_, inner) {
	return '"' + inner.replace(/"/g, '\\"') + '"';
});

// Remove trailing commas before } or ]
body = body.replace(/,(\s*[}\]])/g, '$1');

let parsed;
try {
	parsed = JSON.parse(body);
} catch (err) {
	console.error('JSON parse failed:', err.message);
	console.error('First 600 chars of body:', body.slice(0, 600));
	process.exit(1);
}

const outPath = '/home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repos.json';
fs.writeFileSync(outPath, JSON.stringify(parsed, null, '\t') + '\n');
console.log('wrote', parsed.length, 'repos to', outPath);
EOF
node /tmp/repos-ts-to-json.js
```

If the script fails (often because the TS source contains expressions like `Date.now()` or imports), inspect the offending region and either: (a) adjust the script to handle the literal pattern, or (b) hand-edit the JSON for the few problem entries while keeping the rest as the script produced. The TS source is curated and is mostly literal — the conversion should succeed.

- [ ] **Step 2: Confirm JSON parses and field set is complete**

```bash
node -e "const j = require('/home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repos.json'); console.log('count', j.length); const fields = new Set(); j.forEach(r => Object.keys(r).forEach(k => fields.add(k))); console.log('fields', [...fields].sort().join(','));"
```

Expected: count is similar to (or exceeds) the prior 25; the fields list contains at minimum `name, description, language, stars, forks, openIssuesAndPullRequests, updatedAt, createdAt, url, defaultBranch, demoUrl, homepage, hasPages, hasIssues, hasProjects, hasWiki, hasDiscussions, topics, featured, featuredPriority, origin, access, relatedPosts` (omissions are OK if the field is missing on a per-repo basis in the source — but the union of all repos should include all of them).

- [ ] **Step 3: Visual diff sanity check**

```bash
git diff --stat wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repos.json
```

If the diff shows whole-file rewrite, that is expected. Spot-check a couple of the well-known featured repos (`tarot`, `ai-cli-web-funnel`, `ai-prompt-pro`) to confirm `updatedAt` matches the TS source.

- [ ] **Step 4: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repos.json
git commit -m "chore(work-showcase): refresh curated repos.json from React data/repos.ts"
```

---

### Task 17: Refresh `repo-case-study-details.json` from `src/data/repo-case-study-details.ts`

**Files:**
- Modify: `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repo-case-study-details.json`

- [ ] **Step 1: Convert the TS source object map to JSON**

The source file exports an object map (`export const repoCaseStudyDetails: Record<string, ...> = { ... }`), not an array. Keep the JSON output as an object keyed by repo name; `loadRepoCaseStudyDetails()` rejects arrays and `mergeRepoDetails()` indexes by repo name.

Run this object-map conversion:

```bash
cat > /tmp/case-studies-ts-to-json.js <<'EOF'
const fs = require('fs');
const tsPath = '/home/dev/henry-s-digital-canvas/src/data/repo-case-study-details.ts';
const src = fs.readFileSync(tsPath, 'utf8');

// Locate the exported object. The shape is "export const repoCaseStudyDetails: ... = {".
const exportMatch = src.match(/export\s+const\s+repoCaseStudyDetails\s*:[\s\S]*?=\s*\{/);
if (!exportMatch) { console.error('Could not find repoCaseStudyDetails object start'); process.exit(1); }
const objectStart = exportMatch.index + exportMatch[0].lastIndexOf('{');

let depth = 0, i = objectStart, end = -1;
let inString = null;
let escaping = false;
while (i < src.length) {
	const ch = src[i];
	if (inString) {
		if (escaping) {
			escaping = false;
		} else if (ch === '\\') {
			escaping = true;
		} else if (ch === inString) {
			inString = null;
		}
		i++;
		continue;
	}
	if (ch === '"' || ch === "'" || ch === '`') {
		inString = ch;
	} else if (ch === '{') {
		depth++;
	} else if (ch === '}') {
		depth--;
		if (depth === 0) { end = i + 1; break; }
	}
	i++;
}
if (end === -1) { console.error('Could not find object end'); process.exit(1); }

let body = src.slice(objectStart, end);
body = body.replace(/\s+as\s+const\b/g, '');

// Convert simple template literals first; this source uses them only as string literals.
body = body.replace(/`([^`\\]*(?:\\.[^`\\]*)*)`/g, function (_, inner) {
	return JSON.stringify(inner.replace(/\\`/g, '`'));
});
body = body.replace(/'([^'\\\n]*(?:\\.[^'\\\n]*)*)'/g, function (_, inner) {
	return '"' + inner.replace(/"/g, '\\"') + '"';
});
// Quote bare object keys after strings are normalized. Existing quoted keys remain unchanged.
body = body.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":');
body = body.replace(/,(\s*[}\]])/g, '$1');

let parsed;
try { parsed = JSON.parse(body); }
catch (err) { console.error('parse failed', err.message); console.error('First 600 chars:', body.slice(0, 600)); process.exit(1); }

if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
	console.error('Expected object map, got', Array.isArray(parsed) ? 'array' : typeof parsed);
	process.exit(1);
}

const outPath = '/home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repo-case-study-details.json';
fs.writeFileSync(outPath, JSON.stringify(parsed, null, '\t') + '\n');
console.log('wrote', Object.keys(parsed).length, 'case-study detail records to', outPath);
EOF
node /tmp/case-studies-ts-to-json.js
```

If the script fails, inspect the offending span and update only the converter; do not switch the output to an array. The output must remain an object map.

- [ ] **Step 2: Validate the resulting JSON**

```bash
node -e "const j = require('/home/dev/wp-hperkins-com/wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repo-case-study-details.json'); const keys = Object.keys(j); console.log('count', keys.length); console.log('first key', keys[0]); console.log('first', JSON.stringify(j[keys[0]], null, 2).slice(0, 600)); if (Array.isArray(j)) { process.exit(1); }"
```

Expected: count > 10, output is not an array, and the first value includes `problem`, `approach`, `result`, and `highlights` keys. Individual values do not need a `name` key because the repo slug is the object key.

- [ ] **Step 3: Confirm view.js's `mergeRepoDetails` still consumes the shape**

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:route
```

If smoke fails on the work page, examine the merge function in `view.js` (search for `mergeRepoDetails` or wherever case-study details are joined onto repos) and reconcile.

- [ ] **Step 4: Commit**

```bash
git add wp-content/themes/henrys-digital-canvas/blocks/work-showcase/data/repo-case-study-details.json
git commit -m "chore(work-showcase): refresh repo-case-study-details.json from React source"
```

---

## Final verification

### Task 18: Run smoke tests, flush caches, manual checks, parity re-run

**Files:** none (verification only)

- [ ] **Step 1: Run route + API smoke**

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:route
cd wp-content/themes/henrys-digital-canvas && npm run smoke:api
```

Both should pass.

- [ ] **Step 2: Flush caches**

```bash
wp --path=/home/dev/wp-hperkins-com cache flush
```

Then purge `cache-enabler` from `/wp-admin/options-general.php?page=cache-enabler`.

- [ ] **Step 3: Manual browser verification (Playwright MCP unavailable in this session)**

Open the live site at `http://209.97.147.66/work` and verify:

- Language chip rail behaves; clicking a chip writes `?language=...`.
- Refine button is visible; clicking it opens a panel with role and signal chips.
- Picking a role writes `?role=...`; picking signals writes `?signals=tested,typed` etc.
- Refresh restores the same state from the URL.
- "Showing X of Y" header updates.
- Active-facet pills appear; clicking one clears that facet; "Clear all" clears everything.
- Empty state shows the right description and per-facet actions.
- Press `r` (with body focused, not in a text field): Refine panel opens.
- Press `/`: focus moves to the active language chip.
- Press `Escape` while filters are active: all clear.
- Reload the page after using a refine view: "Your last view" button appears (when no role/signals are currently active).
- DevTools network → block GitHub requests with offline mode → engineering signals notice paragraph appears at the top of the panel; commit/language/delivery values show "Offline"; delivery degradation messages list at the bottom.

If the manual test reveals issues, file follow-ups in this plan or as separate fix commits.

- [ ] **Step 4: Re-run the parity checker**

Re-run the `parity-checker` agent for `work-showcase` and confirm the verdict is `PARITY` or `MINOR_DRIFT`. The remaining MINOR_DRIFT items should be limited to the three accepted WP-only extras (editor `heading`/`description` attributes, editor `Notice`, runtime `work-visuals.json` fetch) and any legitimate platform adaptations (e.g. `screen-reader-text` vs `sr-only`, `<a href>` vs React Router `<Link>`).

- [ ] **Step 5: Final report to user**

Summarize what shipped, the smoke results, the manual-check observations, and any known follow-ups.

---

## Out of Scope

- Editor Inspector controls (`heading`, `description`).
- Editor preview `Notice`.
- `work-visuals.json` runtime fetch.
- Replacing the existing reveal observer with framer-motion-style animation.
- Replacing fetch+cooldown with a hooks abstraction layer.
- Introducing React Router or any SPA navigation.
- New REST routes / proxy endpoints.
- `block.json` editor preview file (`index.js`).

---

## Plan Self-Review

- **Spec coverage**: All 20 gaps from the parity audit and both shared dependencies (icon, surface CSS) are mapped to a task. Phase 1 covers gaps 1, 2, 3, 4, 5, 6, 9 + dep 1. Phase 2 covers gaps 7, 8 (and value labels). Phase 3 covers gaps 12, 13, 17, 19 + 16 (probes). Phase 4 covers gaps 14, 15 + dep 2. Phase 5 covers gaps 10, 11. Gap 18 (Repository Library heading level) is implicitly covered when the title element is set to `h2` in `RepositoryLibrary` — re-verify in the manual check.
- **Placeholder scan**: every task includes the actual code or command. The data-refresh tasks include a working conversion script and an escape valve for backtick-template-literal entries.
- **Type consistency**: `activeRole`, `activeSignals`, `setActiveRole`, `setActiveSignals`, `isRefineOpen`, `setIsRefineOpen`, `savedRefineView`, `setSavedRefineView`, `WORK_LAST_REFINE_VIEW_STORAGE_KEY` are used consistently across Tasks 2–8. `getGitHubSignalSourceLabel`/`getGitHubSignalDegradationMessage`/`getPreferredGitHubSignalDegradedSource` are introduced in Task 9 and consumed in Task 10. Surface utility class names (`surface-learning-paper`, `surface-ember-veil`, `surface-inset-soft`) are defined in Task 14 and applied in Tasks 5 and 15.

## Execution Handoff

Plan complete and saved to `wp-content/themes/henrys-digital-canvas/docs/plans/2026-05-02-work-showcase-parity-plan.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — I execute tasks in this session using executing-plans, batching with checkpoints for review.

Which approach?
