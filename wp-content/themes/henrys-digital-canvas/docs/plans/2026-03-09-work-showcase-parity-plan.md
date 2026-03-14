# Work Showcase Parity Remediation — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Close all parity gaps between the `work-showcase` WordPress block and its React source (`Work.tsx`).

**Architecture:** Three phases of edits to `view.js`, `style.css`, and `render.php` in the block directory. Each phase is independently testable. No build step — all files are vanilla JS/CSS/PHP.

**Tech Stack:** WordPress `wp.element` (React), vanilla CSS, PHP server render

**Block directory:** `wp-content/themes/henrys-digital-canvas/blocks/work-showcase/`

---

## Phase 1: Role Group Interactivity + Language Distribution Removal

### Task 1: Add `expandedRoles` state and `toggleRole` handler

**Files:**
- Modify: `view.js:2387-2404` (state declarations in `WorkShowcaseApp`)
- Modify: `view.js:3085-3086` (RoleGroups render call)

**Step 1: Add state variable**

After line 2403 (`compareToast` state), add:

```js
const [ expandedRoles, setExpandedRoles ] = useState( function () {
    return new Set();
} );
```

**Step 2: Add toggle handler**

After the `handleClearCompare` function (find it near the other `handle*` functions), add:

```js
function handleToggleRole( role ) {
    setExpandedRoles( function ( prev ) {
        var next = new Set( prev );
        if ( next.has( role ) ) {
            next.delete( role );
        } else {
            next.add( role );
        }
        return next;
    } );
}
```

**Step 3: Pass new props to RoleGroups**

At line ~3086, change the `RoleGroups` call from:
```js
h( RoleGroups, { groups: reposByRole, roleDescriptionMap: ROLE_DESCRIPTION_MAP } )
```
to:
```js
h( RoleGroups, { groups: reposByRole, roleDescriptionMap: ROLE_DESCRIPTION_MAP, expandedRoles: expandedRoles, onToggleRole: handleToggleRole } )
```

**Step 4: Verify**

Run: `npm run smoke:route` from theme dir.
Expected: All routes still return 200.

---

### Task 2: Make RoleGroups cards interactive

**Files:**
- Modify: `view.js:1691-1782` (RoleGroups component)

**Step 1: Rewrite the RoleGroups component**

Replace the `RoleGroups` function (lines 1691-1782) with:

