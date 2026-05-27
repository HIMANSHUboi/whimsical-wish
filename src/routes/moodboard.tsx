import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ChangeEvent } from "react";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";
import { FlowingMenu, type FlowingMenuItem } from "@/components/FlowingMenu";
import { openLightbox } from "@/components/Lightbox";
import matchaCart from "@/assets/matcha-cart.png";
import matchaTime from "@/assets/matcha-time.png";
import tarotOrnate from "@/assets/tarot-ornate.jpeg";
import fairyHero from "@/assets/fairy-hero.jpeg";
import starSparkle from "@/assets/star-sparkle.png";
import loversTarot from "@/assets/lovers-tarot.jpeg";
import tarotParchment from "@/assets/tarot-parchment.jpeg";
import vanyaFriends from "@/assets/vanya-friends.png";

export const Route = createFileRoute("/moodboard")({
  head: () => ({
    meta: [
      { title: "Moodboard ✦ Pinterest for Vanya" },
      { name: "description", content: "A pinterest-style moodboard for Vanya." },
    ],
  }),
  component: Moodboard,
});

type PinKind = "img" | "quote" | "tag";
type PinCategory = "all" | "aesthetic" | "tarot" | "matcha" | "memories" | "quotes";

type Pin = {
  kind: PinKind;
  src?: string;
  alt?: string;
  text?: string;
  tilt: number;
  tall?: boolean;
  bg?: string;
  custom?: boolean;
  category: PinCategory;
};

const CATEGORIES: { id: PinCategory; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "✦" },
  { id: "aesthetic", label: "Aesthetic", emoji: "✿" },
  { id: "tarot", label: "Tarot", emoji: "🃏" },
  { id: "matcha", label: "Matcha", emoji: "🍵" },
  { id: "memories", label: "Memories", emoji: "📸" },
  { id: "quotes", label: "Quotes", emoji: "❝" },
];

const FLOWING_ITEMS: FlowingMenuItem[] = [
  { label: "Photo", emoji: "✦", value: "img" },
  { label: "Quote", emoji: "❝", value: "quote" },
  { label: "Tag", emoji: "✿", value: "tag" },
];

const seedPins: Pin[] = [
  { kind: "img", src: vanyaFriends, alt: "favorite humans ✦", tilt: -1, category: "memories" },
  { kind: "img", src: loversTarot, alt: "The Lovers tarot card", tilt: -2, tall: true, category: "tarot" },
  { kind: "quote", text: "she's made of moonlight and matcha foam", tilt: 1, category: "quotes" },
  { kind: "img", src: starSparkle, alt: "Eight-pointed star", tilt: 3, bg: "bg-card", category: "aesthetic" },
  { kind: "tag", text: "✦ lavender skies", tilt: -3, category: "aesthetic" },
  { kind: "img", src: tarotParchment, alt: "Vintage tarot parchment", tilt: -1, tall: true, category: "tarot" },
  { kind: "img", src: matchaTime, alt: "matcha latte close-up", tilt: 2, category: "matcha" },
  { kind: "quote", text: "tea steeped in silence, hours stretched in gold.", tilt: 2, category: "quotes" },
  { kind: "img", src: matchaCart, alt: "matcha cart spread", tilt: -2, tall: true, category: "matcha" },
  { kind: "tag", text: "🍵 matcha mornings", tilt: 3, category: "matcha" },
  { kind: "img", src: tarotOrnate, alt: "ornate tarot card", tilt: 1, tall: true, category: "tarot" },
  { kind: "quote", text: "may your birthday be soft, slow, and a little bit magic.", tilt: -1, category: "quotes" },
  { kind: "tag", text: "✿ dusty pink dreams", tilt: 2, category: "aesthetic" },
  { kind: "img", src: fairyHero, alt: "fairy under stars", tilt: -2, category: "aesthetic" },
  { kind: "tag", text: "☾ tarot at midnight", tilt: -2, category: "tarot" },
];

const STORAGE_KEY = "vanya-moodboard-pins-v2";

