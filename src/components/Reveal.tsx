import { useEffect, useRef, useState, createElement, type ReactNode, type CSSProperties, type ElementType } from "react";

type Variant = "fade-up" | "float-in" | "fade";

export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  className = "",
  style,
  as = "div",
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const base = "transition-all duration-[900ms] ease-out will-change-transform";
  const hidden =
    variant === "fade"
      ? "opacity-0"
      : variant === "float-in"
        ? "opacity-0 translate-y-6 scale-[0.97] rotate-[-1deg]"
        : "opacity-0 translate-y-8";
  const visible = "opacity-100 translate-y-0 scale-100 rotate-0";

  return createElement(
    as,
    {
      ref,
      className: `${base} ${shown ? visible : hidden} ${className}`,
      style: { transitionDelay: `${delay}ms`, ...style },
    },
    children,
  );
}