```js
function RoleGroups( props ) {
    if ( props.groups.length === 0 ) {
        return null;
    }

    return h(
        'section',
        { className: 'hdc-work-section' },
        h( SectionIntro, {
            title: 'Projects by Focus Area',
            description:
                'Quick orientation for how the work is distributed across systems, product delivery, craft, and performance.',
        } ),
        h(
            'div',
            { className: 'hdc-work-role-grid' },
            props.groups.map( function ( group, groupIndex ) {
                var latestRepo = group.repos.slice().sort( compareReposByUpdatedAtDesc )[ 0 ] || null;
                var isExpanded = props.expandedRoles && props.expandedRoles.has( group.role );
                var PREVIEW_COUNT = 2;
                var canExpand = group.repos.length > PREVIEW_COUNT;
                var visibleRepos = isExpanded ? group.repos : group.repos.slice( 0, PREVIEW_COUNT );
                var hiddenPreviewCount = isExpanded ? 0 : Math.max( 0, group.repos.length - PREVIEW_COUNT );
                var totalRepoCount = group.repos.length;
                var proportion = props.groups.reduce( function ( max, g ) {
                    return Math.max( max, g.repos.length );
                }, 1 );
                var proportionPercent = Math.round( ( totalRepoCount / proportion ) * 100 );

                return h(
                    'article',
                    {
                        key: 'role-' + group.role,
                        className: classNames( 'hdc-work-role-card', isExpanded && 'is-expanded' ),
                        role: canExpand ? 'button' : undefined,
                        'aria-expanded': canExpand ? String( isExpanded ) : undefined,
                        tabIndex: canExpand ? 0 : undefined,
                        onClick: canExpand ? function () {
                            props.onToggleRole( group.role );
                        } : undefined,
                        onKeyDown: canExpand ? function ( e ) {
                            if ( e.key === 'Enter' || e.key === ' ' ) {
                                e.preventDefault();
                                props.onToggleRole( group.role );
                            }
                        } : undefined,
                    },
                    h(
                        'div',
                        { className: 'hdc-work-role-proportion' },
                        h( 'div', {
                            className: 'hdc-work-role-proportion-fill',
                            style: { width: proportionPercent + '%' },
                            'data-target-width': proportionPercent,
                        } )
                    ),
                    h(
                        'div',
                        { className: 'hdc-work-role-header' },
                        h(
                            'span',
                            { className: 'hdc-work-role-icon', 'aria-hidden': 'true' },
                            renderLucideIcon( h, ROLE_ICON_MARKER[ group.role ], { className: 'hdc-work-role-icon-svg', size: 16 } ) || '•'
                        ),
                        h(
                            'div',
                            null,
                            h( 'h4', { className: 'hdc-work-role-title' }, group.role ),
                            h( 'p', { className: 'hdc-work-role-description' }, ROLE_DESCRIPTION_MAP[ group.role ] )
                        )
                    ),
                    h(
                        'div',
                        { className: 'hdc-work-badge-row hdc-work-role-badges' },
                        h(
                            Badge,
                            { variant: 'secondary' },
                            String( totalRepoCount ),
                            totalRepoCount === 1 ? ' repository' : ' repositories'
                        ),
                        latestRepo
                            ? h(
                                Badge,
                                { variant: 'outline' },
                                'Updated ',
                                formatShortDateLabel( latestRepo.updatedAt )
                            )
                            : null
                    ),
                    visibleRepos.length > 0
                        ? h(
                            'div',
                            { className: 'hdc-work-role-preview' },
                            h( 'p', { className: 'hdc-work-label' }, 'Recent examples' ),
                            h(
                                'div',
                                { className: 'hdc-work-badge-row' },
                                visibleRepos.map( function ( repo ) {
                                    return h(
                                        'a',
                                        {
                                            key: group.role + '-' + repo.name,
                                            className: 'hdc-work-badge is-outline hdc-work-role-repo-link',
                                            href: getWorkDetailUrl( repo.name ),
                                            onClick: function ( e ) {
                                                e.stopPropagation();
                                            },
                                            onKeyDown: function ( e ) {
                                                e.stopPropagation();
                                            },
                                        },
                                        repo.name
                                    );
                                } ).concat(
                                    canExpand
                                        ? [
                                            h(
                                                'span',
                                                {
                                                    key: group.role + '-toggle',
                                                    className: 'hdc-work-badge is-outline hdc-work-role-toggle-badge',
                                                },
                                                isExpanded ? 'Show less' : '+' + String( hiddenPreviewCount ) + ' more',
                                                h(
                                                    'span',
                                                    {
                                                        className: 'hdc-work-role-badge-chevron',
                                                        'aria-hidden': 'true',
                                                    },
                                                    renderLucideIcon( h, 'chevron-down', { size: 12 } )
                                                )
                                            ),
                                        ]
                                        : []
                                )
                            )
                        )
                        : null
                );
            } )
        )
    );
}
```

**Step 2: Verify in browser**

Navigate to https://wp.hperkins.com/work/ and confirm:
- Role group cards show expand/collapse toggle
- Clicking expands to show all repo name badges
- Clicking again collapses
- Keyboard (Enter/Space) works
- Repo name links navigate without toggling card

---

### Task 3: Add role group CSS

**Files:**
- Modify: `style.css` (after the role group styles section — find `.hdc-work-role-card`)

**Step 1: Find existing role group styles and add interactive styles**

After the existing `.hdc-work-role-card` block in `style.css`, add:

```css
.hdc-work-role-card[role="button"] {
    cursor: pointer;
}

.hdc-work-role-card[role="button"]:hover {
    box-shadow: 0 0 0 1px hsl(var(--border)), 0 2px 8px hsl(var(--shadow) / 0.08);
    transform: translateY(-1px);
}

.hdc-work-role-card[role="button"]:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
}

.hdc-work-role-proportion {
    height: 3px;
    background: hsl(var(--surface-2));
    border-radius: var(--radius-pill);
    overflow: hidden;
    margin-bottom: 0.3rem;
}

.hdc-work-role-proportion-fill {
    height: 100%;
    background: hsl(var(--primary));
    border-radius: var(--radius-pill);
    transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.hdc-work-role-repo-link {
    text-decoration: none;
    color: inherit;
}

.hdc-work-role-repo-link:hover {
    background: hsl(var(--accent));
}

.hdc-work-role-toggle-badge {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
}

.hdc-work-role-badge-chevron {
    display: inline-flex;
    transition: transform 0.2s ease;
}

.is-expanded .hdc-work-role-badge-chevron {
    transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
    .hdc-work-role-card[role="button"]:hover {
        transform: none;
    }
    .hdc-work-role-proportion-fill {
        transition: none;
    }
    .hdc-work-role-badge-chevron {
        transition: none;
    }
}
```

