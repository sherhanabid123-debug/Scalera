// Performance tier flags, resolved once at module load.
// The `perf-lite` / `reduce-motion` classes are set synchronously by the
// inline script in index.html (before first paint), so reading them here is
// reliable and avoids a second round of device detection.

const root = typeof document !== "undefined" ? document.documentElement : null;

export const PERF_LITE = !!root && root.classList.contains("perf-lite");
export const REDUCE_MOTION = !!root && root.classList.contains("reduce-motion");

// True when we should render the full, effect-heavy experience.
export const FULL_FX = !PERF_LITE && !REDUCE_MOTION;
