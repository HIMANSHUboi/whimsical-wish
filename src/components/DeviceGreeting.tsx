import { useEffect, useState } from "react";

type DeviceType = "iphone" | "ipad" | "macbook" | "other";

function detectDevice(): DeviceType {
  if (typeof window === "undefined" || typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent.toLowerCase();
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const w = window.innerWidth;

  if (ua.includes("iphone") || (isTouchDevice && w < 500)) return "iphone";
  if (ua.includes("ipad") || (isTouchDevice && w >= 500 && w < 1200)) return "ipad";
  if (ua.includes("macintosh") || (!isTouchDevice && w >= 1200)) return "macbook";
  return "other";
}

const DEVICE_DATA: Record<
  Exclude<DeviceType, "other">,
  { icon: string; label: string; message: string; sub: string }
> = {
  iphone: {
    icon: "📱",
    label: "iPhone",
    message: "peeking from your pocket ✦",
    sub: "the whole garden, in your palm",
  },
  ipad: {
    icon: "🍃",
    label: "iPad",
    message: "cozy iPad mode 🌿",
    sub: "best enjoyed beside your morning tea",
  },
  macbook: {
    icon: "✦",
    label: "MacBook",
    message: "opened on a MacBook — fancy!",
    sub: "the stars look better on a big screen",
  },
};

export function DeviceGreeting() {
  const [device, setDevice] = useState<DeviceType>("other");
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const key = "vanya-device-greeted";
    if (sessionStorage.getItem(key)) return; // only once per session

    const d = detectDevice();
    setDevice(d);

    if (d !== "other") {
      const t = setTimeout(() => {
        setVisible(true);
        sessionStorage.setItem(key, "true");
      }, 2000); // show after 2s so page loads first
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setDismissed(true), 5000); // auto-dismiss after 5s
    return () => clearTimeout(t);
  }, [visible]);

  if (device === "other" || !visible || dismissed) return null;

  const data = DEVICE_DATA[device as Exclude<DeviceType, "other">];

  return (
    <div
      className="fixed bottom-24 left-4 z-50 animate-toast-in"
      role="status"
      aria-live="polite"
    >
      <div className="glass-card rounded-2xl px-4 py-3 max-w-[220px] shadow-soft relative">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-muted text-muted-foreground text-[10px] flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          aria-label="dismiss"
        >
          ✕
        </button>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{data.icon}</span>
          <span className="text-[10px] uppercase tracking-widest text-primary font-medium">
            {data.label}
          </span>
        </div>
        <p className="font-script text-base text-twilight leading-snug">
          {data.message}
        </p>
        <p className="text-[10px] text-muted-foreground italic mt-0.5">
          {data.sub}
        </p>
      </div>
    </div>
  );
}