**Step 2: Verify**

Run: `npm run smoke:browser`
Expected: Pass (no visual regressions).

**Step 3: Commit**

```bash
git add blocks/work-showcase/view.js blocks/work-showcase/style.css
git commit -m "feat(work-showcase): add role group expand/collapse interactivity

Ports the expandedRoles state and toggleRole handler from React
WorkRoleGroups. Cards now support click/keyboard expand with chevron
animation, proportion bar, and repo link stopPropagation."
```

---

### Task 4: Remove Language Distribution section from SignalsPanel

**Files:**
- Modify: `view.js` — multiple locations
- Modify: `style.css:227-335`
- Modify: `render.php:24,42,44`

**Step 1: Remove from `render.php`**

Remove these lines from the `$defaults` array:
```php
'languageSummaryMaxRepos' => 80,
```

Remove from the `$config` array:
```php
'githubLanguageSummaryProxyUrl' => '/api/github/language-summary',
'languageSummaryMaxRepos' => max( 1, min( 80, (int) $attrs['languageSummaryMaxRepos'] ) ),
```

**Step 2: Remove from `view.js` constants**

Remove these lines (~34-36):
```js
const GITHUB_LANGUAGE_SUMMARY_MAX_REPOS_DEFAULT = 80;
const GITHUB_LANGUAGE_SUMMARY_MAX_REPOS_LIMIT = 80;
```

Remove line ~74:
```js
const languageSummaryRateLimitCooldownByQueryKey = new Map();
```

**Step 3: Remove language summary functions from `view.js`**

Remove these functions entirely:
- `getLanguageSummaryRateLimitCooldownQueryKey` (line 773-774)
- `normalizeLanguage` (line 777-780)
- `buildFallbackRepoLanguageCounts` (line 782-796)
- `buildFallbackLanguageSummary` (line 798-808)
- `isLanguageRepoCountArray` (line 810-819)
- `isLanguageByteTotalArray` (line 821-829) — read to confirm exact end line
- `fetchGitHubLanguageSummaryFromProxy` (line 898-930)
- `loadLanguageSummary` (line 932-958)
- `formatLanguageSourceMessage` (line 1174-1192)

**Step 4: Remove Language Distribution DOM from SignalsPanel**

In the `SignalsPanel` function (~line 1347-1566):
- Remove the variables: `barChartData`, `maxLanguageRepoCount`, `treemapData`, `totalLanguageBytes`, `languageSummaryDescription` (lines 1351-1374).
- Remove the Language Distribution `h('div', { className: 'hdc-work-language-distribution' }, ...)` block (lines 1465-1564).
- The function should end after the stats grid closing paren (line ~1463), then a closing paren for the section, then `}`.

**Step 5: Remove `languageSummary` state and references from `WorkShowcaseApp`**

- Remove `const [ languageSummary, setLanguageSummary ]` state (line 2391-2393).
- Remove `setLanguageSummary(...)` call in the loading effect (line 2428).
- Remove `setLanguageSummary( data.languageSummary )` in the success handler (line 2437).
- Remove `setLanguageSummary(...)` in the error handler (lines 2451-2453).
- Remove `languageSummary` from the `loadWorkData` return value (line 1143, 1149).
- Remove `languageSummary` call inside `loadWorkData` (line 1143).
- Remove the `languageSummary`-related props from the `SignalsPanel` render call (lines 3048, 3050-3055):
  - Remove: `analyzedRepoCount`, `byteDataIncomplete`, `languageByteTotals`, `languageSummarySource`, `repoLanguageCounts`.

**Step 6: Remove `languageSummaryMaxRepos` from config parsing**

In the `parseConfig` function, remove the `languageSummaryMaxRepos` line (~line 459-461).

**Step 7: Remove CSS**

Remove the entire block from `.hdc-work-language-distribution` through `.hdc-work-byte-value` (lines 227-335 in `style.css`).

