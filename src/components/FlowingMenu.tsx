import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export interface FlowingMenuItem {
  label: string;
  emoji: string;
  value: string;
}

interface FlowingMenuProps {
  items: FlowingMenuItem[];
  selected: string;
  onSelect: (value: string) => void;
}

export function FlowingMenu({ items, selected, onSelect }: FlowingMenuProps) {
  return (
    <div className="flowing-menu-container w-full overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur">
      {items.map((item) => (
        <FlowingMenuItem
          key={item.value}
          item={item}
          isSelected={selected === item.value}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function FlowingMenuItem({
  item,
  isSelected,
  onSelect,
}: {
  item: FlowingMenuItem;
  isSelected: boolean;
  onSelect: (value: string) => void;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimatingRef = useRef(false);

  const marqueeText = `${item.emoji} ${item.label} · ${item.emoji} ${item.label} · ${item.emoji} ${item.label} · `;

  useEffect(() => {
    if (!marqueeInnerRef.current) return;
    // Continuous subtle scroll when selected
    if (isSelected) {
      gsap.to(marqueeInnerRef.current, {
        x: "-50%",
        duration: 8,
        ease: "none",
        repeat: -1,
      });
    } else {
      gsap.killTweensOf(marqueeInnerRef.current);
      gsap.set(marqueeInnerRef.current, { x: 0 });
    }
    return () => {
      if (marqueeInnerRef.current) {
        gsap.killTweensOf(marqueeInnerRef.current);
      }
    };
  }, [isSelected]);

  const handleMouseEnter = () => {
    if (!marqueeRef.current || !marqueeInnerRef.current || !itemRef.current) return;

    if (animationRef.current) {
      animationRef.current.kill();
    }

    isAnimatingRef.current = true;

    // Animate marquee in
    gsap.killTweensOf(marqueeInnerRef.current);
    animationRef.current = gsap.timeline();
    animationRef.current
      .set(marqueeRef.current, { y: "101%", opacity: 1 })
      .to(marqueeRef.current, {
        y: "0%",
        duration: 0.5,
        ease: "power3.out",
      })
      .to(
        marqueeInnerRef.current,
        {
          x: "-50%",
          duration: 10,
          ease: "none",
          repeat: -1,
        },
        "<"
      );

    // Skew the label text
    const label = itemRef.current.querySelector(".flowing-label");
    if (label) {
      gsap.to(label, { skewX: -10, duration: 0.3, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    if (!marqueeRef.current || !itemRef.current) return;

    if (animationRef.current) {
      animationRef.current.kill();
    }

    gsap.killTweensOf(marqueeInnerRef.current);
    gsap.to(marqueeRef.current, {
      y: "101%",
      duration: 0.4,
      ease: "power3.in",
    });

    const label = itemRef.current.querySelector(".flowing-label");
    if (label) {
      gsap.to(label, { skewX: 0, duration: 0.3, ease: "power2.out" });
    }
    isAnimatingRef.current = false;
  };

  return (
    <div
      ref={itemRef}
      className={`relative overflow-hidden border-b border-border/30 last:border-b-0 transition-colors duration-200 ${
        isSelected
          ? "bg-primary/10"
          : "bg-transparent hover:bg-muted/30"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => onSelect(item.value)}
        className="w-full flex items-center justify-between px-6 py-4 text-left relative z-10"
      >
        <span
          className={`flowing-label inline-block font-display text-xl transition-colors duration-200 ${
            isSelected ? "text-primary" : "text-foreground/70"
          }`}
        >
          <span className="mr-3 text-2xl">{item.emoji}</span>
          {item.label}
        </span>
        {isSelected && (
          <span className="text-primary text-sm font-script animate-fade-up">
            selected ✦
          </span>
        )}
      </button>

      {/* Flowing marquee overlay */}
      <div
        ref={marqueeRef}
        className="absolute inset-0 flex items-center overflow-hidden pointer-events-none z-20"
        style={{ transform: "translateY(101%)", opacity: 1 }}
      >
        <div
          className={`absolute inset-0 ${
            isSelected
              ? "bg-primary/20"
              : "bg-primary/10"
          }`}
        />
        <div
          ref={marqueeInnerRef}
          className="flex whitespace-nowrap select-none"
          style={{ willChange: "transform" }}
        >
          {/* Repeated text for seamless loop */}
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className="font-display italic text-xl text-primary px-4 shrink-0"
            >
              {marqueeText}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
