import { useLayoutEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Wraps countdown widget content. On mobile (<768px), if the inner content's
 * natural width exceeds the available container width, it auto-shrinks via
 * a CSS scale transform so the counter always fits horizontally and stays
 * centered. On desktop, it renders children without modification.
 */
const MobileFitWrapper = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [innerHeight, setInnerHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!isMobile) {
      setScale(1);
      setInnerHeight(null);
      return;
    }

    const measure = () => {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;

      // Reset scale before measuring to get the natural size.
      inner.style.transform = "none";
      const naturalWidth = inner.scrollWidth;
      const naturalHeight = inner.offsetHeight;
      const available = outer.clientWidth;

      if (naturalWidth > 0 && available > 0 && naturalWidth > available) {
        const next = available / naturalWidth;
        setScale(next);
        setInnerHeight(naturalHeight * next);
      } else {
        setScale(1);
        setInnerHeight(null);
      }
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    if (outerRef.current) ro.observe(outerRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    window.addEventListener("resize", measure);

    // Re-measure shortly after mount to catch font/image loading.
    const t1 = window.setTimeout(measure, 100);
    const t2 = window.setTimeout(measure, 500);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isMobile, children]);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div
      ref={outerRef}
      style={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: innerHeight ?? undefined,
      }}
    >
      <div
        ref={innerRef}
        style={{
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top center",
          // When scaled, the element keeps its natural width but visually shrinks.
          // The outer wrapper (overflow:hidden + centered flex) clips/centers it.
          display: "inline-block",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MobileFitWrapper;