const PIN_CATEGORIES: { id: PinCategory; label: string; emoji: string }[] = [
  { id: "aesthetic", label: "Aesthetic", emoji: "✿" },
  { id: "tarot", label: "Tarot", emoji: "🃏" },
  { id: "matcha", label: "Matcha", emoji: "🍵" },
  { id: "memories", label: "Memories", emoji: "📸" },
  { id: "quotes", label: "Quotes", emoji: "❝" },
];

function Moodboard() {
  const [customPins, setCustomPins] = useState<Pin[]>([]);
  const [kind, setKind] = useState<PinKind>("img");
  const [text, setText] = useState("");
  const [imgData, setImgData] = useState<string | null>(null);
  const [pinCategory, setPinCategory] = useState<PinCategory>("aesthetic");
  const [activeCategory, setActiveCategory] = useState<PinCategory>("all");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCustomPins(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: Pin[]) => {
    setCustomPins(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImgData(reader.result as string);
    reader.readAsDataURL(f);
  };

  const addPin = () => {
    const tilt = Math.round((Math.random() - 0.5) * 6);
    let pin: Pin | null = null;
    if (kind === "img" && imgData) {
      pin = { kind: "img", src: imgData, alt: text || "a little pin", tilt, tall: Math.random() > 0.5, custom: true, category: pinCategory };
    } else if (kind === "quote" && text.trim()) {
      pin = { kind: "quote", text: text.trim(), tilt, custom: true, category: pinCategory };
    } else if (kind === "tag" && text.trim()) {
      pin = { kind: "tag", text: text.trim(), tilt, custom: true, category: pinCategory };
    }
    if (!pin) return;
    persist([pin, ...customPins]);
    setText("");
    setImgData(null);
  };

  const removePin = (i: number) => {
    const next = customPins.filter((_, idx) => idx !== i);
    persist(next);
  };

  const allPins: Array<Pin & { removable?: boolean; rmIdx?: number }> = [
    ...customPins.map((p, i) => ({ ...p, removable: true, rmIdx: i })),
    ...seedPins,
  ];

  const filteredPins = activeCategory === "all"
    ? allPins
    : allPins.filter((p) => p.category === activeCategory);

  return (
    <section className="relative bg-dreamy py-20 overflow-hidden min-h-[80vh]">
      <Sparkles count={25} />
      <div className="relative mx-auto max-w-6xl px-6 space-y-10">
        <Reveal className="text-center space-y-3">
          <p className="font-script text-3xl text-primary">pin-worthy</p>
          <h1 className="font-display text-5xl md:text-6xl text-twilight">
            Vanya's Moodboard
          </h1>
          <p className="text-muted-foreground italic">
            a little corkboard of everything that feels like you ✦
          </p>
        </Reveal>

        {/* CATEGORY FILTER */}
        <Reveal variant="float-in">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full border text-sm font-body font-medium transition-all duration-300 hover:scale-105 ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary shadow-soft"
                    : "bg-card/60 border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-card/90"
                }`}
              >
                {cat.emoji} {cat.label}
                {cat.id !== "all" && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({allPins.filter(p => p.category === cat.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </Reveal>

        {/* ADD PIN */}
        <Reveal variant="float-in">
          <div className="rounded-3xl bg-card/80 backdrop-blur border border-border/60 shadow-soft p-6 md:p-8 max-w-3xl mx-auto space-y-5">
            <div>
              <p className="font-script text-2xl text-primary">pin something of your own</p>
              <p className="text-sm text-muted-foreground italic">a photo, a thought, a tiny tag — make it yours.</p>
            </div>

            {/* Flowing Menu for kind selection */}
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-2">Choose what to pin</p>
              <FlowingMenu
                items={FLOWING_ITEMS}
                selected={kind}
                onSelect={(v) => setKind(v as PinKind)}
              />
            </div>

            {/* Category picker for new pin */}
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {PIN_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setPinCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      pinCategory === cat.id
                        ? "bg-primary/20 border-primary text-primary"
                        : "border-border/50 text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-start">
              {kind === "img" ? (
                <div className="space-y-3">
                  <label className="block">
                    <span className="sr-only">upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFile}
                      className="block w-full text-sm text-foreground/70 file:mr-3 file:rounded-full file:border-0 file:bg-gold file:text-twilight file:px-4 file:py-2 file:font-script file:text-base hover:file:opacity-90"
                    />
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="a little caption ✦ (optional)"
                    className="w-full rounded-xl border border-border bg-background/70 px-4 py-2 text-foreground placeholder:italic placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  {imgData && (
                    <img src={imgData} alt="preview" className="w-24 h-24 object-cover rounded-xl border-2 border-card shadow-soft" />
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={kind === "quote" ? "she wears the stars like a crown..." : "✦ soft girl summer"}
                  className="w-full rounded-xl border border-border bg-background/70 px-4 py-3 font-display italic text-twilight placeholder:italic placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              )}
              <button
                onClick={addPin}
                disabled={kind === "img" ? !imgData : !text.trim()}
                className="rounded-full bg-primary text-primary-foreground px-6 py-3 shadow-soft hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed self-start"
              >
                pin it ✦
              </button>
            </div>
          </div>
        </Reveal>

        {/* Active category label */}
        {activeCategory !== "all" && (
          <div className="text-center animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
              {CATEGORIES.find(c => c.id === activeCategory)?.emoji} Showing {activeCategory} · {filteredPins.length} pin{filteredPins.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* PIN COLUMNS */}
        {filteredPins.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-script text-2xl animate-fade-up">
            no pins here yet ✦ add one above!
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {filteredPins.map((p, i) => (
              <Reveal
                key={`${p.custom ? "c" : "s"}-${i}-${p.text ?? p.src ?? ""}-${activeCategory}`}
                variant="float-in"
                delay={(i % 6) * 80}
                className="break-inside-avoid mb-4"
              >
                <div
                  className="relative group/pin transition-transform duration-500 hover:rotate-0 hover:scale-[1.04] hover:shadow-glow"
                  style={{ transform: `rotate(${p.tilt}deg)` }}
                >
                  {p.removable && (
                    <button
                      onClick={() => removePin(p.rmIdx!)}
                      aria-label="remove pin"
                      className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-card text-primary border border-border shadow-soft opacity-0 group-hover/pin:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
                    >
                      ✕
                    </button>
                  )}

                  {/* Category badge */}
                  <span className="absolute -top-2 -left-2 z-10 text-[10px] px-2 py-0.5 rounded-full bg-card border border-border/50 shadow-soft opacity-0 group-hover/pin:opacity-100 transition-opacity text-muted-foreground">
                    {CATEGORIES.find(c => c.id === p.category)?.emoji}
                  </span>

                  {p.kind === "img" && p.src && (
                    <div
                      className={`rounded-2xl overflow-hidden shadow-soft border-4 border-card group relative ${p.bg ?? ""} cursor-zoom-in`}
                      onClick={() => openLightbox(p.src!, p.alt ?? "")}
                    >
                      <img
                        src={p.src}
                        alt={p.alt ?? ""}
                        loading="lazy"
                        className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${p.tall ? "aspect-[3/4]" : "aspect-square"}`}
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer pointer-events-none" />
                      {p.custom && p.alt && (
                        <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-twilight/80 to-transparent text-card font-script text-lg px-3 py-2 text-center">
                          {p.alt}
                        </p>
                      )}
                    </div>
                  )}
                  {p.kind === "quote" && (
                    <div className="rounded-2xl bg-card/90 backdrop-blur p-6 shadow-soft border border-border/50">
                      <p className="font-display italic text-xl text-twilight leading-snug text-balance">
                        "{p.text}"
                      </p>
                    </div>
                  )}
                  {p.kind === "tag" && (
                    <div className="rounded-full bg-gold text-twilight px-5 py-3 text-center font-script text-2xl shadow-soft">
                      {p.text}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
