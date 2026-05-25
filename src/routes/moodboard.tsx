import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ChangeEvent } from "react";
import { Sparkles } from "@/components/Sparkles";
import { Reveal } from "@/components/Reveal";
import matchaCart from "@/assets/matcha-cart.png";
import matchaTime from "@/assets/matcha-time.png";
import tarotOrnate from "@/assets/tarot-ornate.jpeg";
import fairyHero from "@/assets/fairy-hero.jpeg";
import starSparkle from "@/assets/star-sparkle.png";
import loversTarot from "@/assets/lovers-tarot.jpeg";
import tarotParchment from "@/assets/tarot-parchment.jpeg";

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
type Pin = {
  kind: PinKind;
  src?: string;
  alt?: string;
  text?: string;
  tilt: number;
  tall?: boolean;
  bg?: string;
  custom?: boolean;
};

const seedPins: Pin[] = [
  { kind: "img", src: loversTarot, alt: "The Lovers tarot card", tilt: -2, tall: true },
  { kind: "quote", text: "she's made of moonlight and matcha foam", tilt: 1 },
  { kind: "img", src: starSparkle, alt: "Eight-pointed star", tilt: 3, bg: "bg-card" },
  { kind: "tag", text: "✦ lavender skies", tilt: -3 },
  { kind: "img", src: tarotParchment, alt: "Vintage tarot parchment", tilt: -1, tall: true },
  { kind: "img", src: matchaTime, alt: "matcha latte close-up", tilt: 2 },
  { kind: "quote", text: "tea steeped in silence, hours stretched in gold.", tilt: 2 },
  { kind: "img", src: matchaCart, alt: "matcha cart spread", tilt: -2, tall: true },
  { kind: "tag", text: "🍵 matcha mornings", tilt: 3 },
  { kind: "img", src: tarotOrnate, alt: "ornate tarot card", tilt: 1, tall: true },
  { kind: "quote", text: "may your birthday be soft, slow, and a little bit magic.", tilt: -1 },
  { kind: "tag", text: "✿ dusty pink dreams", tilt: 2 },
  { kind: "img", src: fairyHero, alt: "fairy under stars", tilt: -2 },
  { kind: "tag", text: "☾ tarot at midnight", tilt: -2 },
];

const STORAGE_KEY = "vanya-moodboard-pins-v1";

function Moodboard() {
  const [customPins, setCustomPins] = useState<Pin[]>([]);
  const [kind, setKind] = useState<PinKind>("img");
  const [text, setText] = useState("");
  const [imgData, setImgData] = useState<string | null>(null);

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
      pin = { kind: "img", src: imgData, alt: text || "a little pin", tilt, tall: Math.random() > 0.5, custom: true };
    } else if (kind === "quote" && text.trim()) {
      pin = { kind: "quote", text: text.trim(), tilt, custom: true };
    } else if (kind === "tag" && text.trim()) {
      pin = { kind: "tag", text: text.trim(), tilt, custom: true };
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

        {/* ADD PIN */}
        <Reveal variant="float-in">
          <div className="rounded-3xl bg-card/80 backdrop-blur border border-border/60 shadow-soft p-6 md:p-8 max-w-3xl mx-auto space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-script text-2xl text-primary">pin something of your own</p>
                <p className="text-sm text-muted-foreground italic">a photo, a thought, a tiny tag — make it yours.</p>
              </div>
              <div className="flex gap-2 text-sm">
                {(["img", "quote", "tag"] as PinKind[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    className={`px-4 py-1.5 rounded-full border transition-colors ${
                      kind === k
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {k === "img" ? "✦ photo" : k === "quote" ? "❝ quote" : "✿ tag"}
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

        {/* PIN COLUMNS */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
          {allPins.map((p, i) => (
            <Reveal
              key={`${p.custom ? "c" : "s"}-${i}-${p.text ?? p.src ?? ""}`}
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
                {p.kind === "img" && p.src && (
                  <div className={`rounded-2xl overflow-hidden shadow-soft border-4 border-card group relative ${p.bg ?? ""}`}>
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
      </div>
    </section>
  );
}
