import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ChangeEvent } from "react";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";
import { FlowingMenu, type FlowingMenuItem } from "@/components/FlowingMenu";
import { openLightbox } from "@/components/Lightbox";
import { ParallaxTilt } from "@/components/ParallaxTilt";
import matchaCart from "@/assets/matcha-cart.png";
import matchaTime from "@/assets/matcha-time.png";
import tarotOrnate from "@/assets/tarot-ornate.jpeg";
import fairyHero from "@/assets/fairy-hero.jpeg";
import starSparkle from "@/assets/star-sparkle.png";
import loversTarot from "@/assets/lovers-tarot.jpeg";
import tarotParchment from "@/assets/tarot-parchment.jpeg";
import vanyaFriends from "@/assets/vanya-friends.png";
import vanyaPortrait from "@/assets/vanya-portrait.png";
import vanyaGreenShirt from "@/assets/vanya-green-shirt.png";
import usRide from "@/assets/us-ride.png";

// New Vanya Photos
import vanyaLanterns from "@/assets/vanya-lanterns.jpeg";
import vanyaCave from "@/assets/vanya-cave.jpeg";
import vanyaBeach from "@/assets/vanya-beach.jpeg";
import vanyaCastle1 from "@/assets/vanya-castle1.png";
import vanyaCastle2 from "@/assets/vanya-castle2.png";
import vanyaStreet from "@/assets/vanya-street.png";
import vanyaGarden from "@/assets/vanya-garden.png";