**Step 8: Verify**

Run: `npm run smoke:full`
Expected: All checks pass. SignalsPanel should show only 3 stat cards.

**Step 9: Commit**

```bash
git add blocks/work-showcase/view.js blocks/work-showcase/style.css blocks/work-showcase/render.php
git commit -m "fix(work-showcase): remove WP-only Language Distribution section

Achieves strict parity with React WorkSignalsPanel which shows only
three stat cards. Removes loadLanguageSummary, the bar chart, the
byte treemap, all language-summary state, and associated CSS/config."
```

---

## Phase 2: Missing Repo Card Badges

### Task 5: Add `license` and `openIssuesCount` to data model

**Files:**
- Modify: `view.js:276-325` (`normalizeRepo`)
- Modify: `view.js:685-730` (`mapGitHubRepos`)

**Step 1: Add fields to `normalizeRepo`**

After `shipped: sanitizeString( repo.shipped, '' ),` (line 320), add:

```js
license: sanitizeString( repo.license, '' ),
openIssuesCount: Number.isFinite( Number( repo.openIssuesCount ) ) ? Number( repo.openIssuesCount ) : 0,
```

**Step 2: Map GitHub API fields in `mapGitHubRepos`**

In the `Object.assign` inside `mapGitHubRepos` (line ~704-728), after `shipped:`, add:

```js
license: repo.license && repo.license.spdx_id && repo.license.spdx_id !== 'NOASSERTION'
    ? repo.license.spdx_id
    : ( localRepo ? localRepo.license : '' ),
openIssuesCount: Number.isFinite( repo.open_issues_count ) ? repo.open_issues_count : 0,
```

**Step 3: Verify**

Open browser console on /work/, inspect a repo card's data. Confirm `license` and `openIssuesCount` fields exist.

**Step 4: Commit**

```bash
git add blocks/work-showcase/view.js
git commit -m "feat(work-showcase): add license and openIssuesCount to repo data model

Maps GitHub API license.spdx_id and open_issues_count into the
normalized repo object for use by RepoCard badges."
```

---

### Task 6: Add license badge and open issues count to RepoCard

**Files:**
- Modify: `view.js:1836-1988` (`RepoCard` function)

**Step 1: Update `hasMetadataBadges` check**

At line ~1852-1856, change:

```js
const hasMetadataBadges =
    visibleTopics.length > 0 ||
    hiddenTopicCount > 0 ||
    typeof communityHealthScore === 'number' ||
    hasPublishedRelease;
```

to:

```js
const hasMetadataBadges =
    visibleTopics.length > 0 ||
    hiddenTopicCount > 0 ||
    typeof communityHealthScore === 'number' ||
    hasPublishedRelease ||
    !! repo.license ||
    ( props.ciStatus && props.ciStatus !== 'none' );
```

**Step 2: Add license badge after release badge**

After the release badge `.concat(...)` block (line ~1930-1934), add another `.concat()`:

```js
.concat(
    repo.license
        ? [ h( Badge, { key: repo.name + '-license', variant: 'outline' },
            h( 'span', { className: 'hdc-work-repo-meta-icon', 'aria-hidden': 'true' },
                renderLucideIcon( h, 'scale', { className: 'hdc-work-repo-meta-icon-svg', size: 12 } )
            ),
            ' ' + repo.license
        ) ]
        : []
)
```

**Step 3: Add CI status badge after license badge**

Add another `.concat()`:

```js
.concat(
    props.ciStatus && props.ciStatus !== 'none'
        ? [ h( Badge, {
            key: repo.name + '-ci',
            variant: 'outline',
            className: 'is-ci-' + props.ciStatus,
        }, 'CI ' + props.ciStatus ) ]
        : []
)
```

Note: The `Badge` component currently only uses `props.variant` for className. We need to also pass through a `className` prop. Update the `Badge` function (line ~1153-1161):

```js
function Badge( props ) {
    return h(
        'span',
        {
            className: classNames( 'hdc-work-badge', props.variant ? 'is-' + props.variant : 'is-secondary', props.className ),
        },
        props.children
    );
}
```

**Step 4: Add open issues count in footer**

After the forks `<span>` (line ~1955-1964), add:

