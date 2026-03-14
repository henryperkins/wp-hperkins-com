# Home Page Block Parity Design

**Date**: 2026-03-09
**Block**: `home-page`
**Source**: `Home.tsx`
**Verdict**: NEEDS_WORK (0 high, 2 medium, 8 low)

## Extras Decision

Keep all 3 WP-only extras as-is (option B).

## Phase 1: Medium — Hero Button Icons

| Gap | Fix |
|-----|-----|
| 1. Hero "Work with me" missing ArrowRight | Add `renderLucideIcon(h, 'arrow-right', { size: 16 })` after text in primary button |
| 2. Hero "View case studies" missing FolderOpen | Add `renderLucideIcon(h, 'folder-open', { size: 16 })` before text in secondary button |

Files: `view.js:589-604`

## Phase 2: Low — Animations

| Gap | Fix |
|-----|-----|
| 3. No Reveal entrance animations | Add IntersectionObserver-based reveal using existing `fade-in`/`slide-in` keyframes from `design-system.css`. Apply: hero=fadeIn/slow, work cards=fadeUp/medium+stagger, blog posts=slideInLeft/medium+stagger. Respect `prefers-reduced-motion`. |
| 4. No skeleton pulse animation | Add `@keyframes pulse` + apply to `.hdc-home-page__work-card--skeleton` |

Files: `view.js` (observer setup + class application), `style.css` (pulse keyframe + reveal classes)

## Phase 3: Low — Semantic/Accessibility/Image

| Gap | Fix |
|-----|-----|
| 5. Work card excerpt missing line-clamp | Add `hdc-home-page__card-copy--clamp` modifier to work card description |
| 6. Blog post dates use `<span>` not `<time>` | Change to `h('time', { dateTime: post.date }, post.dateLabel)`, pass raw `date` through fetchPosts |
| 7. Missing SR "Updated:" label on work card dates | Add `h('span', { className: 'screen-reader-text' }, 'Updated:')` before date text |
| 8. Blog images missing `decoding="async"` | Add `decoding: 'async'` to img props |
| 9. Blog images missing `sizes` | Add `sizes: '(min-width: 640px) 112px, 96px'` to img props |
| 10. Blog images missing `onError` handler | Add `onerror` handler that hides the broken image element |

Files: `view.js:677, 691, 824-841`
