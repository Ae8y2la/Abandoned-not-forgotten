/**
 * THE UNFINISHED MISSION — GSAP Motion Tokens & Accessibility Framework
 * Consistent, purposeful, restrained editorial motion.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register core plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Purposeful, consistent duration tokens (in seconds)
export const MOTION_DURATION = {
  instant: 0.01,
  fast: 0.25,
  medium: 0.45,
  slow: 0.75,
  deliberate: 1.2
};

// Editorial easing tokens
export const MOTION_EASE = {
  editorial: 'power2.out',
  cinematic: 'power3.out',
  smooth: 'sine.inOut',
  pulse: 'power1.inOut'
};

/**
 * Creates an accessible gsap.matchMedia context for a component.
 * Ensures that if prefers-reduced-motion is active, static fallbacks run
 * without pinning, scrubbing, or distracting movement.
 *
 * @param {Function} setupFunction - (context: { isReducedMotion: boolean }) => void
 * @param {React.RefObject|Element} [scopeRef] - Component scope for clean selector targeting
 * @returns {Function} cleanupFunction - Call on unmount to revert all tweens/ScrollTriggers
 */
export function createAccessibleAnimation(setupFunction, scopeRef) {
  if (typeof window === 'undefined') return () => {};

  const mm = gsap.matchMedia(scopeRef?.current ? scopeRef : undefined);

  // Standard animation for users with no motion sensitivity
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    setupFunction({ isReducedMotion: false });
  });

  // Reduced motion: instantaneous transitions, no scrubbing, no pinning
  mm.add('(prefers-reduced-motion: reduce)', () => {
    setupFunction({ isReducedMotion: true });
  });

  return () => {
    mm.revert(); // Automatically kills and reverts all tweens/ScrollTriggers created in this context
  };
}

/**
 * Trigger ScrollTrigger recalculation after images or asynchronous assets load.
 */
export function refreshScrollTrigger() {
  if (typeof window !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

export { gsap, ScrollTrigger };