```js
repo.openIssuesCount > 0
    ? h(
        'span',
        { className: 'hdc-work-repo-meta-item' },
        h(
            'span',
            { className: 'hdc-work-repo-meta-icon', 'aria-hidden': 'true' },
            renderLucideIcon( h, 'circle-dot', { className: 'hdc-work-repo-meta-icon-svg', size: 12 } )
        ),
        h( 'span', null, String( repo.openIssuesCount ) )
    )
    : null,
```

This should be added to the array of GitHub repo meta items (inside the ternary for `repo.origin === 'github'`).

**Step 5: Verify in browser**

Navigate to /work/ and confirm:
- Repos with licenses show a Scale icon + license text badge
- Repos with open issues show a CircleDot icon + count in footer
- CI badge placeholder logic works (will show once CI fetch is added)

**Step 6: Commit**

```bash
git add blocks/work-showcase/view.js
git commit -m "feat(work-showcase): add license badge, CI badge, and open issues count

Ports missing repo card elements from React WorkRepoCard: license
badge with Scale icon, CI status badge with color class, and open
issues/PRs count with CircleDot icon in the footer."
```

---

### Task 7: Add CI status fetch

**Files:**
- Modify: `view.js` — add fetch function near `loadRepoProofs` (~line 1027)
- Modify: `view.js` — add state + effect in `WorkShowcaseApp`
- Modify: `view.js` — pass `ciStatus` prop to `RepoCard` in `RepositoryLibrary`
- Modify: `render.php` — add `githubCIStatusProxyUrl` to config

**Step 1: Add config to `render.php`**

In the `$config` array, after `githubRepoProofsProxyUrl`, add:

```php
'githubCIStatusProxyUrl' => '/api/github/ci-status',
```

**Step 2: Add rate limit map constant**

After line ~75 (`repoProofRateLimitCooldownByQueryKey`), add:

```js
const ciStatusRateLimitCooldownByQueryKey = new Map();
```

**Step 3: Add `loadCIStatus` function**

After the `loadRepoProofs` function (~line 1027-1090), add:

```js
async function loadCIStatus( config, repoNames ) {
    var normalizedRepoNames = Array.from(
        new Set(
            repoNames
                .map( function ( name ) {
                    return sanitizeString( name, '' );
                } )
                .filter( Boolean )
        )
    ).sort( function ( a, b ) {
        return a.localeCompare( b );
    } );

    if ( normalizedRepoNames.length === 0 || ! config.githubCIStatusProxyUrl ) {
        return { ciStatusByRepo: {} };
    }

    var username = sanitizeString( config.githubUsername, 'unknown' );
    var cooldownQueryKey = 'github-ci-status:' + username + ':' + normalizedRepoNames.join( '|' );

    if ( getRemainingRateLimitCooldownMs( ciStatusRateLimitCooldownByQueryKey, cooldownQueryKey ) > 0 ) {
        return { ciStatusByRepo: {} };
    }

    try {
        var requestUrl = new URL( resolveRequestUrl( config.githubCIStatusProxyUrl ) );
        requestUrl.searchParams.set( 'username', username );
        normalizedRepoNames.forEach( function ( name ) {
            requestUrl.searchParams.append( 'repo', name );
        } );

        var response = await fetch( requestUrl.toString(), {
            headers: { Accept: 'application/json' },
        } );

        if ( ! response.ok ) {
            if ( response.status === 429 || response.status === 403 ) {
                setRateLimitCooldown( ciStatusRateLimitCooldownByQueryKey, cooldownQueryKey, { status: response.status } );
            }
            return { ciStatusByRepo: {} };
        }

        var payload = await response.json();
        if ( ! payload || ! Array.isArray( payload.results ) ) {
            return { ciStatusByRepo: {} };
        }

        var map = {};
        payload.results.forEach( function ( entry ) {
            if ( entry && entry.repo && entry.status ) {
                map[ entry.repo ] = entry.status;
                map[ entry.repo.toLowerCase() ] = entry.status;
            }
        } );

        return { ciStatusByRepo: map };
    } catch ( error ) {
        if ( isOfflineError( error ) ) {
            return { ciStatusByRepo: {} };
        }
        if ( isRateLimitError( error ) ) {
            setRateLimitCooldown( ciStatusRateLimitCooldownByQueryKey, cooldownQueryKey, error );
        }
        return { ciStatusByRepo: {} };
    }
}
```

**Step 4: Add state in `WorkShowcaseApp`**

After the `repoProofsByRepoName` state (line ~2395), add:

