# Portfolio Performance Optimization Design

## Context

The production portfolio is functionally correct and visually approved, but mobile rendering and scrolling feel less responsive than desktop. The current production baseline is based on `master` commit `af68dda`.

The latest measured PageSpeed results were:

- Mobile performance: 79
- Mobile FCP: 1.7 s
- Mobile LCP: 5.1 s
- Mobile TBT: 100 ms
- Mobile CLS: 0
- Desktop performance: 98
- Desktop LCP: 1.0 s

The trace also reported about 191 ms of forced reflow in the bundled JavaScript, a 672-element DOM, about 590 KiB of image savings, and roughly 890 ms of render-blocking work on mobile.

## Goals

1. Preserve the current layout, colors, typography, transitions, cursor spotlight, project-card tilt, and glass effects unless a measured mobile fallback is required.
2. Remove synchronous layout work from high-frequency scroll and pointer handlers.
3. Consolidate scroll state so the page reads scroll geometry at most once per animation frame.
4. Defer layout and paint for below-the-fold sections without changing their visible appearance.
5. Improve first-view image and font delivery so the hero content becomes visible sooner.
6. Keep the existing static Vite deployment model for this pass.

## Non-goals

- No visual redesign or content rewrite.
- No migration to SSR, Nuxt, or a server runtime.
- No removal of desktop animation or glass effects in the first pass.
- No broad component restructuring unrelated to measured performance bottlenecks.

## Chosen Approach

Use a staged client-side optimization pass. First remove forced layout and duplicate event work, then reduce below-the-fold rendering and first-view asset cost. Re-measure after deployment. SSR or SSG will only be reconsidered if the remaining bottleneck is HTML discovery or crawlability rather than client-side rendering and painting.

This approach is preferred because the site is a small static portfolio, desktop performance is already high, and the observed scroll problem comes from browser main-thread work rather than server response time.

## Architecture

### Shared scroll metrics

Create a focused `useScrollMetrics` composable that owns one passive `scroll` listener and one animation-frame update loop. It exposes reactive `scrollY`, `progress`, `isPastThreshold`, and `isAtBottom` values. Document height is cached and recalculated on resize and through `ResizeObserver`, not on every scroll event.

`ScrollProgress` and `ScrollToTop` consume this shared state. They no longer attach independent scroll handlers or read document geometry themselves.

### Active navigation section

Replace `Navbar`'s per-frame loop over all section elements with `IntersectionObserver`. The observer tracks the hero and six navigation sections using a root margin aligned with the fixed header. The active section is selected from currently intersecting entries by viewport position. The shared `isAtBottom` value ensures Contact is selected at the document end.

This removes repeated `getBoundingClientRect()` calls from the scroll path while keeping navigation behavior and URL hashes unchanged.

### Pointer effects

The cursor spotlight remains visually identical. Pointer events record the latest coordinates only; one scheduled animation frame writes the CSS variables. The effect is disabled for coarse pointers, non-hover devices, and `prefers-reduced-motion`.

Project-card tilt measures the card rectangle once on pointer entry. Pointer moves only update the latest coordinates, and one animation frame writes a `transform`. Geometry is refreshed on the next pointer entry and after a resize. Pointer leave cancels pending work and restores the existing eased reset transition.

All high-frequency handlers follow a read-first, write-second rule so a style write cannot force a same-frame synchronous layout read.

### Below-the-fold rendering

Apply `content-visibility: auto` and a conservative `contain-intrinsic-size` to main sections below the hero. The browser may skip layout and paint for distant content while reserving approximate space, preventing visible scroll jumps.

The hero remains fully rendered. Modal content and anchor navigation are verified because they can interact with skipped sections.

### Images and fonts

Convert the hero portrait and project preview images to appropriately sized WebP assets while retaining the originals only where needed. The hero portrait is marked as high priority and is not lazy-loaded. Below-the-fold project images use explicit dimensions, asynchronous decoding, and lazy loading; modal detail views may load the higher-resolution asset on demand.

Fonts remain visually unchanged. The existing Pretendard, Space Grotesk, and JetBrains Mono stylesheets are loaded with non-blocking preload/onload links plus `noscript` fallbacks; system fonts remain available during loading. No font family is removed solely for performance.

### Visual-effect fallback

Blur, shadow, gradient, and glass effects are preserved in the initial implementation. If post-deployment traces still show paint/compositing as the dominant mobile bottleneck, a narrow mobile media query may reduce `backdrop-filter` strength while preserving the same surfaces and color hierarchy. This fallback requires new measurement evidence before activation.

## Data Flow

1. A browser scroll event marks the shared scroll state dirty.
2. The next animation frame reads `scrollY` once and updates shared reactive values.
3. `ScrollProgress` updates its compositor-friendly `scaleX` transform, and `ScrollToTop` updates visibility only when its threshold state changes.
4. `IntersectionObserver` independently reports section visibility and updates the active navigation item without scanning every section each frame.
5. Pointer events store coordinates; scheduled animation frames apply cursor and tilt transforms.

## Fallback and Cleanup Behavior

- If `IntersectionObserver` is unavailable, navigation defaults to the hero and click navigation continues to work.
- If `ResizeObserver` is unavailable, resize events refresh cached document height.
- Every observer, listener, and pending animation frame is disconnected or cancelled during component unmount.
- Reduced-motion and coarse-pointer users receive the same content without spotlight or tilt motion.
- Anchor navigation, keyboard focus, modal focus trapping, and smooth-scroll behavior remain unchanged.

## Testing Strategy

### Automated checks

- Add unit tests for scroll progress calculation, threshold calculation, and active-section selection as pure functions.
- Add source-level regression checks proving that `Navbar` no longer scans sections with `getBoundingClientRect()` during scroll and that the tilt handler does not measure geometry on every pointer move.
- Verify image markup has explicit dimensions and the intended eager/lazy priority attributes.
- Run the existing presentation verification scripts, TypeScript checking, and the production build.

### Browser checks

- Test desktop mouse scrolling, cursor spotlight, card tilt, section highlighting, modal behavior, and anchor navigation.
- Test a mobile viewport with touch emulation and confirm pointer-only effects are disabled.
- Test `prefers-reduced-motion` and keyboard-only navigation.
- Record a performance trace and verify that scroll frames no longer contain the repeated section geometry loop or pointer-driven forced reflow.

### Production acceptance criteria

Use the median of three mobile PageSpeed runs after deployment:

- Performance score at least 90
- LCP at or below 2.5 s when network variance permits
- CLS remains 0
- TBT remains at or below 150 ms
- No visible regression in layout, typography, navigation, project interactions, or accessibility
- Forced-reflow time and long scroll frames are materially lower than the current baseline

If PageSpeed variance prevents the numeric target in a single run, the trace evidence and three-run median determine acceptance.

## Delivery Sequence

1. Establish automated regression checks and capture the current failing behavior.
2. Implement shared scroll metrics and observer-driven navigation.
3. Throttle cursor and tilt effects through animation frames.
4. Add below-the-fold containment.
5. Optimize image and font delivery.
6. Run the full verification suite and local browser checks.
7. Merge the verified branch into `master`, push, deploy through Vercel, and re-run production measurements.

## SSR Decision

SSR is not part of this optimization pass. It can improve initial HTML availability, but it does not remove the current synchronous layout work that causes scrolling to stutter. Because this portfolio is static, SSG would be considered before SSR if future measurements show that initial document generation or search indexing is the remaining problem.
