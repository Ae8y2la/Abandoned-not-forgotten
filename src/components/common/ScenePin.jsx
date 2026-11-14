import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScenePin({ children, id, accentColor, label }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // static, no animation

    const outer = outerRef.current;
    const inner = innerRef.current;
    const lbl = labelRef.current;

    // Set initial state
    gsap.set([inner, lbl], { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: outer,
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // Fade in over first 20% of progress
    tl.to([inner, lbl], { opacity: 1, duration: 0.2, ease: "none" }, 0);

    // Hold at full opacity from 20% → 80%
    tl.to([inner, lbl], { opacity: 1, duration: 0.6, ease: "none" }, 0.2);

    // Fade out over last 20%
    tl.to([inner, lbl], { opacity: 0, duration: 0.2, ease: "none" }, 0.8);

    return () => {
      // Kill all ScrollTriggers associated with this component's timeline
      tl.scrollTrigger && tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section
      id={id}
      ref={outerRef}
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Telemetry label */}
      {label && (
        <span
          ref={labelRef}
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            zIndex: 10,
            fontFamily: "var(--font-telemetry, monospace)",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: accentColor || "var(--color-lunar-amber, #f5a623)",
            opacity: reduced ? 1 : 0, // reduced: show immediately
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {label}
        </span>
      )}

      {/* Inner content wrapper */}
      <div
        ref={innerRef}
        style={{
          width: "100%",
          height: "100%",
          opacity: reduced ? 1 : 0,
        }}
      >
        {children}
      </div>
    </section>
  );
}