```js
const [ ciStatusByRepoName, setCIStatusByRepoName ] = useState( {} );
```

**Step 5: Add CI status fetch effect**

After the `loadRepoProofs` effect (ends ~line 2916), add:

```js
useEffect(
    function () {
        if ( loading || view !== 'grid' || visibleGitHubRepoNames.length === 0 ) {
            return undefined;
        }

        var cancelled = false;

        loadCIStatus( config, visibleGitHubRepoNames ).then( function ( data ) {
            if ( cancelled ) {
                return;
            }
            setCIStatusByRepoName( data.ciStatusByRepo );
        } );

        return function () {
            cancelled = true;
        };
    },
    [ config, loading, view, visibleGitHubRepoFingerprint, visibleGitHubRepoNames ]
);
```

**Step 6: Pass `ciStatusByRepoName` to `RepositoryLibrary`**

At the `RepositoryLibrary` render call (~line 3089), add the prop:

```js
ciStatusByRepoName: ciStatusByRepoName,
```

**Step 7: Thread `ciStatus` through to `RepoCard`**

In the `RepositoryLibrary` component, where it renders `RepoCard` for each paginated repo, add:

```js
ciStatus: props.ciStatusByRepoName[ repo.name ] || props.ciStatusByRepoName[ repo.name.toLowerCase() ] || null,
```

Look for where `h( RepoCard, { ... } )` is called in `RepositoryLibrary` and add this prop.

**Step 8: Add CI status CSS**

In `style.css`, add after the existing badge styles:

```css
.hdc-work-badge.is-ci-passing {
    color: hsl(var(--success, 142 71% 45%));
}

.hdc-work-badge.is-ci-failing {
    color: hsl(var(--destructive, 0 84% 60%));
}

.hdc-work-badge.is-ci-running {
    color: hsl(var(--warning, 38 92% 50%));
}
```

**Step 9: Verify**

Run: `npm run smoke:full`
Expected: Pass. Repos with CI pipelines show colored status badges.

**Step 10: Commit**

```bash
git add blocks/work-showcase/view.js blocks/work-showcase/style.css blocks/work-showcase/render.php
git commit -m "feat(work-showcase): add CI status fetch and badge rendering

Ports useGitHubCIStatus from React. Fetches CI pipeline status for
visible repos and renders colored CI badges (passing/failing/running)
on repo cards. Includes rate limit and offline handling."
```

---

## Phase 3: Visual Polish

### Task 8: Add skeleton loading UI

**Files:**
- Modify: `view.js` — add `LoadingSkeleton` component, replace loading text
- Modify: `style.css` — add skeleton styles

**Step 1: Add LoadingSkeleton component**

Add after the `EmptyState` component in `view.js`:

```js
function LoadingSkeleton() {
    return h(
        Fragment,
        null,
        h(
            'div',
            { className: 'hdc-work-skeleton-filters' },
            h( 'span', { className: 'hdc-work-skeleton is-h8 is-w-20 is-rounded-pill' } ),
            h( 'span', { className: 'hdc-work-skeleton is-h8 is-w-20 is-rounded-pill' } ),
            h( 'span', { className: 'hdc-work-skeleton is-h8 is-w-20 is-rounded-pill' } ),
            h( 'span', { className: 'hdc-work-skeleton is-h8 is-w-20 is-rounded-pill' } ),
            h( 'span', { className: 'hdc-work-skeleton is-h8 is-w-20 is-rounded-pill' } ),
            h( 'span', { className: 'hdc-work-skeleton is-h9 is-w-36 is-rounded-surface is-ml-auto' } )
        ),
        h(
            'div',
            { className: 'hdc-work-skeleton-grid' },
            [ 0, 1, 2, 3, 4, 5 ].map( function ( i ) {
                return h(
                    'div',
                    { key: 'skeleton-card-' + i, className: 'hdc-work-skeleton-card' },
                    h(
                        'div',
                        { className: 'hdc-work-skeleton-card-head' },
                        h( 'span', { className: 'hdc-work-skeleton is-h5 is-w-24' } ),
                        h( 'span', { className: 'hdc-work-skeleton is-h4 is-w-14' } )
                    ),
                    h( 'span', { className: 'hdc-work-skeleton is-h6 is-w-3-4' } ),
                    h( 'span', { className: 'hdc-work-skeleton is-h4 is-w-full' } ),
                    h( 'span', { className: 'hdc-work-skeleton is-h4 is-w-5-6' } ),
                    h(
                        'div',
                        { className: 'hdc-work-skeleton-card-topics' },
                        h( 'span', { className: 'hdc-work-skeleton is-h5 is-w-16 is-rounded-pill' } ),
                        h( 'span', { className: 'hdc-work-skeleton is-h5 is-w-14 is-rounded-pill' } ),
                        h( 'span', { className: 'hdc-work-skeleton is-h5 is-w-20 is-rounded-pill' } )
                    ),
                    h(
                        'div',
                        { className: 'hdc-work-skeleton-card-footer' },
                        h( 'span', { className: 'hdc-work-skeleton is-h4 is-w-12' } ),
                        h( 'span', { className: 'hdc-work-skeleton is-h4 is-w-12' } ),
                        h( 'span', { className: 'hdc-work-skeleton is-h4 is-w-20' } )
                    )
                );
            } )
        )
    );
}
```