export const Route = createFileRoute("/moodboard")({
  head: () => ({
    meta: [
      { title: "Moodboard ✦ Pinterest & Scrapbook" },
      { name: "description", content: "A pinterest-style moodboard and dried flower scrapbook for Vanya." },
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
  { kind: "img", src: vanyaLanterns, alt: "under the lantern glow ✦", tilt: 2, tall: true, category: "memories" },
  { kind: "img", src: matchaTime, alt: "matcha latte close-up", tilt: 2, category: "matcha" },
  { kind: "img", src: vanyaCave, alt: "exploring stone caves ✦", tilt: -2, category: "memories" },
  { kind: "quote", text: "tea steeped in silence, hours stretched in gold.", tilt: 2, category: "quotes" },
  { kind: "img", src: matchaCart, alt: "matcha cart spread", tilt: -2, tall: true, category: "matcha" },
  { kind: "img", src: vanyaBeach, alt: "beach nights under the stars ✦", tilt: 1, tall: true, category: "memories" },
  { kind: "tag", text: "🍵 matcha mornings", tilt: 3, category: "matcha" },
  { kind: "img", src: tarotOrnate, alt: "ornate tarot card", tilt: 1, tall: true, category: "tarot" },
  { kind: "img", src: vanyaCastle1, alt: "fairytale castle moments ✦", tilt: -3, tall: true, category: "memories" },
  { kind: "quote", text: "may your birthday be soft, slow, and a little bit magic.", tilt: -1, category: "quotes" },
  { kind: "img", src: vanyaCastle2, alt: "looking back at the castle ✦", tilt: 2, category: "memories" },
  { kind: "tag", text: "✿ dusty pink dreams", tilt: 2, category: "aesthetic" },
  { kind: "img", src: fairyHero, alt: "fairy under stars", tilt: -2, category: "aesthetic" },
  { kind: "img", src: vanyaStreet, alt: "street lights & quiet nights ✦", tilt: -1, category: "memories" },
  { kind: "tag", text: "☾ tarot at midnight", tilt: -2, category: "tarot" },
  { kind: "img", src: vanyaGarden, alt: "garden night canopy ✦", tilt: 3, tall: true, category: "memories" },
];

const SCRAPBOOK_PAGES = [
  {
    title: "A Magical Beginning ♊",
    subtitle: "June Sixteenth",
    text: "Born under a celestial Gemini sky, turning ordinary hours into constellations. Vanya Bharti: a girl who is equal parts warm sunshine and quiet mystery.",
    img: vanyaPortrait,
    alt: "Vanya Bharti portrait",
    flowers: ["🌸", "🌾", "✨"],
    tapeTilt: "-3deg",
  },
  {
    title: "The Warmest Hearts 📸",
    subtitle: "Sweet Connections",
    text: "Taped next to the people who adore you. The laughter that fills up cold days, and the quiet comfort of friends who feel like home.",
    img: vanyaFriends,
    alt: "Vanya and friends",
    flowers: ["🪻", "🌿", "🤍"],
    tapeTilt: "4deg",
  },
  {
    title: "Ceremonial Jade 🍵",
    subtitle: "Sipped in Quiet",
    text: "A love for slow rituals. Iced, frothy Uji matcha, green steam rising, and soft afternoons where the world holds its breath for a while.",
    img: matchaTime,
    alt: "Matcha ritual",
    flowers: ["🍃", "🍵", "🌼"],
    tapeTilt: "-2deg",
  },
  {
    title: "Lantern Lights 🏮",
    subtitle: "A Wish in the Glow",
    text: "Standing beneath the warm, floating lantern light, looking up at the sky. A quiet moment of holding a wish close to your heart.",
    img: vanyaLanterns,
    alt: "Vanya under lanterns",
    flowers: ["🏮", "✨", "💫"],
    tapeTilt: "-4deg",
  },
  {
    title: "Chamber of Echoes 🪨",
    subtitle: "Cave Exploring",
    text: "Stepping inside the ancient stone paths, where quiet echoes meet the cool, damp breeze. Finding beauty in hidden places.",
    img: vanyaCave,
    alt: "Vanya in the cave",
    flowers: ["🪨", "🌿", "💧"],
    tapeTilt: "3deg",
  },
  {
    title: "Night on the Shore 🌊",
    subtitle: "Beachside Magic",
    text: "Under the deep blue canvas of the night sky, feet in the cold sand, standing back-to-back on the shore. The waves singing their birthday lullaby.",
    img: vanyaBeach,
    alt: "Vanya on the beach at night",
    flowers: ["🌊", "🐚", "🌌"],
    tapeTilt: "-3deg",
  },
  {
    title: "Fairy-Tale Dreams 🏰",
    subtitle: "Castle Under Stars",
    text: "Standing in front of the illuminated fairytale castle, looking back with a soft smile. A princess in her own whimsical adventure.",
    img: vanyaCastle2,
    alt: "Vanya at the castle",
    flowers: ["🏰", "👑", "🌸"],
    tapeTilt: "4deg",
  },
  {
    title: "Chasing Sunsets 🌅",
    subtitle: "Sunset Drives",
    text: "Long drives, favorite tracks on loop, and golden hour casting long shadows. Life is a collection of these beautiful, fleeting frames.",
    img: usRide,
    alt: "Road trip memory",
    flowers: ["🌻", "🍂", "💛"],
    tapeTilt: "5deg",
  },
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
  const [viewMode, setViewMode] = useState<"pinterest" | "scrapbook">("pinterest");
  const [customPins, setCustomPins] = useState<Pin[]>([]);
  const [kind, setKind] = useState<PinKind>("img");
  const [text, setText] = useState("");
  const [imgData, setImgData] = useState<string | null>(null);
  const [pinCategory, setPinCategory] = useState<PinCategory>("aesthetic");
  const [activeCategory, setActiveCategory] = useState<PinCategory>("all");
  const [scrapbookIndex, setScrapbookIndex] = useState(0);

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

  const currentPage = SCRAPBOOK_PAGES[scrapbookIndex];

  return (
    <section className="relative bg-dreamy py-20 overflow-hidden min-h-[85vh]">
      <Sparkles count={25} />
      <div className="relative mx-auto max-w-6xl px-6 space-y-10">
        
        {/* Toggle mode headers */}
        <Reveal className="text-center space-y-3">
          <p className="font-script text-3xl text-primary">pin & press</p>
          <h1 className="font-display text-5xl md:text-6xl text-twilight leading-[1.1]">
            Vanya's Collection
          </h1>
          <p className="text-muted-foreground italic">
            A little corner of everything that feels like you.
          </p>
        </Reveal>

        {/* View mode toggle */}
        <Reveal className="flex justify-center">
          <div className="inline-flex bg-card/60 backdrop-blur border border-border/50 rounded-full p-1 shadow-soft">
            <button
              onClick={() => setViewMode("pinterest")}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                viewMode === "pinterest"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              📌 Pinterest Board
            </button>
            <button
              onClick={() => setViewMode("scrapbook")}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                viewMode === "scrapbook"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              📖 Dried Flower Scrapbook
            </button>
          </div>
        </Reveal>

        {/* MODE 1: PINTEREST BOARD */}
        {viewMode === "pinterest" && (
          <>
            {/* CATEGORY FILTER */}
            <Reveal variant="float-in">
              <div className="flex flex-wrap justify-center gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-5 py-2 rounded-full border text-sm font-body font-medium transition-all duration-300 hover:scale-105 cursor-pointer ${
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
              <div className="rounded-3xl bg-card/85 backdrop-blur border border-border/60 shadow-soft p-6 md:p-8 max-w-3xl mx-auto space-y-5">
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
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
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
                          className="block w-full text-sm text-foreground/70 file:mr-3 file:rounded-full file:border-0 file:bg-gold file:text-twilight file:px-4 file:py-2 file:font-script file:text-base hover:file:opacity-90 cursor-pointer"
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
                    className="rounded-full bg-primary text-primary-foreground px-6 py-3 shadow-soft hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed self-start cursor-pointer"
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
                          className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-card text-primary border border-border shadow-soft opacity-0 group-hover/pin:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground cursor-pointer flex items-center justify-center text-xs"
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
          </>
        )}

        {/* MODE 2: COZY SCRAPBOOK JOURNAL */}
        {viewMode === "scrapbook" && (
          <Reveal variant="float-in" className="max-w-4xl mx-auto">
            {/* Scrapbook page double layout */}
            <div className="bg-[#fcf8f2] dark:bg-neutral-900 border-2 border-[#e8dfd2] dark:border-neutral-800 rounded-[2.5rem] p-6 md:p-10 shadow-glow relative min-h-[480px] grid md:grid-cols-2 gap-8 items-center">
              
              {/* Binder rings in the middle (only on medium+ screens) */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 hidden md:flex flex-col justify-around py-8 pointer-events-none z-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="w-6 h-3 bg-neutral-600/20 rounded-full border border-neutral-700/30 flex items-center justify-center -translate-x-1">
                    <div className="w-5 h-1 bg-gradient-to-r from-neutral-400 to-neutral-200 rounded-full" />
                  </div>
                ))}
              </div>

              {/* Page Left: Dried Flowers & Photo */}
              <div className="flex flex-col items-center justify-center relative space-y-4">
                {/* Translucent washi tape at the top of the photo */}
                <div
                  className="absolute z-10 w-20 h-6 bg-white/40 backdrop-blur-xs border-x border-white/20 shadow-xs pointer-events-none"
                  style={{
                    transform: `translateX(-50%) rotate(${currentPage.tapeTilt})`,
                    left: "50%",
                    top: "-10px",
                  }}
                />

                {/* Pressed flowers scattered */}
                <div className="absolute -top-6 -left-6 text-4xl select-none opacity-45 rotate-[-12deg]">
                  {currentPage.flowers[0]}
                </div>
                <div className="absolute -bottom-6 -right-4 text-3xl select-none opacity-40 rotate-[22deg]">
                  {currentPage.flowers[1]}
                </div>

                {/* Polaroid style photo */}
                <ParallaxTilt max={6} className="w-full max-w-[280px]">
                  <div className="bg-white p-3 pb-8 rounded shadow-glow border border-neutral-200/50 group cursor-zoom-in" onClick={() => openLightbox(currentPage.img, currentPage.alt)}>
                    <div className="overflow-hidden aspect-square rounded-sm relative">
                      <img
                        src={currentPage.img}
                        alt={currentPage.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#f8f1e5]/10 mix-blend-color-burn" />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="font-script text-xl text-neutral-700 font-semibold leading-none">{currentPage.subtitle}</p>
                    </div>
                  </div>
                </ParallaxTilt>
              </div>

              {/* Page Right: Handwritten Memoir & Captions */}
              <div className="space-y-5 px-2 md:px-6 relative">
                {/* Floating sparkle emoji */}
                <div className="absolute top-0 right-0 text-2xl animate-twinkle select-none opacity-30">
                  {currentPage.flowers[2]}
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-primary/75 font-semibold">
                    Page {scrapbookIndex + 1} of {SCRAPBOOK_PAGES.length}
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl text-neutral-800 dark:text-neutral-100 font-bold leading-tight">
                    {currentPage.title}
                  </h2>
                </div>

                <div className="h-px bg-neutral-300 dark:bg-neutral-800" />

                <p className="font-script text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                  "{currentPage.text}"
                </p>

                <div className="h-px bg-neutral-300 dark:bg-neutral-800" />

                {/* Micro page indicators */}
                <div className="flex gap-2 justify-center py-2">
                  {SCRAPBOOK_PAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setScrapbookIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        scrapbookIndex === i ? "bg-primary scale-125" : "bg-neutral-300 dark:bg-neutral-700"
                      }`}
                      title={`Go to page ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Scrapbook page navigation buttons */}
            <div className="flex justify-between items-center max-w-sm mx-auto pt-6">
              <button
                onClick={() => setScrapbookIndex((prev) => (prev > 0 ? prev - 1 : SCRAPBOOK_PAGES.length - 1))}
                className="px-5 py-2 rounded-full border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider hover:bg-primary/5 transition-colors cursor-pointer"
              >
                ← Prev Page
              </button>
              <button
                onClick={() => setScrapbookIndex((prev) => (prev < SCRAPBOOK_PAGES.length - 1 ? prev + 1 : 0))}
                className="px-5 py-2 rounded-full border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider hover:bg-primary/5 transition-colors cursor-pointer"
              >
                Next Page →
              </button>
            </div>
          </Reveal>
        )}

      </div>
    </section>
  );
}
