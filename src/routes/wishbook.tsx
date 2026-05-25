import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/wishbook")({
  head: () => ({
    meta: [
      { title: "Wishbook ✦ Messages for Vanya" },
      { name: "description", content: "Leave a birthday message for Vanya." },
    ],
  }),
  component: Wishbook,
});

interface WishEntry {
  id: string;
  name: string;
  message: string;
  color: string;
  tilt: number;
  createdAt: number;
}

const STORAGE_KEY = "vanya-wishbook-v1";
const APP_KEY = "lfeiwes4";
const COLORS = [
  "bg-rose-50 dark:bg-rose-950/40",
  "bg-purple-50 dark:bg-purple-950/40",
  "bg-amber-50 dark:bg-amber-950/40",
  "bg-sky-50 dark:bg-sky-950/40",
  "bg-emerald-50 dark:bg-emerald-950/40",
  "bg-pink-50 dark:bg-pink-950/40",
];

// Server functions to read/write to the free cloud database
export const getWishesServer = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const listRes = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${APP_KEY}/vanya_wish_ids`);
    const listText = await listRes.json();
    if (!listText) return [];
    const ids: string[] = JSON.parse(listText);

    const fetchPromises = ids.map(async (id) => {
      try {
        const wishRes = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${APP_KEY}/vanya_wish_${id}`);
        const wishText = await wishRes.json();
        if (wishText) {
          return JSON.parse(wishText) as WishEntry;
        }
      } catch (err) {
        console.error(`Error fetching wish ${id}:`, err);
      }
      return null;
    });

    const results = await Promise.all(fetchPromises);
    return results.filter((w): w is WishEntry => w !== null).sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.error("Error in getWishesServer:", err);
    return [];
  }
});

export const addWishServer = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: WishEntry }) => {
    try {
      const entry = data;
      const wishVal = JSON.stringify(entry);
      await fetch(
        `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${APP_KEY}/vanya_wish_${entry.id}/${encodeURIComponent(wishVal)}`,
        { method: "POST" }
      );

      const listRes = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${APP_KEY}/vanya_wish_ids`);
      const listText = await listRes.json();
      let ids: string[] = [];
      if (listText) {
        try {
          ids = JSON.parse(listText);
        } catch {}
      }
      ids = [entry.id, ...ids].slice(0, 80);

      const idsVal = JSON.stringify(ids);
      await fetch(
        `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${APP_KEY}/vanya_wish_ids/${encodeURIComponent(idsVal)}`,
        { method: "POST" }
      );

      return { success: true };
    } catch (err) {
      console.error("Error in addWishServer:", err);
      return { success: false };
    }
  });

export const removeWishServer = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: string }) => {
    try {
      const id = data;
      const listRes = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${APP_KEY}/vanya_wish_ids`);
      const listText = await listRes.json();
      if (listText) {
        let ids: string[] = JSON.parse(listText);
        ids = ids.filter((currId) => currId !== id);
        const idsVal = JSON.stringify(ids);
        await fetch(
          `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${APP_KEY}/vanya_wish_ids/${encodeURIComponent(idsVal)}`,
          { method: "POST" }
        );
      }
      await fetch(
        `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${APP_KEY}/vanya_wish_${id}/`,
        { method: "POST" }
      );
      return { success: true };
    } catch (err) {
      console.error("Error in removeWishServer:", err);
      return { success: false };
    }
  });

function Wishbook() {
  const [wishes, setWishes] = useState<WishEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Load from localStorage for immediate display
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setWishes(JSON.parse(raw));
        setLoading(false);
      }
    } catch {}

    // 2. Fetch fresh database list in background
    getWishesServer()
      .then((serverWishes) => {
        if (serverWishes) {
          setWishes(serverWishes);
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(serverWishes)); } catch {}
        }
      })
      .catch((err) => console.error("Error fetching db wishes:", err))
      .finally(() => setLoading(false));
  }, []);

  const addWish = () => {
    if (!name.trim() || !message.trim()) return;
    const entry: WishEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      message: message.trim(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      tilt: Math.round((Math.random() - 0.5) * 5),
      createdAt: Date.now(),
    };

    // Optimistic local update
    const next = [entry, ...wishes];
    setWishes(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}

    // Save to server database in background
    addWishServer(entry).catch((err) => console.error("Error saving wish:", err));

    setName("");
    setMessage("");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("trigger-confetti"));
    }
  };

  const removeWish = (id: string) => {
    // Optimistic local update
    const next = wishes.filter((w) => w.id !== id);
    setWishes(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}

    // Delete on server database in background
    removeWishServer(id).catch((err) => console.error("Error deleting wish:", err));
  };

  return (
    <section className="relative bg-dreamy py-20 overflow-hidden min-h-[80vh]">
      <Sparkles count={20} />
      <div className="relative mx-auto max-w-5xl px-6 space-y-12">
        <Reveal className="text-center space-y-3">
          <p className="font-script text-3xl text-primary">write a little something</p>
          <h1 className="font-display text-5xl md:text-6xl text-twilight">
            The Wishbook ✦
          </h1>
          <p className="text-muted-foreground italic">
            leave a birthday wish — it'll stay right here, pinned to the wall of love.
          </p>
        </Reveal>

        {/* Add wish form */}
        <Reveal variant="float-in">
          <div className="rounded-3xl bg-card/80 backdrop-blur border border-border/60 shadow-soft p-6 md:p-8 max-w-2xl mx-auto space-y-5">
            <p className="font-script text-2xl text-primary">pin your wish ✦</p>
            <div className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="your name ✦"
                maxLength={50}
                className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-foreground placeholder:italic placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="write your birthday wish for Vanya..."
                maxLength={300}
                rows={3}
                className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-foreground placeholder:italic placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{message.length}/300</span>
                <button
                  onClick={addWish}
                  disabled={!name.trim() || !message.trim()}
                  className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 shadow-soft hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed font-display"
                >
                  leave a wish ♡
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Wish wall */}
        {wishes.length > 0 && (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:_balance]">
            {wishes.map((w, i) => (
              <Reveal key={w.id} variant="float-in" delay={(i % 6) * 80} className="break-inside-avoid mb-4">
                <div
                  className={`relative group/wish rounded-2xl ${w.color} p-6 shadow-soft border border-border/30 transition-transform duration-500 hover:rotate-0 hover:scale-[1.02]`}
                  style={{ transform: `rotate(${w.tilt}deg)` }}
                >
                  <button
                    onClick={() => removeWish(w.id)}
                    aria-label="remove wish"
                    className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-card text-primary border border-border shadow-soft opacity-0 group-hover/wish:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground text-xs"
                  >
                    ✕
                  </button>
                  <p className="font-display italic text-lg text-twilight leading-relaxed mb-3">
                    "{w.message}"
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-script text-sm">
                      {w.name[0].toUpperCase()}
                    </span>
                    <p className="font-script text-base text-primary">— {w.name}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {wishes.length === 0 && (
          <Reveal className="text-center py-10">
            <p className="text-muted-foreground italic font-display text-xl">
              no wishes yet — be the first to leave one ✦
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