**Step 2: Replace loading text with skeleton**

At line ~3024, change:

```js
loading ? h( 'p', { className: 'hdc-work-status' }, 'Loading repositories…' ) : null,
```

to:

```js
loading ? h( LoadingSkeleton ) : null,
```

**Step 3: Add CSS**

```css
@keyframes hdc-skeleton-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.hdc-work-skeleton {
    display: block;
    background: hsl(var(--muted));
    border-radius: var(--radius-surface);
    animation: hdc-skeleton-pulse 2s ease-in-out infinite;
}

.hdc-work-skeleton.is-rounded-pill { border-radius: var(--radius-pill); }
.hdc-work-skeleton.is-rounded-surface { border-radius: var(--radius-surface); }

.hdc-work-skeleton.is-h4 { height: 1rem; }
.hdc-work-skeleton.is-h5 { height: 1.25rem; }
.hdc-work-skeleton.is-h6 { height: 1.5rem; }
.hdc-work-skeleton.is-h8 { height: 2rem; }
.hdc-work-skeleton.is-h9 { height: 2.25rem; }

.hdc-work-skeleton.is-w-12 { width: 3rem; }
.hdc-work-skeleton.is-w-14 { width: 3.5rem; }
.hdc-work-skeleton.is-w-16 { width: 4rem; }
.hdc-work-skeleton.is-w-20 { width: 5rem; }
.hdc-work-skeleton.is-w-24 { width: 6rem; }
.hdc-work-skeleton.is-w-36 { width: 9rem; }
.hdc-work-skeleton.is-w-full { width: 100%; }
.hdc-work-skeleton.is-w-5-6 { width: 83.333%; }
.hdc-work-skeleton.is-w-3-4 { width: 75%; }
.hdc-work-skeleton.is-ml-auto { margin-left: auto; }

.hdc-work-skeleton-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2.5rem;
}

.hdc-work-skeleton-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(3, 1fr);
}

.hdc-work-skeleton-card {
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-surface);
    background: hsl(var(--surface-1));
    padding: 1rem;
    display: grid;
    gap: 0.5rem;
}

.hdc-work-skeleton-card-head {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.hdc-work-skeleton-card-topics {
    display: flex;
    gap: 0.4rem;
    margin-top: 0.25rem;
}

.hdc-work-skeleton-card-footer {
    display: flex;
    gap: 0.75rem;
    border-top: 1px solid hsl(var(--border));
    padding-top: 0.5rem;
    margin-top: 0.25rem;
}

@media (max-width: 720px) {
    .hdc-work-skeleton-grid {
        grid-template-columns: 1fr;
    }
}

@media (prefers-reduced-motion: reduce) {
    .hdc-work-skeleton {
        animation: none;
    }
}
```

**Step 4: Verify**

Reload /work/ with network throttling (Slow 3G) to observe skeleton loading state.

**Step 5: Commit**

```bash
git add blocks/work-showcase/view.js blocks/work-showcase/style.css
git commit -m "feat(work-showcase): add skeleton loading UI

Replaces 'Loading repositories...' text with animated skeleton
placeholders matching the filter bar and repo card grid layout.
Includes pulse animation and reduced-motion support."
```

---

### Task 9: Add reveal/entrance animations

**Files:**
- Modify: `style.css` — add reveal keyframes and classes
- Modify: `view.js` — add IntersectionObserver and apply reveal classes

