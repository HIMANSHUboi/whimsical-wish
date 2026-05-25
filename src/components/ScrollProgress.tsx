import { useState, useEffect } from "react";

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 100) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-[4px] z-[100] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.6)] transition-all duration-100 ease-out relative"
        style={{ width: `${scrollProgress}%` }}
      >
        {scrollProgress > 0.5 && (
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 flex items-center justify-center animate-spin-slow"
            style={{ filter: "drop-shadow(0 0 5px rgba(251, 191, 36, 0.9))" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-amber-300">
              <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