**Step 1: Add CSS keyframes and classes**

```css
@keyframes hdc-reveal-fade-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes hdc-reveal-fade-up-soft {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hdc-reveal {
    opacity: 0;
}

.hdc-reveal.is-visible {
    animation: hdc-reveal-fade-up 0.26s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    animation-delay: calc(var(--reveal-index, 0) * 0.16s);
}

.hdc-reveal.is-soft.is-visible {
    animation-name: hdc-reveal-fade-up-soft;
}

@media (prefers-reduced-motion: reduce) {
    .hdc-reveal {
        opacity: 1;
    }
    .hdc-reveal.is-visible {
        animation: none;
    }
}
```

**Step 2: Add IntersectionObserver utility in `view.js`**

Near the top of the file (after the constant declarations, before the helper functions), add:

```js
var revealObserver = null;

function initRevealObserver() {
    if ( revealObserver ) {
        revealObserver.disconnect();
    }

    if ( typeof IntersectionObserver === 'undefined' ) {
        document.querySelectorAll( '.hdc-reveal' ).forEach( function ( el ) {
            el.classList.add( 'is-visible' );
        } );
        return;
    }

    revealObserver = new IntersectionObserver(
        function ( entries ) {
            entries.forEach( function ( entry ) {
                if ( entry.isIntersecting ) {
                    entry.target.classList.add( 'is-visible' );
                    revealObserver.unobserve( entry.target );
                }
            } );
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll( '.hdc-reveal:not(.is-visible)' ).forEach( function ( el ) {
        revealObserver.observe( el );
    } );
}
```

**Step 3: Apply reveal classes in components**

Apply the `hdc-reveal` class and `--reveal-index` CSS variable to these elements:

1. **Hero section**: In the hero render (~line 2992), add `className: classNames('hdc-work-page-hero', 'ember-surface', 'hdc-reveal', 'is-soft')` and `style: { '--reveal-index': 0 }`.

2. **SignalsPanel**: Wrap the outer `<section>` with `className: classNames('hdc-work-signals', 'hdc-reveal')` and `style: { '--reveal-index': 0 }`.

3. **Role group cards**: On each `<article>` in RoleGroups, add `'hdc-reveal'` to className and `style` should include `'--reveal-index': groupIndex`.

4. **Repo cards**: On each `<article class="hdc-work-repo-card">` in the grid, add `'hdc-reveal'` to className and `style` should include `'--reveal-index': index` (index within the paginated page).

5. **Featured case study cards**: On each `<article class="hdc-work-featured-card">`, add `'hdc-reveal'` to className with `'--reveal-index': index`.

**Step 4: Trigger observer after render**

Add a `useEffect` in `WorkShowcaseApp` that calls `initRevealObserver()` after content renders:

```js
useEffect( function () {
    if ( ! loading && ! error ) {
        requestAnimationFrame( function () {
            initRevealObserver();
        } );
    }
}, [ loading, error, page, view, filter ] );
```

This re-initializes the observer when page/view/filter changes to catch newly rendered reveal elements.

**Step 5: Verify**

Navigate to /work/, scroll down. Elements should fade-up as they enter the viewport. Toggle to reduced-motion in OS settings and confirm no animation plays.

**Step 6: Commit**

```bash
git add blocks/work-showcase/view.js blocks/work-showcase/style.css
git commit -m "feat(work-showcase): add reveal entrance animations

Ports Reveal component behavior using CSS keyframes and
IntersectionObserver. Hero uses fadeUpSoft, cards and sections
use fadeUp with staggered delays. Respects prefers-reduced-motion."
```

---

## Final Verification

### Task 10: Run full smoke test and parity checker

**Step 1: Full smoke test**

```bash
cd wp-content/themes/henrys-digital-canvas && npm run smoke:full
```

Expected: All route, API, and browser checks pass.

**Step 2: Run parity checker**

Use the `parity-checker` agent to re-compare the work-showcase block against Work.tsx.

Expected: Rating should be **MINOR_DRIFT** (remaining drifts are the documented acceptable platform differences: pagination text buttons, native checkbox, toast, single breakpoint, case study item limit).

**Step 3: Clear caches**

```bash
wp --path=/home/hperkins-wp/htdocs/wp.hperkins.com cache flush
```

Purge cache-enabler from WP admin.
